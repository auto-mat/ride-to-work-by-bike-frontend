<script lang="ts">
/**
 * FormFieldBusinessVatId Component
 *
 * The `FormFieldBusinessVatId` displays business VAT ID (DIČ) input.
 *
 * @description * Use this component to render business VAT ID input in forms.
 *
 * Note: This component is commonly used in `FormCreateInvoice`.
 *
 * @props
 * - `modelValue` (string, required): The object representing user input.
 * - `bgColor` (string, default: 'transparent'): The input background color.
 *   It should be of type `string`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-business-vat-id v-model="businessVatId" />
 */

// libraries
import { computed, defineComponent } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';

export default defineComponent({
  name: 'FormFieldBusinessVatId',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    bgColor: {
      type: String as () => 'white' | 'transparent',
      default: 'transparent',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const businessVatId = computed({
      get() {
        return props.modelValue;
      },
      set(value: string) {
        emit('update:modelValue', value);
      },
    });

    const { isBusinessVatId, isFilled } = useValidation();

    return {
      businessVatId,
      isFilled,
      isBusinessVatId,
    };
  },
});
</script>

<template>
  <div class="col-12 col-sm-6" data-cy="form-business-vat-id">
    <!-- Label -->
    <label for="form-business-vat-id" class="text-caption text-bold">
      {{ $t('form.labelBusinessVatId') }}
    </label>
    <!-- Input -->
    <q-input
      dense
      outlined
      v-model="businessVatId"
      :rules="[
        (val) =>
          isFilled(val) ||
          $t('form.messageFieldRequired', {
            fieldName: $t('form.labelBusinessVatId'),
          }),
        (val) => isBusinessVatId(val) || $t('form.messageBusinessVatIdInvalid'),
      ]"
      :bg-color="bgColor"
      class="q-mt-sm"
      id="form-business-vat-id"
      name="business-vat-id"
      data-cy="form-business-vat-id-input"
    />
  </div>
</template>
