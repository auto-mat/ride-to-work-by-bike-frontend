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
  IsUserOrganizationAdminResponse,
  UseApiIsUserOrganizationAdminReturn,
} from '../components/types/apiOrganization';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Get user organization admin status composable
 * Used for checking if the current user is an administrator of an organization
 * @param {Logger | null} logger
 * @returns {UseApiIsUserOrganizationAdminReturn}
 */
export const useApiIsUserOrganizationAdmin = (
  logger: Logger | null,
): UseApiIsUserOrganizationAdminReturn => {
  const isLoading = ref<boolean>(false);
  const isUserOrganizationAdmin = ref<boolean | null>(null);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Check if current user is an organization administrator
   * Uses the auth token to identify the user
   * @returns {Promise<void>}
   */
  const checkIsUserOrganizationAdmin = async (): Promise<void> => {
    logger?.info('Check if current user is an organization coordinator.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<IsUserOrganizationAdminResponse>({
      endpoint: rideToWorkByBikeConfig.urlApiIsUserOrganizationAdmin,
      method: 'get',
      translationKey: 'getIsUserOrganizationAdmin',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data) {
      isUserOrganizationAdmin.value = data.is_user_organization_admin;
      logger?.debug(
        `Current user is organization coordinator <${isUserOrganizationAdmin.value}>.`,
      );
    }

    isLoading.value = false;
  };

  return {
    isLoading,
    isUserOrganizationAdmin,
    checkIsUserOrganizationAdmin,
  };
};
