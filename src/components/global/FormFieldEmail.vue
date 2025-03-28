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
 * - `color` (string, optional): The color of the input. Defaults to `white`.
 * - `bgColor` (string, optional): The background color of the input.
 *    Defaults to `transparent`.
 * - `dark` (boolean, optional): Whether the input should be dark.
 *    Defaults to `false`.
 * - `required` (boolean, default: true): Whether the input is required.
 *    Defaults to `true`.
 * - `testing` (boolean, optional): Wheter this is a testing environment.
 *    Defaults to `false`.
 * - `useFormFieldValidationErrorCssClass` (boolean, optional): Use custom email form field
 *                                                              validation error CSS class
 *                                                              Defaults to `false`.
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

import { formFieldCustomValidationErrCssClass } from '../../utils';

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
    color: {
      type: String,
      default: 'grey-10',
    },
    bgColor: {
      type: String as () => 'white' | 'transparent',
      default: 'transparent',
    },
    required: {
      type: Boolean,
      default: true,
    },
    testing: {
      type: Boolean,
      default: false,
    },
    useFormFieldValidationErrorCssClass: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideLabel: {
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
    const emailFormFieldCssClasses = {
      'q-mt-sm': true,
    };
    if (props.useFormFieldValidationErrorCssClass)
      emailFormFieldCssClasses[formFieldCustomValidationErrCssClass] = true;

    const { isEmail, isFilled } = useValidation();

    return {
      email,
      isFilled,
      isEmail,
      emailFormFieldCssClasses,
    };
  },
});
</script>
<template>
  <div class="col-12 col-sm-6" data-cy="form-email">
    <!-- Label -->
    <label v-if="!hideLabel" for="form-email" class="text-caption text-bold">
      {{ $t('form.labelEmail') }}
    </label>
    <!-- Input -->
    <q-input
      dense
      outlined
      :color="color"
      :bg-color="bgColor"
      :dark="dark"
      v-model="email"
      :lazy-rules="!testing"
      :rules="[
        (val) =>
          !required ||
          isFilled(val) ||
          $t('form.messageFieldRequired', {
            fieldName: $t('form.labelEmail'),
          }),
        (val) => !val || isEmail(val) || $t('form.messageEmailInvalid'),
      ]"
      :class="emailFormFieldCssClasses"
      id="form-email"
      name="email"
      data-cy="form-email-input"
    />
  </div>
</template>
