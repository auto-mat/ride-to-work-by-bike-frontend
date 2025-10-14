// libraries
import { defineStore } from 'pinia';

// composables
import { useApiGetAdminOrganisation } from 'src/composables/useApiGetAdminOrganisation';

// types
import type { Logger } from '../components/types/Logger';
import type { AdminOrganisation } from '../components/types/AdminOrganisation';

interface AdminOrganisationState {
  $log: Logger | null;
  adminOrganisations: AdminOrganisation[];
  isLoading: boolean;
}

export const useAdminOrganisationStore = defineStore('adminOrganisation', {
  state: (): AdminOrganisationState => ({
    $log: null,
    adminOrganisations: [],
    isLoading: false,
  }),

  getters: {
    getAdminOrganisations: (state) => state.adminOrganisations,
    getIsLoading: (state) => state.isLoading,
    getCurrentAdminOrganisation: (state) => state.adminOrganisations[0],
  },

  actions: {
    setAdminOrganisations(adminOrganisations: AdminOrganisation[]): void {
      this.adminOrganisations = adminOrganisations;
    },
    /**
     * Load admin organisations from API
     * @returns {Promise<void>}
     */
    async loadAdminOrganisations(): Promise<void> {
      const { organisations, loadAdminOrganisations } =
        useApiGetAdminOrganisation(this.$log);
      this.isLoading = true;
      await loadAdminOrganisations();
      this.setAdminOrganisations(organisations.value);
      this.$log?.debug(
        `Admin organisations loaded <${JSON.stringify(this.adminOrganisations, null, 2)}>.`,
      );
      this.isLoading = false;
    },
    /**
     * Clear all store data
     * @returns {void}
     */
    clearStore(): void {
      this.adminOrganisations = [];
      this.isLoading = false;
    },
  },

  persist: {
    omit: ['isLoading'],
  },
});
