// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// libraries
import { defineStore } from 'pinia';
import { Notify } from 'quasar';

// adapters
import { payuAdapter } from 'src/adapters/payuAdapter';
import { subsidiaryAdapter } from 'src/adapters/subsidiaryAdapter';
import { registerCoordinatorAdapter } from 'src/adapters/registerCoordinatorAdapter';
import { registerChallengeAdapter } from '../adapters/registerChallengeAdapter';

// composables
import { useApiGetRegisterChallenge } from 'src/composables/useApiGetRegisterChallenge';
import { useApiGetSubsidiaries } from 'src/composables/useApiGetSubsidiaries';
import { useApiGetOrganizations } from 'src/composables/useApiGetOrganizations';
import { useApiGetTeams } from 'src/composables/useApiGetTeams';
import { useApiGetMerchandise } from 'src/composables/useApiGetMerchandise';
import { useApiGetFilteredMerchandise } from 'src/composables/useApiGetFilteredMerchandise';
import { useApiPostRegisterChallenge } from '../composables/useApiPostRegisterChallenge';
import { useApiGetIpAddress } from '../composables/useApiGetIpAddress';
import { useApiPostPayuCreateOrder } from '../composables/useApiPostPayuCreateOrder';
import { useApiGetHasOrganizationAdmin } from '../composables/useApiGetHasOrganizationAdmin';
import { useApiIsUserOrganizationAdmin } from '../composables/useApiIsUserOrganizationAdmin';

// enums
import { Gender } from '../components/types/Profile';
import { PaymentState } from '../components/enums/Payment';
import { NewsletterType } from '../components/types/Newsletter';
import {
  OrganizationSubsidiary,
  OrganizationType,
  OrganizationOption,
  OrganizationTeam,
} from '../components/types/Organization';
import { PaymentSubject } from '../components/enums/Payment';
import { RegisterChallengeStep } from '../components/enums/RegisterChallenge';
import { PaymentCategory } from '../components/types/ApiPayu';

// stores
import { useRegisterStore } from './register';

// types
import type { Logger } from '../components/types/Logger';
import type {
  RegisterChallengeCoordinatorForm,
  RegisterChallengePersonalDetailsForm,
} from '../components/types/RegisterChallenge';
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
  ToApiPayloadStoreState,
} from '../components/types/ApiRegistration';
import type { IpAddressResponse } from '../components/types/ApiIpAddress';
import { deepObjectWithSimplePropsCopy } from 'src/utils';

const emptyFormPersonalDetails: RegisterChallengePersonalDetailsForm = {
  firstName: '',
  lastName: '',
  newsletter: [] as NewsletterType[],
  nickname: '',
  gender: null as Gender | null,
  terms: true,
};

const emptyFormRegisterCoordinator: RegisterChallengeCoordinatorForm = {
  jobTitle: '',
  phone: '',
  responsibility: false,
  terms: false,
};

/**
 * Store for the register challenge page.
 * Holds form values and selected options.
 */
