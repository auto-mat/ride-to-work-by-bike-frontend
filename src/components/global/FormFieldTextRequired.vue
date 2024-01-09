<script lang="ts">
/**
 * FormFieldTextRequired Component
 *
 * The `FormFieldTextRequired` displays text required input.
 *
 * @description * Use this component to render text required input in forms.
 *
 * Note: This component is commonly used in `FormRegisterCoordinator`, `FormRegisterChallenge`.
 *
 * @props
 * - `value` (string, required): The object representing user input.
 *   It should be of type `string`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-text-required v-model="value" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103756&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';

export default defineComponent({
  name: 'FormFieldTextRequired',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    bgColor: {
      type: String as () => 'white' | 'transparent',
      default: 'transparent',
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    labelShort: {
      type: String,
    },
    autocomplete: {
      type: String,
    },
    testing: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputValue = computed({
      get() {
        return props.modelValue;
      },
      set(value: string) {
        emit('update:modelValue', value);
      },
    });

    const { isFilled } = useValidation();

    return {
      inputValue,
      isFilled,
    };
  },
});
</script>

<template>
  <div :data-cy="`form-${name}`">
    <!-- Label -->
    <label :for="`form-${name}`" class="text-grey-10 text-caption text-bold">
      {{ $t(label) }}
    </label>
    <!-- Input -->
    <q-input
      dense
      outlined
      v-model="inputValue"
      lazy-rules
      :rules="[
        (val) =>
          isFilled(val) ||
          $t('form.messageFieldRequired', {
            fieldName: labelShort ? $t(labelShort) : $t(label),
          }),
      ]"
      :bg-color="bgColor"
      class="q-mt-sm"
      :id="`form-${name}`"
      :name="name"
      :autocomplete="autocomplete"
      :data-cy="`form-${name}-input`"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.q-field__control) {
  border-radius: 8px;
}
</style>
