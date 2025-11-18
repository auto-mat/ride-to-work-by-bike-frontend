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

// utils
import { pairedCategories, priceLevelPairs } from '../utils/price_level_pairs';

// types
import type { Logger } from '../components/types/Logger';
import type {
  AdminOrganisation,
  AdminSubsidiary,
  AdminTeam,
  AdminTeamMember,
  TableFeeApprovalRow,
} from '../components/types/AdminOrganisation';
import type {
  InvoiceResult,
  InvoicePayment,
  InvoiceTeam,
} from '../components/types/Invoice';
import type { CoordinatorMakeInvoicePayload } from '../composables/useApiPostCoordinatorMakeInvoice';

interface InvoiceFormState {
  orderNumber: string;
  orderNote: string;
  isDonorEntryFee: boolean;
  isBillingDetailsCorrect: boolean;
  selectedMembers: { [key: number]: number[] };
  customBillingAddress: {
    street: string;
    streetNumber: string;
    city: string;
    psc: string;
  } | null;
  isBillingFormExpanded: boolean;
}

interface AdminOrganisationState {
  $log: Logger | null;
  adminOrganisations: AdminOrganisation[];
  adminInvoices: InvoiceResult[];
  isLoadingOrganisations: boolean;
  isLoadingInvoices: boolean;
  isLoadingApprovePayments: boolean;
  selectedPaymentsToApprove: TableFeeApprovalRow[];
  paymentRewards: Record<number, boolean | null>;
  paymentAmounts: Record<number, number>;
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
    paymentRewards: {},
    paymentAmounts: {},
    invoiceForm: {
      orderNumber: '',
      orderNote: '',
      isDonorEntryFee: false,
      isBillingDetailsCorrect: false,
      selectedMembers: {},
      customBillingAddress: null,
      isBillingFormExpanded: false,
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
    getIsBillingAddressEmpty: (state): boolean => {
      return !state.invoiceForm.customBillingAddress;
    },
    getBillingStreet: (state): string =>
      state.invoiceForm.customBillingAddress?.street || '',
    getBillingStreetNumber: (state): string =>
      state.invoiceForm.customBillingAddress?.streetNumber || '',
    getBillingCity: (state): string =>
      state.invoiceForm.customBillingAddress?.city || '',
    getBillingPsc: (state): string =>
      state.invoiceForm.customBillingAddress?.psc || '',
    /**
     * Get reward status for a specific member
     * @param {number} memberId - Member ID
     * @returns {boolean | null} - Reward status
     */
    getPaymentReward:
      (state) =>
      (memberId: number): boolean | null => {
        return state.paymentRewards[memberId] ?? null;
      },
    /**
     * Get payment amount for a specific member
     * @param {number} memberId - Member ID
     * @returns {number | null} - Payment amount
     */
    getPaymentAmount:
      (state) =>
      (memberId: number): number | null => {
        return state.paymentAmounts[memberId] ?? null;
      },
    /**
     * Get rows data for fee approval table
     * Transforms organization data into table rows
     * @param {boolean} approved - Whether to show approved or non-approved members
     * @returns {TableFeeApprovalRow[]} - Array of table rows
     */
    getFeeApprovalData:
      (state) =>
      (approved: boolean): TableFeeApprovalRow[] => {
        const organisation = state.adminOrganisations[0];
        if (!organisation || !organisation.subsidiaries) {
          return [];
        }
        const allMembers: TableFeeApprovalRow[] = [];

        // helper function - transform member to row
        const transformMemberToRow = (
          member: AdminTeamMember,
          subsidiaryAddress: string,
        ): TableFeeApprovalRow => {
          return {
            id: member.id,
            name: member.name,
            reward: member.is_payment_with_reward,
            email: member.email,
            nickname: member.nickname,
            amount: parseFloat(member.payment_amount) || 0,
            dateCreated: member.date_of_challenge_registration,
            address: subsidiaryAddress,
          };
        };

        // loop over subsidiaries
        organisation.subsidiaries.forEach((subsidiary: AdminSubsidiary) => {
          const subsidiaryAddress = `${subsidiary.street} ${subsidiary.street_number}, ${subsidiary.city}`;
          // loop over teams
          subsidiary.teams.forEach((team: AdminTeam) => {
            // get members based on approval status
            const memberArray = approved
              ? team.members_with_paid_entry_fee_by_org_coord
              : team.members_without_paid_entry_fee_by_org_coord;
            // transform members to rows
            memberArray.forEach((member: AdminTeamMember) => {
              allMembers.push(transformMemberToRow(member, subsidiaryAddress));
            });
          });
        });
        return allMembers;
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
    setBillingFormExpanded(value: boolean): void {
      this.invoiceForm.isBillingFormExpanded = value;
    },
    /**
     * Set reward status for a specific member
     * Also calculate and update payment amount based on reward status
     * @param {number} memberId - Member ID
     * @param {boolean | null} value - Reward status
     * @returns {void}
     */
    setPaymentReward(memberId: number, value: boolean | null): void {
      this.paymentRewards[memberId] = value;
      // find payment as a table row (API data)
      const nonApprovedData = this.getFeeApprovalData(false);
      const payment = nonApprovedData.find((p) => p.id === memberId);
      if (!payment) {
        this.$log?.debug(`Payment with memberId <${memberId}> not found.`);
        return;
      }
      const challengeStore = useChallengeStore();
      const originalRewardStatus = payment.reward;
      const originalAmount = payment.amount;
      // if reward value = original value, use original payment amount
      if (value === originalRewardStatus) {
        this.paymentAmounts[memberId] = originalAmount;
        return;
      }
      // if not, find matching price level and calculate new amount
      const priceLevels = originalRewardStatus
        ? challengeStore.getCurrentPriceLevelsWithReward
        : challengeStore.getCurrentPriceLevels;
      const matchedPriceLevel = Object.values(priceLevels).find((level) => {
        return (
          level.price === originalAmount &&
          pairedCategories.includes(level.category)
        );
      });
      // fallback
      if (!matchedPriceLevel) {
        this.paymentAmounts[memberId] = originalAmount;
        return;
      }
      const pairedCategory = priceLevelPairs[matchedPriceLevel.category];
      const newPriceLevels = value
        ? challengeStore.getCurrentPriceLevelsWithReward
        : challengeStore.getCurrentPriceLevels;
      const newPrice = newPriceLevels[pairedCategory]?.price;
      // fallback
      if (newPrice === undefined) {
        this.paymentAmounts[memberId] = originalAmount;
        return;
      }
      // set new price
      this.paymentAmounts[memberId] = newPrice;
    },
    /**
     * Initialize paymentRewards map from table rows
     * @param {TableFeeApprovalRow[]} rows - Table rows with member data
     * @returns {void}
     */
    initializePaymentRewards(rows: TableFeeApprovalRow[]): void {
      rows.forEach((row) => {
        // Only initialize if not already set (preserve user edits)
        if (!(row.id in this.paymentRewards)) {
          this.paymentRewards[row.id] = row.reward;
        }
      });
    },
    /**
     * Set payment amount for a specific member
     * @param {number} memberId - Member ID
     * @param {number} amount - Payment amount
     * @returns {void}
     */
    setPaymentAmount(memberId: number, amount: number): void {
      this.paymentAmounts[memberId] = amount;
    },
    /**
     * Initialize paymentAmounts map from table rows
     * @param {TableFeeApprovalRow[]} rows - Table rows with member data
     * @returns {void}
     */
    initializePaymentAmounts(rows: TableFeeApprovalRow[]): void {
      rows.forEach((row) => {
        // Only initialize if not already set (preserve user edits)
        if (!(row.id in this.paymentAmounts)) {
          this.paymentAmounts[row.id] = row.amount;
        }
      });
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
      this.initializeBillingAddress();
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
      const ids: Record<string, number> = {};
      // get ids and amounts
      this.selectedPaymentsToApprove.forEach((payment) => {
        const currentAmount = this.paymentAmounts[payment.id];
        ids[payment.id.toString()] =
          currentAmount !== undefined ? currentAmount : payment.amount;
      });
      this.isLoadingApprovePayments = true;
      // approve payments
      const result = await approvePayments(ids);
      // clear local state
      this.setSelectedPaymentsToApprove([]);
      this.paymentRewards = {};
      this.paymentAmounts = {};
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
      if (approvedIds.length !== Object.keys(ids).length) {
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
      const payload: CoordinatorMakeInvoicePayload = {
        // when set to undefined, field is not sent in the request
        order_number: this.invoiceForm.orderNumber || undefined,
        client_note: this.invoiceForm.orderNote || undefined,
        company_pais_benefitial_fee:
          this.invoiceForm.isDonorEntryFee || undefined,
        payment_ids: paymentIds,
      };
      if (
        this.invoiceForm.isBillingFormExpanded &&
        this.invoiceForm.customBillingAddress
      ) {
        // name must be present in the payload
        payload.company_name = this.getCurrentAdminOrganisation?.name;
        payload.company_address = {
          psc: this.invoiceForm.customBillingAddress.psc,
          street: this.invoiceForm.customBillingAddress.street,
          street_number: this.invoiceForm.customBillingAddress.streetNumber,
          city: this.invoiceForm.customBillingAddress.city,
        };
      }
      const result = await makeInvoice(payload);
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
        customBillingAddress: null,
        isBillingFormExpanded: false,
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
     * Initialize billing address with current organization data
     * @returns {void}
     */
    initializeBillingAddress(): void {
      const organization = this.getCurrentAdminOrganisation;
      if (organization) {
        this.invoiceForm.customBillingAddress = {
          street: organization.street || '',
          streetNumber: String(organization.street_number || ''),
          city: organization.city || '',
          psc: String(organization.psc || ''),
        };
      }
    },
    /**
     * Reset billing form to initial state
     * @returns {void}
     */
    resetBillingForm(): void {
      this.invoiceForm.customBillingAddress = null;
      this.invoiceForm.isBillingFormExpanded = false;
    },
    /**
     * Update a specific field in the billing address using $patch
     * @param {string} field - Field name to update
     * @param {string} value - New field value
     * @returns {void}
     */
    updateBillingAddressField(
      field: keyof NonNullable<InvoiceFormState['customBillingAddress']>,
      value: string,
    ): void {
      this.$patch((state) => {
        if (!state.invoiceForm.customBillingAddress) {
          this.initializeBillingAddress();
        } else {
          state.invoiceForm.customBillingAddress[field] = value;
        }
      });
    },
    /**
     * Clear all store data
     * @returns {void}
     */
    clearStore(): void {
      this.adminOrganisations = [];
      this.adminInvoices = [];
      this.selectedPaymentsToApprove = [];
      this.paymentRewards = {};
      this.paymentAmounts = {};
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
