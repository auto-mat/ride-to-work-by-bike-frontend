<script lang="ts">
/**
 * FormFieldSelectCity Component
 *
 * @description * Use this component to render a select with city options.
 * It is commonly used in `CommunityPage` and `PrizesPage`.
 *
 * @props
 * - `modelValue` (number|null): The select value.
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
import { computed, defineComponent, inject, onMounted } from 'vue';

import { useApiGetCities } from '../../composables/useApiGetCities';

// types
import { FormOption } from '../../components/types/Form';
import { Logger } from '../../components/types/Logger';

export default defineComponent({
  name: 'FormFieldSelectCity',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Number as () => number | null,
      required: false,
      default: null,
    },
  },
  setup(props, { emit }) {
    const city = computed({
      get: (): number | null => props.modelValue,
      set: (value: number | null): void => emit('update:modelValue', value),
    });

    const logger = inject('vuejs3-logger') as Logger | null;
    const { cities, isLoading, loadCities } = useApiGetCities(logger);

    onMounted(() => {
      loadCities();
    });

    const optionsCity = computed<FormOption[]>(() =>
      cities.value.map((city) => ({
        label: city.name,
        value: city.id,
      })),
    );

    return {
      city,
      isLoading,
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
      :loading="isLoading"
      :options="optionsCity"
      :style="{ 'min-width': '160px' }"
      class="col-auto"
      id="form-select-city"
      data-cy="form-select-city"
    />
  </div>
</template>
