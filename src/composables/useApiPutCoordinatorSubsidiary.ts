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
import type { Ref } from 'vue';
import type { Logger } from '../components/types/Logger';
import type {
  SubsidiaryPostApiAddress,
  SubsidiaryPutApiResponse,
} from '../components/types/ApiSubsidiary';

export interface UseApiPutCoordinatorSubsidiaryReturn {
  isLoading: Ref<boolean>;
  updateSubsidiary: (
    subsidiaryId: number,
    payload: { address: SubsidiaryPostApiAddress },
  ) => Promise<SubsidiaryPutApiResponse | null>;
}

/**
 * Enables updating a subsidiary address via coordinator API.
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPutCoordinatorSubsidiaryReturn}
 */
export const useApiPutCoordinatorSubsidiary = (
  logger: Logger | null,
): UseApiPutCoordinatorSubsidiaryReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Updates a subsidiary address.
   * @param {number} subsidiaryId - Subsidiary ID
   * @param {{ address: SubsidiaryPostApiAddress }} payload - Address data
   * @returns {Promise<SubsidiaryPutApiResponse | null>}
   */
  const updateSubsidiary = async (
    subsidiaryId: number,
    payload: { address: SubsidiaryPostApiAddress },
  ): Promise<SubsidiaryPutApiResponse | null> => {
    logger?.debug(`Update subsidiary address with ID <${subsidiaryId}>.`);
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const endpoint = `${rideToWorkByBikeConfig.urlApiCoordinatorSubsidiary}${subsidiaryId}/`;

    const { data } = await apiFetch<SubsidiaryPutApiResponse>({
      endpoint,
      method: 'put',
      translationKey: 'updateCoordinatorSubsidiary',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    updateSubsidiary,
  };
};
