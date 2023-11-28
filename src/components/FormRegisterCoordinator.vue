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
 * @events
 *
 * @slots
 * - `content`: For ... .
 *   exposed props and methods:
 *     - `state`
 *
 * @components
 *
 * @example
 * <form-register-coordinator />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25476&mode=dev)
 */

import { defineComponent, reactive, ref } from 'vue';

// composables
import { useValidation } from '../composables/useValidation';

export default defineComponent({
  name: 'FormRegisterCoordinator',
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
    });

    const isPassword = ref(true);
    const isPasswordConfirm = ref(true);

    const { isEmail, isFilled, isIdentical, isPhone, isStrongPassword } =
      useValidation();

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
      isEmail,
      isFilled,
      isIdentical,
      isPhone,
      isStrongPassword,
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
        <div class="row q-col-gutter-md">
          <!-- Input: first name -->
          <div
            class="col-12 col-sm-6"
            data-cy="form-register-coordinator-first-name"
          >
            <!-- Label -->
            <label
              for="form-register-coordinator-first-name"
              class="text-caption text-bold"
            >
              {{ $t('register.coordinator.form.labelFirstName') }}
            </label>
            <!-- Input -->
            <q-input
              dense
              outlined
              v-model="formRegisterCoordinator.firstName"
              lazy-rules
              :rules="[
                (val) =>
                  isFilled(val) ||
                  $t('register.coordinator.form.messageFieldRequired', {
                    fieldName: $t('register.coordinator.form.labelFirstName'),
                  }),
              ]"
              bg-color="grey-1"
              class="q-mt-sm"
              id="form-register-coordinator-first-name"
              name="first_name"
              data-cy="form-register-coordinator-first-name-input"
            />
          </div>
          <!-- Input: last name -->
          <div
            class="col-12 col-sm-6"
            data-cy="form-register-coordinator-last-name"
          >
            <!-- Label -->
            <label
              for="form-register-coordinator-last-name"
              class="text-caption text-bold"
            >
              {{ $t('register.coordinator.form.labelLastName') }}
            </label>
            <!-- Input -->
            <q-input
              dense
              outlined
              v-model="formRegisterCoordinator.lastName"
              lazy-rules
              :rules="[
                (val) =>
                  isFilled(val) ||
                  $t('register.coordinator.form.messageFieldRequired', {
                    fieldName: $t('register.coordinator.form.labelLastName'),
                  }),
              ]"
              bg-color="grey-1"
              class="q-mt-sm"
              id="form-register-coordinator-last-name"
              name="last_name"
              data-cy="form-register-coordinator-last-name-input"
            />
          </div>
          <!-- Input: company -->
          <div class="col-12 col-sm-6">
            <!-- TODO: Add company input (perhaps another component?) -->
          </div>
          <!-- Input: job title -->
          <div class="col-12">
            <!-- Label -->
            <label
              for="form-register-coordinator-job-title"
              class="text-caption text-bold"
            >
              {{ $t('register.coordinator.form.labelJobTitle') }}
            </label>
            <!-- Input -->
            <q-input
              dense
              outlined
              v-model="formRegisterCoordinator.jobTitle"
              lazy-rules
              :rules="[
                (val) =>
                  isFilled(val) ||
                  $t('register.coordinator.form.messageFieldRequired', {
                    fieldName: $t(
                      'register.coordinator.form.labelJobTitleShort',
                    ),
                  }),
              ]"
              bg-color="grey-1"
              class="q-mt-sm"
              id="form-register-coordinator-job-title"
              name="job_title"
              data-cy="form-register-coordinator-job-title-input"
            />
          </div>
          <!-- Input: email -->
          <div class="col-12 col-sm-6">
            <!-- Label -->
            <label for="form-register-coordinator-email" class="text-caption">
              {{ $t('register.coordinator.form.labelEmail') }}
            </label>
            <!-- Input -->
            <q-input
              dense
              outlined
              v-model="formRegisterCoordinator.email"
              lazy-rules
              :rules="[
                (val) =>
                  isFilled(val) ||
                  $t('register.coordinator.form.messageFieldRequired', {
                    fieldName: $t('register.coordinator.form.labelEmail'),
                  }),
                (val) =>
                  isEmail(val) ||
                  $t('register.coordinator.form.messageEmailInvalid'),
              ]"
              bg-color="grey-1"
              class="q-mt-sm"
              id="form-register-coordinator-email"
              name="email"
              data-cy="form-register-coordinator-email-input"
            />
          </div>
          <!-- Input: phone-->
          <div class="col-12 col-sm-6">
            <!-- Label -->
            <label for="form-register-coordinator-phone" class="text-caption">
              {{ $t('register.coordinator.form.labelPhone') }}
            </label>
            <!-- Input -->
            <q-input
              dense
              outlined
              v-model="formRegisterCoordinator.phone"
              lazy-rules
              :rules="[
                (val) =>
                  isFilled(val) ||
                  $t('register.coordinator.form.messageFieldRequired', {
                    fieldName: $t('register.coordinator.form.labelPhone'),
                  }),
                (val) =>
                  isPhone(val) ||
                  $t('register.coordinator.form.messagePhoneInvalid'),
              ]"
              bg-color="grey-1"
              class="q-mt-sm"
              id="form-register-coordinator-phone"
              name="phone"
              data-cy="form-register-coordinator-phone-input"
            />
          </div>
        </div>
      </div>
    </q-form>
  </div>
</template>

<style scoped lang="scss"></style>
