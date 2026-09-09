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

interface UseApiPutAvatarReturn {
  isLoading: Ref<boolean>;
  putAvatar: (
    id: number,
    file: File,
  ) => Promise<ApiAvatarMutationResponse | null>;
}

/**
 * Composable for replacing an existing avatar
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPutAvatarReturn}
 */
export const useApiPutAvatar = (
  logger: Logger | null,
): UseApiPutAvatarReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Replace an existing avatar with a new file
   * @param {number} id - Avatar ID to replace
   * @param {File} file - New image file
   * @returns {Promise<ApiAvatarMutationResponse | null>} - Upload response
   */
  const putAvatar = async (
    id: number,
    file: File,
  ): Promise<ApiAvatarMutationResponse | null> => {
    logger?.debug(
      `Replace user profile avatar image with ID <${id}> with new image file <${file.name}>.`,
    );
    isLoading.value = true;

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('primary', 'true');

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // put avatar
    const { data } = await apiFetch<ApiAvatarMutationResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiAvatar}${id}/`,
      method: 'put',
      translationKey: 'replaceAvatar',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload: formData,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return { isLoading, putAvatar };
};
