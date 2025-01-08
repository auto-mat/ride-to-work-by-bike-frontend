// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';
import type {
  Merchandise,
  GetMerchandiseResponse,
  UseApiGetFilteredMerchandiseReturn,
} from '../components/types/Merchandise';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Get filtered merchandise composable
 * Used to getting API filtered merchandise data by code
 * @param logger - Logger
 * @returns {UseApiGetFilteredMerchandiseReturn}
 */
export const useApiGetFilteredMerchandise = (
  logger: Logger | null,
): UseApiGetFilteredMerchandiseReturn => {
  const merchandise = ref<Merchandise[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();

  const { apiFetch } = useApi();

  /**
   * Filter merchandise
   * Fetches merchandise data by code
   */
  const loadFilteredMerchandise = async (code: string): Promise<void> => {
    // reset data
    logger?.debug(
      `Reseting filtered merchandise data <${JSON.stringify(merchandise.value, null, 2)}>.`,
    );
    merchandise.value = [];
    logger?.debug(
      `Merchandise filtered data reset to <${JSON.stringify(merchandise.value, null, 2)}>.`,
    );

    // get merchandise
    logger?.debug(`Get merchandise filtered by code <${code}> from the API.`);
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch merchandise
    const { data } = await apiFetch<GetMerchandiseResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiMerchandise}${code}/`,
      method: 'get',
      translationKey: 'getFilteredMerchandise',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      merchandise.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }

    isLoading.value = false;
  };

  /**
   * Fetch next page of filtered merchandise
   * @param {string} url - Get filtered merchandise next page API URL
   * @returns {Promise<void>} - Promise
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of filtered merchandise from <${url}>.`);
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch next page
    const { data } = await apiFetch<GetMerchandiseResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getMerchandise',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // store results
    if (data?.results?.length) {
      merchandise.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  return {
    merchandise,
    isLoading,
    loadFilteredMerchandise,
  };
};
