<script lang="ts">
/**
 * FormFieldSelectTable Component
 *
 * The `FormFieldSelectTable`
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
 * <form-field-select-table />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5366%3A28607&mode=dev)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// composables
import { useValidation } from 'src/composables/useValidation';

// types
import { FormOption } from '../types/Form';

export default defineComponent({
  name: 'FormFieldSelectTable',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Array as () => FormOption[],
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const query = ref<string>('');

    const filteredOptions = computed(() => {
      return props.options.filter(
        (option: FormOption): boolean =>
          option.label
            .toLocaleLowerCase()
            .indexOf(query.value.toLocaleLowerCase()) > -1,
      );
    });

    const inputValue = computed({
      get(): string {
        return props.modelValue;
      },
      set(value: string): void {
        emit('update:modelValue', value);
      },
    });

    const borderRadius: string = rideToWorkByBikeConfig.borderRadiusCardSmall;

    const { isFilled } = useValidation();

    return {
      borderRadius,
      filteredOptions,
      inputValue,
      query,
      isFilled,
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
  <q-field
    borderless
    dense
    item-aligned
    rounded
    v-model="inputValue"
    class="q-pa-none q-mb-sm"
    :rules="[
      (val: string) => isFilled(val) || $t('form.messageOptionRequired'),
    ]"
  >
    <q-card
      flat
      bordered
      class="full-width q-mt-sm"
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
            <q-icon name="search" class="q-pl-sm" />
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
  </q-field>
</template>

<style lang="scss" scoped>
:deep(.q-field__append) {
  display: none;
}
:deep(.q-radio__label) {
  color: $grey-10;
}
:deep(.text-negative .q-radio__label) {
  color: $negative;
}
</style>
