<script lang="ts">
/**
 * LoginRegisterButtons Component
 *
 * The `LoginRegisterButtons` component is used for login via external providers such
 * as Google, Facebook, etc.
 *
 * @description * Use this component to render the buttons and handle
 * authentication.
 *
 * Note: This component is commonly used in `FormLogin`.
 *
 * @example
 * <login-register-buttons />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6274%3A28817&mode=dev)
 */

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoginRegisterButtons',
  props: {
    variant: {
      type: String as () => 'login' | 'register',
      required: true,
    },
  },
});
</script>

<template>
  <div>
    <!-- Button: Login Google -->
    <q-btn
      unelevated
      rounded
      outline
      color="primary"
      class="full-width"
      data-cy="login-register-button-google"
    >
      <!-- Icon -->
      <q-icon
        name="fab fa-google"
        size="18px"
        color="primary"
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
    <!-- Button: Login Facebook -->
    <q-btn
      unelevated
      rounded
      outline
      color="primary"
      class="full-width q-mt-md"
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
