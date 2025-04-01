// libraries
import { defineStore } from 'pinia';

// composables
import { useApiGetCommuteMode } from '../composables/useApiGetCommuteMode';
import { useApiGetTrips } from 'src/composables/useApiGetTrips';

// types
import type { CommuteMode } from '../components/types/Route';
import type { Logger } from '../components/types/Logger';
import type { RouteItem } from '../components/types/Route';

interface TripsState {
  $log: Logger | null;
  commuteModes: CommuteMode[];
  routeItems: RouteItem[];
  isLoading: boolean;
}

export const useTripsStore = defineStore('trips', {
  state: (): TripsState => ({
    // property set in pinia.js boot file
    $log: null as Logger | null,
    commuteModes: [],
    routeItems: [],
    isLoading: false,
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
  },
});
