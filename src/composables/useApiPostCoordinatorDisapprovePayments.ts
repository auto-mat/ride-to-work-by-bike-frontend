// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Ref } from 'vue';
import type { Logger } from '../components/types/Logger';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface DisapprovePaymentsRequest {
  ids: Record<string, number>;
}

interface DisapprovePaymentsResponse {
  message: string;
  disapproved_ids: number[];
}

interface UseApiPostCoordinatorDisapprovePaymentsReturn {
  isLoading: Ref<boolean>;
  disapprovePayments: (
    ids: Record<string, number>,
  ) => Promise<DisapprovePaymentsResponse | null>;
}

/**
 * Composable to disapprove payments by coordinator
 * @param {Logger | null} logger
 * @returns {UseApiPostCoordinatorDisapprovePaymentsReturn}
 */
export const useApiPostCoordinatorDisapprovePayments = (
  logger: Logger | null,
): UseApiPostCoordinatorDisapprovePaymentsReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Disapprove a set of payments by IDs with amounts
   * @param {Record<string, number>} ids - Object mapping member IDs to payment amounts
   * @returns {Promise<DisapprovePaymentsResponse | null>} - response data or null if request failed
   */
  const disapprovePayments = async (
    ids: Record<string, number>,
  ): Promise<DisapprovePaymentsResponse | null> => {
    logger?.debug(`Disapprove payments with IDs <${JSON.stringify(ids)}>.`);
    isLoading.value = true;

    // append access token to request header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const payload: DisapprovePaymentsRequest = {
      ids,
    };

    const { data } = await apiFetch<DisapprovePaymentsResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiCoordinatorDisapprovePayments}`,
      method: 'post',
      translationKey: 'disapprovePayments',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      showSuccessMessage: false,
      payload,
      logger,
    });

    logger?.debug(
      `Disapprove payments response data <${JSON.stringify(data, null, 2)}>.`,
    );

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    disapprovePayments,
  };
};
