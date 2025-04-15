// libraries
import { defineStore } from 'pinia';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// composables
import { useApiGetCommuteMode } from '../composables/useApiGetCommuteMode';
import { useApiGetTrips } from 'src/composables/useApiGetTrips';
import { useApiGetOpenAppWithRestToken } from '../composables/useApiGetOpenAppWithRestToken';

// types
import type { CommuteMode } from '../components/types/Route';
import type { Logger } from '../components/types/Logger';
import type { RouteItem } from '../components/types/Route';

interface TripsState {
  $log: Logger | null;
  commuteModes: CommuteMode[];
  routeItems: RouteItem[];
  isLoading: boolean;
  urlAppCyclers: string;
  urlAppNaKolePrahou: string;
  isLoadingOpenAppWithRestToken: boolean;
}

export const useTripsStore = defineStore('trips', {
  state: (): TripsState => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    commuteModes: [],
    routeItems: [],
    isLoading: false,
    urlAppCyclers: '',
    urlAppNaKolePrahou: '',
    isLoadingOpenAppWithRestToken: false,
  }),

  getters: {
    /**
     * Get all available commute modes
     * @returns {CommuteMode[]} - Array of commute modes
     */
    getCommuteModes: (state): CommuteMode[] => state.commuteModes,
    /**
     * Get all available trips
     * @returns {Trip[]} - Array of trips
     */
    getRouteItems: (state): RouteItem[] => state.routeItems as RouteItem[],
    /**
     * Get loading state
     * @returns {boolean} - Whether data is being loaded
     */
    getIsLoading: (state): boolean => state.isLoading,
    /**
     * Get commute mode by slug
     * @returns {(slug: string) => CommuteMode | undefined} - Function to get commute mode by slug
     */
    getCommuteModeBySlug:
      (state) =>
      (slug: string): CommuteMode | undefined => {
        return state.commuteModes.find((mode) => mode.slug === slug);
      },
    /**
     * Get eco-friendly commute modes
     * @returns {CommuteMode[]} - Array of eco-friendly commute modes
     */
    getEcoCommuteModes: (state): CommuteMode[] => {
      return state.commuteModes.filter((mode) => mode.eco);
    },
    getUrlAppCyclers: (state) => state.urlAppCyclers,
    getUrlAppNaKolePrahou: (state) => state.urlAppNaKolePrahou,
    getIsLoadingOpenAppWithRestToken: (state) =>
      state.isLoadingOpenAppWithRestToken,
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
     * Set commute modes
     * @param {CommuteMode[]} modes - Array of commute modes to set
     * @returns {void}
     */
    setCommuteModes(modes: CommuteMode[]): void {
      this.commuteModes = modes;
    },
    /**
     * Set route items
     * @param {RouteItem[]} routeItems - Array of route items to set
     * @returns {void}
     */
    setRouteItems(routeItems: RouteItem[]): void {
      this.routeItems = routeItems;
    },
    /**
     * Set Cyclers app URL
     * @param {string} url - New URL
     * @returns {void}
     */
    setUrlAppCyclers(url: string): void {
      this.urlAppCyclers = url;
    },
    /**
     * Set Na kole Prahou app URL
     * @param {string} url - New URL
     * @returns {void}
     */
    setUrlAppNaKolePrahou(url: string): void {
      this.urlAppNaKolePrahou = url;
    },
    /**
     * Update route items by merging new items with existing ones
     * Routes are identified by date and direction combination
     * @param {RouteItem[]} newRouteItems - Array of new route items to merge
     * @returns {void}
     */
    updateRouteItems(newRouteItems: RouteItem[]): void {
      // create a map of existing routes for easy lookup
      const existingRoutesMap = new Map<string, RouteItem>();
      this.routeItems.forEach((route) => {
        const key = `${route.date}-${route.direction}`;
        existingRoutesMap.set(key, route as RouteItem);
      });
      // update or add new routes
      newRouteItems.forEach((newRoute) => {
        const key = `${newRoute.date}-${newRoute.direction}`;
        existingRoutesMap.set(key, newRoute as RouteItem);
      });
      // convert map back to array
      this.routeItems = Array.from(existingRoutesMap.values());
    },
    /**
     * Load commute modes from API
     * @returns {Promise<void>}
     */
    async loadCommuteModes(): Promise<void> {
      const { loadCommuteModes } = useApiGetCommuteMode(this.$log);
      this.setIsLoading(true);
      const modes = await loadCommuteModes();
      this.setCommuteModes(modes);
      this.setIsLoading(false);
    },
    /**
     * Load trips from API
     * @returns {Promise<void>}
     */
    async loadRoutesToStore(): Promise<void> {
      const { loadTrips } = useApiGetTrips(this.$log);
      this.setIsLoading(true);
      const routeItems = await loadTrips();
      this.setRouteItems(routeItems);
      this.setIsLoading(false);
    },
    /**
     * Load open app with rest token from API
     * @returns {Promise<void>}
     */
    async loadOpenAppWithRestToken(): Promise<void> {
      const { load } = useApiGetOpenAppWithRestToken(this.$log);
      const {
        apiTripsThirdPartyAppIdCyclers,
        apiTripsThirdPartyAppIdNaKolePrahou,
      } = rideToWorkByBikeConfig;

      this.isLoadingOpenAppWithRestToken = true;
      if (apiTripsThirdPartyAppIdCyclers) {
        const response = await load(apiTripsThirdPartyAppIdCyclers);
        if (response.app_url) {
          this.setUrlAppCyclers(response.app_url);
        }
      }
      if (apiTripsThirdPartyAppIdNaKolePrahou) {
        const response = await load(apiTripsThirdPartyAppIdNaKolePrahou);
        if (response.app_url) {
          this.setUrlAppNaKolePrahou(response.app_url);
        }
      }
      this.isLoadingOpenAppWithRestToken = false;
    },
  },
});
