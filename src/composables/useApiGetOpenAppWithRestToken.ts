// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';
import type {
  OpenAppWithRestTokenResponse,
  useApiGetOpenAppWithRestTokenReturn,
} from '../components/types/ApiOpenAppWithRestToken';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Get open app with rest token composable
 * Used for fetching open app with rest token data
 * @param {Logger | null} logger
 * @returns {useApiGetOpenAppWithRestTokenReturn}
 */
export const useApiGetOpenAppWithRestToken = (
  logger: Logger | null,
): useApiGetOpenAppWithRestTokenReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load open app with rest token data
   * @param {string} appId - App ID to fetch data for
   * @returns {Promise<OpenAppWithRestTokenResponse>} - Promise resolving to response data
   */
  const load = async (appId: string): Promise<OpenAppWithRestTokenResponse> => {
    logger?.info(
      `Get open app with rest token for app <${appId}> from the API.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<OpenAppWithRestTokenResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiOpenAppWithRestToken}${appId}`,
      method: 'get',
      translationKey: 'getOpenAppWithRestToken',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    logger?.debug(
      `Open app with rest token response data <${JSON.stringify(data, null, 2)}>.`,
    );

    isLoading.value = false;
    return data ?? { app_url: '', token_expiration: '' };
  };

  return {
    isLoading,
    load,
  };
};
