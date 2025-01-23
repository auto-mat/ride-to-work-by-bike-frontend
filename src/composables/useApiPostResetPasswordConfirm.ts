// libraries
import { ref } from 'vue';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// types
import type { Logger } from '../components/types/Logger';

// utils
import { requestDefaultHeader } from '../utils';

// types
import type {
  PostResetPasswordConfirmPayload,
  PostResetPasswordConfirmResponse,
  UseApiPostResetPasswordConfirmReturn,
} from '../components/types/ApiResetPassword';

/**
 * Post reset password confirmation composable
 * Exposes behaviour for submitting a new password.
 * @param logger - Logger
 * @returns {UseApiPostResetPasswordConfirmReturn}
 */
export const useApiPostResetPasswordConfirm = (
  logger: Logger | null,
): UseApiPostResetPasswordConfirmReturn => {
  const isLoading = ref<boolean>(false);
  const { apiFetch } = useApi();

  /**
   * Reset password confirmation
   * Confirms user's password reset using the reset token and user ID.
   * @param {PostResetPasswordConfirmPayload} payload - Reset password confirmation payload
   * @returns {Promise<PostResetPasswordConfirmResponse | null>} - Promise
   */
  const resetPasswordConfirm = async (
    payload: PostResetPasswordConfirmPayload,
  ): Promise<PostResetPasswordConfirmResponse | null> => {
    logger?.debug(
      `Confirm password reset for user ID <${payload.uid}> with token <${payload.token}>.`,
    );
    isLoading.value = true;

    // post reset password confirmation request
    const { data } = await apiFetch<PostResetPasswordConfirmResponse>({
      endpoint: rideToWorkByBikeConfig.urlApiResetPasswordConfirm,
      method: 'post',
      translationKey: 'resetPasswordConfirm',
      headers: requestDefaultHeader(),
      payload,
      showSuccessMessage: false,
      logger,
    });

    isLoading.value = false;
    return data;
  };

  return {
    isLoading,
    resetPasswordConfirm,
  };
};
