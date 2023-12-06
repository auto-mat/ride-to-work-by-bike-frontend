<script lang="ts">
/**
 * FormFieldPhoneTest Component
 *
 * The `FormFieldPhoneTest` serves as a wrapper for testing
 * the `FormFieldPhone` component.
 *
 * @description * Use this component to test the FormFieldPhone component.
 *
 * @components
 * - `FormFieldPhone`: Component to render phone input field.
 *
 * @example
 * <form-field-phone-test />
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import FormFieldPhone from './FormFieldPhone.vue';

export default defineComponent({
  name: 'FormFieldPhoneTest',
  components: {
    FormFieldPhone,
  },
  setup() {
    const phone = ref('');

    return {
      phone,
    };
  },
});
</script>

<template>
  <form-field-phone v-model="phone" :testing="true" />
</template>
