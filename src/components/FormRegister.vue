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
 *
 * @example
 * <FormRegister />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25412&mode=dev)
 */

// libraries
import { defineComponent, ref, reactive } from 'vue';

// composables
import { useValidation } from '../composables/useValidation';

export default defineComponent({
  name: 'FormRegister',
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

    return {
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
          lazy-rules
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
          lazy-rules
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
