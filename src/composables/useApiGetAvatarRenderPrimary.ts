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
import type { ApiAvatarRenderResponse } from '../components/types/ApiAvatar';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

interface UseApiGetAvatarRenderReturn {
  isLoading: Ref<boolean>;
  getAvatarRender: () => Promise<string | null>;
}

/**
 * Composable for getting the primary avatar rendered at the configured size
 * @param {Logger | null} logger - Logger
 * @returns {UseApiGetAvatarRenderReturn}
 */
export const useApiGetAvatarRender = (
  logger: Logger | null,
): UseApiGetAvatarRenderReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Get the primary avatar image URL rendered at `profileAvatarRenderSize`
   * @returns {Promise<string | null>} - Rendered avatar image URL
   */
  const getAvatarRender = async (): Promise<string | null> => {
    logger?.debug('Get rendered user profile primary avatar image.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const size = String(rideToWorkByBikeConfig.profileAvatarRenderSize);

    // get rendered primary avatar
    const { data } = await apiFetch<ApiAvatarRenderResponse>({
      endpoint: rideToWorkByBikeConfig.urlApiAvatarRenderPrimary,
      method: 'get',
      translationKey: 'getAvatar',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      params: { width: size, height: size },
      logger,
    });

    isLoading.value = false;
    return data?.image_url ?? null;
  };

  return { isLoading, getAvatarRender };
};
