<script lang="ts">
/**
 * FormFieldCompanyTest Component
 *
 * The `FormFieldCompanyTest` serves as a wrapper for testing
 * the `FormFieldCompany` component.
 *
 * @description * Use this component to test the FormFieldCompany component.
 *
 * @components
 * - `FormFieldCompany`: Component to render company input field.
 *
 * @example
 * <form-field-company-test />
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import FormFieldCompany from './FormFieldCompany.vue';

export default defineComponent({
  name: 'FormFieldCompanyTest',
  components: {
    FormFieldCompany,
  },
  setup() {
    const company = ref('');

    return {
      company,
    };
  },
});
</script>

<template>
  <form-field-company v-model="company" />
</template>
