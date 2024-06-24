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
 * - `FormFieldCheckboxTeam`: Component to render checkbox team widget.
 * - `FormFieldCompany`: Component to render company input field.
 * - `FormFieldDateRequired`: Component to render date input field.
 * - `FormFieldEmail`: Component to render email input field.
 * - `FormFieldOptionGroup`: Component to render option group input field.
 * - `FormFieldPassword`: Component to render password input field.
 * - `FormFieldPasswordConfirm`: Component to render password confirm input
 *   field.
 * - `FormFieldPhone`: Component to render phone input field.
 * - `FormFieldRadioRequired`: Component to render radio input field.
 * - `FormFieldSelectCity`: Component to render city select field.
 * - `FormFieldSelectTable`: Component to render company select field.
 * - `FormFieldTextRequired`: Component to render text input field.
 *
 * @example
 * <form-field-test-wrapper component="FormFieldPassword" :testing="true" />
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import FormFieldCheckboxTeam from '../form/FormFieldCheckboxTeam.vue';
import FormFieldCompany from './FormFieldCompany.vue';
import FormFieldDateRequired from '../form/FormFieldDateRequired.vue';
import FormFieldEmail from './FormFieldEmail.vue';
import FormFieldOptionGroup from '../form/FormFieldOptionGroup.vue';
import FormFieldPassword from './FormFieldPassword.vue';
import FormFieldPasswordConfirm from './FormFieldPasswordConfirm.vue';
import FormFieldPhone from './FormFieldPhone.vue';
import FormFieldRadioRequired from '../form/FormFieldRadioRequired.vue';
import FormFieldSelectCity from '../form/FormFieldSelectCity.vue';
import FormFieldSelectTable from '../form/FormFieldSelectTable.vue';
import FormFieldTextRequired from './FormFieldTextRequired.vue';
import FormFieldBusinessId from '../form/FormFieldBusinessId.vue';

export default defineComponent({
  name: 'FormFieldTestWrapper',
  components: {
    FormFieldCheckboxTeam,
    FormFieldCompany,
    FormFieldDateRequired,
    FormFieldEmail,
    FormFieldOptionGroup,
    FormFieldPassword,
    FormFieldPasswordConfirm,
    FormFieldPhone,
    FormFieldRadioRequired,
    FormFieldSelectCity,
    FormFieldSelectTable,
    FormFieldTextRequired,
    FormFieldBusinessId,
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
    required: {
      type: Boolean,
    },
    array: {
      type: Boolean,
    },
  },
  setup(props) {
    const inputValue = ref(props.array ? [] : '');

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
    :required="required"
  />
</template>
