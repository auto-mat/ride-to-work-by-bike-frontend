// libraries
import { ref, Ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// enums
import { ApiBaseUrl } from '../components/enums/Api';

// types
import type { Logger } from '../components/types/Logger';
import type { SendRegistrationConfirmationEmailResponse } from '../components/types/ApiSendRegistrationConfirmationEmail';

type UseApiSendRegistrationConfirmationEmailReturn = {
  isLoading: Ref<boolean>;
  sendRegistrationConfirmationEmail: () => Promise<SendRegistrationConfirmationEmailResponse | null>;
};

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
  const { apiFetch } = useApi(ApiBaseUrl.rtwbbBackendApi);

  /**
   * Send registration confirmation email
   * Triggers sending of a new registration confirmation email
   */
  const sendRegistrationConfirmationEmail =
    async (): Promise<SendRegistrationConfirmationEmailResponse | null> => {
      logger?.info('Send registration confirmation email request to the API.');
      isLoading.value = true;

      const { data } =
        await apiFetch<SendRegistrationConfirmationEmailResponse>({
          endpoint: `${rideToWorkByBikeConfig.urlApiSendRegistrationConfirmationEmail}`,
          method: 'post',
          translationKey: 'sendRegistrationConfirmationEmail',
          showSuccessMessage: true,
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
