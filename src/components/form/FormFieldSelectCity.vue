<script lang="ts">
/**
 * FormFieldSelectCity Component
 *
 * @description * Use this component to render a select with city options.
 * It is commonly used in `CommunityPage` and `PrizesPage`.
 *
 * @props
 * - `modelValue` (string|null) - Selected city slug.
 *   It should be of type `string`.
 * - `cities` (City[]) - Array of cities from which options are generated.
 * - `loading` (boolean) - Whether the cities are loading.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-select-city v-model="city" :cities="cities" :loading="loading" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104327&t=XckLLHWI3q8VrRFl-1)
 */

// libraries
import { computed, defineComponent, ref, watch } from 'vue';

// types
import type { FormOption } from '../../components/types/Form';

export default defineComponent({
  name: 'FormFieldSelectCity',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String as () => string | null,
      required: false,
      default: null,
    },
    cities: {
      type: Array as () => City[],
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const city = ref<FormOption | null>(null);

    const options = computed<FormOption[]>(() =>
      props.cities.map((city) => ({
        label: city.name,
        value: city.slug,
        slug: city.wp_slug,
      })),
    );

    // update city when modelValue prop is available
    watch(
      () => props.modelValue,
      (newValue) => {
        city.value =
          options.value.find((option) => option.slug === newValue) ?? null;
      },
      { once: true },
    );

    // emit updated city slug
    watch(city, (newValue) => {
      emit('update:modelValue', newValue?.slug ?? null);
    });

    return {
      city,
      options,
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
      v-model="city"
      :loading="loading"
      :options="options"
      :style="{ 'min-width': '160px' }"
      class="col-auto"
      id="form-select-city"
      data-cy="form-select-city"
    />
  </div>
</template>
