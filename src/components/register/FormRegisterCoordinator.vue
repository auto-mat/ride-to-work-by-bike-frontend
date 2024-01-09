<script lang="ts">
/**
 * FormRegisterCoordinator Component
 *
 * The `FormRegisterCoordinator` is used to allow coordinators to register.
 *
 * @description * Use this component to display registration form.
 *
 * Note: This component is commonly used in `RegisterCoordinatorPage`.
 *
 * @components
 * - `FormFieldEmail`: Component to render email input.
 *
 * @example
 * <form-register-coordinator />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25476&mode=dev)
 */

// libraries
import { defineComponent, reactive, ref } from 'vue';

// composables
import { useValidation } from '../../composables/useValidation';

// components
import FormFieldEmail from './../global/FormFieldEmail.vue';
import FormFieldTextRequired from './../global/FormFieldTextRequired.vue';
import FormFieldPhone from './../global/FormFieldPhone.vue';

export default defineComponent({
  name: 'FormRegisterCoordinator',
  components: {
    FormFieldEmail,
    FormFieldTextRequired,
    FormFieldPhone,
  },
  setup() {
    const formRegisterCoordinator = reactive({
      firstName: '',
      lastName: '',
      company: [],
      jobTitle: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirm: '',
      responsibility: false,
      terms: false,
    });

    const stringOptions = ['Company 1', 'Company 2'];
    const options = ref(null);

    const isPassword = ref(true);
    const isPasswordConfirm = ref(true);

    const { isEmail, isFilled, isIdentical, isPhone, isStrongPassword } =
      useValidation();

    // Quasar types are not implemented yet so we provide custom typing
    // for update function.
    // https://github.com/quasarframework/quasar/issues/8914#issuecomment-1313783889
    const onFilter = (val: string, update: (fn: () => void) => void): void => {
      if (val === '') {
        update(() => {
          options.value = stringOptions;
        });
        return;
      }
      // Filtering options based on text typing by the user
      update(() => {
        const valLowerCase = val.toLowerCase();
        options.value = stringOptions.filter(
          (v) => v.toLowerCase().indexOf(valLowerCase) > -1,
        );
      });
    };

    const onSubmit = (): void => {
      // noop
    };

    const onReset = (): void => {
      // noop
    };

    return {
      formRegisterCoordinator,
      isPassword,
      isPasswordConfirm,
      options,
      isEmail,
      isFilled,
      isIdentical,
      isPhone,
      isStrongPassword,
      onFilter,
      onReset,
      onSubmit,
    };
  },
});
</script>

