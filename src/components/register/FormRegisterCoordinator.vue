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
import { defineComponent, reactive } from 'vue';

// components
import FormFieldCompany from '../global/FormFieldCompany.vue';
import FormFieldEmail from './../global/FormFieldEmail.vue';
import FormFieldTextRequired from './../global/FormFieldTextRequired.vue';
import FormFieldPassword from '../global/FormFieldPassword.vue';
import FormFieldPasswordConfirm from '../global/FormFieldPasswordConfirm.vue';
import FormFieldPhone from './../global/FormFieldPhone.vue';

export default defineComponent({
  name: 'FormRegisterCoordinator',
  components: {
    FormFieldCompany,
    FormFieldEmail,
    FormFieldTextRequired,
    FormFieldPassword,
    FormFieldPasswordConfirm,
    FormFieldPhone,
  },
  setup() {
    const formRegisterCoordinator = reactive({
      firstName: '',
      lastName: '',
      company: '',
      jobTitle: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirm: '',
      responsibility: false,
      terms: false,
    });

    const onSubmit = (): void => {
      // noop
    };

    const onReset = (): void => {
      // noop
    };

    return {
      formRegisterCoordinator,
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
          <form-field-company
            v-model="formRegisterCoordinator.company"
            class="col-12"
            data-cy="form-register-coordinator-company"
          />
          <!-- Input: job title -->
          <form-field-text-required
            v-model="formRegisterCoordinator.jobTitle"
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
          <form-field-password
            v-model="formRegisterCoordinator.password"
            class="col-12 col-sm-6"
            data-cy="form-register-coordinator-password"
          />
          <!-- Input: password confirm -->
          <form-field-password-confirm
            v-model="formRegisterCoordinator.passwordConfirm"
            :compare-value="formRegisterCoordinator.password"
            class="col-12 col-sm-6"
            data-cy="form-register-coordinator-password-confirm"
          />
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
:deep(.q-checkbox__bg) {
  border: 1px solid $grey-6;
  border-radius: 4px;
}
:deep(.q-checkbox__svg) {
  padding: 3px;
}
</style>
