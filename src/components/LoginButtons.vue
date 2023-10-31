<script lang="ts">
/**
 * LoginButtons Component
 *
 * The `LoginButtons` component is used for login via external providers such
 * as Google, Facebook, etc.
 *
 * @description * Use this component to render the buttons and handle
 * authentication.
 *
 * Note: This component is commonly used in `FormLogin`.
 *
 * @example
 * <login-buttons />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6274%3A28817&mode=dev)
 */

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoginButtons',
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
      data-cy="login-button-google"
    >
      <!-- Icon -->
      <q-icon
        name="fab fa-google"
        size="18px"
        color="primary"
        class="q-mr-sm"
        data-cy="login-button-google-icon"
      />
      <!-- Label -->
      {{ $t('login.buttons.buttonGoogle') }}
    </q-btn>
    <!-- Button: Login Facebook -->
    <q-btn
      unelevated
      rounded
      outline
      color="primary"
      class="full-width q-mt-md"
      data-cy="login-button-facebook"
    >
      <!-- Icon -->
      <q-icon
        name="facebook"
        size="24px"
        color="primary"
        class="q-mr-sm"
        data-cy="login-button-facebook-icon"
      />
      <!-- Label -->
      {{ $t('login.buttons.buttonFacebook') }}
    </q-btn>
  </div>
</template>
