// libraries
import { ref } from 'vue';
import { Notify } from 'quasar';

// composables
import { useApi } from './useApi';

// boot
import { i18n } from '../boot/i18n';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// enums
import { ApiBaseUrl } from '../components/enums/Api';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';
import type {
  ValidateInvitationTokenRequest,
  ValidateInvitationTokenResponse,
  UseApiPostValidateTeamMembershipInvitationEmailReturn,
} from '../components/types/ApiInvitation';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Validate team membership invitation token
 * Used to validate invitation email token and get team data
 * @param {Logger | null} logger - Logger
 * @returns {UseApiPostValidateTeamMembershipInvitationEmailReturn}
 */
export const useApiPostValidateTeamMembershipInvitationEmail = (
  logger: Logger | null,
): UseApiPostValidateTeamMembershipInvitationEmailReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi(ApiBaseUrl.rtwbbBackendApi);

  /**
   * Validate team membership invitation token
   * @param {ValidateInvitationTokenRequest} payload - API payload
   * @returns {Promise<ValidateInvitationTokenResponse | null>} - API response
   */
  const postValidateTeamMembershipInvitationEmail = async (
    payload: ValidateInvitationTokenRequest,
  ): Promise<ValidateInvitationTokenResponse | null> => {
    logger?.info(
      'Validate team membership invitation e-mail request to the API.',
    );
    isLoading.value = true;
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data, success } = await apiFetch<ValidateInvitationTokenResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiValidateTeamMembershipInvitationEmail}`,
      method: 'post',
      translationKey: 'validateTeamMembershipInvitationEmail',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload,
      logger,
      showErrorMessage: false,
    });

    isLoading.value = false;

    if (!success) {
      Notify.create({
        message: i18n.global.t(
          'validateTeamMembershipInvitationEmail.validationFailed',
        ),
        color: 'negative',
      });
      return null;
    }

    return data;
  };

  return {
    isLoading,
    postValidateTeamMembershipInvitationEmail,
  };
};
