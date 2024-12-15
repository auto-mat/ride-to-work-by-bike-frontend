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
import type {
  PostOrganizationPayload,
  PostOrganizationResponse,
} from '../components/types/apiOrganization';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface UseApiPostOrganizationReturn {
  isLoading: Ref<boolean>;
  createOrganization: (
    name: string,
    vatId: string,
    organizationType: string,
  ) => Promise<PostOrganizationResponse | null>;
}

/**
 * Post organization composable
 * Used to enable calling the API to create organization
 * @param logger - Logger
 * @returns {UseApiPostOrganizationReturn}
 */
export const useApiPostOrganization = (
  logger: Logger | null,
): UseApiPostOrganizationReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Create organization
   * Creates a new organization
   * @param {string} name - Organization name
   * @param {string} vatId - Organization VAT ID
   * @param {string} organizationType - Organization type
   * @returns {Promise<PostOrganizationResponse | null>} - Promise
   */
  const createOrganization = async (
    name: string,
    vatId: string,
    organizationType: string,
  ): Promise<PostOrganizationResponse | null> => {
    logger?.debug(
      `Create new organization with name <${name}> and VAT ID <${vatId}>.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization += loginStore.getAccessToken;

    // data
    const payload: PostOrganizationPayload = {
      name,
      vatId,
      organization_type: organizationType,
    };

    // post organization
    const { data } = await apiFetch<PostOrganizationResponse>({
      endpoint: rideToWorkByBikeConfig.urlApiOrganizations,
      method: 'post',
      translationKey: 'createOrganization',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    createOrganization,
  };
};