<template>
  <div>
    <!-- Form: register coordinator -->
    <q-form
      autofocus
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md text-grey-10"
    >
      <!-- Heading -->
      <h2
        class="q-mt-0 q-mb-sm text-body1 text-weight-bold"
        data-cy="register-coordinator-form-title"
      >
        {{ $t('register.coordinator.form.title') }}
      </h2>
      <div class="q-mt-lg">
        <div class="row q-col-gutter-md q-mb-sm">
          <!-- Input: first name -->
          <form-field-text-required
            v-model="formRegisterCoordinator.firstName"
            name="form-first-name"
            label="form.labelFirstName"
            autocomplete="given-name"
            class="col-12 col-sm-6"
            data-cy="form-register-coordinator-first-name"
          />
          <!-- Input: last name -->
          <form-field-text-required
            v-model="formRegisterCoordinator.lastName"
            name="form-last-name"
            label="form.labelLastName"
            autocomplete="family-name"
            class="col-12 col-sm-6"
            data-cy="form-register-coordinator-last-name"
          />
          <!-- Input: company -->
          <!-- TODO: add option to input new company -->
          <div class="col-12" data-cy="form-register-coordinator-company">
            <!-- Label -->
            <label
              for="form-register-coordinator-company"
              class="text-caption text-bold"
            >
              {{ $t('register.coordinator.form.labelCompany') }}
            </label>
            <!-- Input -->
            <q-select
              dense
              outlined
              use-input
              v-model="formRegisterCoordinator.company"
              :options="options"
              lazy-rules
              :rules="[
                (val) =>
                  isFilled(val) ||
                  $t('register.coordinator.form.messageFieldRequired', {
                    fieldName: $t(
                      'register.coordinator.form.labelCompanyShort',
                    ),
                  }),
              ]"
              @filter="onFilter"
              class="q-mt-sm"
              id="form-register-coordinator-company"
              name="company"
              data-cy="form-register-coordinator-company-input"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    {{ $t('register.coordinator.form.messageNoCompany') }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Input: job title -->
          <form-field-text-required
            v-model="formRegisterCoordinator.lastName"
            name="form-job-title"
            label="form.labelJobTitle"
            label-short="form.labelJobTitleShort"
            class="col-12"
            data-cy="form-register-coordinator-job-title"
          />
          <!-- Input: email -->
          <form-field-email
            v-model="formRegisterCoordinator.email"
            data-cy="form-register-coordinator-email"
          />
          <!-- Input: phone-->
          <form-field-phone
            v-model="formRegisterCoordinator.phone"
            data-cy="form-register-coordinator-phone"
          />
          <!-- Input: password -->
          <div
            class="col-12 col-sm-6"
            data-cy="form-register-coordinator-password"
          >
            <!-- Label -->
            <label
              for="form-register-coordinator-password"
              class="text-caption text-bold"
            >
              {{ $t('register.coordinator.form.labelPassword') }}
            </label>
            <!-- Input -->
            <q-input
              dense
              outlined
              hide-bottom-space
              v-model="formRegisterCoordinator.password"
              id="form-register-coordinator-password"
              :hint="$t('register.coordinator.form.hintPassword')"
              :type="isPassword ? 'password' : 'text'"
              :rules="[
                (val) =>
                  isFilled(val) ||
                  $t('register.coordinator.form.messageFieldRequired', {
                    fieldName: $t('register.coordinator.form.labelPassword'),
                  }),
                (val) =>
                  isStrongPassword(val) ||
                  $t('register.coordinator.form.messagePasswordStrong'),
              ]"
              lazy-rules
              class="q-mt-sm"
              data-cy="form-register-coordinator-password-input"
            >
              <!-- Icon: show password -->
              <template v-slot:append>
                <q-icon
                  color="primary"
                  :name="isPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  size="18px"
                  @click="isPassword = !isPassword"
                  data-cy="form-register-coordinator-password-icon"
                />
              </template>
            </q-input>
          </div>
          <!-- Input: password confirm -->
          <div
            class="col-12 col-sm-6"
            data-cy="form-register-coordinator-password-confirm"
          >
            <!-- Label -->
            <label
              for="form-register-coordinator-password-confirm"
              class="text-caption text-bold"
            >
              {{ $t('register.coordinator.form.labelPasswordConfirm') }}
            </label>
            <!-- Input -->
            <q-input
              dense
              outlined
              hide-bottom-space
              v-model="formRegisterCoordinator.passwordConfirm"
              id="form-register-coordinator-password"
              :type="isPasswordConfirm ? 'password' : 'text'"
              :rules="[
                (val) =>
                  isFilled(val) ||
                  $t('register.coordinator.form.messageFieldRequired', {
                    fieldName: $t(
                      'register.coordinator.form.labelPasswordConfirm',
                    ),
                  }),
                (val) =>
                  isIdentical(val, formRegisterCoordinator.password) ||
                  $t(
                    'register.coordinator.form.messagePasswordConfirmNotMatch',
                  ),
              ]"
              lazy-rules
              class="q-mt-sm"
              data-cy="form-register-coordinator-password-confirm-input"
            >
              <!-- Icon: show password -->
              <template v-slot:append>
                <q-icon
                  color="primary"
                  :name="isPasswordConfirm ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  size="18px"
                  @click="isPasswordConfirm = !isPasswordConfirm"
                  data-cy="form-register-coordinator-password-confirm-icon"
                />
              </template>
            </q-input>
          </div>
          <!-- Input: confirm responsibility -->
          <div
            class="col-12"
            data-cy="form-register-coordinator-responsibility"
          >
            <q-field
              dense
              borderless
              hide-bottom-space
              :model-value="formRegisterCoordinator.responsibility"
              :rules="[
                (val) =>
                  !!val ||
                  $t('register.coordinator.form.messageResponsibilityRequired'),
              ]"
            >
              <q-checkbox
                v-model="formRegisterCoordinator.responsibility"
                color="primary"
                :true-value="true"
                :false-value="false"
                style="margin: 0 -10px"
                class="text-grey-10"
              >
                <span>{{
                  $t('register.coordinator.form.labelResponsibility')
                }}</span>
              </q-checkbox>
            </q-field>
          </div>
          <!-- Input: confirm consent -->
          <div class="col-12" data-cy="form-register-coordinator-terms">
            <q-field
              dense
              borderless
              hide-bottom-space
              :model-value="formRegisterCoordinator.terms"
              :rules="[
                (val) =>
                  !!val || $t('register.coordinator.form.messageTermsRequired'),
              ]"
            >
              <q-checkbox
                id="form-register-coordinator-terms"
                v-model="formRegisterCoordinator.terms"
                color="primary"
                :true-value="true"
                :false-value="false"
                rules="required"
                style="margin: -10px"
                class="text-grey-10"
              >
                <!-- Default slot: label -->
                <span>
                  {{ $t('register.coordinator.form.labelTerms') }}
                  <!-- Link: terms -->
                  <!-- TODO: Link to terms page -->
                  <a href="#" target="_blank" class="text-primary">{{
                    $t('register.coordinator.form.linkTerms')
                  }}</a
                  >.
                </span>
              </q-checkbox>
            </q-field>
          </div>
        </div>
        <!-- Button: submit -->
        <div class="flex justify-end q-mt-lg">
          <q-btn
            rounded
            unelevated
            type="submit"
            color="primary"
            :label="$t('register.coordinator.form.buttonSubmit')"
            data-cy="form-register-coordinator-submit"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<style scoped lang="scss">
:deep(.q-field__control) {
  border-radius: 8px;
}
:deep(.q-checkbox__bg) {
  border: 1px solid $grey-6;
  border-radius: 4px;
}
:deep(.q-checkbox__svg) {
  padding: 3px;
}
</style>
