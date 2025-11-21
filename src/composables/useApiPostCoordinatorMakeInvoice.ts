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

export interface CoordinatorMakeInvoicePayload {
  order_number?: string;
  client_note?: string;
  company_pais_benefitial_fee?: boolean;
  payment_ids?: number[];
  company_name?: string;
  company_ico?: string;
  company_dic?: string;
  telephone?: string;
  email?: string;
  country?: string;
  anonymize?: boolean;
  company_address?: {
    psc?: string;
    street?: string;
    street_number?: string;
    city?: string;
    recipient?: string;
  };
}

interface CoordinatorMakeInvoiceResponse {
  invoice_id: number;
}

interface UseApiPostCoordinatorMakeInvoiceReturn {
  isLoading: Ref<boolean>;
  makeInvoice: (
    payload?: CoordinatorMakeInvoicePayload,
  ) => Promise<CoordinatorMakeInvoiceResponse | null>;
}

/**
 * Composable posting a request to create a coordinator invoice
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPostCoordinatorMakeInvoiceReturn}
 */
export const useApiPostCoordinatorMakeInvoice = (
  logger: Logger | null,
): UseApiPostCoordinatorMakeInvoiceReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Post a request to create a coordinator invoice
   * @param {CoordinatorMakeInvoicePayload} payload - Optional invoice data
   * @returns {Promise<CoordinatorMakeInvoiceResponse | null>}
   */
  const makeInvoice = async (
    payload?: CoordinatorMakeInvoicePayload,
  ): Promise<CoordinatorMakeInvoiceResponse | null> => {
    logger?.debug('Creating coordinator invoice.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // post make invoice
    const { data } = await apiFetch<CoordinatorMakeInvoiceResponse>({
      endpoint: rideToWorkByBikeConfig.urlApiCoordinatorMakeInvoice,
      method: 'post',
      translationKey: 'makeInvoice',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    makeInvoice,
  };
};
