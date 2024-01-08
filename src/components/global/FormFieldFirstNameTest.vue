<script lang="ts">
/**
 * FormFieldFirstNameTest Component
 *
 * The `FormFieldFirstNameTest` serves as a wrapper for testing
 * the `FormFieldFirstName` component.
 *
 * @description * Use this component to test the FormFieldFirstName component.
 *
 * @components
 * - `FormFieldFirstName`: Component to render first name input field.
 *
 * @example
 * <form-field-first-name-test />
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import FormFieldFirstName from './FormFieldFirstName.vue';

export default defineComponent({
  name: 'FormFieldFirstNameTest',
  components: {
    FormFieldFirstName,
  },
  setup() {
    const firstName = ref('');

    return {
      firstName,
    };
  },
});
</script>

<template>
  <form-field-first-name v-model="firstName" :testing="true" />
</template>
