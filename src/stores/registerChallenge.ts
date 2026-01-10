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
import { useApiGetDiscountCoupon } from '../composables/useApiGetDiscountCoupon';
import { useApiGetMyTeam } from '../composables/useApiGetMyTeam';

// enums
import { Gender } from '../components/types/Profile';
import { PaymentState } from '../components/enums/Payment';
import {
  OrganizationSubsidiary,
  OrganizationType,
  OrganizationOption,
  OrganizationTeam,
} from '../components/types/Organization';
import { PaymentSubject } from '../components/enums/Payment';
import { RegisterChallengeStep } from '../components/enums/RegisterChallenge';
import { PaymentCategory } from '../components/types/ApiPayu';
import { TeamMemberStatus } from 'src/components/enums/TeamMember';

// stores
import { useChallengeStore } from './challenge';
import { useRegisterStore } from './register';
import { useLoginStore } from './login';

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
import type {
  ExtendedMemberResults,
  MemberResults,
  MyTeamResults,
} from '../components/types/Results';
import { i18n } from '../boot/i18n';
import { PriceLevelCategory } from '../components/enums/Challenge';
import type {
  RegisterChallengePostPayload,
  RegisterChallengePostResponse,
  RegisterChallengeResult,
  ToApiPayloadStoreState,
} from '../components/types/ApiRegistration';

// utils
import { defaultLocale } from 'src/i18n/def_locale';
import { deepObjectWithSimplePropsCopy } from 'src/utils';
import {
  emptyFormPersonalDetails,
  emptyFormRegisterCoordinator,
  getRegisterChallengeEmptyPersistentState,
} from 'src/utils/get_register_challenge_empty_state';

/**
 * Store for the register challenge page.
 * Holds form values and selected options.
 */
