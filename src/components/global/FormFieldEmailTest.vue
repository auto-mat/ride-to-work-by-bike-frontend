<script lang="ts">
/**
 * FormFieldEmailTest Component
 *
 * The `FormFieldEmailTest` serves as a wrapper for testing
 * the `FormFieldEmail` component.
 *
 * @description * Use this component to test the FormFieldEmail component.
 *
 * @components
 * - `FormFieldEmail`: Component to render email input field.
 *
 * @example
 * <form-field-email-test />
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import FormFieldEmail from './FormFieldEmail.vue';

export default defineComponent({
  name: 'FormFieldEmailTest',
  components: {
    FormFieldEmail,
  },
  setup() {
    const email = ref('');

    return {
      email,
    };
  },
});
</script>

<template>
  <form-field-email v-model="email" :testing="true" />
</template>
