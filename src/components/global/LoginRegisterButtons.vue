<script lang="ts">
/**
 * LoginRegisterButtons Component
 *
 * The `LoginRegisterButtons` component is used for login or registration
 * via external providers such as Google, Facebook, etc.
 *
 * @description * Use this component to render the buttons and handle
 * authentication.
 *
 * Note: This component is commonly used in `FormLogin` and `FormRegister`.
 *
 * @props
 * - `variant` (String: 'login' | 'register', required): Determines the
 * function based on whether the component is used for login or
 * registration.
 *
 * @example
 * <login-register-buttons />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6274%3A28817&mode=dev)
 */

import { defineComponent, inject } from 'vue';
import { useLoginStore } from '../../stores/login';
import { useI18n } from 'vue-i18n';

// types
import type { Logger } from '../types/Logger';
import type { GoogleAuthResponse } from '../types/Login';

export default defineComponent({
  name: 'LoginRegisterButtons',
  props: {
    variant: {
      type: String as () => 'login' | 'register',
      required: true,
    },
  },
  setup() {
    const logger: Logger | undefined = inject('vuejs3-logger');
    const loginStore = useLoginStore();
    const { t } = useI18n();

    const onGoogleLogin = async (response: GoogleAuthResponse) => {
      if (logger) {
        logger.debug(`onGoogleLogin - response: ${JSON.stringify(response)}`);
      }
      // process response
      try {
        // TODO: confirm the validity of error responses
        if (response.error) {
          handleGoogleAuthError(response.error);
        } else {
          await loginStore.authenticateWithGoogle(response);
        }
      } catch (error) {
        if (logger) {
          logger.debug(`Google auth error: ${JSON.stringify(error)}`);
        }
      }
    };
    /**
     * Handles Google authentication errors
     * Shows toast notification based on the error type.
     * @param {string} error - Error message
     * @returns {void}
     */
    const handleGoogleAuthError = (error: string): void => {
      if (!logger) {
        return;
      }
      switch (error) {
        case 'popup_closed_by_user':
          logger.debug('Login was canceled. Please try again.');
          break;
        case 'access_denied':
          logger.debug('Access denied. Please grant permissions to continue.');
          break;
        case 'idpiframe_initialization_failed':
          logger.debug(
            'Failed to initialize Google login. Ensure third-party cookies are enabled.',
          );
          break;
        default:
          logger.debug('An unknown error occurred. Please try again.');
      }
    };

    return {
      onGoogleLogin,
      t,
    };
  },
});
</script>

<template>
  <div>
    <!-- Button: Login Google -->
    <GoogleLogin :callback="onGoogleLogin" class="full-width">
      <q-btn
        unelevated
        rounded
        outline
        color="white"
        class="full-width"
        data-cy="login-register-button-google"
      >
        <!-- Icon -->
        <q-icon
          name="fab fa-google"
          size="18px"
          color="white"
          class="q-mr-sm"
          data-cy="login-register-button-google-icon"
        />
        <!-- Label -->
        <span v-if="variant === 'login'">{{
          t('login.buttons.buttonGoogle')
        }}</span>
        <span v-else-if="variant === 'register'">{{
          t('register.buttons.buttonGoogle')
        }}</span>
      </q-btn>
    </GoogleLogin>
    <!-- Button: Login Facebook -->
    <q-btn
      unelevated
      rounded
      outline
      color="white"
      class="full-width q-mt-md"
      data-cy="login-register-button-facebook"
    >
      <!-- Icon -->
      <q-icon
        name="facebook"
        size="24px"
        color="white"
        class="q-mr-sm"
        data-cy="login-register-button-facebook-icon"
      />
      <!-- Label -->
      <span v-if="variant === 'login'">{{
        t('login.buttons.buttonFacebook')
      }}</span>
      <span v-else-if="variant === 'register'">{{
        t('register.buttons.buttonFacebook')
      }}</span>
    </q-btn>
  </div>
</template>
