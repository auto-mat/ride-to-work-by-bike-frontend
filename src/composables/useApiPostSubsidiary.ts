// libraries
import { ref, Ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface PostSubsidiaryPayload {
  address: PostSubsidiaryAddressFields;
  city_id: number;
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
  city_id: number;
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
    subsidiaryData: PostSubsidiaryPayload,
  ): Promise<PostSubsidiaryResponse | null> => {
    logger?.debug(
      `Creating subsidiary with data <${JSON.stringify(subsidiaryData, null, 2)}>.`,
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
        payload: subsidiaryData,
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
