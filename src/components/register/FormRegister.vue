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
import { defineComponent, inject, ref, reactive, computed } from 'vue';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useApi } from '../../composables/useApi';
import { useQuasar } from 'quasar';

// composables
import { i18n } from '../../boot/i18n';
import { useValidation } from '../../composables/useValidation';

// components
import FormFieldEmail from '../global/FormFieldEmail.vue';
import LoginRegisterButtons from '../global/LoginRegisterButtons.vue';

// stores
import { useGlobalStore } from '../../stores/global';
import { useRegisterStore } from '../../stores/register';

// types
import type { Logger } from '../types/Logger';

interface RegisterResponse {
  email: string;
}

export default defineComponent({
  name: 'FormRegister',
  components: {
    FormFieldEmail,
    LoginRegisterButtons,
  },
  emits: ['formSubmit'],
  setup() {
    const formRegister = reactive({
      email: '',
      password: '',
      passwordConfirm: '',
    });

    const registerStore = useRegisterStore();
    const globalStore = useGlobalStore();
    const logger = inject('vue3-logger') as Logger;
    const isActiveChallenge = computed(() => globalStore.getIsActiveChallenge);
    const isPassword = ref(true);
    const isPasswordConfirm = ref(true);

    const { isEmail, isFilled, isIdentical, isStrongPassword } =
      useValidation();

    const { apiFetch } = useApi();
    const $q = useQuasar();

    const onSubmitRegister = async (): Promise<void> => {
      // fields are already validated in the QForm
      try {
        const response = await apiFetch<RegisterResponse>({
          endpoint: rideToWorkByBikeConfig.urlApiRegister,
          method: 'post',
          payload: {
            email: formRegister.email,
            password: formRegister.password,
          },
          translationKey: 'register',
          logger: logger as Logger,
        });

        if (response.data?.email) {
          $q.notify({
            color: 'positive',
            message: i18n.global.t('register.form.messageSuccess', {
              email: response.data.email,
            }),
          });
          // set email in store
          registerStore.setEmail(response.data.email);
          // set awaitingConfirmation in store
          registerStore.setAwaitingConfirmation(true);
        }
      } catch (error) {
        logger.debug(JSON.stringify(error));
        $q.notify({
          color: 'negative',
          message: i18n.global.t('register.form.messageError'),
        });
      }
    };

    const onReset = (): void => {
      formRegister.email = '';
      formRegister.password = '';
      formRegister.passwordConfirm = '';
    };

    const backgroundColor = rideToWorkByBikeConfig.colorWhiteOpacity;
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    return {
      backgroundColor,
      borderRadius,
      formRegister,
      isActiveChallenge,
      isPassword,
      isPasswordConfirm,
      isEmail,
      isFilled,
      isIdentical,
      isStrongPassword,
      onSubmitRegister,
      onReset,
    };
  },
});
</script>

<template>
  <div class="bg-primary text-white" data-cy="form-register">
    <!-- Heading -->
    <div class="q-mb-lg">
      <h1 class="text-h5 text-bold q-my-none" data-cy="form-register-title">
        {{ $t('register.form.titleRegister') }}
      </h1>
      <p
        v-if="!isActiveChallenge"
        class="q-mt-md q-mb-none"
        data-cy="form-register-text-no-active-challenge"
      >
        {{ $t('register.form.textNoActiveChallenge') }}
      </p>
    </div>
    <!-- Form: register -->
    <q-form @submit.prevent="onSubmitRegister" @reset="onReset">
      <!-- Input: email -->
      <form-field-email
        dark
        v-model="formRegister.email"
        bg-color="transparent"
        color="white"
        data-cy="form-register-email"
      />
      <!-- Input: password -->
      <div data-cy="form-register-password">
        <!-- Label -->
        <label for="form-register-password" class="text-caption text-bold">
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
          dark
          dense
          outlined
          hide-bottom-space
          color="white"
          bg-color="transparent"
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
        color="secondary q-mt-lg"
        text-color="primary"
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
