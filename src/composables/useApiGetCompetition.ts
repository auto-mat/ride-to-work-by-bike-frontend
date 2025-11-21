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
  Competition,
  CompetitionResponse,
} from '../components/types/Competition';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiGetCompetitionReturn = {
  competitions: Ref<Competition[]>;
  isLoading: Ref<boolean>;
  loadCompetition: () => Promise<void>;
};

/**
 * Get competition composable
 * Used to enable calling the API to get competition details
 * @param {Logger | null} logger - Logger
 * @returns {UseApiGetCompetitionReturn}
 */
export const useApiGetCompetition = (
  logger: Logger | null,
): UseApiGetCompetitionReturn => {
  const competitions = ref<Competition[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load competition details
   * Fetches competition data and saves it
   */
  const loadCompetition = async (): Promise<void> => {
    // reset competition results
    logger?.debug(
      `Reseting competitions <${JSON.stringify(competitions.value, null, 2)}>.`,
    );
    competitions.value = [];
    logger?.debug(
      `Competitions reset to <${JSON.stringify(competitions.value, null, 2)}>.`,
    );

    // get competition
    logger?.info('Get competition from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch competition
    const { data } = await apiFetch<CompetitionResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiCompetition}`,
      method: 'get',
      translationKey: 'getCompetition',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      competitions.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }

    isLoading.value = false;
  };

  /**
   * Fetch next page of competition data
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of competition from <${url}>.`);
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch next page
    const { data } = await apiFetch<CompetitionResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getCompetition',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // store results
    if (data?.results?.length) {
      competitions.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  return {
    competitions,
    isLoading,
    loadCompetition,
  };
};