export const useRegisterChallengeStore = defineStore('registerChallenge', {
  state: () => ({
    $log: null as Logger | null,
    personalDetails: deepObjectWithSimplePropsCopy(emptyFormPersonalDetails),
    payment: null, // TODO: add data type options
    paymentAmount: null as number | null,
    paymentState: PaymentState.none,
    paymentSubject: PaymentSubject.individual,
    organizationType: OrganizationType.none,
    organizationId: null as number | null,
    subsidiaryId: null as number | null,
    teamId: null as number | null,
    merchId: null as number | null,
    voucher: null as ValidatedCoupon | null,
    subsidiaries: [] as OrganizationSubsidiary[],
    organizations: [] as OrganizationOption[],
    teams: [] as OrganizationTeam[],
    merchandiseItems: [] as MerchandiseItem[],
    merchandiseCards: {} as Record<Gender, MerchandiseCard[]>,
    formRegisterCoordinator: deepObjectWithSimplePropsCopy(
      emptyFormRegisterCoordinator,
    ),
    telephone: '',
    telephoneOptIn: false,
    isLoadingRegisterChallenge: false,
    ipAddressData: null as IpAddressResponse | null,
    isLoadingSubsidiaries: false,
    isLoadingOrganizations: false,
    isLoadingTeams: false,
    isLoadingMerchandise: false,
    isLoadingFilteredMerchandise: false,
    isLoadingPayuOrder: false,
    isPayuTransactionInitiated: false,
    checkPaymentStatusRepetitionCount: 0,
    isSelectedRegisterCoordinator: false,
    hasOrganizationAdmin: null as boolean | null,
    isUserOrganizationAdmin: null as boolean | null,
    isLoadingUserOrganizationAdmin: false,
    paymentCategory: PaymentCategory.none,
  }),

  getters: {
    getPersonalDetails: (state): RegisterChallengePersonalDetailsForm =>
      state.personalDetails,
    getOrganizationType: (state): OrganizationType => state.organizationType,
    getOrganizationId: (state): number | null => state.organizationId,
    getHasOrganizationAdmin: (state): boolean | null =>
      state.hasOrganizationAdmin,
    getSubsidiaryId: (state): number | null => state.subsidiaryId,
    getTeamId: (state): number | null => state.teamId,
    getMerchId: (state): number | null => state.merchId,
    getPaymentSubject: (state): PaymentSubject => state.paymentSubject,
    getPaymentAmount: (state): number | null => state.paymentAmount,
    getPaymentState: (state): PaymentState => state.paymentState,
    getVoucher: (state): ValidatedCoupon | null => state.voucher,
    getSubsidiaries: (state): OrganizationSubsidiary[] => state.subsidiaries,
    getOrganizations: (state): OrganizationOption[] => state.organizations,
    getTeams: (state): OrganizationTeam[] => state.teams,
    getMerchandiseItems: (state): MerchandiseItem[] => state.merchandiseItems,
    getMerchandiseCards: (state): Record<Gender, MerchandiseCard[]> =>
      state.merchandiseCards,
    getPaymentCategory: (state): PaymentCategory => state.paymentCategory,
    getIsSelectedRegisterCoordinator: (state): boolean =>
      state.isSelectedRegisterCoordinator,
    getFormRegisterCoordinator: (state): RegisterChallengeCoordinatorForm =>
      state.formRegisterCoordinator,
    getTelephone: (state): string => state.telephone,
    getTelephoneOptIn: (state): boolean => state.telephoneOptIn,
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
      if (currentPriceLevels[PriceLevelCategory.company]) {
        return currentPriceLevels[PriceLevelCategory.company].price;
      }
      return 0;
    },
    getIpAddressData: (state): IpAddressResponse | null => state.ipAddressData,
    getIpAddress: (state): string => state.ipAddressData?.ip || '',
    getIsPayuTransactionInitiated: (state): boolean =>
      state.isPayuTransactionInitiated,
    getIsPaymentCategoryDonation: (state): boolean => {
      return (
        state.paymentCategory === PaymentCategory.donation ||
        state.paymentCategory === PaymentCategory.entryFeeDonation
      );
    },
    getIsPaymentCategoryEntryFee: (state): boolean => {
      return (
        state.paymentCategory === PaymentCategory.entryFee ||
        state.paymentCategory === PaymentCategory.entryFeeDonation
      );
    },
    getIsPaymentSuccessful: (state): boolean => {
      return [PaymentState.done, PaymentState.noAdmission].includes(
        state.paymentState,
      );
    },
    getIsPaymentUnsuccessful: (state): boolean => {
      return state.paymentState === PaymentState.unknown;
    },
    getIsPaymentSubjectOrganization: (state): boolean => {
      return [PaymentSubject.company, PaymentSubject.school].includes(
        state.paymentSubject,
      );
    },
    getIsPersonalDetailsComplete(): boolean {
      return (
        this.getPersonalDetails.firstName !== '' &&
        this.getPersonalDetails.lastName !== '' &&
        this.getPersonalDetails.nickname !== '' &&
        this.getPersonalDetails.gender !== Gender.none &&
        this.getPersonalDetails.terms === true
      );
    },
    getIsPaymentComplete(): boolean {
      const isPaymentStateSuccess = [
        PaymentState.noAdmission,
        PaymentState.done,
      ].includes(this.getPaymentState);
      const isPaymentCategoryDonation =
        this.getPaymentCategory === PaymentCategory.donation;
      const isPaymentSubjectVoucher =
        this.getPaymentSubject === PaymentSubject.voucher;
      // payment not successful
      if (!isPaymentStateSuccess) {
        return false;
      }
      // complete - successful payment of entry fee
      else if (isPaymentStateSuccess && !isPaymentCategoryDonation) {
        return true;
      }
      // complete - status = voucher (100% discount) + successful donation
      else if (
        isPaymentStateSuccess &&
        isPaymentCategoryDonation &&
        isPaymentSubjectVoucher
      ) {
        return true;
      }
      return false;
    },
    getIsOrganizationTypeComplete(): boolean {
      return this.getOrganizationType !== OrganizationType.none;
    },
    getIsOrganizationIdComplete(): boolean {
      return this.getOrganizationId !== null;
    },
    getIsSubsidiaryIdComplete(): boolean {
      return this.getSubsidiaryId !== null;
    },
    getIsTeamIdComplete(): boolean {
      return this.getTeamId !== null;
    },
    getIsMerchIdComplete(): boolean {
      return this.getMerchId !== null;
    },
    getIsRegistrationComplete(): boolean {
      return (
        this.getIsPersonalDetailsComplete &&
        this.getIsPaymentComplete &&
        this.getIsOrganizationTypeComplete &&
        this.getIsOrganizationIdComplete &&
        this.getIsSubsidiaryIdComplete &&
        this.getIsTeamIdComplete &&
        this.getIsMerchIdComplete
      );
    },
    getIsUserOrganizationAdmin: (state): boolean | null =>
      state.isUserOrganizationAdmin,
    getIsLoadingUserOrganizationAdmin: (state): boolean =>
      state.isLoadingUserOrganizationAdmin,
  },

  actions: {
    setPersonalDetails(personalDetails: RegisterChallengePersonalDetailsForm) {
      Object.assign(this.personalDetails, personalDetails);
    },
    setOrganizationType(organizationType: OrganizationType) {
      this.organizationType = organizationType;
    },
    setOrganizationId(id: number | null): void {
      this.organizationId = id;
      this.checkOrganizationHasCoordinator();
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
    setPaymentCategory(paymentCategory: PaymentCategory) {
      this.paymentCategory = paymentCategory;
    },
    setPaymentState(paymentState: PaymentState) {
      this.paymentState = paymentState;
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
    setTelephone(telephone: string) {
      this.telephone = telephone;
    },
    setTelephoneOptIn(telephoneOptIn: boolean) {
      this.telephoneOptIn = telephoneOptIn;
    },
    setIsPayuTransactionInitiated(isPayuTransactionInitiated: boolean) {
      this.isPayuTransactionInitiated = isPayuTransactionInitiated;
    },
    setFormRegisterCoordinator(
      formRegisterCoordinator: RegisterChallengeCoordinatorForm,
    ) {
      this.formRegisterCoordinator = formRegisterCoordinator;
    },
    setIsSelectedRegisterCoordinator(isSelectedRegisterCoordinator: boolean) {
      this.isSelectedRegisterCoordinator = isSelectedRegisterCoordinator;
    },
    setHasOrganizationAdmin(hasOrganizationAdmin: boolean | null) {
      this.hasOrganizationAdmin = hasOrganizationAdmin;
    },
    setIsUserOrganizationAdmin(isUserOrganizationAdmin: boolean | null) {
      this.isUserOrganizationAdmin = isUserOrganizationAdmin;
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
        this.$log?.info(
          'No registration challenge data available to set store state.',
        );
      }
      this.isLoadingRegisterChallenge = false;
    },
    /**
     * Set store state from API registration data
     * @param registration - Registration data from API
     */
    setRegisterChallengeFromApi(registration: RegisterChallengeResult): void {
      this.$log?.debug(
        `Setting store state from registration challenge data <${JSON.stringify(
          registration,
          null,
          2,
        )}>.`,
      );
      const parsedResponse = registerChallengeAdapter.toStoreData(registration);
      // update store state
      this.setPersonalDetails(parsedResponse.personalDetails);
      this.$log?.debug(
        `Personal details updated to <${JSON.stringify(this.getPersonalDetails, null, 2)}>.`,
      );
      /**
       * The paymentAmount value is sent for subject = 'company' or 'school'.
       * TODO: It is sent to the API after the TEAM step is completed.
       * If sent earlier, we cannot determine the right coordinator.
       * paymentAmount indicates what was the price for which the user
       * registered. We store the amount because the price changes.
       */
      /**
       * The paymentVoucher value is sent when discounted payment is made.
       * We do not need the name value (unless for information purposes)
       * as the payment must be made immediately.
       * If voucher is saved and paymentAmount is null, we set the voucher
       * as a full discount voucher.
       */
      const isVoucherFullDiscount =
        parsedResponse.voucher &&
        (!parsedResponse.paymentAmount ||
          parsedResponse.paymentCategory === PaymentCategory.donation);
      if (isVoucherFullDiscount) {
        this.setVoucher({
          valid: true,
          discount: 100,
          name: parsedResponse.voucher,
        });
      }
      /**
       * Update payment subject to API response value if not exception case
       * Exception case is a donation payment made when organization pays the
       * starting fee. This sends back paymentSubject for the donation
       * payment. However, we need the paymentSubject for the entry fee
       * payment.
       */
      const isPaymentOrganizationDonation =
        parsedResponse.paymentSubject === PaymentSubject.individual &&
        parsedResponse.paymentCategory === PaymentCategory.donation;
      if (isPaymentOrganizationDonation) {
        // exception case - donation payment made by organization
        this.$log?.debug(
          `Donation payment made by organization <${isPaymentOrganizationDonation}>.`,
        );
        if (parsedResponse.organizationType === OrganizationType.company) {
          this.setPaymentSubject(PaymentSubject.company);
        } else if (
          parsedResponse.organizationType === OrganizationType.school
        ) {
          this.setPaymentSubject(PaymentSubject.school);
        }
      } else {
        this.setPaymentSubject(parsedResponse.paymentSubject);
      }
      this.$log?.debug(
        `Payment subject store updated to <${this.getPaymentSubject}>.`,
      );
      this.setPaymentState(parsedResponse.paymentState);
      this.$log?.debug(
        `Payment state store updated to <${this.getPaymentState}>.`,
      );
      this.setPaymentCategory(parsedResponse.paymentCategory);
      this.$log?.debug(
        `Payment category store updated to <${this.getPaymentCategory}>.`,
      );
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
        `Organization type strore updated to <${this.getOrganizationType}>.`,
      );
      this.setOrganizationId(parsedResponse.organizationId);
      this.$log?.debug(
        `Organization ID strore updated to <${this.getOrganizationId}>.`,
      );
      this.setSubsidiaryId(parsedResponse.subsidiaryId);
      this.$log?.debug(
        `Subsidiary ID store updated to <${this.getSubsidiaryId}>.`,
      );
      this.setTeamId(parsedResponse.teamId);
      this.$log?.debug(`Team ID store updated to <${this.getTeamId}>.`);
      this.setMerchId(parsedResponse.merchId);
      this.$log?.debug(`Merch ID store updated to <${this.getMerchId}>.`);
      this.setTelephone(parsedResponse.telephone);
      this.$log?.debug(`Telephone store updated to <${this.getTelephone}>.`);
      this.setTelephoneOptIn(parsedResponse.telephoneOptIn);
      this.$log?.debug(
        `Telephone opt-in store updated to <${this.getTelephoneOptIn}>.`,
      );
    },
    /**
     * Submit a registration step
     * @param step - The step being submitted
     */
    async submitStep(
      step: RegisterChallengeStep,
    ): Promise<RegisterChallengePostResponse | null> {
      // payload map defines what data is sent to the API for each step
      const isPaymentOrganization = this.getIsPaymentSubjectOrganization;
      /**
       * Defines what data is sent to the API for each step
       * Data with `null` value is discarded by the
       * registerChallengeAdapter.toApiPayload function.
       */
      const payloadMap: Record<RegisterChallengeStep, unknown> = {
        [RegisterChallengeStep.personalDetails]: {
          personalDetails: this.personalDetails,
        },
        [RegisterChallengeStep.payment]: {
          // only send payment subject if payment subject is not organization
          paymentSubject: isPaymentOrganization ? null : this.paymentSubject,
          // null value is discarded, so we always send voucher
          voucher: this.voucher,
        },
        [RegisterChallengeStep.participation]: {},
        [RegisterChallengeStep.organization]: {},
        [RegisterChallengeStep.team]: isPaymentOrganization
          ? /**
             * If payment subject is organization, we send additional data
             * paymentSubject - current payment subject
             * paymentAmount - default payment amount for company
             * paymentCategory - entry fee
             * products - entry fee product
             */
            {
              teamId: this.teamId,
              paymentSubject: this.paymentSubject,
              paymentAmount: this.getDefaultPaymentAmountCompany,
              paymentCategory: PaymentCategory.entryFee,
              products: [
                {
                  name: rideToWorkByBikeConfig.rtwbbChallengeEntryFeeOrderedProductName,
                  unitPrice: this.getDefaultPaymentAmountCompany,
                  quantity: 1,
                },
              ],
            }
          : { teamId: this.teamId },
        [RegisterChallengeStep.merch]: {
          merchId: this.merchId,
          telephone: this.telephone,
          telephoneOptIn: this.telephoneOptIn,
        },
        [RegisterChallengeStep.summary]: {},
      };
      // convert store state to API payload
      const payload = registerChallengeAdapter.toApiPayload(
        payloadMap[step] as ToApiPayloadStoreState,
      );
      this.$log?.debug(
        `Submitting <${step}> payload <${JSON.stringify(payload, null, 2)}>.`,
      );
      // skip API call if payload is empty
      if (Object.keys(payload).length === 0) {
        this.$log?.debug(
          `Empty payload <${JSON.stringify(payload, null, 2)}>, skipping API call.`,
        );
        return null;
      }
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
        `Posting registration challenge data to API <${JSON.stringify(payload, null, 2)}>.`,
      );

      const response = await registerChallenge(payload);
      this.isLoadingRegisterChallenge = false;

      return response;
    },
    async loadSubsidiariesToStore(logger: Logger | null) {
      const { subsidiaries, loadSubsidiaries } = useApiGetSubsidiaries(logger);
      if (this.organizationId) {
        logger?.debug(
          `Load organization ID <${this.getOrganizationId}>` +
            ' subsidiaries and save them into store.',
        );
        this.isLoadingSubsidiaries = true;
        await loadSubsidiaries(this.organizationId);
        this.subsidiaries = subsidiaries.value;
        logger?.debug(
          `Loaded subsidiaries <${this.getSubsidiaries}> saved into store.`,
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
    /**
     * Load IP address data from API
     * @returns {Promise<string>} - IP address
     */
    async loadIpAddress(): Promise<string> {
      const { ipAddressData, loadIpAddress } = useApiGetIpAddress(this.$log);
      this.$log?.debug('Loading IP address data.');
      await loadIpAddress();
      return ipAddressData.value?.ip || '';
    },
    /**
     * Create PayU order and redirect to payment
     * @returns {Promise<void>}
     */
    async createPayuOrder(): Promise<void> {
      this.$log?.debug('Creating PayU order.');
      this.isLoadingPayuOrder = true;
      // get client IP
      const clientIp = await this.loadIpAddress();
      if (!clientIp) {
        Notify.create({
          message: i18n.global.t('createPayuOrder.apiMessageError'),
          color: 'negative',
        });
        this.$log?.debug('Failed to get client IP address.');
        this.isLoadingPayuOrder = false;
        return;
      }
      // check payment amount
      if (!this.paymentAmount || this.paymentAmount <= 0) {
        Notify.create({
          message: i18n.global.t('createPayuOrder.apiMessageNoPaymentAmount'),
          color: 'negative',
        });
        this.$log?.debug(
          `Payment amount <${this.paymentAmount}>, skipping PayU order creation.`,
        );
        this.isLoadingPayuOrder = false;
        return;
      }
      // create order
      const { createOrder } = useApiPostPayuCreateOrder(this.$log);
      this.$log?.debug(
        `Creating PayU order with amount <${this.getPaymentAmount}>,` +
          ` payment subject <${this.getPaymentSubject}` +
          ` and client IP <${clientIp}>.`,
      );
      const payload = payuAdapter.toPayuOrderPayload(
        this.paymentSubject,
        this.paymentAmount,
        this.voucher,
        clientIp,
      );
      this.$log?.debug(
        `Payload created <${JSON.stringify(payload, null, 2)}>.`,
      );
      if (!payload) {
        Notify.create({
          message: i18n.global.t('createPayuOrder.payloadCreateError'),
          color: 'positive',
        });
        this.isLoadingPayuOrder = false;
        return;
      }
      const response = await createOrder(payload);
      // check response and redirect
      if (response?.status.statusCode === 'SUCCESS' && response.redirectUri) {
        Notify.create({
          message: i18n.global.t('createPayuOrder.apiMessageSuccess'),
          color: 'positive',
        });
        this.$log?.debug(
          `Redirecting to PayU payment page: ${response.redirectUri}`,
        );
        this.isPayuTransactionInitiated = true;
        this.$log?.debug(
          `PayU transaction initiated flag set to ${this.isPayuTransactionInitiated}.`,
        );
        // localize the URI
        const redirectUriLocalized = `${response.redirectUri}&lang=${i18n.global.locale}`;
        window.location.href = redirectUriLocalized;
      } else {
        Notify.create({
          message: i18n.global.t('createPayuOrder.apiMessageError'),
          color: 'negative',
        });
        this.$log?.error(
          'Failed to create PayU order or missing redirect URI.',
        );
      }
      this.isLoadingPayuOrder = false;
    },
    /**
     * Start periodic check of register challenge data with max repetitions
     * Used when payment is in progress to detect when it's completed
     */
    startRegisterChallengePeriodicCheck(): void {
      this.$log?.debug(
        'Start periodic check of registration status with interval' +
          ` <${rideToWorkByBikeConfig.checkRegisterChallengeStatusIntervalSeconds}> seconds` +
          ` and max. repetitions <${rideToWorkByBikeConfig.checkRegisterChallengeStatusMaxRepetitions}>.`,
      );
      let intervalId: ReturnType<typeof setInterval> | null = null;

      // function to clear interval
      const stopCheck = (): void => {
        if (intervalId) {
          this.$log?.debug('Stop periodic check of registration status.');
          clearInterval(intervalId);
          this.$log?.debug(`Cleared interval ID <${intervalId}>.`);
          intervalId = null;
          this.checkPaymentStatusRepetitionCount = 0;
          this.$log?.debug('Reset interval ID and repetition count.');
        }
      };

      // function to run the interval
      const checkRegisterChallenge = async (): Promise<void> => {
        this.$log?.debug('Check payment status.');
        // before each call, check if paymentState is done
        if (
          this.isPayuTransactionInitiated &&
          this.paymentState !== PaymentState.done
        ) {
          this.$log?.debug(
            'Payment is in progress, refresh registration data from the API.',
          );
          await this.loadRegisterChallengeToStore();
          // if payment is now done after the refresh, stop checking
          if ((this.paymentState as PaymentState) === PaymentState.done) {
            this.$log?.debug('Payment is now done, stopping periodic check.');
            stopCheck();
            return;
          }
          // increment counter
          this.checkPaymentStatusRepetitionCount++;
          // check that we have not reached max iterations count
          const maxRepetitions =
            rideToWorkByBikeConfig.checkRegisterChallengeStatusMaxRepetitions;
          if (
            !maxRepetitions ||
            this.checkPaymentStatusRepetitionCount >= maxRepetitions
          ) {
            this.$log?.debug(
              `Maximum number of payment status checks reached (${maxRepetitions}),` +
                ' stopping periodic check.',
            );
            // if we do reach max iterations count, stop loop
            stopCheck();
            return;
          }
        } else {
          this.$log?.debug(
            'Payment is either not started from the UI or already done,' +
              ' disable periodic check.',
          );
          stopCheck();
          return;
        }
      };

      // start interval
      intervalId = setInterval(
        checkRegisterChallenge,
        rideToWorkByBikeConfig.checkRegisterChallengeStatusIntervalSeconds *
          1000,
      );
    },
    /**
     * Register coordinator with store data
     * This is done if the user has selected the "Register coordinator" option.
     * Function is only called once the full form is validated.
     * @returns {Promise<void>}
     */
    async registerCoordinator(): Promise<void> {
      if (this.isSelectedRegisterCoordinator && this.getOrganizationId) {
        this.$log?.debug('Register coordinator with store data.');
        const registerStore = useRegisterStore();
        const payload =
          registerCoordinatorAdapter.registerChallengeToApiPayload({
            formRegisterCoordinator: this.getFormRegisterCoordinator,
            organizationId: this.getOrganizationId,
            personalDetails: this.getPersonalDetails,
          });
        this.$log?.debug(
          `Register coordinator payload <${JSON.stringify(payload)}>.`,
        );
        if (!payload) {
          Notify.create({
            type: 'negative',
            message: i18n.global.t(
              'registerCoordinator.messageNoOrganizationId',
            ),
          });
          return;
        }
        await registerStore.registerCoordinator(payload, false);
        // check if user is registered as a coordinator
        this.checkIsUserOrganizationAdmin();
        // check if organization has coordinator
        await this.checkOrganizationHasCoordinator();
        // if organization is now logged as having a coordinator, reset flag
        if (this.hasOrganizationAdmin) {
          this.setIsSelectedRegisterCoordinator(false);
        }
      }
    },
    /**
     * Check if currently selected organization has a coordinator
     * @returns {Promise<void>}
     */
    async checkOrganizationHasCoordinator(): Promise<void> {
      const { hasOrganizationAdmin, checkOrganizationAdmin } =
        useApiGetHasOrganizationAdmin(this.$log);
      await checkOrganizationAdmin();
      this.$log?.debug(
        `Has organization admin API response data <${hasOrganizationAdmin.value}>.`,
      );
      this.setHasOrganizationAdmin(hasOrganizationAdmin.value);
      this.$log?.debug(
        `Organization has coordinator store updated to <${this.hasOrganizationAdmin}>.`,
      );
    },
    /**
     * Check if current user is an organization administrator
     * @returns {Promise<void>}
     */
    async checkIsUserOrganizationAdmin(): Promise<void> {
      this.isLoadingUserOrganizationAdmin = true;
      this.$log?.info('Checking if user is organization admin.');
      const isAdmin = await useApiIsUserOrganizationAdmin(this.$log);
      this.$log?.debug(
        `Is user organization admin API response data <${isAdmin}>.`,
      );
      this.setIsUserOrganizationAdmin(isAdmin);
      this.$log?.debug(
        `User is organization admin store updated to <${this.isUserOrganizationAdmin}>.`,
      );
      this.isLoadingUserOrganizationAdmin = false;
    },
  },

  persist: {
    omit: [
      'subsidiaries',
      'organizations',
      'teams',
      'merchandiseItems',
      'merchandiseCards',
      'ipAddressData',
      'checkPaymentStatusRepetitionCount',
    ],
  },
});
