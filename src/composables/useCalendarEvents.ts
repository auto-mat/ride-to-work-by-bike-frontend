// libraries
import { date } from 'quasar';
import { computed } from 'vue';

// adapters
import { feedAdapter } from '../adapters/feedAdapter';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { OfferEventType } from '../components/enums/Offers';

// stores
import { useFeedStore } from '../stores/feed';

// utils
import {
  isOfferSingleDayEvent,
  parseOfferLocalDate,
} from '../utils/get_offer_valid';

// types
import type { CardOffer } from '../components/types/Card';

/**
 * Provides single-day city events from the feed store, grouped by day.
 * Multi-day offers are not included.
 */
export const useCalendarEvents = () => {
  const feedStore = useFeedStore();
  const { apiDateFormat } = rideToWorkByBikeConfig;

  /**
   * Map events to date
   * - key: date in `YYYY-MM-DD` format
   * - value: events of that day sorted by start time
   */
  const eventsMap = computed((): Record<string, CardOffer[]> => {
    const sortedEventPosts = feedStore.getPostsOffer
      .filter(isOfferSingleDayEvent)
      .map((post) => ({
        post,
        startDate: parseOfferLocalDate(post.start_date),
      }))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    // build map
    const eventsByDate = {} as Record<string, CardOffer[]>;
    sortedEventPosts.forEach(({ post, startDate }) => {
      const day = date.formatDate(startDate, apiDateFormat);
      if (!eventsByDate[day]) {
        eventsByDate[day] = [];
      }
      eventsByDate[day].push(
        feedAdapter.mapPostsToCardOffer(post, OfferEventType.oneDayEvent),
      );
    });
    return eventsByDate;
  });

  return {
    eventsMap,
  };
};
