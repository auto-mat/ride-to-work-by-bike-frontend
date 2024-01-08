<script lang="ts">
/**
 * FormFieldLastNameTest Component
 *
 * The `FormFieldLastNameTest` serves as a wrapper for testing
 * the `FormFieldLastName` component.
 *
 * @description * Use this component to test the FormFieldLastName component.
 *
 * @components
 * - `FormFieldLastName`: Component to render last name input field.
 *
 * @example
 * <form-field-last-name-test />
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import FormFieldLastName from './FormFieldLastName.vue';

export default defineComponent({
  name: 'FormFieldLastNameTest',
  components: {
    FormFieldLastName,
  },
  setup() {
    const lastName = ref('');

    return {
      lastName,
    };
  },
});
</script>

<template>
  <form-field-last-name v-model="lastName" :testing="true" />
</template>
