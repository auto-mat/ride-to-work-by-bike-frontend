<script lang="ts">
/**
 * FormFieldFirstName Component
 *
 * The `FormFieldFirstName` displays first name input.
 *
 * @description * Use this component to render first name input in forms.
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
 * <form-field-first-name v-model="firstName" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103756&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';

export default defineComponent({
  name: 'FormFieldFirstName',
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
    const firstName = computed({
      get() {
        return props.modelValue;
      },
      set(value: string) {
        emit('update:modelValue', value);
      },
    });

    const { isFilled } = useValidation();

    return {
      firstName,
      isFilled,
    };
  },
});
</script>

<template>
  <div data-cy="form-first-name">
    <!-- Label -->
    <label for="form-first-name" class="text-grey-10 text-caption text-bold">
      {{ $t('form.labelFirstName') }}
    </label>
    <!-- Input -->
    <q-input
      dense
      outlined
      v-model="firstName"
      lazy-rules
      :rules="[
        (val) =>
          isFilled(val) ||
          $t('form.messageFieldRequired', {
            fieldName: $t('form.labelFirstName'),
          }),
      ]"
      :bg-color="bgColor"
      class="q-mt-sm"
      id="form-first-name"
      name="first_name"
      autocomplete="given-name"
      data-cy="form-first-name-input"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.q-field__control) {
  border-radius: 8px;
}
</style>
