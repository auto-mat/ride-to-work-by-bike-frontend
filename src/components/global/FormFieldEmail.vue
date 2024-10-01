<script lang="ts">
/**
 * FormFieldEmail Component
 *
 * The `FormFieldEmail` displays email input.
 *
 * @description * Use this component to render email input in forms.
 *
 * Note: This component is commonly used in `FormRegister`, `FormLogin`,
 * `FormRegistrationCoordinator`, `ContactForm`.
 *
 * @props
 * - `value` (string, required): The object representing user input.
 *   It should be of type `string`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-email />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25412&mode=dev)
 */

// libraries
import { computed, defineComponent } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';

export default defineComponent({
  name: 'FormFieldEmail',
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      required: true,
    },
    bgColor: {
      type: String as () => 'white' | 'transparent',
      default: 'transparent',
    },
    testing: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const email = computed({
      get() {
        return props.modelValue;
      },
      set(value: string) {
        emit('update:modelValue', value);
      },
    });

    const { isEmail, isFilled } = useValidation();

    return {
      email,
      isFilled,
      isEmail,
    };
  },
});
</script>

<template>
  <div class="col-12 col-sm-6" data-cy="form-email">
    <!-- Label -->
    <label for="form-email" class="text-caption text-bold">
      {{ $t('form.labelEmail') }}
    </label>
    <!-- Input -->
    <q-input
      dense
      outlined
      :dark="dark"
      v-model="email"
      :lazy-rules="!testing"
      :rules="[
        (val) =>
          isFilled(val) ||
          $t('form.messageFieldRequired', {
            fieldName: $t('form.labelEmail'),
          }),
        (val) => isEmail(val) || $t('form.messageEmailInvalid'),
      ]"
      :bg-color="bgColor"
      class="q-mt-sm"
      id="form-email"
      name="email"
      data-cy="form-email-input"
    />
  </div>
</template>
