<script lang="ts">
/**
 * FormFieldCheckboxRequired Component
 *
 * @description * Use this component to render a required checkbox input field.
 *
 * Note: This component is used in `FormRegisterCoordinator`.
 *
 * @props
 * - `modelValue` (boolean, required): Value of the checkbox.
 *   It should be of type `boolean`.
 * - `validationMessage` (string, required): Validation message of the checkbox.
 *   It should be of type `string`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @slots
 * - `default`: Label for the checkbox.
 *
 * @example
 * <form-field-checkbox-required v-model="isChecked" :label="label" :validation-message="validationMessage" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6417-29946&t=22yqDCEydrJ2RQgL-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'FormFieldCheckboxRequired',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    validationMessage: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const model = computed({
      get: (): boolean => props.modelValue,
      set: (value: boolean) => emit('update:modelValue', value),
    });

    return {
      model,
    };
  },
});
</script>

<template>
  <q-field
    dense
    borderless
    hide-bottom-space
    :model-value="model"
    :rules="[(val) => !!val || validationMessage]"
    data-cy="form-field-checkbox-required"
  >
    <q-checkbox
      dense
      v-model="model"
      color="primary"
      :true-value="true"
      :false-value="false"
      class="text-grey-10"
      data-cy="form-field-checkbox-required-input"
    >
      <span data-cy="form-field-checkbox-required-label">
        <slot />
      </span>
    </q-checkbox>
  </q-field>
</template>
