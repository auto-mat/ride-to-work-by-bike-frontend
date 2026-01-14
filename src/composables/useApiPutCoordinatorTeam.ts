// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Ref } from 'vue';
import type { Logger } from '../components/types/Logger';

interface CoordinatorTeamPutRequest {
  name: string;
  campaign_id: number;
  subsidiary_id: number;
}

interface CoordinatorTeamPutResponse {
  id: number;
  name: string;
}

export interface UseApiPutCoordinatorTeamReturn {
  isLoading: Ref<boolean>;
  updateTeam: (
    subsidiaryId: number,
    teamId: number,
    teamName: string,
    campaignId: number,
  ) => Promise<CoordinatorTeamPutResponse | null>;
}

/**
 * Enables updating a team via coordinator API.
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPutCoordinatorTeamReturn}
 */
export const useApiPutCoordinatorTeam = (
  logger: Logger | null,
): UseApiPutCoordinatorTeamReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Updates a team name.
   * @param {number} subsidiaryId - Team subsidiary ID
   * @param {number} teamId - Team ID
   * @param {string} teamName - New team name
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<CoordinatorTeamPutResponse | null>}
   */
  const updateTeam = async (
    subsidiaryId: number,
    teamId: number,
    teamName: string,
    campaignId: number,
  ): Promise<CoordinatorTeamPutResponse | null> => {
    logger?.debug(`Update team with ID <${teamId}> to name <${teamName}>.`);
    isLoading.value = true;

    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const endpoint =
      `${rideToWorkByBikeConfig.urlApiCoordinatorSubsidiary}` +
      `${subsidiaryId}/${rideToWorkByBikeConfig.urlApiCoordinatorTeam}${teamId}/`;

    const payload: CoordinatorTeamPutRequest = {
      name: teamName,
      campaign_id: campaignId,
      subsidiary_id: subsidiaryId,
    };

    const { data } = await apiFetch<CoordinatorTeamPutResponse>({
      endpoint,
      method: 'put',
      translationKey: 'updateCoordinatorTeam',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    updateTeam,
  };
};
