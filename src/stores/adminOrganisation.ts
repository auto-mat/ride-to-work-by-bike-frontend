// libraries
import { Notify } from 'quasar';
import { defineStore } from 'pinia';

// composables
import { i18n } from '../boot/i18n';
import { useApiGetAdminOrganisation } from '../composables/useApiGetAdminOrganisation';
import { useApiGetCoordinatorInvoices } from '../composables/useApiGetCoordinatorInvoices';
import { useApiPostCoordinatorApprovePayments } from '../composables/useApiPostCoordinatorApprovePayments';
import { useApiPostCoordinatorMakeInvoice } from '../composables/useApiPostCoordinatorMakeInvoice';
import { useApiPostCoordinatorMoveMember } from '../composables/useApiPostCoordinatorMoveMember';
import { useApiPostCoordinatorTeam } from '../composables/useApiPostCoordinatorTeam';
import { useApiDeleteCoordinatorTeam } from '../composables/useApiDeleteCoordinatorTeam';
import { useApiPutCoordinatorTeam } from '../composables/useApiPutCoordinatorTeam';
import { useApiPutCoordinatorSubsidiary } from '../composables/useApiPutCoordinatorSubsidiary';

// adapters
import { subsidiaryAdapter } from '../adapters/subsidiaryAdapter';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { PhaseType } from '../components/types/Challenge';
import { TeamMemberStatus } from '../components/enums/TeamMember';
import { PriceLevelCategory } from '../components/enums/Challenge';

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
  Invoice,
  InvoiceResult,
  InvoicePayment,
  InvoiceTeam,
} from '../components/types/Invoice';
import type { CoordinatorMakeInvoicePayload } from '../composables/useApiPostCoordinatorMakeInvoice';
import type { FormCompanyAddressFields } from '../components/types/Form';

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
  customBillingOrganization: {
    companyName: string;
    businessId: string;
    businessVatId: string;
  } | null;
  isBillingFormExpanded: boolean;
  anonymize: boolean;
}

interface AdminOrganisationState {
  $log: Logger | null;
  adminOrganisations: AdminOrganisation[];
  adminInvoices: InvoiceResult[];
  isLoadingOrganisations: boolean;
  isLoadingInvoices: boolean;
  isLoadingApprovePayments: boolean;
  isLoadingCreateTeam: boolean;
  isLoadingDeleteTeam: boolean;
  isLoadingMoveMember: boolean;
  isLoadingUpdateTeam: boolean;
  isLoadingUpdateSubsidiary: boolean;
  selectedPaymentsToApprove: TableFeeApprovalRow[];
  paymentRewards: Record<number, boolean | null>;
  paymentAmounts: Record<number, number>;
  invoiceForm: InvoiceFormState;
  // Invoice polling state
  invoicePollingIntervalId: number | null;
  invoicePollingTimeoutId: number | null;
}

