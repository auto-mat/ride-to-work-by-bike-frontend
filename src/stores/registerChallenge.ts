// libraries
import { defineStore } from 'pinia';

// composables
import { useApiGetSubsidiaries } from 'src/composables/useApiGetSubsidiaries';

// enums
import { Gender } from '../components/types/Profile';
import { NewsletterType } from '../components/types/Newsletter';
import {
  OrganizationSubsidiary,
  OrganizationType,
} from '../components/types/Organization';
import { PaymentSubject } from '../components/enums/Payment';

// types
import type { Logger } from '../components/types/Logger';
import type { RegisterChallengePersonalDetailsForm } from '../components/types/RegisterChallenge';

const emptyFormPersonalDetails: RegisterChallengePersonalDetailsForm = {
  firstName: '',
  lastName: '',
  newsletter: [] as NewsletterType[],
  nickname: '',
  gender: null as Gender | null,
  terms: true,
  paymentSubject: PaymentSubject.individual,
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
    subsidiaries: [] as OrganizationSubsidiary[],
    isLoadingSubsidiaries: false,
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
    getSubsidiaries: (state): OrganizationSubsidiary[] => state.subsidiaries,
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
    setSubsidiaries(subsidiaries: OrganizationSubsidiary[]) {
      this.subsidiaries = subsidiaries;
    },
    async loadSubsidiariesToStore(logger: Logger | null) {
      const { subsidiaries, loadSubsidiaries } = useApiGetSubsidiaries(logger);
      if (this.organizationId) {
        this.isLoadingSubsidiaries = true;
        await loadSubsidiaries(this.organizationId);
        this.subsidiaries = subsidiaries.value;
        this.isLoadingSubsidiaries = false;
      }
    },
  },

  persist: true,
});
