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
  TeamPostApiPayload,
  TeamPostApiResponse,
} from '../components/types/ApiTeam';

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
   * @param {number} subsidiaryId - Subsidiary Id to create team under
   * @param {string} teamName - Team name to create
   * @returns {Promise<TeamPostApiResponse | null>} - Promise
   */
  const createTeam = async (
    subsidiaryId: number,
    teamName: string,
  ): Promise<TeamPostApiResponse | null> => {
    // create payload
    logger?.debug(`Creating team payload with name <${teamName}>.`);
    const teamPayload: TeamPostApiPayload = { name: teamName };
    logger?.debug(
      `Created team payload <${JSON.stringify(teamPayload, null, 2)}>.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization += loginStore.getAccessToken;

    try {
      // post team
      const { data } = await apiFetch<TeamPostApiResponse>({
        endpoint: `${rideToWorkByBikeConfig.urlApiSubsidiaries}${subsidiaryId}/${rideToWorkByBikeConfig.urlApiTeams}`,
        method: 'post',
        translationKey: 'createTeam',
        headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
        payload: teamPayload,
        logger,
      });

      isLoading.value = false;

      if (data) {
        logger?.debug(`Created team <${JSON.stringify(data, null, 2)}>.`);
        return data;
      } else {
        logger?.debug('No data returned from team creation API.');
        return null;
      }
    } catch (error) {
      logger?.error(`Error creating team: ${error}`);
      isLoading.value = false;
      return null;
    }
  };

  return {
    isLoading,
    createTeam,
  };
};
