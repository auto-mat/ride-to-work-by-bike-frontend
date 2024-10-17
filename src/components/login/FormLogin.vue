<script lang="ts">
/**
 * FormLogin Component
 *
 * The `FormLogin`
 *
 * @description * Use this component to render login form.
 * Login form contains password reset.
 *
 * @events
 * - `formSubmit`: Emitted on form submit.
 *
 * @components
 * - `LoginRegisterButtons`: Component to render third-party authentication
 * buttons.
 * - `BannerAppButtons`: Component to render download links for RTWBB app.
 *
 * @example
 * <form-login />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6274%3A28441&mode=dev)
 */

// libraries
import { colors } from 'quasar';
import { computed, defineComponent, ref, reactive } from 'vue';

// components
import BannerAppButtons from './BannerAppButtons.vue';
import FormFieldEmail from '../global/FormFieldEmail.vue';
import LoginRegisterButtons from '../global/LoginRegisterButtons.vue';

// composables
import { useValidation } from '../../composables/useValidation';

// enums
import { LoginFormState } from '../../stores/login';

// stores
import { useLoginStore } from '../../stores/login';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'FormLogin',
  components: {
    BannerAppButtons,
    FormFieldEmail,
    LoginRegisterButtons,
  },
  emits: ['formSubmit'],
  setup() {
    const loginStore = useLoginStore();
    const formLogin = reactive({
      username: '',
      password: '',
    });
    const loginLoading = ref(false);

    const formPasswordReset = reactive({
      email: '',
    });

    const isPassword = ref(true);
    const formState = computed(() => loginStore.getLoginFormState);
    const setFormState = (state: LoginFormState) => {
      loginStore.setLoginFormState(state);
    };

    const contactEmail = computed(() => loginStore.getPasswordResetEmail);

    const { isEmail, isFilled } = useValidation();

    const onSubmitLogin = async () => {
      loginLoading.value = true;

      await loginStore.login(formLogin);

      loginLoading.value = false;
    };

    const onSubmitPasswordReset = () => {
      loginStore.resetPassword(formPasswordReset.email);
    };

    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const white = getPaletteColor('white');
    const whiteOpacity = changeAlpha(
      white,
      rideToWorkByBikeConfig.opacityWhiteBackground,
    );

    return {
      contactEmail,
      formPasswordReset,
      formState,
      isPassword,
      LoginFormState,
      loginLoading,
      formLogin,
      whiteOpacity,
      isEmail,
      isFilled,
      onSubmitLogin,
      onSubmitPasswordReset,
      setFormState,
    };
  },
});
</script>

