// libraries
import { defineStore } from 'pinia';

// composables
import { useApi } from '../composables/useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { Gender } from '../components/types/Profile';
import { NewsletterType } from '../components/types/Newsletter';
import { OrganizationType } from '../components/types/Organization';

// stores
import { useLoginStore } from './login';

// types
import type { Logger } from '../components/types/Logger';
import type {
  RegisterChallengePersonalDetailsForm,
  RegisterChallengeResponse,
} from '../components/types/RegisterChallenge';

// utils
import { requestTokenHeader, requestDefaultHeader } from '../utils';

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
    organizationType: null as OrganizationType | null,
    organizationId: null as number | null,
    subsidiaryId: null as number | null,
    teamId: null as number | null,
    merchId: null as number | null,
  }),

  getters: {
    getPersonalDetails: (state): RegisterChallengePersonalDetailsForm =>
      state.personalDetails,
    getOrganizationType: (state): OrganizationType | null =>
      state.organizationType,
    getOrganizationId: (state): number | null => state.organizationId,
    getSubsidiaryId: (state): number | null => state.subsidiaryId,
    getTeamId: (state): number | null => state.teamId,
    getMerchId: (state): number | null => state.merchId,
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
    /**
     * Get register challenge values
     * Called on RegisterChallenge page load.
     * If user has a registration in progress, fetch and store values.
     * If not, do nothing.
     * @returns {Promise<RegisterChallengeResponse | null>} - Response or null.
     */
    async getRegisterChallengeValues(): Promise<RegisterChallengeResponse | null> {
      const { apiFetch } = useApi();
      const loginStore = useLoginStore();
      // append access token into HTTP header
      const requestTokenHeader_ = { ...requestTokenHeader };
      requestTokenHeader_.Authorization += loginStore.getAccessToken;
      // fetch values
      this.$log?.info('Get register challenge values from API.');
      const { data } = await apiFetch<RegisterChallengeResponse>({
        endpoint: rideToWorkByBikeConfig.urlApiChallengeRegistrationUser,
        method: 'get',
        translationKey: 'registerChallengeGet',
        showSuccessMessage: false,
        logger: this.$log,
        headers: Object.assign(requestDefaultHeader, requestTokenHeader_),
      });

      if (data) {
        this.$log?.debug('Fetched data for registration in progress.');
        this.$log?.debug(
          `Register challenge data <${JSON.stringify(data, null, 2)}>.`,
        );

        // Update store with fetched data
        if (data.personalDetails) {
          this.$log?.debug(
            `Setting personal details to <${JSON.stringify(data.personalDetails, null, 2)}>.`,
          );
          this.setPersonalDetails({
            ...this.personalDetails,
            ...data.personalDetails,
          });
          this.$log?.debug(
            `Personal details set to <${JSON.stringify(this.getPersonalDetails, null, 2)}>.`,
          );
        }
        if (data.newsletter) {
          this.$log?.debug(
            `Setting newsletter to <${JSON.stringify(data.newsletter, null, 2)}>.`,
          );
          this.setPersonalDetails({
            ...this.personalDetails,
            newsletter: data.newsletter,
          });
          this.$log?.debug(
            `Newsletter set to <${JSON.stringify(this.getPersonalDetails.newsletter, null, 2)}>.`,
          );
        }
        if (data.organizationId) {
          this.$log?.debug(
            `Setting organization ID to <${data.organizationId}>.`,
          );
          this.setOrganizationId(data.organizationId);
          this.$log?.debug(
            `Organization ID set to <${this.getOrganizationId}>.`,
          );
          // TODO: derive organizationType from organizationId
        }
        if (data.subsidiaryId) {
          this.$log?.debug(`Setting subsidiary ID to <${data.subsidiaryId}>.`);
          this.setSubsidiaryId(data.subsidiaryId);
          this.$log?.debug(`Subsidiary ID set to <${this.getSubsidiaryId}>.`);
        }
        if (data.teamId) {
          this.$log?.debug(`Setting team ID to <${data.teamId}>.`);
          this.setTeamId(data.teamId);
          this.$log?.debug(`Team ID set to <${this.getTeamId}>.`);
        }
        if (data.merchId) {
          this.$log?.debug(`Setting merch ID to <${data.merchId}>.`);
          this.setMerchId(data.merchId);
          this.$log?.debug(`Merch ID set to <${this.getMerchId}>.`);
        }

        return data;
      } else {
        this.$log?.debug(
          'No data received from register challenge values API.',
        );
        return null;
      }
    },
  },

  persist: true,
});
