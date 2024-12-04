// libraries
import { ref, Ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { FormCompanyAddressFields } from '../components/types/Form';
import type { Logger } from '../components/types/Logger';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface PostSubsidiaryPayload {
  address: PostSubsidiaryAddressFields;
  city_id: number | null;
}

interface PostSubsidiaryAddressFields {
  street: string;
  street_number: string;
  recipient: string;
  city: string;
  psc: string | number;
}

interface PostSubsidiaryResponse {
  id: number;
  city_id: number | null;
  active: boolean;
  address: PostSubsidiaryAddressFields;
}

interface UseApiPostSubsidiaryReturn {
  isLoading: Ref<boolean>;
  createSubsidiary: (
    organizationId: number,
    subsidiaryData: PostSubsidiaryPayload,
  ) => Promise<PostSubsidiaryResponse | null>;
}

/**
 * Post subsidiary composable
 * Used to enable calling the API to create organization subsidiary
 * @param logger - Logger
 * @returns {UseApiPostSubsidiaryReturn}
 */
export const useApiPostSubsidiary = (
  logger: Logger | null,
): UseApiPostSubsidiaryReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Create subsidiary
   * Creates a new subsidiary under specified organization
   * @param {number} organizationId - Organization Id to create subsidiary under
   * @param {PostSubsidiaryPayload} subsidiaryData - Subsidiary data to create
   * @returns {Promise<PostSubsidiaryResponse | null>} - Promise
   */
  const createSubsidiary = async (
    organizationId: number,
    subsidiaryData: FormCompanyAddressFields,
  ): Promise<PostSubsidiaryResponse | null> => {
    // parse subsidiary data and create a paylaod for API
    logger?.debug(
      `Creating subsidiary payload from data <${JSON.stringify(subsidiaryData, null, 2)}>.`,
    );
    const subsidiaryPayload: PostSubsidiaryPayload = {
      address: {
        street: subsidiaryData.street,
        street_number: subsidiaryData.houseNumber,
        recipient: subsidiaryData.department,
        city: subsidiaryData.city,
        psc: subsidiaryData.zip,
      },
      city_id: subsidiaryData.cityChallenge,
    };
    logger?.debug(
      `Created subsidiary payload <${JSON.stringify(subsidiaryPayload, null, 2)}>.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization += loginStore.getAccessToken;

    try {
      // post subsidiary
      const { data } = await apiFetch<PostSubsidiaryResponse>({
        endpoint: `${rideToWorkByBikeConfig.urlApiOrganizations}${organizationId}/${rideToWorkByBikeConfig.urlApiSubsidiaries}`,
        method: 'post',
        translationKey: 'createSubsidiary',
        headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
        payload: subsidiaryPayload,
        logger,
      });

      isLoading.value = false;
      return data;
    } catch (error) {
      logger?.error(`Error creating subsidiary: ${error}`);
      isLoading.value = false;
      return null;
    }
  };

  return {
    isLoading,
    createSubsidiary,
  };
};
