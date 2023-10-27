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
 * @example
 * <form-login />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6274%3A28441&mode=dev)
 */

// libraries
import { defineComponent, ref, reactive } from 'vue';
import { setCssVar } from 'quasar';

// types
import type { ConfigGlobal } from './types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);
setCssVar('primary', rideToWorkByBikeConfig.colorPrimary);

export default defineComponent({
  name: 'FormLogin',
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
    const formState = ref<'login' | 'password-reset'>('login');

    const isValid = (val: string): boolean => val?.length > 0;

    const onSubmitLogin = () => {
      // noop
    };

    const onSubmitPasswordReset = () => {
      // noop
    };

    return {
      formLogin,
      formPasswordReset,
      formState,
      isPassword,
      isValid,
      onSubmitLogin,
      onSubmitPasswordReset,
    };
  },
});
</script>

<template>
  <div v-if="formState === 'login'">
    <div class="q-my-lg">
      <h1 class="text-h5 text-bold q-my-none" data-cy="login-page-title">
        {{ $t('login.titleLogin') }}
      </h1>
    </div>
    <!-- Form: login -->
    <q-form @submit.prevent="onSubmitLogin">
      <!-- Input: email -->
      <div data-cy="form-login-email">
        <!-- Label -->
        <label for="form-login-email" class="text-caption text-bold">
          {{ $t('login.form.email') }}
        </label>
        <!-- Input -->
        <q-input
          dense
          outlined
          v-model="formLogin.email"
          :rules="[(val) => isValid(val) || $t('login.form.emailReqired')]"
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
          {{ $t('login.form.password') }}
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
          :rules="[(val) => isValid(val) || $t('login.form.passwordRequired')]"
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
            data-cy="form-login-forgotten-password"
            @click.prevent="formState = 'password-reset'"
            >{{ $t('login.form.forgottenPassword') }}</a
          >
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
  </div>
  <div v-else-if="formState === 'password-reset'">
    <div class="q-my-lg">
      <q-btn
        round
        outline
        color="primary"
        size="13px"
        @click.prevent="formState = 'login'"
      >
        <q-icon name="arrow_back" size="24px" />
      </q-btn>
    </div>
    <div class="q-my-sm">
      <h1 class="text-h5 text-bold q-my-none" data-cy="login-page-title">
        {{ $t('login.titlePasswordReset') }}
      </h1>
    </div>
    <div class="q-mt-sm q-mb-lg">
      <p>{{ $t('login.descriptionPasswordReset') }}</p>
    </div>
    <!-- Form: password reset -->
    <q-form @submit.prevent="onSubmitPasswordReset">
      <!-- Input: email -->
      <div data-cy="form-login-email">
        <!-- Label -->
        <label for="form-login-email" class="text-caption text-bold">
          {{ $t('login.form.emailPasswordReset') }}
        </label>
        <!-- Input -->
        <q-input
          dense
          outlined
          v-model="formPasswordReset.email"
          :rules="[
            (val) => isValid(val) || $t('login.form.emailPasswordResetReqired'),
          ]"
          bg-color="grey-1"
          id="form-login-email"
          name="subject"
          class="q-mt-sm"
          data-cy="form-login-email-input"
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
        data-cy="form-login-submit-password-reset"
      />
    </q-form>
  </div>
</template>

<style scoped lang="scss">
:deep(.q-field__control) {
  border-radius: 8px;
  &:before {
    border-color: transparent;
  }
}
</style>
