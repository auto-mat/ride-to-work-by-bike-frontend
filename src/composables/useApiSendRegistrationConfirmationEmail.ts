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
  SendRegistrationConfirmationEmailResponse,
  UseApiSendRegistrationConfirmationEmailReturn,
} from '../components/types/ApiSendRegistrationConfirmationEmail';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Send registration confirmation email composable
 * Used to enable calling the API to resend registration confirmation email
 * @param {Logger | null} logger - Logger
 * @returns {UseApiSendRegistrationConfirmationEmailReturn}
 */
export const useApiSendRegistrationConfirmationEmail = (
  logger: Logger | null,
): UseApiSendRegistrationConfirmationEmailReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi(ApiBaseUrl.rtwbbBackendApi);

  /**
   * Send registration confirmation email
   * Triggers sending of a new registration confirmation email
   * @returns {Promise<SendRegistrationConfirmationEmailResponse | null>} - API response
   */
  const sendRegistrationConfirmationEmail =
    async (): Promise<SendRegistrationConfirmationEmailResponse | null> => {
      logger?.info('Send registration confirmation email request to the API.');
      isLoading.value = true;

      // append access token into HTTP header
      const requestTokenHeader_ = { ...requestTokenHeader };
      requestTokenHeader_.Authorization +=
        await loginStore.getAccessTokenWithRefresh();

      const { data } =
        await apiFetch<SendRegistrationConfirmationEmailResponse>({
          endpoint: `${rideToWorkByBikeConfig.urlApiSendRegistrationConfirmationEmail}`,
          method: 'post',
          translationKey: 'sendRegistrationConfirmationEmail',
          headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
          showSuccessMessage: false,
          logger,
        });

      isLoading.value = false;

      return data;
    };

  return {
    isLoading,
    sendRegistrationConfirmationEmail,
  };
};
