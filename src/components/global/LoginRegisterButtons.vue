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

    // @ts-expect-error: response is not typed
    const loginCallback = (response) => {
      if (logger) {
        logger.debug(`loginCallback - response: ${JSON.stringify(response)}`);
      }
      // TODO: use login store to run functions based on the response data
    };

    return {
      loginCallback,
    };
  },
});
</script>

<template>
  <div>
    <!-- Button: Login Google -->
    <GoogleLogin :callback="loginCallback" class="full-width">
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
        $t('login.buttons.buttonFacebook')
      }}</span>
      <span v-else-if="variant === 'register'">{{
        $t('register.buttons.buttonFacebook')
      }}</span>
    </q-btn>
  </div>
</template>
