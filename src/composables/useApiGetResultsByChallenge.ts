// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { ResultsReportTypeByChallenge } from '../components/enums/Results';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';
import type {
  ResultsResponse,
  useApiGetResultsByChallengeReturn,
} from '../components/types/ApiResults';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Get results by challenge composable
 * Used for fetching results report URLs by challenge
 * @param {Logger | null} logger
 * @returns {useApiGetResultsByChallengeReturn}
 */
export const useApiGetResultsByChallenge = (
  logger: Logger | null,
): useApiGetResultsByChallengeReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load results report URLs by challenge
   * @param {ResultsReportTypeByChallenge} reportType - Report type to fetch URLs for
   * @returns {Promise<ResultsResponse>} - Promise resolving to response data
   */
  const load = async (
    reportType: ResultsReportTypeByChallenge,
  ): Promise<ResultsResponse> => {
    logger?.debug(
      `Get results by challenge for report type <${reportType}> from the API.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<ResultsResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiResultsByChallenge}${reportType}/`,
      method: 'get',
      translationKey: 'getResultsByChallenge',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    logger?.debug(
      `Results by challenge response data <${JSON.stringify(data, null, 2)}>.`,
    );

    isLoading.value = false;
    return data ?? { data_report_url: null };
  };

  return {
    isLoading,
    load,
  };
};
