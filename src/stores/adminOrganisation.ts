// libraries
import { Notify } from 'quasar';
import { defineStore } from 'pinia';

// composables
import { i18n } from '../boot/i18n';
import { useApiGetAdminOrganisation } from '../composables/useApiGetAdminOrganisation';
import { useApiGetCoordinatorInvoices } from '../composables/useApiGetCoordinatorInvoices';
import { useApiPostCoordinatorApprovePayments } from '../composables/useApiPostCoordinatorApprovePayments';
import { useApiPostCoordinatorMakeInvoice } from '../composables/useApiPostCoordinatorMakeInvoice';

// enums
import { PhaseType } from '../components/types/Challenge';

// stores
import { useChallengeStore } from './challenge';

// types
import type { Logger } from '../components/types/Logger';
import type {
  AdminOrganisation,
  AdminSubsidiary,
  AdminTeam,
  AdminTeamMember,
} from '../components/types/AdminOrganisation';
import type {
  InvoiceResult,
  InvoicePayment,
  InvoiceTeam,
} from '../components/types/Invoice';
import type { TableFeeApprovalRow } from '../composables/useTableFeeApprovalData';

interface InvoiceFormState {
  orderNumber: string;
  orderNote: string;
  isDonorEntryFee: boolean;
  isBillingDetailsCorrect: boolean;
  selectedMembers: { [key: number]: number[] };
}

interface AdminOrganisationState {
  $log: Logger | null;
  adminOrganisations: AdminOrganisation[];
  adminInvoices: InvoiceResult[];
  isLoadingOrganisations: boolean;
  isLoadingInvoices: boolean;
  isLoadingApprovePayments: boolean;
  selectedPaymentsToApprove: TableFeeApprovalRow[];
  invoiceForm: InvoiceFormState;
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
    invoiceForm: {
      orderNumber: '',
      orderNote: '',
      isDonorEntryFee: false,
      isBillingDetailsCorrect: false,
      selectedMembers: {},
    },
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
    getInvoiceForm: (state) => state.invoiceForm,
    /**
     * Get teams data for invoice creation
     * Matches payments_to_invoice with team members by userprofile_id
     */
    getInvoiceTeams: (state): InvoiceTeam[] => {
      const organisation = state.adminOrganisations[0];
      const invoiceResult = state.adminInvoices[0];
      // check existence
      if (!organisation || !invoiceResult) {
        return [];
      }
      const paymentsToInvoice = invoiceResult.payments_to_invoice;
      // teams map to store result structure
      const teamsMap = new Map<number, InvoiceTeam>();
      // member map to lookup member by user_profile_id
      const memberMap = new Map<
        number,
        { member: AdminTeamMember; team: AdminTeam }
      >();
      // build member map from all subsidiaries and teams
      organisation.subsidiaries.forEach((subsidiary: AdminSubsidiary) => {
        subsidiary.teams.forEach((team: AdminTeam) => {
          const allMembers = [
            ...team.members_without_paid_entry_fee_by_org_coord,
            ...team.members_with_paid_entry_fee_by_org_coord,
            ...team.other_members,
          ];
          allMembers.forEach((member: AdminTeamMember) => {
            memberMap.set(member.user_profile_id, { member, team });
          });
        });
      });
      // match payments with members and group by team
      paymentsToInvoice.forEach((payment: InvoicePayment) => {
        const memberData = memberMap.get(payment.userprofile_id);
        if (memberData) {
          const { member, team } = memberData;
          // create or get existing team
          if (!teamsMap.has(team.id)) {
            teamsMap.set(team.id, {
              id: team.id,
              name: team.name,
              members: [],
            });
          }
          const invoiceTeam = teamsMap.get(team.id)!;
          invoiceTeam.members.push({
            id: member.id,
            name: member.name,
            teamId: team.id,
            payment: {
              id: payment.id,
              amount: payment.amount,
            },
          });
        }
      });

      return Array.from(teamsMap.values());
    },
    // check if there are payments to invoice
    getHasPaymentsToInvoice: (state): boolean => {
      const invoiceResult = state.adminInvoices[0];
      if (!invoiceResult || !invoiceResult.payments_to_invoice) {
        return false;
      }
      return invoiceResult.payments_to_invoice.length > 0;
    },
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
     * Create invoice from internal form state
     * @returns {Promise<boolean>} - Success status
     */
    async createInvoice(): Promise<boolean> {
      // get payment ids from selected members
      const paymentIds: number[] = [];
      Object.values(this.invoiceForm.selectedMembers).forEach((memberIds) => {
        paymentIds.push(...memberIds);
      });
      // if no payments available or no payments selected, return
      if (!this.getHasPaymentsToInvoice || !paymentIds.length) {
        Notify.create({
          message: i18n.global.t(
            'makeInvoice.apiMessageErrorNoPaymentsToInvoice',
          ),
          color: 'negative',
        });
        return false;
      }
      const challengeStore = useChallengeStore();
      if (!challengeStore.getIsChallengeInPhase(PhaseType.invoices)) {
        Notify.create({
          message: i18n.global.t(
            'makeInvoice.apiMessageErrorNotInInvoicesPhase',
          ),
          color: 'negative',
        });
        return false;
      }
      const { makeInvoice } = useApiPostCoordinatorMakeInvoice(this.$log);
      const result = await makeInvoice({
        // when set to undefined, field is not sent in the request
        order_number: this.invoiceForm.orderNumber || undefined,
        client_note: this.invoiceForm.orderNote || undefined,
        company_pais_benefitial_fee:
          this.invoiceForm.isDonorEntryFee || undefined,
        payment_ids: paymentIds,
      });
      // if successful, refetch invoices list
      if (result) {
        await this.loadAdminInvoices();
        return true;
      }
      return false;
    },
    /**
     * Reset invoice form to initial state
     * @returns {void}
     */
    resetInvoiceForm(): void {
      this.invoiceForm = {
        orderNumber: '',
        orderNote: '',
        isDonorEntryFee: false,
        isBillingDetailsCorrect: false,
        selectedMembers: {},
      };
    },
    /**
     * Initialize selectedMembers with all members selected by default
     * @returns {void}
     */
    initializeSelectedMembers(): void {
      const newSelectedMembers: { [key: number]: number[] } = {};
      const teams = this.getInvoiceTeams;
      teams.forEach((team) => {
        // set selected value for each member in the team
        newSelectedMembers[team.id] = team.members.map(
          (member) => member.payment.id,
        );
      });
      this.invoiceForm.selectedMembers = newSelectedMembers;
    },
    /**
     * Clear all store data
     * @returns {void}
     */
    clearStore(): void {
      this.adminOrganisations = [];
      this.adminInvoices = [];
      this.selectedPaymentsToApprove = [];
      this.resetInvoiceForm();
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
