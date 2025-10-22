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
import type {
  InvoiceResult,
  GetCoordinatorInvoicesResponse,
} from '../components/types/Invoice';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiGetCoordinatorInvoicesReturn = {
  invoiceResults: Ref<InvoiceResult[]>;
  isLoading: Ref<boolean>;
  loadCoordinatorInvoices: () => Promise<void>;
};

/**
 * Composable for fetching coordinator invoices
 * @param {Logger | null} logger - Logger
 * @returns {UseApiGetCoordinatorInvoicesReturn}
 */
export const useApiGetCoordinatorInvoices = (
  logger: Logger | null,
): UseApiGetCoordinatorInvoicesReturn => {
  const invoiceResults = ref<InvoiceResult[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load coordinator invoices
   * Fetches coordinator invoice data and saves them
   * @returns {Promise<void>}
   */
  const loadCoordinatorInvoices = async (): Promise<void> => {
    // reset invoice results
    logger?.debug(
      `Reseting coordinator invoices <${JSON.stringify(invoiceResults.value, null, 2)}>.`,
    );
    invoiceResults.value = [];
    logger?.debug(
      `Coordinator invoices set to <${JSON.stringify(invoiceResults.value, null, 2)}>.`,
    );

    // get coordinator invoices
    logger?.info('Get coordinator invoices from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch coordinator invoices
    const { data } = await apiFetch<GetCoordinatorInvoicesResponse>({
      endpoint: rideToWorkByBikeConfig.urlApiCoordinatorInvoices,
      method: 'get',
      translationKey: 'getCoordinatorInvoices',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      pushResultsToInvoiceResults(data);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }

    isLoading.value = false;
  };

  /**
   * Fetch next page of coordinator invoices
   * @param {string} url - next page API URL
   * @returns {Promise<void>}
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of coordinator invoices from <${url}>.`);
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch next page
    const { data } = await apiFetch<GetCoordinatorInvoicesResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getCoordinatorInvoices',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // store results
    if (data?.results?.length) {
      pushResultsToInvoiceResults(data);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  /**
   * Push results to local array
   * @param {GetCoordinatorInvoicesResponse} data - response data
   * @returns {void}
   */
  const pushResultsToInvoiceResults = (
    data: GetCoordinatorInvoicesResponse,
  ): void => {
    logger?.info(
      'Coordinator invoices fetched. Saving to invoice results array.',
    );
    logger?.debug(
      `Adding coordinator invoices <${JSON.stringify(data.results, null, 2)}> to invoice results.`,
    );
    invoiceResults.value.push(...data.results);
    logger?.debug(
      `Coordinator invoices set to <${JSON.stringify(invoiceResults.value, null, 2)}>.`,
    );
  };

  return {
    invoiceResults,
    isLoading,
    loadCoordinatorInvoices,
  };
};
