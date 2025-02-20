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
import type { GetMyTeamResponse } from '../components/types/Organization';
import type { TeamMemberStatus } from '../components/enums/TeamMember';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface MemberStatusUpdate {
  id: number;
  approved_for_team: TeamMemberStatus;
}

interface UseApiPutMyTeamReturn {
  isLoading: Ref<boolean>;
  updateTeamMemberStatus: (members: MemberStatusUpdate[]) => Promise<void>;
}

/**
 * Put my team composable
 * Used to update team member status
 * @param logger - Logger
 * @returns {UseApiPutMyTeamReturn}
 */
export const useApiPutMyTeam = (
  logger: Logger | null,
): UseApiPutMyTeamReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Update team member status
   * Updates the approval status for multiple team members
   * @param {MemberStatusUpdate[]} members - Array of member status updates
   */
  const updateTeamMemberStatus = async (
    members: MemberStatusUpdate[],
  ): Promise<void> => {
    logger?.debug(
      `Updating team member status for members: ${JSON.stringify(members)}`,
    );
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

    // update team members
    await apiFetch<GetMyTeamResponse>({
      endpoint: rideToWorkByBikeConfig.urlApiMyTeam,
      method: 'put',
      translationKey: 'updateTeamMembers',
      headers,
      payload: { members },
      logger,
    });

    isLoading.value = false;
  };

  return {
    isLoading,
    updateTeamMemberStatus,
  };
};
