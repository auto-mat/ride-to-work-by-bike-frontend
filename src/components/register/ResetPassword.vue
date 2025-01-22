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
import { colors } from 'quasar';
import { defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// composables
import { useValidation } from '../../composables/useValidation';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { routesConf } from '../../router/routes_conf';

export default defineComponent({
  name: 'ResetPassword',

  setup() {
    const router = useRouter();
    const route = useRoute();
    const key = route.query.key;
    const email = route.query.email;

    if (typeof key !== 'string' || typeof email !== 'string') {
      router.push(routesConf['login']['path']);
    }

    const password1 = ref('');
    const password2 = ref('');
    const isPassword = ref(true);
    const isPasswordConfirm = ref(true);

    const { isFilled, isIdentical, isStrongPassword } = useValidation();

    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const whiteOpacity = changeAlpha(
      getPaletteColor('white'),
      rideToWorkByBikeConfig.colorWhiteBackgroundOpacity,
    );

    const onSubmitResetPassword = () => {
      console.log('onSubmitResetPassword');
    };

    return {
      key,
      email,
      isFilled,
      isIdentical,
      isStrongPassword,
      isPassword,
      isPasswordConfirm,
      password1,
      password2,
      whiteOpacity,
      onSubmitResetPassword,
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
          name="svguse:icons/password/icons.svg#lock"
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
    <div
      data-cy="reset-password-text"
      class="q-mb-lg"
      v-html="$t('register.form.textResetPassword', { email })"
    />
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
        :label="$t('register.form.submitResetPassword')"
        data-cy="form-reset-password-submit"
      />
    </q-form>
  </div>
</template>
