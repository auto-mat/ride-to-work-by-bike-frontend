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

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormFieldCompany',
});
</script>

<template>
  <div data-cy="form-company">
    <!-- Label -->
    <label for="form-company" class="text-caption text-bold">
      {{ $t('form.labelCompany') }}
    </label>
    <!-- Input -->
    <q-select
      dense
      outlined
      use-input
      v-model="formRegisterCoordinator.company"
      :options="options"
      lazy-rules
      :rules="[
        (val) =>
          isFilled(val) ||
          $t('form.messageFieldRequired', {
            fieldName: $t('form.labelCompanyShort'),
          }),
      ]"
      @filter="onFilter"
      class="q-mt-sm"
      id="form-company"
      name="company"
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
  </div>
</template>
