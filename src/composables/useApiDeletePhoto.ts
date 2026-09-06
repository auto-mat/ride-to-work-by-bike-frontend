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

interface UseApiDeletePhotoReturn {
  isLoading: Ref<boolean>;
  deletePhoto: (id: number) => Promise<boolean>;
}

/**
 * Composable for deleting a profile photo
 * @param {Logger | null} logger - Logger
 * @returns {UseApiDeletePhotoReturn}
 */
export const useApiDeletePhoto = (
  logger: Logger | null,
): UseApiDeletePhotoReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Delete profile photo with given ID
   * @param {number} id - Photo ID
   * @returns {Promise<boolean>} - Success status
   */
  const deletePhoto = async (id: number): Promise<boolean> => {
    logger?.debug(`Delete profile photo with ID <${id}>.`);
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // delete photo
    const { success } = await apiFetch<Record<string, never>>({
      endpoint: `${rideToWorkByBikeConfig.urlApiPhoto}${id}`,
      method: 'delete',
      translationKey: 'deletePhoto',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    isLoading.value = false;
    return success;
  };

  return { isLoading, deletePhoto };
};
