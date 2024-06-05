<script lang="ts">
/**
 * FormFieldSelectCity Component
 *
 * @description * Use this component to render a select with city options.
 * It is commonly used in `CommunityPage` and `PrizesPage`.
 *
 * @props
 * - `modelValue` (string, required): The select value.
 *   It should be of type `string`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-select-city v-model="city" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104327&t=XckLLHWI3q8VrRFl-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

// types
import { FormOption } from '../../components/types/Form';

export default defineComponent({
  name: 'FormFieldSelectCity',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const city = computed({
      get: (): string => props.modelValue,
      set: (value): void => emit('update:modelValue', value),
    });

    const optionsCity: FormOption[] = [
      { label: 'Praha', value: 'praha' },
      { label: 'Ostrava', value: 'ostrava' },
      { label: 'Brno', value: 'brno' },
      { label: 'Hradec Králové', value: 'hradec-kralove' },
      { label: 'Jihlava', value: 'jihlava' },
      { label: 'Kolín', value: 'kolin' },
      { label: 'Liberec', value: 'liberec' },
      { label: 'Most', value: 'most' },
      { label: 'Pardubice', value: 'pardubice' },
      { label: 'Třebechovice pod Orebem', value: 'trebechovice-pod-orebem' },
    ];

    return {
      city,
      optionsCity,
    };
  },
});
</script>

<template>
  <div class="row items-center justify-end" data-cy="form-field-select-city">
    <label
      for="form-select-city"
      class="col-auto q-mr-sm"
      data-cy="form-select-label"
    >
      <span>{{ $t('form.labelCity') }}:</span>
    </label>
    <q-select
      dense
      outlined
      emit-value
      map-options
      v-model="city"
      :options="optionsCity"
      :style="{ 'min-width': '160px' }"
      class="col-auto"
      id="form-select-city"
      data-cy="form-select-city"
    />
  </div>
</template>
