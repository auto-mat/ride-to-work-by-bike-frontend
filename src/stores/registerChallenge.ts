// libraries
import { defineStore } from 'pinia';

// adapters
import { subsidiaryAdapter } from 'src/adapters/subsidiaryAdapter';
import { registerChallengeAdapter } from '../adapters/registerChallengeAdapter';

// composables
import { useApiGetRegisterChallenge } from 'src/composables/useApiGetRegisterChallenge';
import { useApiGetSubsidiaries } from 'src/composables/useApiGetSubsidiaries';
import { useApiGetOrganizations } from 'src/composables/useApiGetOrganizations';
import { useApiGetTeams } from 'src/composables/useApiGetTeams';
import { useApiGetMerchandise } from 'src/composables/useApiGetMerchandise';
import { useApiGetFilteredMerchandise } from 'src/composables/useApiGetFilteredMerchandise';
import { useApiPostRegisterChallenge } from '../composables/useApiPostRegisterChallenge';

// enums
import { Gender } from '../components/types/Profile';
import { NewsletterType } from '../components/types/Newsletter';
import {
  OrganizationSubsidiary,
  OrganizationType,
  OrganizationOption,
  OrganizationTeam,
} from '../components/types/Organization';
import { PaymentSubject } from '../components/enums/Payment';
import { RegisterChallengeStep } from '../components/enums/RegisterChallenge';

// types
import type { Logger } from '../components/types/Logger';
import type { RegisterChallengePersonalDetailsForm } from '../components/types/RegisterChallenge';
import type { ValidatedCoupon } from '../components/types/Coupon';
import type {
  MerchandiseCard,
  MerchandiseItem,
} from '../components/types/Merchandise';
import { i18n } from '../boot/i18n';
import { useChallengeStore } from './challenge';
import { PriceLevelCategory } from '../components/enums/Challenge';
import type {
  RegisterChallengePostPayload,
  RegisterChallengePostResponse,
  RegisterChallengeResult,
} from '../components/types/ApiRegistration';

const emptyFormPersonalDetails: RegisterChallengePersonalDetailsForm = {
  firstName: '',
  lastName: '',
  newsletter: [] as NewsletterType[],
  nickname: '',
  gender: null as Gender | null,
  terms: true,
};

/**
 * Store for the register challenge page.
 * Holds form values and selected options.
 */
