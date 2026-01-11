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

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface CoordinatorTeamPostRequest {
  name: string;
  campaign_id: number;
  subsidiary_id: number;
}

interface CoordinatorTeamPostResponse {
  id: number;
  name: string;
}

interface UseApiPostCoordinatorTeamReturn {
  isLoading: Ref<boolean>;
  createTeam: (
    subsidiaryId: number,
    teamName: string,
    campaignId: number,
  ) => Promise<CoordinatorTeamPostResponse | null>;
}

/**
 * Post coordinator team composable
 * Used to create subsidiary team via coordinator endpoint
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPostCoordinatorTeamReturn}
 */
export const useApiPostCoordinatorTeam = (
  logger: Logger | null,
): UseApiPostCoordinatorTeamReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Create a new team under specified subsidiary and campaign
   * @param {number} subsidiaryId - Team subsidiary ID
   * @param {string} teamName - Team name to create
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<CoordinatorTeamPostResponse | null>}
   */
  const createTeam = async (
    subsidiaryId: number,
    teamName: string,
    campaignId: number,
  ): Promise<CoordinatorTeamPostResponse | null> => {
    logger?.debug(
      `Create new team with name <${teamName}>` +
        ` under subsidiary with ID <${subsidiaryId}>` +
        ` for campaign ID <${campaignId}>.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // construct endpoint URL
    const endpoint =
      `${rideToWorkByBikeConfig.urlApiCoordinatorSubsidiary}` +
      `${subsidiaryId}/${rideToWorkByBikeConfig.urlApiCoordinatorTeam}`;

    // construct request payload
    const payload: CoordinatorTeamPostRequest = {
      name: teamName,
      campaign_id: campaignId,
      subsidiary_id: subsidiaryId,
    };

    // post team
    const { data } = await apiFetch<CoordinatorTeamPostResponse>({
      endpoint,
      method: 'post',
      translationKey: 'createCoordinatorTeam',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload,
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
