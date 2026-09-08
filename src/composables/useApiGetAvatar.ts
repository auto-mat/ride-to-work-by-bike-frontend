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
import type { ApiAvatarGetResponse } from '../components/types/ApiAvatar';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface UseApiGetAvatarReturn {
  isLoading: Ref<boolean>;
  getAvatar: () => Promise<ApiAvatarGetResponse | null>;
}

/**
 * Composable for getting the user's avatar(s)
 * @param {Logger | null} logger - Logger
 * @returns {UseApiGetAvatarReturn}
 */
export const useApiGetAvatar = (
  logger: Logger | null,
): UseApiGetAvatarReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Get the user's avatar(s)
   * @returns {Promise<ApiAvatarGetResponse | null>} - Avatar list or default avatar response
   */
  const getAvatar = async (): Promise<ApiAvatarGetResponse | null> => {
    logger?.debug('Get user avatar.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // get avatar
    const { data } = await apiFetch<ApiAvatarGetResponse>({
      endpoint: rideToWorkByBikeConfig.urlApiAvatar,
      method: 'get',
      translationKey: 'getAvatar',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return { isLoading, getAvatar };
};
