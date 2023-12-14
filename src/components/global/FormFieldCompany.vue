<script lang="ts">
/**
 * FormFieldCompany Component
 *
 * The `FormFieldCompany` renders company select
 *
 * @description * Use this component to allow user to select their company
 * and create a new company to register under.
 *
 * Note: This component is commonly used in `FormRegisterCoordinator`.
 *
 * @props
 * - `value` (string, required): The object representing user input.
 *   It should be of type `string`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-company />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25476&mode=dev)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';

// types
import type { Ref } from 'vue';

// constants
const stringOptions: string[] = ['Company 1', 'Company 2'];

export default defineComponent({
  name: 'FormFieldCompany',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    testing: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const options: Ref<string[]> = ref([]);

    const company = computed({
      get: () => props.modelValue,
      set: (value: string) => {
        emit('update:modelValue', value);
      },
    });

    // handles select input
    const onInputValue = (val: string) => {
      company.value = val;
    };

    /**
     * Provides autocomplete functionality
     * Upon typing, find strings which contain query entered into the select
     *
     * Limitation: does not support fuzzy search
     *
     * Quasar types are not implemented yet so we provide custom typing
     * for update function.
     * See https://github.com/quasarframework/quasar/issues/8914#issuecomment-1313783889
     *
     * See https://quasar.dev/vue-components/select#example--text-autocomplete
     */
    const onFilter = (val: string, update: (fn: () => void) => void) => {
      update(() => {
        const valLowerCase = val.toLocaleLowerCase();
        options.value = stringOptions.filter(
          (option) => option.toLocaleLowerCase().indexOf(valLowerCase) > -1,
        );
      });
    };

    const { isFilled } = useValidation();

    return {
      company,
      options,
      isFilled,
      onFilter,
      onInputValue,
    };
  },
});
</script>

<template>
  <div class="row gap-24">
    <div class="col" data-cy="form-company">
      <!-- Label -->
      <label for="form-company" class="text-caption text-bold">
        {{ $t('form.labelCompany') }}
      </label>
      <!-- Input -->
      <q-select
        dense
        outlined
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :model-value="company"
        :options="options"
        class="q-mt-sm"
        id="form-company"
        name="company"
        :lazy-rules="!testing"
        :rules="[
          (val) =>
            isFilled(val) ||
            $t('form.messageFieldRequired', {
              fieldName: $t('form.labelCompanyShort'),
            }),
        ]"
        @filter="onFilter"
        @input-value="onInputValue"
        data-cy="form-company-input"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              {{ $t('form.messageNoCompany') }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <!-- TODO: add option to input new company -->
    </div>
    <div class="col-auto flex items-center q-pt-sm">
      <q-btn
        flat
        rounded
        icon="mdi-plus"
        color="primary"
        data-cy="button-add-company"
      >
        <span class="inline-block q-pl-xs">
          {{ $t('register.challenge.buttonAddCompany') }}
        </span>
      </q-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.q-field__control) {
  border-radius: 8px;
}
</style>
