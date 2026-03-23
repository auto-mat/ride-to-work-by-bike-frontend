// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';
import type {
  PutOrganizationPayload,
  PutOrganizationResponse,
  UseApiPutCoordinatorOrganizationReturn,
} from '../components/types/apiOrganization';

/**
 * Enables updating an organization via coordinator API.
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPutCoordinatorOrganizationReturn}
 */
export const useApiPutCoordinatorOrganization = (
  logger: Logger | null,
): UseApiPutCoordinatorOrganizationReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Updates an organization.
   * @param {number} organizationId - Organization ID
   * @param {PutOrganizationPayload} payload - Organization data
   * @returns {Promise<PutOrganizationResponse | null>}
   */
  const updateOrganization = async (
    organizationId: number,
    payload: PutOrganizationPayload,
  ): Promise<PutOrganizationResponse | null> => {
    logger?.debug(`Update organization with ID <${organizationId}>.`);
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const endpoint = `${rideToWorkByBikeConfig.urlApiCoordinatorOrganization}${organizationId}/`;

    const { data } = await apiFetch<PutOrganizationResponse>({
      endpoint,
      method: 'put',
      translationKey: 'updateCoordinatorOrganization',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    updateOrganization,
  };
};
