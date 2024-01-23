<script lang="ts">
/**
 * FormFieldCompanySelect Component
 *
 * The `FormFieldCompanySelect`
 *
 * @description * Use this component to display company select with search
 * field.
 *
 * Note: This component is commonly used in `RegisterChallengePage`.
 *
 * @props
 * - `modelValue` (String, required): The object representing selected
 *   company.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-company-select />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5366%3A28607&mode=dev)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// types
import { FormOption } from '../types/Form';

export default defineComponent({
  name: 'FormFieldCompanySelect',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const query = ref('');

    const options = ref<FormOption[]>([
      {
        label: 'Very long company name spanning 3 lines on mobile',
        value: 'company-1',
      },
      {
        label: 'Company 2',
        value: 'company-2',
      },
      {
        label: 'Company 3',
        value: 'company-3',
      },
      {
        label: 'Company 4',
        value: 'company-4',
      },
      {
        label: 'Company 5',
        value: 'company-5',
      },
      {
        label: 'Company 6',
        value: 'company-6',
      },
      {
        label: 'Company 7',
        value: 'company-7',
      },
    ]);

    const filteredOptions = computed(() => {
      return options.value.filter(
        (option) =>
          option.label
            .toLocaleLowerCase()
            .indexOf(query.value.toLocaleLowerCase()) > -1,
      );
    });

    const inputValue = computed({
      get(): string {
        return props.modelValue;
      },
      set(value: string) {
        emit('update:modelValue', value);
      },
    });

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    return {
      borderRadius,
      filteredOptions,
      inputValue,
      query,
    };
  },
});
</script>

<template>
  <!-- Label -->
  <label
    for="form-company"
    class="text-grey-10 text-caption text-bold"
    data-cy="form-company-select-query"
  >
    {{ $t('form.company.labelCompany') }}
  </label>
  <q-card
    flat
    bordered
    class="q-mt-sm"
    :style="{ 'border-radius': borderRadius }"
    data-cy="form-company-select-card"
  >
    <!-- Search field -->
    <q-card-section class="q-pa-sm" data-cy="form-company-select-search">
      <!-- Input -->
      <q-input
        dense
        outlined
        v-model="query"
        icon
        id="form-company-select-query"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-card-section>
    <!-- Separator -->
    <q-separator />
    <!-- Options list -->
    <q-card-section class="q-pa-xs" data-cy="form-company-select-options">
      <q-scroll-area style="height: 250px">
        <q-option-group
          v-model="inputValue"
          :options="filteredOptions"
          color="primary"
          class="q-pr-sm"
          data-cy="form-company-select-option-group"
        />
      </q-scroll-area>
    </q-card-section>
    <!-- Separator -->
    <q-separator />
    <!-- Button: Add company -->
    <q-card-section
      class="full-width flex items-center justify-center q-pa-sm"
      data-cy="form-company-select-button"
    >
      <!-- Button: Add company -->
      <q-btn
        flat
        rounded
        icon="mdi-plus"
        color="primary"
        data-cy="button-add-company"
      >
        <!-- Label -->
        <span class="inline-block q-pl-xs">
          {{ $t('register.challenge.buttonAddCompany') }}
        </span>
      </q-btn>
    </q-card-section>
    <!-- TODO: add dialog new company -->
  </q-card>
</template>
