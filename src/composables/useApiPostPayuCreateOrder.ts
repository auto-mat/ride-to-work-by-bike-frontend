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
    amount: number,
    clientIp: string,
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
   * @param {number} amount - Payment amount
   * @param {string} clientIp - Client IP address
   * @returns {Promise<PayuCreateOrderResponse | null>} - Promise
   */
  const createOrder = async (
    amount: number,
    clientIp: string,
  ): Promise<PayuCreateOrderResponse | null> => {
    logger?.debug(
      `Create new PayU order with amount <${amount}> and client IP <${clientIp}>.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization += loginStore.getAccessToken;

    // data
    const payload: PayuCreateOrderPayload = {
      amount,
      client_ip: clientIp,
    };

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
