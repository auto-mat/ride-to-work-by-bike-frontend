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

interface UseApiDeleteCoordinatorTeamReturn {
  isLoading: Ref<boolean>;
  deleteTeam: (subsidiaryId: number, teamId: number) => Promise<boolean>;
}

/**
 * Delete subsidiary team via coordinator action
 * @param {Logger | null} logger - Logger
 * @returns {UseApiDeleteCoordinatorTeamReturn}
 */
export const useApiDeleteCoordinatorTeam = (
  logger: Logger | null,
): UseApiDeleteCoordinatorTeamReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Delete a team under specified subsidiary
   * Team must have no active members
   * @param {number} subsidiaryId - Team subsidiary ID
   * @param {number} teamId - Team ID to delete
   * @returns {Promise<boolean>} - Success status
   */
  const deleteTeam = async (
    subsidiaryId: number,
    teamId: number,
  ): Promise<boolean> => {
    logger?.debug(
      `Delete team with ID <${teamId}>` +
        ` under subsidiary with ID <${subsidiaryId}>.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // construct endpoint URL
    const endpoint =
      `${rideToWorkByBikeConfig.urlApiCoordinatorSubsidiary}` +
      `${subsidiaryId}/${rideToWorkByBikeConfig.urlApiCoordinatorTeam}${teamId}/`;

    // delete team
    const { success } = await apiFetch<Record<string, never>>({
      endpoint,
      method: 'delete',
      translationKey: 'deleteCoordinatorTeam',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    isLoading.value = false;
    return success;
  };

  return {
    isLoading,
    deleteTeam,
  };
};
