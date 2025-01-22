// types
import type { Ref } from 'vue';

export interface SendRegistrationConfirmationEmailResponse {
  send_registration_confirmation_email: boolean;
}

export interface UseApiSendRegistrationConfirmationEmailReturn {
  isLoading: Ref<boolean>;
  sendRegistrationConfirmationEmail: () => Promise<SendRegistrationConfirmationEmailResponse | null>;
}
