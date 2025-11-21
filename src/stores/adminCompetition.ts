// libraries
import { defineStore } from 'pinia';

// composables
import { useApiGetCompetition } from '../composables/useApiGetCompetition';

// types
import type { Logger } from '../components/types/Logger';
import type { Competition } from '../components/types/Competition';

interface AdminCompetitionState {
  $log: Logger | null;
  competitions: Competition[];
  isLoadingCompetition: boolean;
}

export const useAdminCompetitionStore = defineStore('adminCompetition', {
  state: (): AdminCompetitionState => ({
    $log: null,
    competitions: [],
    isLoadingCompetition: false,
  }),

  getters: {
    getCompetitions: (state) => state.competitions,
    getIsLoadingCompetition: (state) => state.isLoadingCompetition,
  },

  actions: {
    setCompetitions(competitions: Competition[]): void {
      this.competitions = competitions;
    },
    /**
     * Load competitions from API
     * @returns {Promise<void>}
     */
    async loadCompetitions(): Promise<void> {
      const { competitions, loadCompetition } = useApiGetCompetition(this.$log);
      this.isLoadingCompetition = true;
      await loadCompetition();
      this.setCompetitions(competitions.value);
      this.$log?.debug(
        `Competitions loaded <${JSON.stringify(this.competitions, null, 2)}>.`,
      );
      this.isLoadingCompetition = false;
    },
    /**
     * Clear all store data
     * @returns {void}
     */
    clearStore(): void {
      this.competitions = [];
      this.isLoadingCompetition = false;
    },
  },

  persist: {
    omit: ['isLoadingCompetition'],
  },
});
