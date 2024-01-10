<script lang="ts">
/**
 * FormFieldTextRequiredTest Component
 *
 * The `FormFieldTextRequiredTest` serves as a wrapper for testing
 * the `FormFieldTextRequired` component.
 *
 * @description * Use this component to test the FormFieldTextRequired component.
 *
 * @components
 * - `FormFieldTextRequired`: Component to render text required input field.
 *
 * @example
 * <form-field-text-required-test />
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import FormFieldTextRequired from './FormFieldTextRequired.vue';

export default defineComponent({
  name: 'FormFieldTextRequiredTest',
  components: {
    FormFieldTextRequired,
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
  <form-field-text-required
    name="text-required"
    label="form.labelTextRequired"
    v-model="inputValue"
  />
</template>
