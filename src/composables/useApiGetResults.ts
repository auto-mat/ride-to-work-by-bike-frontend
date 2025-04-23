// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { ResultsReportType } from '../components/enums/Results';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';
import type {
  ResultsResponse,
  useApiGetResultsReturn,
} from '../components/types/ApiResults';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Get results composable
 * Used for fetching results report URLs
 * @param {Logger | null} logger
 * @returns {useApiGetResultsReturn}
 */
export const useApiGetResults = (
  logger: Logger | null,
): useApiGetResultsReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load results report URLs
   * @param {ResultsReportType} reportType - Report type to fetch URLs for
   * @returns {Promise<ResultsResponse>} - Promise resolving to response data
   */
  const load = async (
    reportType: ResultsReportType,
  ): Promise<ResultsResponse> => {
    logger?.info(`Get results for report type <${reportType}> from the API.`);
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<ResultsResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiResults}${reportType}/`,
      method: 'get',
      translationKey: 'getResults',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    logger?.debug(`Results response data <${JSON.stringify(data, null, 2)}>.`);

    isLoading.value = false;
    return data ?? { data_report_url: null };
  };

  return {
    isLoading,
    load,
  };
};
