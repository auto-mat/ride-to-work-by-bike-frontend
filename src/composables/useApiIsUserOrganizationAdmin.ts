// libraries
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Check if current user is an organization administrator
 * @param {Logger | null} logger
 * @returns {Promise<boolean>} - True if user is an organization admin
 */
export const useApiIsUserOrganizationAdmin = async (
  logger: Logger | null,
): Promise<boolean> => {
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  logger?.info('Check if current user is an organization coordinator.');

  // append access token into HTTP header
  const requestTokenHeader_ = { ...requestTokenHeader };
  requestTokenHeader_.Authorization +=
    await loginStore.getAccessTokenWithRefresh();

  const { data } = await apiFetch<{ is_user_organization_admin: boolean }>({
    endpoint: rideToWorkByBikeConfig.urlApiIsUserOrganizationAdmin,
    method: 'get',
    translationKey: 'getIsUserOrganizationAdmin',
    showSuccessMessage: false,
    headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
    logger,
  });

  const isAdmin = data?.is_user_organization_admin ?? false;
  logger?.debug(`Current user is organization coordinator <${isAdmin}>.`);

  return isAdmin;
};
