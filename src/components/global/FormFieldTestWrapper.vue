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
 *
 * @components
 * - `FormFieldPassword`: Component to render password input field.
 * - `FormFieldPasswordConfirm`: Component to render password input field.
 *
 * @example
 * <form-field-test-wrapper component="FormFieldPassword" :testing="true" />
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import FormFieldPassword from './FormFieldPassword.vue';
import FormFieldPasswordConfirm from './FormFieldPasswordConfirm.vue';
import FormFieldPhone from './FormFieldPhone.vue';
import FormFieldTextRequired from './FormFieldTextRequired.vue';

export default defineComponent({
  name: 'FormFieldTestWrapper',
  components: {
    FormFieldPassword,
    FormFieldPasswordConfirm,
    FormFieldPhone,
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
    name: {
      type: String,
    },
    label: {
      type: String,
    },
    testing: {
      type: Boolean,
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
  />
</template>