export const useRegisterChallengeStore = defineStore('registerChallenge', {
  state: () => ({
    $log: null as Logger | null,
    personalDetails: emptyFormPersonalDetails,
    payment: null, // TODO: add data type options
    organizationType: OrganizationType.none,
    organizationId: null as number | null,
    subsidiaryId: null as number | null,
    teamId: null as number | null,
    merchId: null as number | null,
    paymentSubject: PaymentSubject.individual,
    paymentAmount: 0 as number | null,
    voucher: null as ValidatedCoupon | null,
    subsidiaries: [] as OrganizationSubsidiary[],
    organizations: [] as OrganizationOption[],
    teams: [] as OrganizationTeam[],
    merchandiseItems: [] as MerchandiseItem[],
    merchandiseCards: {} as Record<Gender, MerchandiseCard[]>,
    isLoadingRegisterChallenge: false,
    isLoadingSubsidiaries: false,
    isLoadingOrganizations: false,
    isLoadingTeams: false,
    isLoadingMerchandise: false,
    isLoadingFilteredMerchandise: false,
  }),

  getters: {
    getPersonalDetails: (state): RegisterChallengePersonalDetailsForm =>
      state.personalDetails,
    getOrganizationType: (state): OrganizationType => state.organizationType,
    getOrganizationId: (state): number | null => state.organizationId,
    getSubsidiaryId: (state): number | null => state.subsidiaryId,
    getTeamId: (state): number | null => state.teamId,
    getMerchId: (state): number | null => state.merchId,
    getPaymentSubject: (state): PaymentSubject => state.paymentSubject,
    getPaymentAmount: (state): number | null => state.paymentAmount,
    getVoucher: (state): ValidatedCoupon | null => state.voucher,
    getSubsidiaries: (state): OrganizationSubsidiary[] => state.subsidiaries,
    getOrganizations: (state): OrganizationOption[] => state.organizations,
    getTeams: (state): OrganizationTeam[] => state.teams,
    getMerchandiseItems: (state): MerchandiseItem[] => state.merchandiseItems,
    getMerchandiseCards: (state): Record<Gender, MerchandiseCard[]> =>
      state.merchandiseCards,
    getSelectedOrganizationLabel: (state): string => {
      if (state.organizationId) {
        const organization = state.organizations.find(
          (org) => org.id === state.organizationId,
        );
        return organization?.name || '';
      }
      return '';
    },
    getSelectedSubsidiaryLabel: (state): string => {
      if (state.subsidiaryId) {
        const subsidiary = state.subsidiaries.find(
          (sub) => sub.id === state.subsidiaryId,
        );
        return subsidiary?.title || '';
      }
      return '';
    },
    getSelectedTeamLabel: (state): string => {
      if (state.teamId) {
        const team = state.teams.find((t) => t.id === state.teamId);
        return team?.name || '';
      }
      return '';
    },
    getSelectedMerchandiseLabel: (state): string => {
      if (state.merchId) {
        const merchandise = state.merchandiseItems.find(
          (m) => m.id === state.merchId,
        );
        return merchandise?.label || i18n.global.t('form.merch.labelNoMerch');
      }
      return '';
    },
    getSelectedMerchandiseDescription: (state): string => {
      if (state.merchId) {
        const merchandise = state.merchandiseItems.find(
          (m) => m.id === state.merchId,
        );
        return merchandise?.description || '';
      }
      return '';
    },
    getSelectedSubsidiaryAddress: (state): string => {
      if (state.subsidiaryId) {
        const subsidiary = state.subsidiaries.find(
          (sub) => sub.id === state.subsidiaryId,
        );
        return subsidiaryAdapter.fromFormCompanyAddressFieldsToString(
          subsidiary?.address,
        );
      }
      return '';
    },
    /**
     * Get default payment amount for company registration
     * Used when saving challenge registration with company payment.
     * @returns {number} - Default company payment amount
     */
    getDefaultPaymentAmountCompany(): number {
      const challengeStore = useChallengeStore();
      const currentPriceLevels = challengeStore.getCurrentPriceLevels;
      return currentPriceLevels[PriceLevelCategory.company].price;
    },
  },

  actions: {
    setPersonalDetails(personalDetails: RegisterChallengePersonalDetailsForm) {
      Object.assign(this.personalDetails, personalDetails);
    },
    setOrganizationType(organizationType: OrganizationType) {
      this.organizationType = organizationType;
    },
    setOrganizationId(organizationId: number | null) {
      this.organizationId = organizationId;
    },
    setSubsidiaryId(subsidiaryId: number | null) {
      this.subsidiaryId = subsidiaryId;
    },
    setTeamId(teamId: number | null) {
      this.teamId = teamId;
    },
    setMerchId(merchId: number | null) {
      this.merchId = merchId;
    },
    setPaymentSubject(paymentSubject: PaymentSubject) {
      this.paymentSubject = paymentSubject;
    },
    setPaymentAmount(paymentAmount: number | null) {
      this.paymentAmount = paymentAmount;
    },
    setVoucher(voucher: ValidatedCoupon | null) {
      this.voucher = voucher;
    },
    setSubsidiaries(subsidiaries: OrganizationSubsidiary[]) {
      this.subsidiaries = subsidiaries;
    },
    setOrganizations(organizations: OrganizationOption[]) {
      this.organizations = organizations;
    },
    setTeams(teams: OrganizationTeam[]) {
      this.teams = teams;
    },
    setMerchandiseItems(items: MerchandiseItem[]) {
      this.merchandiseItems = items;
    },
    setMerchandiseCards(cards: Record<Gender, MerchandiseCard[]>) {
      this.merchandiseCards = cards;
    },
    /**
     * Load registration data from API and set store state
     */
    async loadRegisterChallengeToStore(): Promise<void> {
      const { registrations, loadRegistrations } = useApiGetRegisterChallenge(
        this.$log,
      );
      this.isLoadingRegisterChallenge = true;
      await loadRegistrations();
      if (registrations.value.length > 0) {
        this.setRegisterChallengeFromApi(registrations.value[0]);
      } else {
        this.$log?.debug('No registration data available to set store state');
      }
      this.isLoadingRegisterChallenge = false;
    },
    /**
     * Set store state from API registration data
     * @param registration - Registration data from API
     */
    setRegisterChallengeFromApi(registration: RegisterChallengeResult): void {
      this.$log?.debug(
        `Setting store state from registration data <${JSON.stringify(
          registration,
          null,
          2,
        )}>`,
      );
      const parsedResponse = registerChallengeAdapter.toStoreData(registration);
      // update store state
      this.setPersonalDetails(parsedResponse.personalDetails);
      this.$log?.debug(
        `Personal details updated to <${JSON.stringify(this.personalDetails, null, 2)}>`,
      );
      /**
       * The paymentAmount value is sent for subject = 'company' or 'school'.
       * It indicates what was the price for which the user registered.
       * We store the amount because the price may change.
       */
      /**
       * The paymentVoucher value is sent when discounted payment is made.
       * We do not need the name value (unless for information purposes)
       * as the payment must be made immediately.
       */
      this.setPaymentSubject(parsedResponse.paymentSubject);
      this.$log?.debug(`Payment subject updated to <${this.paymentSubject}>`);
      /**
       * In case the payment subject has been selected but the organizationType
       * has not been set by completing the step "Participation", we set
       * the organizationType based on the payment subject.
       */
      if (parsedResponse.paymentSubject === PaymentSubject.company) {
        this.setOrganizationType(OrganizationType.company);
      } else if (parsedResponse.paymentSubject === PaymentSubject.school) {
        this.setOrganizationType(OrganizationType.school);
      }
      if (parsedResponse.organizationType) {
        this.setOrganizationType(parsedResponse.organizationType);
      }
      this.$log?.debug(
        `Organization type updated to <${this.organizationType}>`,
      );
      this.setOrganizationId(parsedResponse.organizationId);
      this.$log?.debug(`Organization ID updated to <${this.organizationId}>`);
      this.setSubsidiaryId(parsedResponse.subsidiaryId);
      this.$log?.debug(`Subsidiary ID updated to <${this.subsidiaryId}>`);
      this.setTeamId(parsedResponse.teamId);
      this.$log?.debug(`Team ID updated to <${this.teamId}>`);
      this.setMerchId(parsedResponse.merchId);
      this.$log?.debug(`Merch ID updated to <${this.merchId}>`);
    },
    /**
     * Submit a registration step
     * @param step - The step being submitted
     */
    async submitStep(
      step: RegisterChallengeStep,
    ): Promise<RegisterChallengePostResponse | null> {
      // payload map defines what data is sent to the API for each step
      const payloadMap: Record<RegisterChallengeStep, unknown> = {
        [RegisterChallengeStep.personalDetails]: {
          personalDetails: this.personalDetails,
        },
        [RegisterChallengeStep.payment]: {
          paymentSubject: this.paymentSubject,
          paymentAmount: this.paymentAmount,
          voucher: this.voucher,
        },
        [RegisterChallengeStep.participation]: {},
        [RegisterChallengeStep.organization]: {},
        [RegisterChallengeStep.team]: { teamId: this.teamId },
        [RegisterChallengeStep.merch]: { merchId: this.merchId },
        [RegisterChallengeStep.summary]: {},
      };
      // convert store state to API payload
      const payload = registerChallengeAdapter.toApiPayload(payloadMap[step]);
      this.$log?.debug(
        `Submitting ${step} payload <${JSON.stringify(payload, null, 2)}>`,
      );
      // post payload to API
      return this.postRegisterChallenge(payload);
    },
    /**
     * Post registration data to API
     * @param {RegisterChallengePostPayload} payload - Registration data to send
     * @returns {Promise<RegisterChallengePostResponse | null>}
     */
    async postRegisterChallenge(
      payload: RegisterChallengePostPayload,
    ): Promise<RegisterChallengePostResponse | null> {
      const { registerChallenge } = useApiPostRegisterChallenge(this.$log);
      this.isLoadingRegisterChallenge = true;

      this.$log?.debug(
        `Posting registration data to API <${JSON.stringify(payload, null, 2)}>`,
      );

      const response = await registerChallenge(payload);
      this.isLoadingRegisterChallenge = false;

      return response;
    },
    async loadSubsidiariesToStore(logger: Logger | null) {
      const { subsidiaries, loadSubsidiaries } = useApiGetSubsidiaries(logger);
      if (this.organizationId) {
        logger?.debug(
          `Load organization ID <${this.organizationId}>` +
            ' subsidiaries and save them into store.',
        );
        this.isLoadingSubsidiaries = true;
        await loadSubsidiaries(this.organizationId);
        this.subsidiaries = subsidiaries.value;
        logger?.debug(
          `Loaded subsidiaries <${this.subsidiaries}> saved into store.`,
        );
        this.isLoadingSubsidiaries = false;
      }
    },
    async loadOrganizationsToStore(logger: Logger | null) {
      const { organizations, loadOrganizations } =
        useApiGetOrganizations(logger);
      if (this.organizationType !== OrganizationType.none) {
        logger?.debug(
          `Load organizations for type <${this.organizationType}>` +
            ' and save them into store.',
        );
        this.isLoadingOrganizations = true;
        await loadOrganizations(this.organizationType);
        this.organizations = organizations.value;
        logger?.debug(
          `Loaded organizations <${this.organizations}> saved into store.`,
        );
        this.isLoadingOrganizations = false;
      }
    },
    async loadTeamsToStore(logger: Logger | null) {
      const { teams, loadTeams } = useApiGetTeams(logger);
      if (this.subsidiaryId) {
        logger?.debug(
          `Load subsidiary ID <${this.subsidiaryId}>` +
            ' teams and save them into store.',
        );
        this.isLoadingTeams = true;
        await loadTeams(this.subsidiaryId);
        this.teams = teams.value;
        logger?.debug(`Loaded teams <${this.teams}> saved into store.`);
        this.isLoadingTeams = false;
      }
    },
    async loadMerchandiseToStore(logger: Logger | null) {
      const { merchandiseItems, merchandiseCards, loadMerchandise } =
        useApiGetMerchandise(logger);
      logger?.info('Loading merchandise data into store.');
      this.isLoadingMerchandise = true;
      await loadMerchandise();
      this.merchandiseItems = merchandiseItems.value;
      this.merchandiseCards = merchandiseCards.value;
      logger?.debug(
        `Loaded merchandise items <${this.merchandiseItems.length}> and cards saved into store.`,
      );
      this.isLoadingMerchandise = false;
    },
    async loadFilteredMerchandiseToStore(logger: Logger | null, code: string) {
      const { merchandise, loadFilteredMerchandise } =
        useApiGetFilteredMerchandise(logger);
      logger?.debug(
        `Loading filtered merchandise data by code <${code}> into store.`,
      );
      this.isLoadingFilteredMerchandise = true;
      await loadFilteredMerchandise(code);
      this.setMerchId(merchandise.value[0]['id']);
      logger?.debug(
        `Loaded filtered merchandise item ID <${this.getMerchId}> saved into store.`,
      );
      this.isLoadingFilteredMerchandise = false;
    },
  },

  persist: {
    omit: [
      'subsidiaries',
      'organizations',
      'teams',
      'merchandiseItems',
      'merchandiseCards',
    ],
  },
});
