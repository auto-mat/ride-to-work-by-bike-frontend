<script lang="ts">
/**
 * ResetPassword Component
 *
 * @description
 * Renders a form that allows users to reset their password after clicking
 * the reset password link from their email.
 *
 * @example
 * <reset-password />
 */

// libraries
import { colors, Notify } from 'quasar';
import { defineComponent, inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// composables
import { i18n } from '../../boot/i18n';
import { useValidation } from '../../composables/useValidation';
import { useApiPostResetPasswordConfirm } from '../../composables/useApiPostResetPasswordConfirm';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { routesConf } from '../../router/routes_conf';

// enums
import { LoginFormState } from '../../stores/login';

// store
import { useLoginStore } from '../../stores/login';

// types
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'ResetPassword',

  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const loginStore = useLoginStore();
    const router = useRouter();
    const route = useRoute();
    const token = route.query.token;
    const uid = route.query.uid;

    if (typeof token !== 'string' || typeof uid !== 'string') {
      logger?.debug(
        `Reset password token <${token}> or uid <${uid}> is not a string.` +
          ` Redirect to login page <${routesConf['login']['path']}>.`,
      );
      router.push(routesConf['login']['path']);
    }

    const password1 = ref('');
    const password2 = ref('');
    const isPassword = ref(true);
    const isPasswordConfirm = ref(true);

    const { isFilled, isIdentical, isStrongPassword } = useValidation();
    const { isLoading, resetPasswordConfirm } =
      useApiPostResetPasswordConfirm(logger);

    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const whiteOpacity = changeAlpha(
      getPaletteColor('white'),
      rideToWorkByBikeConfig.colorWhiteBackgroundOpacity,
    );

    /**
     * Submit reset password and handles response
     * If response is successful, redirects to login page
     * and sets login form state to `login`.
     * @returns {Promise<void>}
     */
    const onSubmitResetPassword = async (): Promise<void> => {
      // reset password
      const response = await resetPasswordConfirm({
        new_password1: password1.value,
        new_password2: password2.value,
        uid: uid as string,
        token: token as string,
      });
      // show success message
      if (response && response.detail) {
        Notify.create({
          message: response.detail,
          color: 'positive',
        });
      } else if (response) {
        // fallback message
        Notify.create({
          message: i18n.global.t('resetPasswordConfirm.messageSuccess'),
          color: 'negative',
        });
      }
      if (response) {
        // reset form
        password1.value = '';
        password2.value = '';
        logger?.debug(
          `Reset form field password1 <${password1.value}>` +
            ` and password2 <${password2.value}>).`,
        );
        // redirect to login page
        loginStore.setLoginFormState(LoginFormState.login);
        logger?.debug(
          `Set login form state store value to <${loginStore.getLoginFormState}>.`,
        );
        logger?.debug(
          `Redirect to login page <${routesConf['login']['path']}>.`,
        );
        router.push(routesConf['login']['path']);
      }
    };

    return {
      isFilled,
      isIdentical,
      isStrongPassword,
      isPassword,
      isPasswordConfirm,
      password1,
      password2,
      whiteOpacity,
      onSubmitResetPassword,
      isLoading,
    };
  },
});
</script>

<template>
  <div class="bg-primary text-white" data-cy="reset-password">
    <!-- Graphics -->
    <div class="q-mb-lg" data-cy="reset-password-graphics">
      <q-avatar
        size="64px"
        :style="{ backgroundColor: whiteOpacity, color: 'white' }"
        data-cy="reset-password-avatar"
      >
        <!-- Icon -->
        <q-icon
          size="40px"
          color="white"
          name="svguse:icons/reset_password/icons.svg#lock"
          data-cy="reset-password-icon"
        />
      </q-avatar>
    </div>
    <!-- Heading -->
    <div class="q-mb-lg">
      <h1 class="text-h5 text-bold q-my-none" data-cy="reset-password-title">
        {{ $t('register.form.titleResetPassword') }}
      </h1>
    </div>
    <!-- Text -->
    <div data-cy="reset-password-text" class="q-mb-lg">
      {{ $t('register.form.textResetPassword') }}
    </div>
    <!-- Form: register -->
    <q-form @submit.prevent="onSubmitResetPassword">
      <!-- Input: password -->
      <div data-cy="form-reset-password">
        <!-- Label -->
        <label for="form-reset-password" class="text-caption text-bold">
          {{ $t('register.form.labelPassword') }}
        </label>
        <!-- Input -->
        <q-input
          dark
          dense
          outlined
          hide-bottom-space
          color="white"
          bg-color="transparent"
          v-model="password1"
          id="form-reset-password"
          :hint="$t('register.form.hintPassword')"
          :type="isPassword ? 'password' : 'text'"
          :rules="[
            (val) =>
              isFilled(val) || $t('register.form.messagePasswordRequired'),
            (val) =>
              isStrongPassword(val) ||
              $t('register.form.messagePasswordStrong'),
          ]"
          lazy-rules
          class="q-mt-sm"
          data-cy="form-reset-password-input"
        >
          <!-- Icon: show password -->
          <template v-slot:append>
            <q-icon
              color="white"
              :name="isPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              size="18px"
              @click="isPassword = !isPassword"
              data-cy="form-reset-password-icon"
            />
          </template>
        </q-input>
      </div>
      <!-- Input: password confirm -->
      <div class="q-mt-md" data-cy="form-reset-password-confirm">
        <!-- Label -->
        <label for="form-reset-password-confirm" class="text-caption text-bold">
          {{ $t('register.form.labelPasswordConfirm') }}
        </label>
        <!-- Input -->
        <q-input
          dark
          dense
          outlined
          hide-bottom-space
          color="white"
          bg-color="transparent"
          v-model="password2"
          id="form-reset-password-confirm"
          :type="isPasswordConfirm ? 'password' : 'text'"
          :rules="[
            (val) =>
              isFilled(val) ||
              $t('register.form.messagePasswordConfirmRequired'),
            (val) =>
              isIdentical(val, password1) ||
              $t('register.form.messagePasswordConfirmNotMatch'),
          ]"
          lazy-rules
          class="q-mt-sm"
          data-cy="form-reset-password-confirm-input"
        >
          <!-- Icon: show password -->
          <template v-slot:append>
            <q-icon
              color="white"
              :name="isPasswordConfirm ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              size="18px"
              @click="isPasswordConfirm = !isPasswordConfirm"
              data-cy="form-reset-password-confirm-icon"
            />
          </template>
        </q-input>
      </div>
      <!-- Button: submit -->
      <q-btn
        unelevated
        rounded
        class="full-width"
        type="submit"
        color="secondary q-mt-lg"
        text-color="primary"
        :loading="isLoading"
        :label="$t('register.form.submitResetPassword')"
        data-cy="form-reset-password-submit"
      />
    </q-form>
  </div>
</template>
