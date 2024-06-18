<script lang="ts">
/**
 * FormFieldDateRequired Component
 *
 * @description * Use this component to display a required date field.
 *
 * Note: This component is commonly used in `FormCompanyChallenge`.
 *
 * @props
 * - `NAME` (TYPE, required): The object representing ... .
 *   It should be of type `TYPE`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 * - `bgColor` (string, default: 'transparent'): The background color of the
 * - `name` (string, required): The name used for id and test selectors.
 * - `label` (string, required): The translation key for the label.
 * - `labelShort` (string): The translation key for the short label.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-date-required v-model="date" bg-color="white" name="date" :label="$t('form.labelDate')" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-106325&t=Osf58JD9vxDJlHaW-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

// composables
import { useValidation } from '../../composables/useValidation';

export default defineComponent({
  name: 'FormFieldDateRequired',
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
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
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
  <div data-cy="form-field-date">
    <!-- Label -->
    <label
      :for="`form-${name}`"
      class="text-grey-10 text-caption text-bold"
      :data-cy="`form-${name}-label`"
    >
      {{ $t(label) }}
    </label>

    <!-- Input -->
    <q-input
      dense
      outlined
      hide-bottom-space
      v-model="inputValue"
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
      mask="##. ##. ####"
      :data-cy="`form-${name}-input`"
    >
      <template v-slot:prepend>
        <q-icon
          name="event"
          class="cursor-pointer"
          :data-cy="`form-${name}-icon`"
        >
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date
              dense
              minimal
              outlined
              mask="DD. MM. YYYY"
              v-model="inputValue"
              color="primary"
              data-cy="form-date-picker"
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>
