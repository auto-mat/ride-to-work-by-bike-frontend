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
 * @props
 * - `useFormFieldValidationErrorCssClass` (boolean, optional): Use custom email form field
 *                                                              validation error CSS class
 *                                                              Defaults to `false`.
 * @events
 * - `formSubmit`: Emitted on form submit.
 *
 * @slots
 *
 * @components
 * - `FormFieldEmail`: Component to render email input.
 * - `LoginRegisterButtons`: Component to render third-party authentication
 * buttons.
 *
 * @example
 * <form-register />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25412&mode=dev)
 */

// libraries
import { colors } from 'quasar';
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  ref,
  reactive,
} from 'vue';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// composables
import { useValidation } from '../../composables/useValidation';

// components
import FormFieldEmail from '../global/FormFieldEmail.vue';
import LoginRegisterButtons from '../global/LoginRegisterButtons.vue';
import ShowCurrentDatetime from '../debug/ShowCurrentDatetime.vue';

// types
import type { Logger } from '../types/Logger';

// enums
import { PhaseType } from '../types/Challenge';

// stores
import { useChallengeStore } from '../../stores/challenge';
import { useRegisterStore } from '../../stores/register';

import { i18n } from '../../boot/i18n';
import { defaultLocale } from '../../i18n/def_locale';

import { formFieldCustomValidationErrCssClass } from '../../utils';
import { getApiBaseUrlWithLang } from '../../utils/get_api_base_url_with_lang';

export default defineComponent({
  name: 'FormRegister',
  props: {
    useFormFieldValidationErrorCssClass: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {
    FormFieldEmail,
    LoginRegisterButtons,
    ShowCurrentDatetime,
  },
  emits: ['formSubmit'],
  setup(props) {
    const logger = inject('vuejs3-logger') as Logger | null;
    const defaultFormRegisterValue = '';
    const formRegister = reactive({
      email: defaultFormRegisterValue,
      password1: defaultFormRegisterValue,
      password2: defaultFormRegisterValue,
    });

    const registerStore = useRegisterStore();
    const challengeStore = useChallengeStore();
    const isActiveChallenge = computed((): boolean =>
      challengeStore.getIsChallengeInPhase(PhaseType.competition),
    );
    const isPassword = ref<boolean>(true);
    const isPasswordConfirm = ref<boolean>(true);
    const isPrivacyConsent = ref<boolean>(false);
    const isNewsletterSubscription = ref<boolean>(false);

    const { isEmail, isFilled, isIdentical, isStrongPassword } =
      useValidation();

    const onSubmitRegister = async (): Promise<void> => {
      // fields are already validated in the QForm
      await registerStore.register(formRegister.email, formRegister.password1);
    };

    const onReset = (): void => {
      formRegister.email = defaultFormRegisterValue;
      formRegister.password1 = defaultFormRegisterValue;
      formRegister.password2 = defaultFormRegisterValue;
    };

    const { getPaletteColor, changeAlpha } = colors;
    const whiteOpacity = changeAlpha(
      getPaletteColor('white'),
      rideToWorkByBikeConfig.colorWhiteBackgroundOpacity,
    );

    onMounted(() => {
      challengeStore.loadPhaseSet();
    });

    const passwordFormFieldCssClasses = {
      'q-mt-sm': true,
    };
    const dataPrivacyPolicyFormFieldCssClasses = {};
    if (props.useFormFieldValidationErrorCssClass) {
      passwordFormFieldCssClasses[formFieldCustomValidationErrCssClass] = true;
      dataPrivacyPolicyFormFieldCssClasses[
        formFieldCustomValidationErrCssClass
      ] = true;
    }

    const urlAppDataPrivacyPolicy = computed(() => {
      return getApiBaseUrlWithLang(
        logger,
        rideToWorkByBikeConfig.urlAppDataPrivacyPolicy,
        defaultLocale,
        i18n,
      );
    });

    return {
      whiteOpacity,
      formRegister,
      isActiveChallenge,
      isPassword,
      isPasswordConfirm,
      isPrivacyConsent,
      isNewsletterSubscription,
      isEmail,
      isFilled,
      isIdentical,
      isStrongPassword,
      onSubmitRegister,
      onReset,
      passwordFormFieldCssClasses,
      dataPrivacyPolicyFormFieldCssClasses,
      props,
      urlAppDataPrivacyPolicy,
    };
  },
});
</script>

<template>
  <div class="bg-primary text-white" data-cy="form-register">
    <!-- Show current debug date time message during Cypress tests required
         to indentify if this campaign competition phase is active/inactive
    -->
    <show-current-datetime></show-current-datetime>
    <!-- Heading -->
    <div class="q-mb-lg" data-cy="form-register-form">
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
        :useFormFieldValidationErrorCssClass="
          props.useFormFieldValidationErrorCssClass
        "
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
          v-model="formRegister.password1"
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
          :class="passwordFormFieldCssClasses"
          data-cy="form-register-password-input"
        >
          <!-- Icon: show password -->
          <template v-slot:append>
            <q-icon
              color="white"
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
          v-model="formRegister.password2"
          id="form-register-password"
          :type="isPasswordConfirm ? 'password' : 'text'"
          :rules="[
            (val) =>
              isFilled(val) ||
              $t('register.form.messagePasswordConfirmRequired'),
            (val) =>
              isIdentical(val, formRegister.password1) ||
              $t('register.form.messagePasswordConfirmNotMatch'),
          ]"
          lazy-rules
          :class="passwordFormFieldCssClasses"
          data-cy="form-register-password-confirm-input"
        >
          <!-- Icon: show password -->
          <template v-slot:append>
            <q-icon
              color="white"
              :name="isPasswordConfirm ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              size="18px"
              @click="isPasswordConfirm = !isPasswordConfirm"
              data-cy="form-register-password-confirm-icon"
            />
          </template>
        </q-input>
      </div>
      <!-- Section: checkboxes -->
      <div>
        <div class="q-mt-lg">
          <!-- Input: Privacy policy -->
          <q-field
            dense
            borderless
            hide-bottom-space
            :model-value="isPrivacyConsent"
            :rules="[
              (val) =>
                !!val || $t('register.form.messagePrivacyConsentRequired'),
            ]"
            data-cy="form-register-privacy-consent"
            :class="dataPrivacyPolicyFormFieldCssClasses"
          >
            <q-checkbox
              dense
              id="form-register-privacy-consent"
              v-model="isPrivacyConsent"
              color="primary"
              :true-value="true"
              :false-value="false"
              rules="required"
              class="text-white"
              style="align-items: flex-start"
              data-cy="form-register-privacy-consent-input"
            >
              <!-- Link: consent -->
              <span>
                {{ $t('register.form.labelPrivacyConsent1') }}
                <!-- TODO: Link to privacy policy page -->
                <a
                  :href="urlAppDataPrivacyPolicy"
                  target="_blank"
                  class="text-white"
                  @click.stop
                  data-cy="form-register-privacy-consent-link"
                  >{{ $t('register.form.labelPrivacyConsentLink') }}</a
                >.
              </span>
            </q-checkbox>
          </q-field>
        </div>
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
      <q-separator
        :style="{ backgroundColor: whiteOpacity }"
        class="q-my-lg"
        data-cy="form-register-separator"
      />
      <!-- Buttons: Register with 3rd party -->
      <login-register-buttons variant="register" />
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