<template>
  <!-- State: Login -->
  <div
    v-if="formState === LoginFormState.login"
    class="bg-primary text-white"
    data-cy="form-login"
  >
    <div class="q-mb-lg">
      <h1 class="text-h5 text-bold q-my-none" data-cy="form-title-login">
        {{ $t('login.form.titleLogin') }}
      </h1>
    </div>
    <!-- Form: login -->
    <q-form @submit.prevent="onSubmitLogin">
      <!-- Input: email -->
      <form-field-email
        dark
        color="white"
        bg-color="transparent"
        v-model="formLogin.username"
        data-cy="form-login-email"
      />
      <!-- Input: password -->
      <div data-cy="form-login-password">
        <!-- Label -->
        <label for="form-login-password" class="text-caption text-bold">
          {{ $t('login.form.labelPassword') }}
        </label>
        <!-- Input -->
        <q-input
          dark
          dense
          outlined
          hide-bottom-space
          bg-color="transparent"
          color="white"
          v-model="formLogin.password"
          id="form-login-password"
          :type="isPassword ? 'password' : 'text'"
          :rules="[
            (val) => isFilled(val) || $t('login.form.messagePasswordRequired'),
          ]"
          class="q-mt-sm"
          data-cy="form-login-password-input"
        >
          <!-- Icon: show password -->
          <template v-slot:append>
            <q-icon
              color="white"
              :name="isPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              size="18px"
              @click="isPassword = !isPassword"
              data-cy="form-login-password-icon"
            />
          </template>
        </q-input>
        <!-- Link: fogotten password -->
        <div class="flex justify-end q-mt-sm">
          <a
            href="#"
            class="text-white text-caption"
            @click.prevent="setFormState(LoginFormState.passwordReset)"
            data-cy="form-login-forgotten-password"
          >
            {{ $t('login.form.forgottenPassword') }}
          </a>
        </div>
      </div>
      <!-- Button: submit -->
      <q-btn
        unelevated
        rounded
        class="full-width q-mt-lg"
        type="submit"
        color="secondary"
        text-color="primary"
        :loading="loginLoading"
        :label="$t('login.form.submitLogin')"
        data-cy="form-login-submit-login"
      />
    </q-form>
    <!-- Separator -->
    <q-separator
      :style="{ backgroundColor: whiteOpacity }"
      class="q-my-lg"
      data-cy="form-login-separator"
    />
    <!-- Buttons: Login with 3rd party -->
    <login-register-buttons variant="login" />
    <!-- Link: Register -->
    <div class="text-white q-mt-lg">
      <p data-cy="login-prompt-no-account">
        {{ $t('login.form.promptNoAccount') }}
        <router-link
          :to="{ name: 'register' }"
          class="text-white"
          data-cy="login-link-register"
        >
          {{ $t('login.form.linkRegister') }} </router-link
        >.
      </p>
    </div>
    <!-- Links: Mobile app -->
    <div class="q-mt-xl">
      <banner-app-buttons />
    </div>
  </div>
  <!-- State: Forgotten password -->
  <div
    v-else-if="formState === LoginFormState.passwordReset"
    class="bg-primary text-white"
    data-cy="form-password-reset"
  >
    <div class="q-my-lg">
      <q-btn
        round
        outline
        color="white"
        size="13px"
        @click.prevent="setFormState(LoginFormState.login)"
        data-cy="form-password-reset-button-back"
      >
        <q-icon name="arrow_back" size="24px" />
      </q-btn>
    </div>
    <div class="q-my-sm">
      <h1
        class="text-h5 text-bold q-my-none"
        data-cy="form-password-reset-title"
      >
        {{ $t('login.form.titlePasswordReset') }}
      </h1>
    </div>
    <div class="q-mt-sm q-mb-lg">
      <p data-cy="form-password-reset-description">
        {{ $t('login.form.descriptionPasswordReset') }}
      </p>
    </div>
    <!-- Form: password reset -->
    <q-form @submit.prevent="onSubmitPasswordReset">
      <!-- Input: email -->
      <form-field-email
        dark
        outlined
        v-model="formPasswordReset.email"
        color="white"
        bg-color="transparent"
        data-cy="form-password-reset-email"
      />
      <!-- Button: submit -->
      <q-btn
        unelevated
        rounded
        class="full-width q-mt-lg"
        type="submit"
        color="secondary"
        text-color="primary"
        :label="$t('login.form.submitPasswordReset')"
        data-cy="form-password-reset-submit"
      />
    </q-form>
  </div>
  <!-- State: Password reset finished -->
  <div
    v-else-if="formState === LoginFormState.resetFinished"
    class="bg-primary text-white"
    data-cy="form-reset-finished"
  >
    <div class="q-my-lg">
      <!-- Icon: Email -->
      <div class="flex">
        <q-avatar
          size="64px"
          :style="{ backgroundColor: whiteOpacity }"
          data-cy="form-reset-finished-icon-wrapper"
        >
          <q-icon
            name="mdi-email-outline"
            size="40px"
            color="white"
            class="q-ma-xs"
            data-cy="form-reset-finished-icon"
          />
        </q-avatar>
      </div>
      <!-- Title -->
      <h2
        class="text-h5 text-bold q-my-none q-mt-lg"
        data-cy="form-reset-finished-title"
      >
        {{ $t('login.form.titleResetFinished') }}
      </h2>
      <!-- Description -->
      <p
        v-html="$t('login.form.descriptionResetFinished', { contactEmail })"
        class="text-body1 q-my-none q-mt-sm"
        data-cy="form-reset-finished-description"
      ></p>
      <!-- Prompt: wrong email -->
      <p
        v-html="$t('login.form.promptWrongEmail')"
        class="text-body1 q-my-none q-mt-lg"
        data-cy="form-reset-finished-prompt"
      ></p>
      <!-- Button: new password -->
      <q-btn
        unelevated
        rounded
        outline
        class="full-width q-mt-lg"
        type="submit"
        color="white"
        text-color="white"
        :label="$t('login.form.submitNewPassword')"
        @click="setFormState(LoginFormState.passwordReset)"
        data-cy="form-reset-finished-submit"
      />
    </div>
  </div>
</template>
