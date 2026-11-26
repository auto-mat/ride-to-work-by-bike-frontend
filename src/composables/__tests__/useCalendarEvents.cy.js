import { createPinia, setActivePinia } from 'pinia';
import { useCalendarEvents } from '../useCalendarEvents';
import { useFeedStore } from '../../stores/feed';
import { OfferEventType } from '../../components/enums/Offers';
import { isOfferSingleDayEvent } from '../../utils/get_offer_valid';

const buildPost = (startDate, endDate, id = 1, title = 'Event') => ({
  id,
  title,
  url: '',
  published: '',
  voucher: '',
  voucher_url: '',
  akce_na_triko: '0',
  start_date: startDate,
  end_date: endDate,
  excerpt: '',
  content: '',
  mobileapppopismista: '',
  image: '',
  categories: [],
});

describe('isOfferSingleDayEvent', () => {
  it('accepts event with start date and empty end date', () => {
    expect(isOfferSingleDayEvent(buildPost('2025-05-27 17:00', ''))).to.equal(
      true,
    );
  });

  it('accepts event ending on the same day', () => {
    expect(
      isOfferSingleDayEvent(buildPost('2025-06-18 17:00', '2025-06-18')),
    ).to.equal(true);
  });

  it('rejects multi-day event (offer)', () => {
    expect(
      isOfferSingleDayEvent(buildPost('2025-06-18 17:00', '2025-06-19')),
    ).to.equal(false);
  });

  it('rejects missing start date', () => {
    expect(isOfferSingleDayEvent(buildPost('', ''))).to.equal(false);
  });

  it('rejects placeholder start date', () => {
    expect(isOfferSingleDayEvent(buildPost(' 00:00', ''))).to.equal(false);
  });

  it('rejects invalid start date', () => {
    expect(isOfferSingleDayEvent(buildPost('not a date', ''))).to.equal(false);
  });

  it('rejects invalid end date', () => {
    expect(
      isOfferSingleDayEvent(buildPost('2025-06-18 17:00', 'not a date')),
    ).to.equal(false);
  });
});

describe('useCalendarEvents', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('returns empty map when there are no offers', () => {
    const { eventsMap } = useCalendarEvents();
    expect(eventsMap.value).to.deep.equal({});
  });

  it('maps to correct keys - dates', () => {
    useFeedStore().setPostsOffer([
      buildPost('2025-05-27 17:00', '', 1, 'Workshop'),
      buildPost('2025-06-18 17:00', '2025-06-18', 2, 'Ride'),
    ]);
    const { eventsMap } = useCalendarEvents();
    expect(Object.keys(eventsMap.value)).to.have.members([
      '2025-05-27',
      '2025-06-18',
    ]);
    expect(eventsMap.value['2025-05-27'][0].title).to.equal('Workshop');
    expect(eventsMap.value['2025-06-18'][0].title).to.equal('Ride');
  });

  it('strips timezone to get correct dates', () => {
    useFeedStore().setPostsOffer([buildPost('2025-05-27T23:30:00Z', '')]);
    const { eventsMap } = useCalendarEvents();
    expect(Object.keys(eventsMap.value)).to.deep.equal(['2025-05-27']);
  });

  it('excludes invalid dates and multi-day events (offers)', () => {
    useFeedStore().setPostsOffer([
      buildPost('2025-05-01 00:00', '2025-05-31', 1),
      buildPost('2025-06-18 17:00', '2025-06-19', 2),
      buildPost(' 00:00', '', 3),
      buildPost('', '', 4),
    ]);
    const { eventsMap } = useCalendarEvents();
    expect(eventsMap.value).to.deep.equal({});
  });

  it('sorts events in a day by start time', () => {
    useFeedStore().setPostsOffer([
      buildPost('2025-05-28 17:00', '', 1, 'Evening'),
      buildPost('2025-05-28 06:00', '', 2, 'Morning'),
      buildPost('2025-05-28 12:00', '2025-05-28', 3, 'Noon'),
    ]);
    const { eventsMap } = useCalendarEvents();
    expect(
      eventsMap.value['2025-05-28'].map((card) => card.title),
    ).to.deep.equal(['Morning', 'Noon', 'Evening']);
  });

  it('maps events to one-day event cards', () => {
    useFeedStore().setPostsOffer([buildPost('2025-05-27 17:00', '', 7)]);
    const { eventsMap } = useCalendarEvents();
    const card = eventsMap.value['2025-05-27'][0];
    expect(card.id).to.equal(7);
    expect(card.type).to.equal(OfferEventType.oneDayEvent);
    expect(card.startDate).to.equal('2025-05-27 17:00');
  });
});
