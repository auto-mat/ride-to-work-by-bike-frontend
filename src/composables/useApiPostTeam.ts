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
import type { TeamPostApiResponse } from '../components/types/ApiTeam';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface UseApiPostTeamReturn {
  isLoading: Ref<boolean>;
  createTeam: (
    subsidiaryId: number,
    teamName: string,
  ) => Promise<TeamPostApiResponse | null>;
}

/**
 * Post team composable
 * Used to enable calling the API to create subsidiary team
 * @param logger - Logger
 * @returns {UseApiPostTeamReturn}
 */
export const useApiPostTeam = (logger: Logger | null): UseApiPostTeamReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Create team
   * Creates a new team under specified subsidiary
   * @param {Number} subsidiaryId - Team subsidiary ID
   * @param {String} teamName - Team name to create
   * @returns {Promise<TeamPostApiResponse | null>} - Promise
   */
  const createTeam = async (
    subsidiaryId: number,
    teamName: string,
  ): Promise<TeamPostApiResponse | null> => {
    logger?.debug(
      `Create new team with name <${teamName}>` +
        ` under subsidiary with ID <${subsidiaryId}>.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // post team
    const { data } = await apiFetch<TeamPostApiResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiSubsidiaries}${subsidiaryId}/${rideToWorkByBikeConfig.urlApiTeams}`,
      method: 'post',
      translationKey: 'createTeam',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload: { name: teamName },
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    createTeam,
  };
};
