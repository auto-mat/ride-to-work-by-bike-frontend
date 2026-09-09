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

interface UseApiDeleteAvatarReturn {
  isLoading: Ref<boolean>;
  deleteAvatar: (id: number) => Promise<boolean>;
}

/**
 * Composable for deleting an avatar
 * @param {Logger | null} logger - Logger
 * @returns {UseApiDeleteAvatarReturn}
 */
export const useApiDeleteAvatar = (
  logger: Logger | null,
): UseApiDeleteAvatarReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Delete avatar with given ID
   * @param {number} id - Avatar ID
   * @returns {Promise<boolean>} - Success status
   */
  const deleteAvatar = async (id: number): Promise<boolean> => {
    logger?.debug(`Delete user profile avatar image with ID <${id}>.`);
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // delete avatar
    const { success } = await apiFetch<Record<string, never>>({
      endpoint: `${rideToWorkByBikeConfig.urlApiAvatar}${id}/`,
      method: 'delete',
      translationKey: 'deleteAvatar',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    isLoading.value = false;
    return success;
  };

  return { isLoading, deleteAvatar };
};
