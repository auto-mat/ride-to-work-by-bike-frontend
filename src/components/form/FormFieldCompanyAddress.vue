<script lang="ts">
/**
 * FormFieldCompanyAddress Component
 *
 * The `FormFieldCompanyAddress`
 *
 * @description * Use this component to render address selection field.
 *
 * Note: This component is commonly used in `RegisterChallengePage`.
 *
 * @props
 * - `modelValue` (object, required): The object representing address.
 *   It should be of type `FormAddressType`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `DialogDefault`: Component to render a dialog window.
 * - `FormAddAddress`: Component to render address form fields.
 *
 * @example
 * <form-field-company-address />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6485%3A29568&mode=dev)
 */

// libraries
import { defineComponent, nextTick, ref } from 'vue';

import type { FormOption } from 'src/components/types/Form';

export default defineComponent({
  name: 'FormFieldCompanyAddress',
  emits: ['update:formValue'],
  props: {
    companyId: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const addressValue = ref(null);
    const isDialogOpen = ref<boolean>(false);

    const onUpdate = (): void => {
      // wait for next tick to emit the value after update
      nextTick((): void => {
        emit('update:formValue', addressValue.value);
      });
    };

    const options: FormOption[] = [
      {
        label: 'Address 1',
        value: {
          street: 'Street',
          streetNumber: '123',
          city: 'City',
          zip: '1234',
          referenceCity: 'Ref City',
          department: 'Department',
        },
      },
      {
        label: 'Address 2',
        value: {
          street: 'Street',
          streetNumber: '123',
          city: 'City',
          zip: '1234',
          referenceCity: 'Ref City',
          department: 'Department',
        },
      },
    ];

    return {
      addressValue,
      isDialogOpen,
      options,
      onUpdate,
    };
  },
});
</script>

<template>
  <div data-cy="form-field-company-address">
    <label
      for="form-company-address"
      class="text-body1 text-bold text-black q-mt-none q-mb-md"
    >
      {{ $t('form.company.labelAddress') }}
    </label>
    <div class="row">
      <div class="col-12 col-sm" data-cy="col-input">
        <!-- Input: Autocomplete -->
        <q-select
          id="form-company-address"
          outlined
          v-model="addressValue"
          :options="options"
          @update:model-value="onUpdate"
        >
          <!-- Item: No option -->
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ $t('form.messageNoResult') }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div
        class="col-12 col-sm-auto flex items-start justify-end q-pt-sm q-pl-md"
        style="margin-top: 2px"
        data-cy="col-button"
      >
        <!-- Button: Add company -->
        <q-btn
          flat
          rounded
          icon="mdi-plus"
          color="primary"
          @click.prevent="isDialogOpen = true"
          data-cy="button-add-company"
        >
          <!-- Label -->
          <span class="inline-block q-pl-xs">
            {{ $t('form.company.buttonAddAddress') }}
          </span>
        </q-btn>
      </div>
    </div>
  </div>
</template>
