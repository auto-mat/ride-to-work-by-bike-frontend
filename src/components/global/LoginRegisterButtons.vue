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

import { Notify } from 'quasar';
import { defineComponent, inject } from 'vue';
import { CallbackTypes } from 'vue3-google-login';

// composables
import { i18n } from '../../boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// stores
import { useLoginStore } from '../../stores/login';

// types
import type { Logger } from '../types/Logger';

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

    const onGoogleLogin = async (response: CallbackTypes.CodePopupResponse) => {
      logger?.debug(
        `Google login component response <${JSON.stringify(response, null, 2)}>.`,
      );
      if (response) {
        await loginStore.authenticateWithGoogle(response);
      }
    };

    const onGoogleLoginError = (error: CallbackTypes.ErrorPopupResponse) => {
      logger?.error(`Google login component error <${error.message}>.`);

      /**
       * Types of error based on `TokenClientConfig` class defined in
       * the `vue3-google-login` library.
       */
      if (error.type === 'popup_failed_to_open') {
        Notify.create({
          message: i18n.global.t('login.messagePopupFailedToOpen'),
          color: 'negative',
        });
      } else if (error.type === 'popup_closed') {
        Notify.create({
          message: i18n.global.t('login.messagePopupClosed'),
          color: 'negative',
        });
      }
    };

    /**
     * Hide Google login button if no client ID is provided.
     * Client ID is provided in `google_login.js` boot file.
     */
    const isGoogleLoginAvailable: boolean =
      !!rideToWorkByBikeConfig.googleLoginAppId;

    return {
      isGoogleLoginAvailable,
      onGoogleLogin,
      onGoogleLoginError,
    };
  },
});
</script>

<template>
  <div class="bg-primary">
    <!-- Button: Login Google -->
    <GoogleLogin
      v-if="isGoogleLoginAvailable"
      :callback="onGoogleLogin"
      :error="onGoogleLoginError"
      class="full-width"
    >
      <q-btn
        unelevated
        rounded
        outline
        color="white"
        class="full-width q-mb-md"
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
          $t('login.buttons.buttonGoogle')
        }}</span>
        <span v-else-if="variant === 'register'">{{
          $t('register.buttons.buttonGoogle')
        }}</span>
      </q-btn>
    </GoogleLogin>
    <!-- Button: Login Facebook -->
    <q-btn
      unelevated
      rounded
      outline
      color="primary"
      class="full-width"
      data-cy="login-register-button-facebook"
    >
      <!-- Icon -->
      <q-icon
        name="facebook"
        size="24px"
        color="primary"
        class="q-mr-sm"
        data-cy="login-register-button-facebook-icon"
      />
      <!-- Label -->
      <span v-if="variant === 'login'">{{
        $t('login.buttons.buttonFacebook')
      }}</span>
      <span v-else-if="variant === 'register'">{{
        $t('register.buttons.buttonFacebook')
      }}</span>
    </q-btn>
  </div>
</template>
