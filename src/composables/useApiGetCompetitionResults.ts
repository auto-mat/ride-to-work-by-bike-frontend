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
  CompetitionResult,
  CompetitionResultResponse,
} from '../components/types/Competition';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

type UseApiGetCompetitionResultsReturn = {
  results: Ref<CompetitionResult[]>;
  isLoading: Ref<boolean>;
  loadCompetitionResults: (slug: string) => Promise<void>;
};

/**
 * Get competition results composable
 * Used to fetch competition result rows by competition slug
 * @param {Logger | null} logger - Logger
 * @returns {UseApiGetCompetitionResultsReturn}
 */
export const useApiGetCompetitionResults = (
  logger: Logger | null,
): UseApiGetCompetitionResultsReturn => {
  const results = ref<CompetitionResult[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load competition results for the given slug
   * @param {string} slug - Competition slug
   */
  const loadCompetitionResults = async (slug: string): Promise<void> => {
    logger?.debug(`Resetting competition results for slug <${slug}>.`);
    results.value = [];
    logger?.info(`Get competition results for slug <${slug}> from the API.`);
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<CompetitionResultResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiCompetitionResult}${slug}/`,
      method: 'get',
      translationKey: 'getCompetitionResults',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      results.value.push(...data.results);
    }

    if (data?.next) {
      await fetchNextPage(data.next);
    }

    isLoading.value = false;
  };

  /**
   * Fetch next page of competition results
   * @param {string} url - Next page URL
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of competition results from <${url}>.`);
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<CompetitionResultResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getCompetitionResults',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      results.value.push(...data.results);
    }

    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  return {
    results,
    isLoading,
    loadCompetitionResults,
  };
};
