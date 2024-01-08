<script lang="ts">
/**
 * FormFieldLastName Component
 *
 * The `FormFieldLastName` displays last name input.
 *
 * @description * Use this component to render last name input in forms.
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
 * <form-field-last-name v-model="lastName" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103756&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';

export default defineComponent({
  name: 'FormFieldLastName',
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
    const lastName = computed({
      get() {
        return props.modelValue;
      },
      set(value: string) {
        emit('update:modelValue', value);
      },
    });

    const { isFilled } = useValidation();

    return {
      lastName,
      isFilled,
    };
  },
});
</script>

<template>
  <div class="col-12 col-sm-6" data-cy="form-last-name">
    <!-- Label -->
    <label for="form-last-name" class="text-caption text-bold">
      {{ $t('form.labelLastName') }}
    </label>
    <!-- Input -->
    <q-input
      dense
      outlined
      v-model="lastName"
      lazy-rules
      :rules="[
        (val) =>
          isFilled(val) ||
          $t('form.messageFieldRequired', {
            fieldName: $t('form.labelLastName'),
          }),
      ]"
      :bg-color="bgColor"
      class="q-mt-sm"
      id="form-last-name"
      name="last_name"
      autocomplete="family-name"
      data-cy="form-last-name-input"
    />
  </div>
</template>
