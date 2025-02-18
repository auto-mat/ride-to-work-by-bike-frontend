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
import type { MyTeamResults } from '../components/types/Results';
import type {
  GetMyTeamResponse,
  useApiGetMyTeamReturn,
} from '../components/types/Organization';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Get my team composable
 * Used to get API data about the user's team
 * @param logger - Logger
 * @returns {useApiGetMyTeamReturn}
 */
export const useApiGetMyTeam = (
  logger: Logger | null,
): useApiGetMyTeamReturn => {
  const team = ref<MyTeamResults | null>(null);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load team
   * Fetches team data and saves it
   */
  const loadTeam = async (): Promise<void> => {
    // reset team
    logger?.debug(
      `Reseting team data <${JSON.stringify(team.value, null, 2)}>.`,
    );
    team.value = null;
    logger?.debug(`Team data set to <${JSON.stringify(team.value, null, 2)}>.`);

    // get team
    logger?.info('Get team from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // prepare headers with version
    const headers = Object.assign(
      requestDefaultHeader(rideToWorkByBikeConfig.apiVersion2),
      requestTokenHeader_,
    );

    // fetch team
    const { data } = await apiFetch<GetMyTeamResponse>({
      endpoint: rideToWorkByBikeConfig.urlApiMyTeam,
      method: 'get',
      translationKey: 'getMyTeam',
      showSuccessMessage: false,
      headers,
      logger,
    });

    if (data?.results?.length) {
      team.value = data.results[0];
    }

    isLoading.value = false;
  };

  return {
    team,
    isLoading,
    loadTeam,
  };
};
