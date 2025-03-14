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
  CommuteMode,
  CommuteModeResponse,
} from '../components/types/Route';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiGetCommuteModeReturn = {
  commuteModes: Ref<CommuteMode[]>;
  isLoading: Ref<boolean>;
  loadCommuteModes: () => Promise<CommuteMode[]>;
};

/**
 * Get commute modes composable
 * Used to enable calling the API to get available commute modes
 * @param logger - Logger
 * @returns {UseApiGetCommuteModeReturn}
 */
export const useApiGetCommuteMode = (
  logger: Logger | null,
): UseApiGetCommuteModeReturn => {
  const commuteModes = ref<CommuteMode[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load commute modes
   * Fetches commute modes data and saves it
   * @returns {Promise<CommuteMode[]>} Array of fetched commute modes
   */
  const loadCommuteModes = async (): Promise<CommuteMode[]> => {
    // reset options
    logger?.debug(
      `Reseting commute modes <${JSON.stringify(commuteModes.value, null, 2)}>.`,
    );
    commuteModes.value = [];
    logger?.debug(
      `Commute modes reset to <${JSON.stringify(commuteModes.value, null, 2)}>.`,
    );

    // get commute modes
    logger?.info('Get commute modes from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch commute modes
    const { data } = await apiFetch<CommuteModeResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiCommuteMode}`,
      method: 'get',
      translationKey: 'getCommuteModes',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      commuteModes.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }

    isLoading.value = false;

    return commuteModes.value;
  };

  /**
   * Fetch next page of commute modes data
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of commute modes from <${url}>.`);
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch next page
    const { data } = await apiFetch<CommuteModeResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getCommuteModes',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // store results
    if (data?.results?.length) {
      commuteModes.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  return {
    commuteModes,
    isLoading,
    loadCommuteModes,
  };
};
