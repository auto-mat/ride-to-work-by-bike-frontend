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
import type { ApiAvatarMutationResponse } from '../components/types/ApiAvatar';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface UseApiPostAvatarReturn {
  isLoading: Ref<boolean>;
  postAvatar: (file: File) => Promise<ApiAvatarMutationResponse | null>;
}

/**
 * Composable for uploading a new avatar
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPostAvatarReturn}
 */
export const useApiPostAvatar = (
  logger: Logger | null,
): UseApiPostAvatarReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Upload a new avatar
   * @param {File} file - Image file to upload
   * @returns {Promise<ApiAvatarMutationResponse | null>} - Upload response
   */
  const postAvatar = async (
    file: File,
  ): Promise<ApiAvatarMutationResponse | null> => {
    logger?.debug(`Upload avatar <${file.name}>.`);
    isLoading.value = true;

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('primary', 'true');

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // post avatar
    const { data } = await apiFetch<ApiAvatarMutationResponse>({
      endpoint: rideToWorkByBikeConfig.urlApiAvatar,
      method: 'post',
      translationKey: 'uploadAvatar',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload: formData,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return { isLoading, postAvatar };
};
