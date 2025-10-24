// libraries
import { Notify } from 'quasar';
import { defineStore } from 'pinia';

// composables
import { i18n } from '../boot/i18n';
import { useApiGetAdminOrganisation } from '../composables/useApiGetAdminOrganisation';
import { useApiGetCoordinatorInvoices } from '../composables/useApiGetCoordinatorInvoices';
import { useApiPostCoordinatorApprovePayments } from '../composables/useApiPostCoordinatorApprovePayments';

// types
import type { Logger } from '../components/types/Logger';
import type { AdminOrganisation } from '../components/types/AdminOrganisation';
import type { InvoiceResult } from '../components/types/Invoice';
import type { TableFeeApprovalRow } from '../composables/useTableFeeApprovalData';

interface AdminOrganisationState {
  $log: Logger | null;
  adminOrganisations: AdminOrganisation[];
  adminInvoices: InvoiceResult[];
  isLoadingOrganisations: boolean;
  isLoadingInvoices: boolean;
  isLoadingApprovePayments: boolean;
  selectedPaymentsToApprove: TableFeeApprovalRow[];
}

export const useAdminOrganisationStore = defineStore('adminOrganisation', {
  state: (): AdminOrganisationState => ({
    $log: null,
    adminOrganisations: [],
    adminInvoices: [],
    isLoadingOrganisations: false,
    isLoadingInvoices: false,
    isLoadingApprovePayments: false,
    selectedPaymentsToApprove: [],
  }),

  getters: {
    getAdminOrganisations: (state) => state.adminOrganisations,
    getAdminInvoices: (state) => state.adminInvoices,
    getIsLoadingOrganisations: (state) => state.isLoadingOrganisations,
    getIsLoadingInvoices: (state) => state.isLoadingInvoices,
    getIsLoadingApprovePayments: (state) => state.isLoadingApprovePayments,
    getIsLoadingAny: (state) =>
      state.isLoadingOrganisations ||
      state.isLoadingInvoices ||
      state.isLoadingApprovePayments,
    getCurrentAdminOrganisation: (state) => state.adminOrganisations[0],
    getCurrentAdminInvoice: (state) => state.adminInvoices[0],
    getSelectedPaymentsToApprove: (state) => state.selectedPaymentsToApprove,
  },

  actions: {
    setAdminOrganisations(adminOrganisations: AdminOrganisation[]): void {
      this.adminOrganisations = adminOrganisations;
    },
    setAdminInvoices(adminInvoices: InvoiceResult[]): void {
      this.adminInvoices = adminInvoices;
    },
    setSelectedPaymentsToApprove(
      selectedPaymentsToApprove: TableFeeApprovalRow[],
    ): void {
      this.selectedPaymentsToApprove = selectedPaymentsToApprove;
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
     * Approve selected payments
     * @returns {Promise<void>}
     */
    async approveSelectedPayments(): Promise<void> {
      const { approvePayments } = useApiPostCoordinatorApprovePayments(
        this.$log,
      );
      // get ids of selected payments
      const ids = this.selectedPaymentsToApprove.map((payment) => payment.id);
      this.isLoadingApprovePayments = true;
      // approve payments
      const result = await approvePayments(ids);

      // clear selected payments
      this.setSelectedPaymentsToApprove([]);
      // refetch organization structure
      await this.loadAdminOrganisations();

      // check that the approved ids are the same as the selected ids
      const approvedIds = result?.approved_ids || [];
      if (approvedIds.length > 0) {
        Notify.create({
          message: i18n.global.t(
            'approvePayments.apiMessageSuccessWithCount',
            { count: approvedIds.length },
            approvedIds.length,
          ),
          color: 'positive',
        });
      }
      // notify if some payment ids were not approved
      if (approvedIds.length !== ids.length) {
        Notify.create({
          message: i18n.global.t('approvePayments.apiMessageErrorPartial'),
          color: 'negative',
        });
      }
      this.isLoadingApprovePayments = false;
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
      this.isLoadingApprovePayments = false;
    },
  },

  persist: {
    omit: [
      'isLoadingOrganisations',
      'isLoadingInvoices',
      'isLoadingApprovePayments',
    ],
  },
});
