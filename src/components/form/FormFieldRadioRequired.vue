<script lang="ts">
/**
 * FormFieldRadioRequired Component
 *
 * The `FormFieldRadioRequired` displays email input.
 *
 * @description * Use this component to render email input in forms.
 *
 * Note: This component is commonly used in `FormRegister`, `FormLogin`.
 *
 * @props
 * - `modelValue` (string, required): The object representing user input.
 *   It should be of type `string`.
 * - `options` (object, required): The object representing the options.
 *   Should have props:
 *   - label (string)
 *   - value (string)
 * - `label` (string, required): The translation key for the label.
 * - `inline` (boolean, default: false): Buttons in row layout
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-radio-required />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6385%3A26514&mode=dev)
 */

// libraries
import { computed, defineComponent } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';

export default defineComponent({
  name: 'FormFieldRadioRequired',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Array as () => { label: string; value: string }[],
      required: true,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const radioValue = computed({
      get() {
        return props.modelValue;
      },
      set(value: string) {
        emit('update:modelValue', value);
      },
    });

    const { isFilled } = useValidation();

    return {
      radioValue,
      isFilled,
    };
  },
});
</script>

<template>
  <q-field
    dense
    borderless
    hide-bottom-space
    :model-value="radioValue"
    :rules="[
      (val: string) => isFilled(val) || $t('form.messageOptionRequired'),
    ]"
  >
    <div class="q-gutter-sm">
      <q-option-group
        v-model="radioValue"
        :options="options"
        :inline="inline"
        color="primary"
        data-cy="form-field-radio"
      />
    </div>
  </q-field>
</template>
