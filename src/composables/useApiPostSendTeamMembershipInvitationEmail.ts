// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// enums
import { ApiBaseUrl } from '../components/enums/Api';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';
import type {
  SendTeamMembershipInvitationEmailPayload,
  SendTeamMembershipInvitationEmailResponse,
  UseApiSendTeamMembershipInvitationEmailReturn,
} from '../components/types/ApiSendTeamMembershipInvitationEmail';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Send team membership invitation email composable
 * Used to enable calling the API to send invitation emails to potential team members
 * @param {Logger | null} logger - Logger
 * @returns {UseApiSendTeamMembershipInvitationEmailReturn}
 */
export const useApiPostSendTeamMembershipInvitationEmail = (
  logger: Logger | null,
): UseApiSendTeamMembershipInvitationEmailReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi(ApiBaseUrl.rtwbbBackendApi);

  /**
   * Send team membership invitation email
   * Triggers sending of invitation emails to potential team members
   * @param {SendTeamMembershipInvitationEmailPayload} payload - API payload
   * @returns {Promise<SendTeamMembershipInvitationEmailResponse | null>} - API response
   */
  const postSendTeamMembershipInvitationEmail = async (
    payload: SendTeamMembershipInvitationEmailPayload,
  ): Promise<SendTeamMembershipInvitationEmailResponse | null> => {
    logger?.info('Send team membership invitation email request to the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<SendTeamMembershipInvitationEmailResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiSendTeamMembershipInvitationEmail}`,
      method: 'post',
      translationKey: 'sendTeamMembershipInvitationEmail',
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      payload,
      logger,
    });

    isLoading.value = false;

    return data;
  };

  return {
    isLoading,
    postSendTeamMembershipInvitationEmail,
  };
};
