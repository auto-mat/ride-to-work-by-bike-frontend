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
 * - `LoginButtons`: Component to render third-party authentication buttons.
 * - `BannerAppButtons`: Component to render download links for RTWBB app.
 *
 * @example
 * <form-login />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6274%3A28441&mode=dev)
 */

// libraries
import { defineComponent, ref, reactive } from 'vue';

// components
import LoginButtons from './LoginButtons.vue';
import BannerAppButtons from './BannerAppButtons.vue';

// types
import { ConfigGlobal } from './types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);

export default defineComponent({
  name: 'FormLogin',
  components: {
    LoginButtons,
    BannerAppButtons,
  },
  emits: ['formSubmit'],
  setup() {
    const formLogin = reactive({
      email: '',
      password: '',
    });

    const formPasswordReset = reactive({
      email: '',
    });

    const isPassword = ref(true);
    const formState = ref<'login' | 'password-reset' | 'reset-finished'>(
      'login',
    );

    const backgroundColor = rideToWorkByBikeConfig.colorWhiteOpacity;
    const contactEmail = rideToWorkByBikeConfig.contactEmail;

    const isValid = (val: string): boolean => val?.length > 0;

    const isEmail = (value: string): boolean => {
      /**
       * Match 99% of valid email addresses and will not pass validation
       * for email addresses that have, for instance
       * - Dots in the beginning
       * - Multiple dots at the end
       * But at the same time it will allow part after @ to be IP address.
       *
       * https://uibakery.io/regex-library/email
       */
      const regex =
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
      return regex.test(value);
    };

    const onSubmitLogin = () => {
      // noop
    };

    const onSubmitPasswordReset = () => {
      // noop
    };

    const onClickFormPasswordResetBtn = (): void => {
      if (isValid(formPasswordReset.email) && isEmail(formPasswordReset.email))
        formState.value = 'reset-finished';
    };

    return {
      backgroundColor,
      contactEmail,
      formLogin,
      formPasswordReset,
      formState,
      isPassword,
      isEmail,
      isValid,
      onClickFormPasswordResetBtn,
      onSubmitLogin,
      onSubmitPasswordReset,
    };
  },
});
</script>

<template>
  <!-- State: Login -->
  <div v-if="formState === 'login'" class="text-grey-10" data-cy="form-login">
    <div class="q-my-lg">
      <h1
        class="text-h5 text-bold grey-10 q-my-none"
        data-cy="form-title-login"
      >
        {{ $t('login.form.titleLogin') }}
      </h1>
    </div>
    <!-- Form: login -->
    <q-form @submit.prevent="onSubmitLogin">
      <!-- Input: email -->
      <div data-cy="form-login-email">
        <!-- Label -->
        <label for="form-login-email" class="text-caption text-bold">
          {{ $t('login.form.labelEmail') }}
        </label>
        <!-- Input -->
        <q-input
          dense
          outlined
          v-model="formLogin.email"
          lazy-rules
          :rules="[
            (val) => isValid(val) || $t('login.form.messageEmailReqired'),
            (val) => isEmail(val) || $t('login.form.messageEmailInvalid'),
          ]"
          bg-color="grey-1"
          id="form-login-email"
          name="subject"
          class="q-mt-sm"
          data-cy="form-login-email-input"
        />
      </div>
      <!-- Input: password -->
      <div data-cy="form-login-password">
        <!-- Label -->
        <label for="form-login-password" class="text-caption text-bold">
          {{ $t('login.form.labelPassword') }}
        </label>
        <!-- Input -->
        <q-input
          dense
          outlined
          hide-bottom-space
          bg-color="grey-1"
          v-model="formLogin.password"
          id="form-login-password"
          :type="isPassword ? 'password' : 'text'"
          :rules="[
            (val) => isValid(val) || $t('login.form.messagePasswordRequired'),
          ]"
          class="q-mt-sm"
          data-cy="form-login-password-input"
        >
          <!-- Icon: show password -->
          <template v-slot:append>
            <q-icon
              color="primary"
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
            class="text-primary text-caption"
            @click.prevent="formState = 'password-reset'"
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
        class="full-width"
        type="submit"
        color="primary q-mt-lg"
        :label="$t('login.form.submitLogin')"
        data-cy="form-login-submit-login"
      />
    </q-form>
    <!-- Separator -->
    <q-separator color="grey-2" class="q-my-lg" />
    <!-- Buttons: Login with 3rd party -->
    <login-buttons />
    <!-- Link: Register -->
    <div class="q-mt-lg">
      <p>
        {{ $t('login.form.promptNoAccount') }}
        <a href="#" class="text-primary" data-cy="login-link-register">
          {{ $t('login.form.linkRegister') }} </a
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
    v-else-if="formState === 'password-reset'"
    class="text-grey-10"
    data-cy="form-password-reset"
  >
    <div class="q-my-lg">
      <q-btn
        round
        outline
        color="primary"
        size="13px"
        @click.prevent="formState = 'login'"
        data-cy="form-password-reset-button-back"
      >
        <q-icon name="arrow_back" size="24px" />
      </q-btn>
    </div>
    <div class="q-my-sm">
      <h1
        class="text-h5 text-bold grey-10 q-my-none"
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
      <div data-cy="form-password-reset-email">
        <!-- Label -->
        <label for="form-login-password-reset" class="text-caption text-bold">
          {{ $t('login.form.labelPasswordReset') }}
        </label>
        <!-- Input -->
        <q-input
          dense
          outlined
          v-model="formPasswordReset.email"
          lazy-rules
          :rules="[
            (val) =>
              isValid(val) || $t('login.form.messagePasswordResetReqired'),
            (val) => isEmail(val) || $t('login.form.messageEmailInvalid'),
          ]"
          bg-color="grey-1"
          id="form-login-password-reset"
          name="subject"
          class="q-mt-sm"
          data-cy="form-password-reset-email-input"
        />
      </div>
      <!-- Button: submit -->
      <q-btn
        unelevated
        rounded
        class="full-width q-mt-lg"
        type="submit"
        color="primary"
        :label="$t('login.form.submitPasswordReset')"
        @click="onClickFormPasswordResetBtn"
        data-cy="form-password-reset-submit"
      />
    </q-form>
  </div>
  <!-- State: Password reset finished -->
  <div
    v-else-if="formState === 'reset-finished'"
    class="text-grey-10"
    data-cy="form-reset-finished"
  >
    <div class="q-my-lg">
      <!-- Icon: Email -->
      <div class="flex">
        <div
          class="q-pa-sm round"
          :style="{ 'background-color': backgroundColor }"
          data-cy="form-reset-finished-icon-wrapper"
        >
          <q-icon
            name="mdi-email-outline"
            size="40px"
            color="primary"
            class="q-ma-xs"
            data-cy="form-reset-finished-icon"
          />
        </div>
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
        color="primary"
        :label="$t('login.form.submitNewPassword')"
        @click="formState = 'password-reset'"
        data-cy="form-reset-finished-submit"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.q-field__control) {
  border-radius: 8px;
  &:before {
    border-color: transparent;
  }
}

.round {
  border-radius: 9999px;
}
</style>
