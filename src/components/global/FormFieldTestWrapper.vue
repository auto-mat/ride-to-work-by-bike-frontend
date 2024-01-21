<script lang="ts">
/**
 * FormFieldTestWrapper Component
 *
 * The `FormFieldTestWrapper` serves as a wrapper for testing
 * the FormField- components.
 *
 * @description * Use this component to test the FormField- components.
 *
 * @props
 * - `component` (string, required): The name of the tested component.
 * - `compareValue` (string): The value used for password comparison.
 * - `label` (string): The translation key used for input label in tests.
 * - `name` (string): The name used for id and test selectors.
 * - `options` (array): The options used for radio button tests.
 *
 * @components
 * - `FormFieldCompany`: Component to render company input field.
 * - `FormFieldEmail`: Component to render email input field.
 * - `FormFieldOptionGroup`: Component to render option group input field.
 * - `FormFieldPassword`: Component to render password input field.
 * - `FormFieldPasswordConfirm`: Component to render password confirm input
 *   field.
 * - `FormFieldPhone`: Component to render phone input field.
 * - `FormFieldRadioRequired`: Component to render radio input field.
 * - `FormFieldTextRequired`: Component to render text input field.
 *
 * @example
 * <form-field-test-wrapper component="FormFieldPassword" :testing="true" />
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import FormFieldCompany from './FormFieldCompany.vue';
import FormFieldEmail from './FormFieldEmail.vue';
import FormFieldOptionGroup from '../form/FormFieldOptionGroup.vue';
import FormFieldPassword from './FormFieldPassword.vue';
import FormFieldPasswordConfirm from './FormFieldPasswordConfirm.vue';
import FormFieldPhone from './FormFieldPhone.vue';
import FormFieldRadioRequired from '../form/FormFieldRadioRequired.vue';
import FormFieldTextRequired from './FormFieldTextRequired.vue';

export default defineComponent({
  name: 'FormFieldTestWrapper',
  components: {
    FormFieldCompany,
    FormFieldEmail,
    FormFieldOptionGroup,
    FormFieldPassword,
    FormFieldPasswordConfirm,
    FormFieldPhone,
    FormFieldRadioRequired,
    FormFieldTextRequired,
  },
  props: {
    component: {
      type: String,
      required: true,
    },
    compareValue: {
      type: String,
    },
    label: {
      type: String,
    },
    name: {
      type: String,
    },
    options: {
      type: Array as () => { label: string; value: string }[],
    },
  },
  setup() {
    const inputValue = ref('');

    return {
      inputValue,
    };
  },
});
</script>

<template>
  <component
    :is="component"
    v-model="inputValue"
    :name="name"
    :label="label"
    :compare-value="compareValue"
    :options="options"
  />
</template>
