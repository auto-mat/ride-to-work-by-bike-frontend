// libraries
import { defineStore } from 'pinia';
import { date } from 'quasar';

// composables
import { useApiGetPosts } from '../composables/useApiGetPosts';
import { useApiGetCities } from '../composables/useApiGetCities';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// types
import type { Logger } from '../components/types/Logger';
import type { Offer } from '../components/types/Offer';
import type { City } from '../components/types/City';

// utils
import { timestampToDatetimeString } from '../utils';
import {
  getOffersFeedParamSet,
  getPrizesFeedParamSet,
} from '../utils/get_feed_param_set';

interface FeedState {
  $log: Logger | null;
  postsOffer: Offer[];
  postsPrize: Offer[];
  isLoading: boolean;
  lastUpdated: number | null;
  cities: City[];
  isLoadingCities: boolean;
}

export const useFeedStore = defineStore('feed', {
  state: (): FeedState => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    postsOffer: [],
    postsPrize: [],
    isLoading: false,
    lastUpdated: null,
    cities: [],
    isLoadingCities: false,
  }),

  getters: {
    /**
     * Get all offer posts
     * @returns {Offer[]} - Array of offer posts
     */
    getPostsOffer(state: FeedState): Offer[] {
      return state.postsOffer;
    },
    /**
     * Get all prize posts
     * @returns {Offer[]} - Array of prize posts
     */
    getPostsPrize(state: FeedState): Offer[] {
      return state.postsPrize;
    },
    /**
     * Get loading state
     * @returns {boolean} - Whether data is being loaded
     */
    getIsLoading(state: FeedState): boolean {
      return state.isLoading;
    },
    /**
     * Get timestamp of last update
     * @returns {number | null} - Timestamp of last update or null if never updated
     */
    getLastUpdated(state: FeedState): number | null {
      return state.lastUpdated;
    },
    /**
     * Get all cities
     * @returns {City[]} - Array of cities
     */
    getCities(state: FeedState): City[] {
      return state.cities;
    },
    /**
     * Get cities loading state
     * @returns {boolean} - Whether cities are being loaded
     */
    getIsLoadingCities(state: FeedState): boolean {
      return state.isLoadingCities;
    },
    /**
     * Check if feed needs refresh (older than 24h)
     * @returns {boolean} - Whether feed needs refresh
     */
    needsRefresh(state: FeedState): boolean {
      const lastUpdate = state.lastUpdated;
      if (!lastUpdate) return true;
      const dateNow = new Date();
      const { feedRefreshCachedPostsIntervalHours } = rideToWorkByBikeConfig;
      const dateMinusCacheRefreshInterval = date.subtractFromDate(dateNow, {
        hours: feedRefreshCachedPostsIntervalHours,
      });
      const timeNowMinusCacheRefreshInterval =
        dateMinusCacheRefreshInterval.getTime();
      this.$log?.debug(
        `Last feed update <${timestampToDatetimeString(lastUpdate / 1000)}>, ` +
          ` current datetime <${timestampToDatetimeString(dateNow.getTime() / 1000)}>,` +
          ' current datetime minus cache refresh interval' +
          ` <${timestampToDatetimeString(dateMinusCacheRefreshInterval.getTime() / 1000)}>.`,
      );
      this.$log?.debug(
        'Last feed update is older than current datetime' +
          ' minus cache refresh interval' +
          ` <${lastUpdate < timeNowMinusCacheRefreshInterval}>.`,
      );
      return lastUpdate < timeNowMinusCacheRefreshInterval;
    },
  },

  actions: {
    /**
     * Set loading state
     * @param {boolean} loading - New loading state
     * @returns {void}
     */
    setIsLoading(loading: boolean): void {
      this.isLoading = loading;
    },
    /**
     * Set offer posts
     * @param {Offer[]} posts - Array of offer posts to set
     * @returns {void}
     */
    setPostsOffer(posts: Offer[]): void {
      this.postsOffer = posts;
    },
    /**
     * Set prize posts
     * @param {Offer[]} posts - Array of prize posts to set
     * @returns {void}
     */
    setPostsPrize(posts: Offer[]): void {
      this.postsPrize = posts;
    },
    /**
     * Set last updated timestamp
     * @param {number} timestamp - Timestamp to set
     * @returns {void}
     */
    setLastUpdated(timestamp: number): void {
      this.lastUpdated = timestamp;
    },
    /**
     * Set cities
     * @param {City[]} cities - Array of cities to set
     * @returns {void}
     */
    setCities(cities: City[]): void {
      this.cities = cities;
    },
    /**
     * Set cities loading state
     * @param {boolean} loading - New loading state
     * @returns {void}
     */
    setIsLoadingCities(loading: boolean): void {
      this.isLoadingCities = loading;
    },
    /**
     * Load posts from API for a given city slug
     * @param {string} citySlug - City slug to load posts for
     * @returns {Promise<void>}
     */
    async loadPosts(citySlug: string): Promise<void> {
      const { loadPosts } = useApiGetPosts(this.$log);
      this.setIsLoading(true);

      // load offers and prizes in parallel
      const [offers, prizes] = await Promise.all([
        loadPosts(getOffersFeedParamSet(citySlug)),
        loadPosts(getPrizesFeedParamSet(citySlug)),
      ]);

      this.setPostsOffer(offers);
      this.setPostsPrize(prizes);
      this.setLastUpdated(new Date().getTime());
      this.setIsLoading(false);
    },
    /**
     * Load cities from API
     * @returns {Promise<void>}
     */
    async loadCities(): Promise<void> {
      const { cities, loadCities } = useApiGetCities(this.$log);
      this.setIsLoadingCities(true);
      await loadCities();
      this.setCities(cities.value);
      this.setIsLoadingCities(false);
    },
    /**
     * Attempt to refresh feed data if needed
     * @param {string} citySlug - City slug to load posts for
     * @returns {Promise<void>}
     */
    async attemptFeedRefresh(citySlug: string): Promise<void> {
      if (this.needsRefresh) {
        this.$log?.info('Feed needs refresh, loading new data.');
        await this.loadPosts(citySlug);
      } else {
        this.$log?.info('Feed is up to date, skipping refresh.');
      }
    },
    /**
     * Clear all store data
     * @returns {void}
     */
    clearStore(): void {
      this.postsOffer = [];
      this.postsPrize = [];
      this.lastUpdated = null;
      this.isLoading = false;
      this.cities = [];
      this.isLoadingCities = false;
    },
  },

  persist: {
    omit: ['isLoading', 'isLoadingCities', 'cities'],
  },
});