export const useAdminOrganisationStore = defineStore('adminOrganisation', {
  state: (): AdminOrganisationState => ({
    $log: null,
    adminOrganisations: [],
    adminInvoices: [],
    isLoadingOrganisations: false,
    isLoadingInvoices: false,
    isLoadingApprovePayments: false,
    isLoadingCreateTeam: false,
    isLoadingDeleteTeam: false,
    isLoadingMoveMember: false,
    isLoadingUpdateTeam: false,
    isLoadingUpdateSubsidiary: false,
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
      customBillingOrganization: null,
      isBillingFormExpanded: false,
      anonymize: false,
    },
    // Invoice polling state
    invoicePollingIntervalId: null,
    invoicePollingTimeoutId: null,
  }),

  getters: {
    getAdminOrganisations: (state) => state.adminOrganisations,
    getAdminInvoices: (state) => state.adminInvoices,
    getIsLoadingOrganisations: (state) => state.isLoadingOrganisations,
    getIsLoadingInvoices: (state) => state.isLoadingInvoices,
    getIsLoadingApprovePayments: (state) => state.isLoadingApprovePayments,
    getIsLoadingCreateTeam: (state) => state.isLoadingCreateTeam,
    getIsLoadingDeleteTeam: (state) => state.isLoadingDeleteTeam,
    getIsLoadingMoveMember: (state) => state.isLoadingMoveMember,
    getIsLoadingUpdateTeam: (state) => state.isLoadingUpdateTeam,
    getIsLoadingUpdateSubsidiary: (state) => state.isLoadingUpdateSubsidiary,
    getIsLoadingAny: (state) =>
      state.isLoadingOrganisations ||
      state.isLoadingInvoices ||
      state.isLoadingApprovePayments ||
      state.isLoadingCreateTeam ||
      state.isLoadingDeleteTeam ||
      state.isLoadingMoveMember ||
      state.isLoadingUpdateTeam ||
      state.isLoadingUpdateSubsidiary,
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
    getBillingCompanyName: (state): string =>
      state.invoiceForm.customBillingOrganization?.companyName || '',
    getBillingBusinessId: (state): string =>
      state.invoiceForm.customBillingOrganization?.businessId || '',
    getBillingBusinessVatId: (state): string =>
      state.invoiceForm.customBillingOrganization?.businessVatId || '',
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
    /**
     * Get total number of boxes across all subsidiaries
     * @returns {number} - Total number of boxes
     */
    getTotalBoxes: (state): number => {
      const organisation = state.adminOrganisations[0];
      if (!organisation || !organisation.subsidiaries) {
        return 0;
      }
      return organisation.subsidiaries.reduce((total, subsidiary) => {
        return total + (subsidiary.boxes?.length || 0);
      }, 0);
    },
    /**
     * Get number of delivered boxes across all subsidiaries
     * @returns {number} - Number of delivered boxes
     */
    getDeliveredBoxes: (state): number => {
      const organisation = state.adminOrganisations[0];
      if (!organisation || !organisation.subsidiaries) {
        return 0;
      }
      return organisation.subsidiaries.reduce((total, subsidiary) => {
        if (!subsidiary.boxes) return total;
        return total + subsidiary.boxes.filter((box) => box.dispatched).length;
      }, 0);
    },
    /**
     * Get all invoices with empty fakturoid_invoice_url (generating)
     * @returns {Invoice[]} - Array of invoices
     */
    getInvoicesBeingGenerated: (state): Invoice[] => {
      const allInvoices: Invoice[] = [];
      state.adminInvoices.forEach((result: InvoiceResult) => {
        result.invoices.forEach((invoice: Invoice) => {
          if (invoice.fakturoid_invoice_url === '') {
            allInvoices.push(invoice);
          }
        });
      });
      return allInvoices;
    },
    /**
     * Check if invoice polling is currently active
     * @returns {boolean} - True if polling is active
     */
    getIsInvoicePollingActive: (state): boolean => {
      return state.invoicePollingIntervalId !== null;
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
      const priceLevelsWithReward = challengeStore.getPriceLevel.filter(
        (level) => {
          return (
            level.category === PriceLevelCategory.companyWithReward ||
            level.category === PriceLevelCategory.schoolWithReward
          );
        },
      );
      const priceLevelsWithoutReward = challengeStore.getPriceLevel.filter(
        (level) => {
          return (
            level.category === PriceLevelCategory.company ||
            level.category === PriceLevelCategory.school
          );
        },
      );
      const priceLevels = originalRewardStatus
        ? priceLevelsWithReward
        : priceLevelsWithoutReward;
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
        ? priceLevelsWithReward
        : priceLevelsWithoutReward;
      const newPriceLevel = Object.values(newPriceLevels).find((level) => {
        return (
          level.category === pairedCategory &&
          level.name === matchedPriceLevel.name
        );
      });
      const newPrice = newPriceLevel?.price;
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
      // refetch organization structure and invoices in parallel
      await Promise.all([
        this.loadAdminOrganisations(),
        this.loadAdminInvoices(),
      ]);
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
     * Create a new team for a specific subsidiary
     * @param {number} subsidiaryId - The ID of the subsidiary to add the team to
     * @param {string} teamName - The name of the new team
     */
    async createTeamForSubsidiary(
      subsidiaryId: number,
      teamName: string,
    ): Promise<void> {
      const { createTeam } = useApiPostCoordinatorTeam(this.$log);
      const challengeStore = useChallengeStore();
      const campaignId = challengeStore.getCampaignId;
      if (!campaignId) {
        this.$log?.error('Cannot create team, campaign ID is not available.');
        return;
      }
      this.$log?.info(
        'Create new team <${teamName}>' +
          ` for subsidiary ID <${subsidiaryId}>` +
          ` in campaign ID <${campaignId}>.`,
      );
      this.isLoadingCreateTeam = true;
      const result = await createTeam(subsidiaryId, teamName, campaignId);
      if (result?.id) {
        this.$log?.debug(`Team created successfully with ID <${result.id}>.`);
        await this.loadAdminOrganisations();
      }
      this.isLoadingCreateTeam = false;
    },
    /**
     * Delete a team for a specific subsidiary
     * Team must have no active members
     * @param {number} subsidiaryId - The ID of the team subsidiary
     * @param {number} teamId - The ID of the team to delete
     */
    async deleteTeam(subsidiaryId: number, teamId: number): Promise<void> {
      const { deleteTeam } = useApiDeleteCoordinatorTeam(this.$log);
      this.$log?.info(
        `Delete team with ID <${teamId}>` +
          ` for subsidiary ID <${subsidiaryId}>.`,
      );
      this.isLoadingDeleteTeam = true;
      const success = await deleteTeam(subsidiaryId, teamId);
      if (success) {
        this.$log?.debug(`Team deleted successfully with ID <${teamId}>.`);
        await this.loadAdminOrganisations();
      }
      this.isLoadingDeleteTeam = false;
    },
    /**
     * Move team member to another team
     * Preserves the member's approval status
     * @param {number} currentSubsidiaryId - Member's current subsidiary ID
     * @param {number} currentTeamId - Member's current team ID
     * @param {number} memberId - ID of the member to move
     * @param {number} targetTeamId - Target team ID to move member to
     * @param {TeamMemberStatus} approvedForTeam - Current approval status to preserve
     */
    async moveTeamMember(
      currentSubsidiaryId: number,
      currentTeamId: number,
      memberId: number,
      targetTeamId: number,
      approvedForTeam: TeamMemberStatus,
    ): Promise<void> {
      const { moveMember } = useApiPostCoordinatorMoveMember(this.$log);
      const challengeStore = useChallengeStore();
      const campaignId = challengeStore.getCampaignId;
      if (!campaignId) {
        this.$log?.error('Cannot move member, campaign ID is not available.');
        return;
      }
      this.$log?.info(
        `Move member with ID <${memberId}> from team ID <${currentTeamId}>` +
          ` to team ID <${targetTeamId}> in subsidiary ID <${currentSubsidiaryId}>.`,
      );
      this.isLoadingMoveMember = true;
      // prepare payload
      const payload = {
        team_id: targetTeamId,
        campaign_id: campaignId,
        approved_for_team: approvedForTeam,
      };
      const data = await moveMember(
        currentSubsidiaryId,
        currentTeamId,
        memberId,
        payload,
      );
      if (data) {
        this.$log?.debug(
          `Member moved successfully, new team ID <${data.team_id}>.`,
        );
        // Refetch organization structure to update UI
        await this.loadAdminOrganisations();
      }
      this.isLoadingMoveMember = false;
    },
    /**
     * Update a team name
     * @param {number} subsidiaryId - The ID of the team subsidiary
     * @param {number} teamId - The ID of the team to update
     * @param {string} teamName - The new team name
     */
    async updateTeam(
      subsidiaryId: number,
      teamId: number,
      teamName: string,
    ): Promise<void> {
      const { updateTeam } = useApiPutCoordinatorTeam(this.$log);
      const challengeStore = useChallengeStore();
      const campaignId = challengeStore.getCampaignId;
      if (!campaignId) {
        this.$log?.error('Cannot update team, campaign ID is not available.');
        return;
      }
      this.$log?.info(
        `Update team with ID <${teamId}> to name <${teamName}>` +
          ` for subsidiary ID <${subsidiaryId}>.`,
      );
      this.isLoadingUpdateTeam = true;
      const result = await updateTeam(
        subsidiaryId,
        teamId,
        teamName,
        campaignId,
      );
      if (result?.id) {
        this.$log?.debug(`Team updated successfully with ID <${result.id}>.`);
        await this.loadAdminOrganisations();
      }
      this.isLoadingUpdateTeam = false;
    },
    /**
     * Update subsidiary address
     * @param {number} subsidiaryId - The ID of the subsidiary to update
     * @param {FormCompanyAddressFields} addressData - The address data to update
     */
    async updateSubsidiary(
      subsidiaryId: number,
      addressData: FormCompanyAddressFields,
    ): Promise<void> {
      const { updateSubsidiary } = useApiPutCoordinatorSubsidiary(this.$log);
      this.$log?.debug(
        `Update subsidiary address with ID <${subsidiaryId}>` +
          ` to <${JSON.stringify(addressData, null, 2)}>.`,
      );
      this.isLoadingUpdateSubsidiary = true;
      // Convert form data to API payload
      const payload =
        subsidiaryAdapter.fromFormDataToApiPayloadUpdate(addressData);
      const result = await updateSubsidiary(subsidiaryId, payload);
      if (result && result.address) {
        this.$log?.debug(
          'Subsidiary address updated successfully' +
            ` ${JSON.stringify(result, null, 2)}>.`,
        );
        await this.loadAdminOrganisations();
      }
      this.isLoadingUpdateSubsidiary = false;
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
        anonymize: this.invoiceForm.anonymize || undefined,
      };
      if (this.invoiceForm.isBillingFormExpanded) {
        // if custom organization details, company_name is required
        if (this.invoiceForm.customBillingOrganization) {
          payload.company_name =
            this.invoiceForm.customBillingOrganization.companyName;
          payload.company_ico =
            this.invoiceForm.customBillingOrganization.businessId;
          payload.company_dic =
            this.invoiceForm.customBillingOrganization.businessVatId;
        } else {
          // company_name fallback
          payload.company_name = this.getCurrentAdminOrganisation?.name;
        }
        // include billing address if present
        if (this.invoiceForm.customBillingAddress) {
          payload.company_address = {
            psc: this.invoiceForm.customBillingAddress.psc,
            street: this.invoiceForm.customBillingAddress.street,
            street_number: this.invoiceForm.customBillingAddress.streetNumber,
            city: this.invoiceForm.customBillingAddress.city,
          };
        }
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
        customBillingOrganization: null,
        isBillingFormExpanded: false,
        anonymize: false,
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
        this.invoiceForm.customBillingOrganization = {
          companyName: organization.name || '',
          businessId: String(organization.ico) || '',
          businessVatId: organization.dic || '',
        };
      }
    },
    /**
     * Reset billing form to initial state
     * @returns {void}
     */
    resetBillingForm(): void {
      this.invoiceForm.customBillingAddress = null;
      this.invoiceForm.customBillingOrganization = null;
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
     * Update a specific field in the billing organization using $patch
     * @param {string} field - Field name to update
     * @param {string} value - New field value
     * @returns {void}
     */
    updateBillingOrganizationField(
      field: keyof NonNullable<InvoiceFormState['customBillingOrganization']>,
      value: string,
    ): void {
      this.$patch((state) => {
        if (!state.invoiceForm.customBillingOrganization) {
          this.initializeBillingAddress();
        } else {
          state.invoiceForm.customBillingOrganization[field] = value;
        }
      });
    },
    /**
     * Start polls for invoices to show generated PDF
     * @returns {void}
     */
    startInvoicePolling(): void {
      // if already polling, skip
      if (this.invoicePollingIntervalId !== null) {
        this.$log?.info('Invoice polling is already active, skipping start.');
        return;
      }
      // check if there are invoices to poll
      const invoicesToPoll = this.getInvoicesBeingGenerated;
      if (invoicesToPoll.length === 0) {
        this.$log?.info('No invoices with empty URLs found, skipping polling.');
        return;
      }
      // extract config values
      const { checkInvoicePollingInterval, checkInvoicePollingMaxRepetitions } =
        rideToWorkByBikeConfig;

      this.$log?.debug(
        `Starting invoice polling for <${invoicesToPoll.length}> invoice(s) with empty URLs.`,
      );
      // setup poll interval
      this.invoicePollingIntervalId = window.setInterval(async () => {
        await this.pollInvoices();
      }, checkInvoicePollingInterval * 1000);
      // setup timeout
      this.invoicePollingTimeoutId = window.setTimeout(
        () => {
          this.$log?.debug(
            'Invoice polling timeout reached' +
              ` <${checkInvoicePollingMaxRepetitions * checkInvoicePollingInterval}> seconds.`,
          );
          this.stopInvoicePolling();
        },
        checkInvoicePollingInterval * checkInvoicePollingMaxRepetitions * 1000,
      );
    },
    /**
     * Poll for invoice updates
     * Fetches latest invoices and checks if any are still generating
     * @returns {Promise<void>}
     */
    async pollInvoices(): Promise<void> {
      this.$log?.info('Polling invoices.');
      // fetch invoices
      await this.loadAdminInvoices();
      // check for PDFs
      const stillGenerating = this.getInvoicesBeingGenerated;
      if (stillGenerating.length === 0) {
        this.$log?.info('All invoices have URLs, stopping polling.');
        this.stopInvoicePolling();
        return;
      }
      this.$log?.debug(
        `Polling continues <${stillGenerating.length}> invoice(s) still generating.`,
      );
    },
    /**
     * Stop invoice polling
     * @returns {void}
     */
    stopInvoicePolling(): void {
      if (this.invoicePollingIntervalId !== null) {
        window.clearInterval(this.invoicePollingIntervalId);
        this.invoicePollingIntervalId = null;
        this.$log?.info('Invoice polling interval cleared.');
      }
      if (this.invoicePollingTimeoutId !== null) {
        window.clearTimeout(this.invoicePollingTimeoutId);
        this.invoicePollingTimeoutId = null;
        this.$log?.info('Invoice polling timeout cleared.');
      }
      this.$log?.info('Invoice polling stopped.');
    },
    /**
     * Clear all store data
     * @returns {void}
     */
    clearStore(): void {
      // Stop any active polling before clearing
      this.stopInvoicePolling();

      this.adminOrganisations = [];
      this.adminInvoices = [];
      this.selectedPaymentsToApprove = [];
      this.paymentRewards = {};
      this.paymentAmounts = {};
      this.resetInvoiceForm();
      this.isLoadingOrganisations = false;
      this.isLoadingInvoices = false;
      this.isLoadingApprovePayments = false;
      this.isLoadingCreateTeam = false;
      this.isLoadingDeleteTeam = false;
      this.isLoadingUpdateTeam = false;
      this.isLoadingMoveMember = false;
      this.isLoadingUpdateSubsidiary = false;
    },
  },

  persist: {
    omit: [
      'isLoadingOrganisations',
      'isLoadingInvoices',
      'isLoadingApprovePayments',
      'isLoadingCreateTeam',
      'isLoadingDeleteTeam',
      'isLoadingMoveMember',
      'isLoadingUpdateTeam',
      'isLoadingUpdateSubsidiary',
      'invoicePollingIntervalId',
      'invoicePollingTimeoutId',
    ],
  },
});
