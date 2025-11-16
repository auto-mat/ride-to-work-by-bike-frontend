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

interface ApprovePaymentsRequest {
  ids: Record<string, number>;
}

interface ApprovePaymentsResponse {
  message: string;
  approved_ids: number[];
}

interface UseApiPostCoordinatorApprovePaymentsReturn {
  isLoading: Ref<boolean>;
  approvePayments: (
    ids: Record<string, number>,
  ) => Promise<ApprovePaymentsResponse | null>;
}

/**
 * Composable to approve payments by coordinator
 * @param {Logger | null} logger
 * @returns {UseApiPostCoordinatorApprovePaymentsReturn}
 */
export const useApiPostCoordinatorApprovePayments = (
  logger: Logger | null,
): UseApiPostCoordinatorApprovePaymentsReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Approve a set of payments by IDs with amounts
   * @param {Record<string, number>} ids - Object mapping member IDs to payment amounts
   * @returns {Promise<ApprovePaymentsResponse | null>} - response data or null if request failed
   */
  const approvePayments = async (
    ids: Record<string, number>,
  ): Promise<ApprovePaymentsResponse | null> => {
    logger?.debug(`Approve payments with IDs <${JSON.stringify(ids)}>.`);
    isLoading.value = true;

    // append access token to request header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const payload: ApprovePaymentsRequest = {
      ids,
    };

    const { data } = await apiFetch<ApprovePaymentsResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiCoordinatorApprovePayments}`,
      method: 'post',
      translationKey: 'approvePayments',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      showSuccessMessage: false,
      payload,
      logger,
    });

    logger?.debug(
      `Approve payments response data <${JSON.stringify(data, null, 2)}>.`,
    );

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    approvePayments,
  };
};
