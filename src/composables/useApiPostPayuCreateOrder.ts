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
  PayuCreateOrderPayload,
  PayuCreateOrderResponse,
} from '../components/types/ApiPayu';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface UseApiPostPayuCreateOrderReturn {
  isLoading: Ref<boolean>;
  createOrder: (
    payload: PayuCreateOrderPayload,
  ) => Promise<PayuCreateOrderResponse | null>;
}

/**
 * Post PayU create order composable
 * Used to enable calling the API to create PayU payment order
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPostPayuCreateOrderReturn}
 */
export const useApiPostPayuCreateOrder = (
  logger: Logger | null,
): UseApiPostPayuCreateOrderReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Create PayU order
   * Creates a new payment order
   * @param {PayuCreateOrderPayload} payload - Payment order data
   * @returns {Promise<PayuCreateOrderResponse | null>} - Promise
   */
  const createOrder = async (
    payload: PayuCreateOrderPayload,
  ): Promise<PayuCreateOrderResponse | null> => {
    logger?.debug(
      `Create new PayU order with payload <${JSON.stringify(payload, null, 2)}>.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // post order
    const { data } = await apiFetch<PayuCreateOrderResponse>({
      endpoint: rideToWorkByBikeConfig.urlApiPayuCreateOrder,
      method: 'post',
      translationKey: 'createPayuOrder',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload,
      showSuccessMessage: false,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    createOrder,
  };
};
