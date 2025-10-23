// libraries
import { defineStore } from 'pinia';

// composables
import { useApiGetAdminOrganisation } from 'src/composables/useApiGetAdminOrganisation';
import { useApiGetCoordinatorInvoices } from 'src/composables/useApiGetCoordinatorInvoices';

// types
import type { Logger } from '../components/types/Logger';
import type { AdminOrganisation } from '../components/types/AdminOrganisation';
import type { InvoiceResult } from '../components/types/Invoice';

interface AdminOrganisationState {
  $log: Logger | null;
  adminOrganisations: AdminOrganisation[];
  adminInvoices: InvoiceResult[];
  isLoadingOrganisations: boolean;
  isLoadingInvoices: boolean;
}

export const useAdminOrganisationStore = defineStore('adminOrganisation', {
  state: (): AdminOrganisationState => ({
    $log: null,
    adminOrganisations: [],
    adminInvoices: [],
    isLoadingOrganisations: false,
    isLoadingInvoices: false,
  }),

  getters: {
    getAdminOrganisations: (state) => state.adminOrganisations,
    getAdminInvoices: (state) => state.adminInvoices,
    getIsLoadingOrganisations: (state) => state.isLoadingOrganisations,
    getIsLoadingInvoices: (state) => state.isLoadingInvoices,
    getIsLoadingAny: (state) =>
      state.isLoadingOrganisations || state.isLoadingInvoices,
    getCurrentAdminOrganisation: (state) => state.adminOrganisations[0],
    getCurrentAdminInvoice: (state) => state.adminInvoices[0],
  },

  actions: {
    setAdminOrganisations(adminOrganisations: AdminOrganisation[]): void {
      this.adminOrganisations = adminOrganisations;
    },
    setAdminInvoices(adminInvoices: InvoiceResult[]): void {
      this.adminInvoices = adminInvoices;
    },
    /**
     * Load admin organisations from API
     * @returns {Promise<void>}
     */
    async loadAdminOrganisations(): Promise<void> {
      const { organisations, loadAdminOrganisations } =
        useApiGetAdminOrganisation(this.$log);
      this.isLoadingOrganisations = true;
      await loadAdminOrganisations();
      this.setAdminOrganisations(organisations.value);
      this.$log?.debug(
        `Admin organisations loaded <${JSON.stringify(this.adminOrganisations, null, 2)}>.`,
      );
      this.isLoadingOrganisations = false;
    },
    /**
     * Load admin invoices from API
     * @returns {Promise<void>}
     */
    async loadAdminInvoices(): Promise<void> {
      const { invoiceResults, loadCoordinatorInvoices } =
        useApiGetCoordinatorInvoices(this.$log);
      this.isLoadingInvoices = true;
      await loadCoordinatorInvoices();
      this.setAdminInvoices(invoiceResults.value);
      this.$log?.debug(
        `Admin invoices loaded <${JSON.stringify(this.adminInvoices, null, 2)}>.`,
      );
      this.isLoadingInvoices = false;
    },
    /**
     * Clear all store data
     * @returns {void}
     */
    clearStore(): void {
      this.adminOrganisations = [];
      this.adminInvoices = [];
      this.isLoadingOrganisations = false;
      this.isLoadingInvoices = false;
    },
  },

  persist: {
    omit: ['isLoadingOrganisations', 'isLoadingInvoices'],
  },
});
