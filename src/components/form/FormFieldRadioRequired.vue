<script lang="ts">
/**
 * FormFieldRadioRequired Component
 *
 * The `FormFieldRadioRequired` displays email input.
 *
 * @description * Use this component to render email input in forms.
 *
 * Used in `FormRegister`, `FormLogin`, `RegisterChallengePayment`.
 *
 * @props
 * - `modelValue` (string|null): The object representing user input.
 *   It should be of type `string` or `null`.
 * - `options` (object, required): The object representing the options.
 *   Should have props:
 *   - label (string)
 *   - value (string)
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

// types
import type { PropType } from 'vue';
import type { FormOption } from 'src/components/types/Form';

export default defineComponent({
  name: 'FormFieldRadioRequired',
  props: {
    modelValue: {
      type: [String, Number] as PropType<string | number | null>,
      default: null,
    },
    options: {
      type: Array as () => FormOption[],
      required: true,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const radioValue = computed({
      get(): string | number | null {
        return props.modelValue;
      },
      set(value: string | number | null) {
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
    <q-option-group
      dense
      v-model="radioValue"
      :options="options"
      :inline="inline"
      color="primary"
      class="text-grey-10 q-gutter-md"
      data-cy="form-field-radio"
    >
      <template v-slot:label="opt">
        <span :data-cy="`radio-option-${opt.value}`" class="text-grey-10">{{
          opt.label
        }}</span>
      </template>
    </q-option-group>
  </q-field>
</template>
