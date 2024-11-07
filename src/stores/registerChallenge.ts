// libraries
import { defineStore } from 'pinia';

// enums
import { NewsletterType } from '../components/types/Newsletter';
import { OrganizationType } from '../components/types/Organization';
import { Gender } from '../components/types/Profile';

// types
import type { FormPersonalDetailsFields } from '../components/types/Form';
import type { Logger } from '../components/types/Logger';

const emptyFormPersonalDetails: FormPersonalDetailsFields = {
  firstName: '',
  lastName: '',
  email: '',
  nickname: '',
  gender: null as Gender | null,
  newsletter: [] as NewsletterType[],
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
    organizationType: null as OrganizationType | null,
    organizationId: null as number | null,
    subsidiaryId: null as number | null,
    teamId: null as number | null,
    merchId: null as number | null,
  }),

  getters: {
    getPersonalDetails: (state): FormPersonalDetailsFields =>
      state.personalDetails,
    getOrganizationType: (state): OrganizationType | null =>
      state.organizationType,
    getOrganizationId: (state): number | null => state.organizationId,
    getSubsidiaryId: (state): number | null => state.subsidiaryId,
    getTeamId: (state): number | null => state.teamId,
    getMerchId: (state): number | null => state.merchId,
  },

  actions: {
    setPersonalDetails(personalDetails: FormPersonalDetailsFields) {
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
  },

  persist: true,
});
