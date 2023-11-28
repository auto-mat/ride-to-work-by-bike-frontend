<script lang="ts">
/**
 * FormRegister Component
 *
 * The `FormRegister` component renders registration form.
 *
 * @description * Use this component to render registration form. Including
 * third party registrators and the link to registration of coordinators.
 *
 * Note: This component is commonly used in `LoginPage`.
 *
 * @events
 * - `formSubmit`: Emitted on form submit.
 *
 * @slots
 *
 * @components
 * - `LoginRegisterButtons`: Component to render third-party authentication
 * buttons.
 *
 * @example
 * <form-register />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25412&mode=dev)
 */

// libraries
import { defineComponent, ref, reactive } from 'vue';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// composables
import { useValidation } from '../../composables/useValidation';

// components
import LoginRegisterButtons from '../global/LoginRegisterButtons.vue';

export default defineComponent({
  name: 'FormRegister',
  components: {
    LoginRegisterButtons,
  },
  emits: ['formSubmit'],
  setup() {
    const formRegister = reactive({
      email: '',
      password: '',
      passwordConfirm: '',
    });

    const isPassword = ref(true);
    const isPasswordConfirm = ref(true);

    const { isEmail, isFilled, isIdentical, isStrongPassword } =
      useValidation();

    const onSubmitRegister = () => {
      // noop
    };

    const backgroundColor = rideToWorkByBikeConfig.colorWhiteOpacity;
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    return {
      backgroundColor,
      borderRadius,
      formRegister,
      isPassword,
      isPasswordConfirm,
      isEmail,
      isFilled,
      isIdentical,
      isStrongPassword,
      onSubmitRegister,
    };
  },
});
</script>

<template>
  <div class="text-grey-10" data-cy="form-register">
    <!-- Heading -->
    <div class="q-my-lg">
      <h1
        class="text-h5 text-grey-10 text-bold q-my-none"
        data-cy="form-register-title"
      >
        {{ $t('register.form.titleRegister') }}
      </h1>
    </div>
    <!-- Form: register -->
    <q-form @submit.prevent="onSubmitRegister">
      <!-- Input: email -->
      <div data-cy="form-register-email">
        <!-- Label -->
        <label for="form-register-email" class="text-caption text-bold">
          {{ $t('register.form.labelEmail') }}
        </label>
        <!-- Input -->
        <q-input
          dense
          outlined
          v-model="formRegister.email"
          lazy-rules
          :rules="[
            (val) => isFilled(val) || $t('register.form.messageEmailReqired'),
            (val) => isEmail(val) || $t('register.form.messageEmailInvalid'),
          ]"
          bg-color="grey-1"
          id="form-register-email"
          name="subject"
          class="q-mt-sm"
          data-cy="form-register-email-input"
        />
      </div>
      <!-- Input: password -->
      <div data-cy="form-register-password">
        <!-- Label -->
        <label for="form-register-password" class="text-caption text-bold">
          {{ $t('register.form.labelPassword') }}
        </label>
        <!-- Input -->
        <q-input
          dense
          outlined
          hide-bottom-space
          bg-color="grey-1"
          v-model="formRegister.password"
          id="form-register-password"
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
          data-cy="form-register-password-input"
        >
          <!-- Icon: show password -->
          <template v-slot:append>
            <q-icon
              color="primary"
              :name="isPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              size="18px"
              @click="isPassword = !isPassword"
              data-cy="form-register-password-icon"
            />
          </template>
        </q-input>
      </div>
      <!-- Input: password confirm -->
      <div class="q-mt-md" data-cy="form-register-password-confirm">
        <!-- Label -->
        <label
          for="form-register-password-confirm"
          class="text-caption text-bold"
        >
          {{ $t('register.form.labelPasswordConfirm') }}
        </label>
        <!-- Input -->
        <q-input
          dense
          outlined
          hide-bottom-space
          bg-color="grey-1"
          v-model="formRegister.passwordConfirm"
          id="form-register-password"
          :type="isPasswordConfirm ? 'password' : 'text'"
          :rules="[
            (val) =>
              isFilled(val) ||
              $t('register.form.messagePasswordConfirmRequired'),
            (val) =>
              isIdentical(val, formRegister.password) ||
              $t('register.form.messagePasswordConfirmNotMatch'),
          ]"
          lazy-rules
          class="q-mt-sm"
          data-cy="form-register-password-confirm-input"
        >
          <!-- Icon: show password -->
          <template v-slot:append>
            <q-icon
              color="primary"
              :name="isPasswordConfirm ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              size="18px"
              @click="isPasswordConfirm = !isPasswordConfirm"
              data-cy="form-register-password-confirm-icon"
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
        color="primary q-mt-lg"
        :label="$t('register.form.submitRegister')"
        data-cy="form-register-submit"
      />
      <!-- Separator -->
      <q-separator color="grey-2" class="q-my-lg" />
      <!-- Buttons: Register with 3rd party -->
      <login-register-buttons variant="register" />
      <!-- Link: Register Coordinator -->
      <div class="q-mt-xl">
        <div
          class="q-pa-md text-body2 text-white"
          :style="{
            'background-color': backgroundColor,
            'border-radius': borderRadius,
          }"
          data-cy="form-register-coordinator"
        >
          <p
            class="q-mt-none q-mb-md"
            data-cy="form-register-coordinator-description"
          >
            {{ $t('register.form.hintRegisterAsCoordinator') }}
          </p>
          <p
            class="q-mt-md q-mb-none"
            data-cy="form-register-coordinator-link-wrapper"
          >
            <router-link
              :to="{ name: 'register-coordinator' }"
              class="text-white"
              data-cy="form-register-coordinator-link"
            >
              {{ $t('register.form.linkRegisterAsCoordinator') }}
            </router-link>
          </p>
        </div>
      </div>
      <!-- Link: Login -->
      <div class="q-mt-lg text-body2 text-white" data-cy="form-register-login">
        <p class="q-my-none">
          {{ $t('register.form.hintLogin') }}
          <router-link
            :to="{ name: 'login' }"
            class="text-white"
            data-cy="form-register-login-link"
          >
            {{ $t('register.form.linkLogin') }} </router-link
          >.
        </p>
      </div>
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
