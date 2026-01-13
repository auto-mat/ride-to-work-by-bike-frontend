// libraries
import { ref, Ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { TeamMemberStatus } from '../components/enums/TeamMember';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface CoordinatorMoveMemberRequest {
  team_id: number;
  campaign_id: number;
  approved_for_team: TeamMemberStatus;
}

interface CoordinatorMoveMemberResponse {
  id: number;
  name: string;
  team_id: number;
  campaign_id: number;
  approved_for_team: TeamMemberStatus;
}

interface UseApiPostCoordinatorMoveMemberReturn {
  isLoading: Ref<boolean>;
  moveMember: (
    subsidiaryId: number,
    teamId: number,
    memberId: number,
    payload: CoordinatorMoveMemberRequest,
  ) => Promise<CoordinatorMoveMemberResponse | null>;
}

/**
 * Post coordinator move member composable
 * Used to move team member to another team
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPostCoordinatorMoveMemberReturn}
 */
export const useApiPostCoordinatorMoveMember = (
  logger: Logger | null,
): UseApiPostCoordinatorMoveMemberReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Move a team member to another team
   * @param {number} subsidiaryId - Member's current subsidiary ID
   * @param {number} teamId - Member's current team ID
   * @param {number} memberId - ID of the member to move
   * @param {CoordinatorMoveMemberRequest} payload - Payload with new team info
   * @returns {Promise<CoordinatorMoveMemberResponse | null>}
   */
  const moveMember = async (
    subsidiaryId: number,
    teamId: number,
    memberId: number,
    payload: CoordinatorMoveMemberRequest,
  ): Promise<CoordinatorMoveMemberResponse | null> => {
    logger?.debug(
      `Move member with ID <${memberId}> to team ID <${payload.team_id}>` +
        ` from team ID <${teamId}> in subsidiary ID <${subsidiaryId}>.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // construct endpoint URL
    const endpoint =
      `${rideToWorkByBikeConfig.urlApiCoordinatorSubsidiary}` +
      `${subsidiaryId}/${rideToWorkByBikeConfig.urlApiCoordinatorTeam}${teamId}/` +
      `member/${memberId}/`;

    // post member move
    const { data } = await apiFetch<CoordinatorMoveMemberResponse>({
      endpoint,
      method: 'put',
      translationKey: 'moveCoordinatorMember',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    moveMember,
  };
};