export const useRegisterChallengeStore = defineStore('registerChallenge', {
  state: () => ({
    $log: null as Logger | null,
    personalDetails: deepObjectWithSimplePropsCopy(emptyFormPersonalDetails),
    paymentAmount: null as number | null,
    paymentCategory: PaymentCategory.none,
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
    myTeam: null as MyTeamResults | null,
    citySlug: null as string | null,
    cityWpSlug: null as string | null,
    formRegisterCoordinator: deepObjectWithSimplePropsCopy(
      emptyFormRegisterCoordinator,
    ),
    telephone: '',
    telephoneOptIn: false,
    language: defaultLocale,
    isLoadingRegisterChallenge: false,
    isLoadingSubsidiaries: false,
    isLoadingOrganizations: false,
    isLoadingTeams: false,
    isLoadingMerchandise: false,
    isLoadingFilteredMerchandise: false,
    isLoadingPayuOrder: false,
    isLoadingUserOrganizationAdmin: false,
    isPayuTransactionInitiated: false,
    isPeriodicCheckInProgress: false,
    checkPaymentStatusRepetitionCount: 0,
    isSelectedRegisterCoordinator: false,
    hasOrganizationAdmin: null as boolean | null,
    isUserOrganizationAdmin: null as boolean | null,
    /**
     * Required for indicating state when merch was saved into DB
     * and allow router to redirect to the home page URL
     */
    isMerchandiseSavedIntoDb: true,
    isPaymentWithReward: true,
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
    getMyTeam: (state): MyTeamResults | null => state.myTeam,
    getCitySlug: (state): string | null => state.citySlug,
    getCityWpSlug: (state): string | null => state.cityWpSlug,
    getPaymentCategory: (state): PaymentCategory => state.paymentCategory,
    getIsSelectedRegisterCoordinator: (state): boolean =>
      state.isSelectedRegisterCoordinator,
    getFormRegisterCoordinator: (state): RegisterChallengeCoordinatorForm =>
      state.formRegisterCoordinator,
    getTelephone: (state): string => state.telephone,
    getTelephoneOptIn: (state): boolean => state.telephoneOptIn,
    getLanguage: (state): string => state.language,
    getRegistrationId: (state): number | null => {
      return state.personalDetails.id || null;
    },
    getEmail: (state): string => state.personalDetails.email,
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
      const currentPriceLevels = this.isPaymentWithReward
        ? challengeStore.getCurrentPriceLevelsWithReward
        : challengeStore.getCurrentPriceLevels;
      const currentCategory = this.isPaymentWithReward
        ? PriceLevelCategory.companyWithReward
        : PriceLevelCategory.company;
      if (currentPriceLevels[currentCategory]) {
        return currentPriceLevels[currentCategory].price;
      }
      return 0;
    },
    /**
     * Get default payment amount for school registration
     * Used when saving challenge registration with school payment.
     * @returns {number} - Default school payment amount
     */
    getDefaultPaymentAmountSchool(): number {
      const challengeStore = useChallengeStore();
      const currentPriceLevels = this.isPaymentWithReward
        ? challengeStore.getCurrentPriceLevelsWithReward
        : challengeStore.getCurrentPriceLevels;
      const currentCategory = this.isPaymentWithReward
        ? PriceLevelCategory.schoolWithReward
        : PriceLevelCategory.school;
      if (currentPriceLevels[currentCategory]) {
        return currentPriceLevels[currentCategory].price;
      }
      return 0;
    },
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
    getIsPaymentSubjectSchool: (state): boolean => {
      return state.paymentSubject === PaymentSubject.school;
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
        this.getPersonalDetails.gender !== Gender.none &&
        this.getPersonalDetails.terms === true
      );
    },
    getIsPaymentComplete(): boolean {
      const challengeStore = useChallengeStore();

      // complete - no price levels configured (free registration)
      if (challengeStore.getPriceLevel.length === 0) {
        this.$log?.info(
          'Payment complete, priceLevel array is empty (free registration).',
        );
        return true;
      }

      const isPaymentStateSuccess = [
        PaymentState.noAdmission,
        PaymentState.done,
      ].includes(this.getPaymentState);
      const isPaymentCategoryDonation =
        this.getPaymentCategory === PaymentCategory.donation;
      const isVoucherFullDiscount =
        this.getPaymentSubject === PaymentSubject.voucher &&
        this.getVoucher?.discount === 100;

      // complete - voucher full discount (set from API response)
      if (isVoucherFullDiscount) {
        return true;
      }
      // payment not successful
      else if (!isPaymentStateSuccess) {
        return false;
      }
      // complete - successful payment of entry fee
      else if (isPaymentStateSuccess && !isPaymentCategoryDonation) {
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
        this.getIsMerchIdComplete &&
        this.getIsMerchandiseSavedIntoDb
      );
    },
    getIsUserOrganizationAdmin: (state): boolean | null =>
      state.isUserOrganizationAdmin,
    getIsLoadingUserOrganizationAdmin: (state): boolean =>
      state.isLoadingUserOrganizationAdmin,
    getIsUserStaff: (state): boolean | null => state.personalDetails.isStaff,
    getIsMerchandiseSavedIntoDb: (state): boolean =>
      state.isMerchandiseSavedIntoDb,
    getIsPeriodicCheckInProgress(): boolean {
      return this.isPeriodicCheckInProgress;
    },
    getIsCurrentUserApproved(): boolean {
      const myTeam = this.getMyTeam;
      if (!myTeam) return false;

      const currentUser = myTeam.members.find(
        (member: MemberResults) => member.is_me,
      ) as MemberResults as ExtendedMemberResults;
      if (!currentUser) return false;

      return currentUser.approved_for_team === TeamMemberStatus.approved;
    },
    getIsPaymentWithReward: (state): boolean => state.isPaymentWithReward,
    getIsVoucherWithoutReward: (state): boolean => {
      return Boolean(
        state.voucher?.name.startsWith(
          rideToWorkByBikeConfig.voucherWithoutReward,
        ),
      );
    },
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
    setMyTeam(myTeam: MyTeamResults | null) {
      this.myTeam = myTeam;
    },
    setCitySlug(citySlug: string | null) {
      this.citySlug = citySlug;
    },
    setCityWpSlug(cityWpSlug: string | null) {
      this.cityWpSlug = cityWpSlug;
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
    setLanguage(language: string) {
      this.language = language;
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
    setIsMerchandiseSavedIntoDb(isMerchandiseSavedIntoDb: boolean) {
      this.isMerchandiseSavedIntoDb = isMerchandiseSavedIntoDb;
    },
    setIsPeriodicCheckInProgress(isPeriodicCheckInProgress: boolean) {
      this.isPeriodicCheckInProgress = isPeriodicCheckInProgress;
    },
    setIsPaymentWithReward(value: boolean): void {
      this.isPaymentWithReward = value;
    },
    /**
     * Switch between regular and with-reward price sets
     * Handle side effects (clear voucher, reset payment amount)
     * @param {boolean} isWithReward - with/without reward setting value
     */
    switchPriceSet(isWithReward: boolean): void {
      this.$log?.debug(
        `Switch to <${isWithReward ? 'with reward' : 'without reward'}> price set.`,
      );
      this.setIsPaymentWithReward(isWithReward);
      // if no reward and merch ID is set, clear it
      if (!isWithReward && this.getMerchId !== null) {
        this.$log?.debug(
          'Removing merch ID when switching to price level without reward.',
        );
        this.setMerchId(null);
        // notify about next steps to save current registration state
        Notify.create({
          message: i18n.global.t('form.messageMerchIdRemoved'),
          color: 'warning',
        });
      }
      // reset payment amount (triggers recalculation)
      this.$log?.info('Resetting payment amount to trigger recalculation.');
      this.setPaymentAmount(null);
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
        await this.setRegisterChallengeFromApi(registrations.value[0]);
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
    async setRegisterChallengeFromApi(
      registration: RegisterChallengeResult,
    ): Promise<void> {
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
      this.setIsPaymentWithReward(parsedResponse.isPaymentWithReward);
      this.$log?.debug(
        `Is payment with reward store updated to <${this.getIsPaymentWithReward}>.`,
      );
      /**
       * The paymentAmount value is sent for subject = 'company' or 'school'.
       * !It is sent to the API after the TEAM step is completed.
       * If sent earlier, we cannot determine the right coordinator.
       * paymentAmount indicates what was the price for which the user
       * registered. We store the amount because the price changes.
       */
      /**
       * Re-validate `voucher` value over API every time registration is loaded
       * to prevent incorrect voucher value from being set.
       * We are only checking validity (existence of the coupon), not
       * availability (possibility to use the coupon). This is because some
       * coupons can only be used once, but need to be loaded every time.
       */
      if (parsedResponse.voucher) {
        const { validateCoupon } = useApiGetDiscountCoupon(this.$log);
        const validatedCoupon = await validateCoupon(parsedResponse.voucher);
        if (validatedCoupon.valid) {
          this.setVoucher(validatedCoupon);
        } else {
          Notify.create({
            type: 'negative',
            message: i18n.global.t('notify.voucherApplyError'),
          });
          this.setVoucher(null);
        }
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
      this.setCitySlug(parsedResponse.citySlug);
      this.$log?.debug(`City slug store updated to <${this.getCitySlug}>.`);
      this.setCityWpSlug(parsedResponse.cityWpSlug);
      this.$log?.debug(
        `City WP slug store updated to <${this.getCityWpSlug}>.`,
      );
      if (parsedResponse.language) {
        this.setLanguage(parsedResponse.language);
        this.$log?.debug(`Language store updated to <${this.getLanguage}>.`);
      }
      if (parsedResponse.isPaymentWithReward !== undefined) {
        this.setIsPaymentWithReward(parsedResponse.isPaymentWithReward);
        this.$log?.debug(
          `Is payment with reward store updated to <${this.getIsPaymentWithReward}>.`,
        );
      }
    },
    /**
     * Submit a registration step
     * @param {RegisterChallengeStep} step - The step being submitted
     * @returns {Promise<RegisterChallengePostResponse | null | true>} - API response or true if no data to send
     */
    async submitStep(
      step: RegisterChallengeStep,
    ): Promise<RegisterChallengePostResponse | null | true> {
      // Fallback email from login store, because user attendance
      // DB model doesn't exist yet, and register-challenge/ REST API
      // GET URL endpoint return empty array data
      if (!this.personalDetails.email) {
        this.initUserEmail();
      }
      // clear voucher on step change if payment subject is not voucher
      if (this.voucher && this.paymentSubject !== PaymentSubject.voucher) {
        this.setVoucher(null);
      }
      // if step = team, check team max members before submitting
      if (step === RegisterChallengeStep.team) {
        const canJoinTeam = await this.validateTeamJoin(this.teamId);
        if (!canJoinTeam) {
          // reset team ID
          this.setTeamId(null);
          this.$log?.debug(`Reset team ID to <${this.getTeamId}>.`);
          return null;
        }
      }

      const isPaymentOrganization = this.getIsPaymentSubjectOrganization;
      // set default payment amount for organization
      let defaultOrganizationPaymentAmount =
        this.getDefaultPaymentAmountCompany;
      // if school, set payment amount for school
      if (this.getIsPaymentSubjectSchool) {
        defaultOrganizationPaymentAmount = this.getDefaultPaymentAmountSchool;
      }
      /**
       * Defines what data is sent to the API for each step
       * Data with `null` value is discarded by the
       * registerChallengeAdapter.toApiPayload function.
       */
      const payloadMap: Record<RegisterChallengeStep, unknown> = {
        [RegisterChallengeStep.personalDetails]: {
          personalDetails: this.personalDetails,
          language: this.language,
        },
        [RegisterChallengeStep.payment]: {
          // only send payment subject if payment subject is not organization
          paymentSubject: isPaymentOrganization ? null : this.paymentSubject,
          // null value is discarded, so we always send voucher
          voucher: this.voucher,
          isPaymentWithReward: this.isPaymentWithReward,
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
              paymentAmount: defaultOrganizationPaymentAmount,
              paymentCategory: PaymentCategory.entryFee,
              products: [
                {
                  name: rideToWorkByBikeConfig.rtwbbChallengeEntryFeeOrderedProductName,
                  unitPrice: defaultOrganizationPaymentAmount,
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
        /**
         * If request does not send because of empty payload
         * (paymentSubject company and no voucher)
         * return true for free pass through stepper response validation
         */
        return true;
      }
      // post payload to API
      return this.postRegisterChallenge(payload);
    },
    /**
     * Get user email from login store if not available
     *
     * Fallback email from login store, becuase user attendance
     * DB model doesn't exist yet, and register-challenge/ REST API
     * GET URL endpoint return empty array data
     */
    initUserEmail(): void {
      this.$log?.debug(
        'Initializing user email from the login store,' +
          " because user attendance DB model doesn't exist yet.",
      );
      const loginStore = useLoginStore();
      const userEmail = loginStore.getUserEmail;
      if (userEmail) {
        const personalDetails = this.getPersonalDetails;
        personalDetails.email = userEmail;
        this.setPersonalDetails(personalDetails);
      }
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

      // set paymentState from API POST response
      if (response?.personal_details?.payment_status) {
        this.setPaymentState(
          response.personal_details.payment_status as PaymentState,
        );
        this.$log?.debug(
          `Update payment state store value to <${this.getPaymentState}>` +
            ' from the API response.',
        );
      }

      this.isLoadingRegisterChallenge = false;

      return response;
    },
    /**
     * Validates if user can join a team.
     * Requirements:
     * - Team must exist and have members array
     * - Team must not be full (members.length < maxTeamMembers)
     * - If team is full, user can only join if it's their current team
     * @param {number | null} teamId - ID of team to validate
     * @returns {Promise<boolean>} Whether user can join the team
     */
    async validateTeamJoin(teamId: number | null): Promise<boolean> {
      const challengeStore = useChallengeStore();
      const maxTeamMembers = challengeStore.getMaxTeamMembers;
      // refetch teams
      await this.loadTeamsToStore(this.$log);
      // load my team info
      await this.loadMyTeamToStore(this.$log);
      // check selected team max members
      const myTeam = this.getMyTeam;
      this.$log?.debug(`My team <${JSON.stringify(myTeam, null, 2)}>.`);
      const selectedTeam = this.teams.find((team) => team.id === teamId);
      this.$log?.debug(
        `Selected team <${JSON.stringify(selectedTeam, null, 2)}>.`,
      );
      // selected team members or max team members are not set - error
      if (!selectedTeam?.members || !maxTeamMembers) {
        this.$log?.debug(
          `Selected team members <${JSON.stringify(selectedTeam?.members, null, 2)}>,` +
            ` max. team members <${maxTeamMembers}>.`,
        );
        Notify.create({
          type: 'negative',
          message: i18n.global.t(
            'postRegisterChallenge.messageTeamMaxMembersUnavailable',
          ),
        });
        return false;
      }
      // check if selected team is full
      const isSelectedTeamMembersCountMax: boolean =
        selectedTeam?.members.length >= maxTeamMembers;
      this.$log?.debug(
        `Is selected team full <${isSelectedTeamMembersCountMax}>.`,
      );
      // check if selected team is my team
      const isSelectedTeamMyTeam: boolean = myTeam?.id === selectedTeam.id;
      this.$log?.debug(`Is selected team my team <${isSelectedTeamMyTeam}>.`);
      // if team is full and it's not user's current team, they can't join
      if (isSelectedTeamMembersCountMax && !isSelectedTeamMyTeam) {
        Notify.create({
          type: 'negative',
          message: i18n.global.t(
            'postRegisterChallenge.messageTeamMaxMembersReached',
          ),
        });
        this.$log?.info('Team max members reached.');
        return false;
      }
      // user can join team
      return true;
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
        logger?.debug(
          `Loaded teams <${JSON.stringify(this.teams, null, 2)}> saved into store.`,
        );
        this.isLoadingTeams = false;
      }
    },
    async loadMyTeamToStore(logger: Logger | null) {
      const { team, loadTeam } = useApiGetMyTeam(logger);
      if (this.teamId) {
        logger?.info('Load my team data.');
        await loadTeam();
        if (team.value) {
          logger?.debug(
            `Setting my team <${JSON.stringify(team.value, null, 2)}>.`,
          );
          this.setMyTeam(team.value);
          logger?.debug(
            `My team set to <${JSON.stringify(this.getMyTeam, null, 2)}>.`,
          );
        }
      } else {
        logger?.debug(
          `No team ID <${this.teamId}>, skipping my team data loading.`,
        );
      }
    },
    async loadMerchandiseToStore(logger: Logger | null) {
      const { merchandiseItems, merchandiseCards, loadMerchandise } =
        useApiGetMerchandise(logger);
      logger?.info('Loading merchandise data into store.');
      this.isLoadingMerchandise = true;
      await loadMerchandise();
      this.setMerchandiseItems(merchandiseItems.value);
      this.setMerchandiseCards(merchandiseCards.value);
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
        this.isPaymentWithReward,
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
          this.setIsPeriodicCheckInProgress(false);
          this.$log?.info(
            'Reset interval ID, repetition count, and periodic check status.',
          );
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
      this.setIsPeriodicCheckInProgress(true);
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
    /**
     * Reset only persistent properties of the store to their initial empty state
     * Non-persisted properties remain unchanged
     */
    resetPersistentProperties(): void {
      const emptyPersistentState = getRegisterChallengeEmptyPersistentState();
      this.$log?.debug(
        `Reset registerChallenge persistent properties to <${JSON.stringify(
          emptyPersistentState,
          null,
          2,
        )}>.`,
      );
      this.$patch(deepObjectWithSimplePropsCopy(emptyPersistentState));
    },
  },

  persist: {
    omit: [
      '$log',
      'subsidiaries',
      'organizations',
      'teams',
      'merchandiseItems',
      'merchandiseCards',
      'isLoadingRegisterChallenge',
      'isLoadingSubsidiaries',
      'isLoadingOrganizations',
      'isLoadingTeams',
      'isLoadingMerchandise',
      'isLoadingFilteredMerchandise',
      'isLoadingPayuOrder',
      'isPeriodicCheckInProgress',
      'checkPaymentStatusRepetitionCount',
      'isLoadingUserOrganizationAdmin',
    ],
  },
});
