<script lang="ts">
/**
 * FormFieldBusinessId Component
 *
 * The `FormFieldBusinessId` displays VAT ID input.
 *
 * @description * Use this component to render VAT ID input in forms.
 *
 * Note: This component is commonly used in `FormRegister`, `FormLogin`,
 * `FormRegistrationCoordinator`, `ContactForm`.
 *
 * @props
 * - `value` (string, required): The object representing user input.
 * - `bgColor` (string, default: 'transparent'): The input background color.
 *   It should be of type `string`.
 * - `testing` (boolean, default: false): Whether component is in test mode.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-business-id />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25412&mode=dev)
 */

// libraries
import { computed, defineComponent } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';

export default defineComponent({
  name: 'FormFieldBusinessId',
  props: {
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
    const vatId = computed({
      get() {
        return props.modelValue;
      },
      set(value: string) {
        emit('update:modelValue', value);
      },
    });

    const { isBusinessId, isFilled } = useValidation();

    return {
      vatId,
      isFilled,
      isBusinessId,
    };
  },
});
</script>

<template>
  <div class="col-12 col-sm-6" data-cy="form-vat-id">
    <!-- Label -->
    <label for="form-vat-id" class="text-caption text-bold">
      {{ $t('form.labelBusinessId') }}
    </label>
    <!-- Input -->
    <q-input
      dense
      outlined
      v-model="vatId"
      :lazy-rules="!testing"
      :rules="[
        (val) =>
          isFilled(val) ||
          $t('form.messageFieldRequired', {
            fieldName: $t('form.labelBusinessId'),
          }),
        (val) => isBusinessId(val) || $t('form.messageBusinessIdInvalid'),
      ]"
      :bg-color="bgColor"
      class="q-mt-sm"
      id="form-vat-id"
      name="vat-id"
      data-cy="form-vat-id-input"
    />
  </div>
</template>
