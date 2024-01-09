<script lang="ts">
/**
 * FormFieldTestWrapper Component
 *
 * The `FormFieldTestWrapper` serves as a wrapper for testing
 * the FormField- components.
 *
 * @description * Use this component to test the FormField- components.
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

export default defineComponent({
  name: 'FormFieldTestWrapper',
  components: {
    FormFieldPassword,
  },
  props: {
    component: {
      type: String,
      required: true,
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
  <component :is="component" v-model="inputValue" :testing="true" />
</template>
