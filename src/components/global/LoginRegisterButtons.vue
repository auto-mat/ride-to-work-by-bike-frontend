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

import { useQuasar } from 'quasar';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'LoginRegisterButtons',
  props: {
    variant: {
      type: String as () => 'login' | 'register',
      required: true,
    },
  },
  setup() {
    const profile = ref<{ id: string; name: string; email: string } | null>(
      null,
    );
    const $q = useQuasar();

    const signInWithGoogle = async () => {
      try {
        // @ts-expect-error - find a way to extend the type of $q
        const googleUser = await $q.gAuth.signIn();
        const basicProfile = googleUser.getBasicProfile();

        profile.value = {
          id: basicProfile.getId(),
          name: basicProfile.getName(),
          email: basicProfile.getEmail(),
        };

        // You can send the token to your backend if needed
        const token = googleUser.getAuthResponse().id_token;
        console.log('Token:', token);
      } catch (error) {
        console.error('Error during Google sign-in:', error);
      }
    };

    return {
      signInWithGoogle,
      profile,
    };
  },
});
</script>

<template>
  <div>
    <!-- Button: Login Google -->
    <GoogleLogin :callback="signInWithGoogle" class="full-width">
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
