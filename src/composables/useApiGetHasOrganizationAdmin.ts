// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';
import { useRegisterChallengeStore } from '../stores/registerChallenge';

// types
import type { Logger } from '../components/types/Logger';
import type {
  HasOrganizationAdminResponse,
  UseApiGetHasOrganizationAdminReturn,
} from '../components/types/apiOrganization';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Get organization admin status composable
 * Used for checking if an organization has an administrator
 * @param {Logger | null} logger
 * @returns {UseApiGetHasOrganizationAdminReturn}
 */
export const useApiGetHasOrganizationAdmin = (
  logger: Logger | null,
): UseApiGetHasOrganizationAdminReturn => {
  const isLoading = ref<boolean>(false);
  const hasOrganizationAdmin = ref<boolean | null>(null);
  const loginStore = useLoginStore();
  const registerChallengeStore = useRegisterChallengeStore();
  const { apiFetch } = useApi();

  /**
   * Check if organization has an administrator
   * Uses organizationId from registerChallengeStore
   * @returns {Promise<void>}
   */
  const checkOrganizationAdmin = async (): Promise<void> => {
    const organizationId = registerChallengeStore.getOrganizationId;
    if (!organizationId) {
      logger?.warn(
        'Cannot check organization admin, ' +
          ` no organization ID was found into store <${organizationId}>.`,
      );
      return;
    }

    logger?.info(
      `Check if organization ID <${organizationId}> has an administrator.`,
    );
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<HasOrganizationAdminResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiHasOrganizationAdmin}${organizationId}/`,
      method: 'get',
      translationKey: 'getHasOrganizationAdmin',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data) {
      hasOrganizationAdmin.value = data.has_organization_admin;
      logger?.debug(
        `Organization ID <${organizationId}> has administrator <${hasOrganizationAdmin.value}>.`,
      );
    }

    isLoading.value = false;
  };

  return {
    isLoading,
    hasOrganizationAdmin,
    checkOrganizationAdmin,
  };
};
