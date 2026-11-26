import { colors } from 'quasar';

import EventLinkList from '../routes/EventLinkList.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey7 = getPaletteColor('grey-7');
const primary = getPaletteColor('primary');

const titleWorkshop = 'Workshop';
const titleBreakfastPartOne = 'Bike';
const titleBreakfastPartTwo = 'breakfast';
const titleBreakfast = `<b>${titleBreakfastPartOne}</b> ${titleBreakfastPartTwo}`;
const titleBreakfastText = `${titleBreakfastPartOne} ${titleBreakfastPartTwo}`;
const titleRide = 'Ride';

const buildCard = (id, title) => ({
  id,
  title,
  content: `<p>Content of ${id}</p>`,
  description: '',
  voucher: '',
  voucherUrl: '',
  tShirtEvent: false,
  startDate: '2025-05-27 17:00',
  endDate: '',
  image: { src: 'https://picsum.photos/id/70/380/380', alt: title },
  metadata: [],
});

describe('<EventLinkList>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['labelEvents'], 'routes', i18n);
  });

  context('single event', () => {
    beforeEach(() => {
      cy.mount(EventLinkList, {
        props: { events: [buildCard(1, titleWorkshop)] },
      });
    });

    it('renders event label and one link without comma', () => {
      cy.dataCy('event-link-list-label')
        .should('be.visible')
        .and('have.text', i18n.global.t('routes.labelEvents'))
        .and('have.color', grey7);
      cy.dataCy('event-link')
        .should('have.length', 1)
        .and('have.color', primary);
      cy.dataCy('event-link-list').should(
        'have.text',
        `${i18n.global.t('routes.labelEvents')} ${titleWorkshop}`,
      );
    });
  });

  context('multiple events', () => {
    beforeEach(() => {
      cy.mount(EventLinkList, {
        props: {
          events: [
            buildCard(1, titleWorkshop),
            buildCard(2, titleBreakfast),
            buildCard(3, titleRide),
          ],
        },
      });
    });

    it('renders comma-separated links', () => {
      cy.dataCy('event-link').should('have.length', 3);
      cy.dataCy('event-link-list').should(
        'have.text',
        `${i18n.global.t('routes.labelEvents')} ${titleWorkshop}, ${titleBreakfastText}, ${titleRide}`,
      );
    });

    it('renders titles as HTML', () => {
      cy.dataCy('event-link')
        .eq(1)
        .find('b')
        .should('have.text', titleBreakfastPartOne);
    });

    it('opens detail dialog on click', () => {
      cy.dataCy('dialog-offer').should('not.exist');
      cy.dataCy('event-link').eq(2).click();
      cy.dataCy('dialog-offer').should('be.visible');
      cy.dataCy('dialog-header').should('contain', titleRide);
      cy.dataCy('dialog-content').should('contain', 'Content of 3');
    });
  });

  context('no events', () => {
    beforeEach(() => {
      cy.mount(EventLinkList, {
        props: { events: [] },
      });
    });

    it('renders nothing', () => {
      cy.dataCy('event-link-list').should('not.exist');
      cy.dataCy('event-link-list-label').should('not.exist');
    });
  });
});
