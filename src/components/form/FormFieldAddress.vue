<script lang="ts">
/**
 * FormFieldAddress Component
 *
 * @description * Use this component to render address fields (street, house number, city, zip).
 *
 * @props
 * - `street` (string, required): Street name
 * - `houseNumber` (string, required): House number
 * - `city` (string, required): City name
 * - `zip` (string, required): ZIP/postal code
 * - `fieldPrefix` (string, default: 'address'): Prefix for field names and data-cy attributes.
 *
 * @events
 * - `update:street`: Emitted when street changes
 * - `update:houseNumber`: Emitted when house number changes
 * - `update:city`: Emitted when city changes
 * - `update:zip`: Emitted when ZIP changes
 *
 * @components
 * - `FormFieldTextRequired`: Component to render required text fields.
 *
 * @example
 * <form-field-address
 *   v-model:street="address.street"
 *   v-model:houseNumber="address.houseNumber"
 *   v-model:city="address.city"
 *   v-model:zip="address.zip"
 *   field-prefix="subsidiary"
 * />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=5366-25187&t=5mlrbbYMHyCGAh8l-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

// components
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';

import { onTrack } from '../../utils/track';

// composables
import { useValidation } from 'src/composables/useValidation';

// enums
import { FormAddressFields } from '../enums/Form';

export default defineComponent({
  name: 'FormFieldAddress',
  components: {
    FormFieldTextRequired,
  },
  props: {
    street: {
      type: String,
      required: true,
    },
    houseNumber: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    fieldPrefix: {
      type: String,
      default: 'address',
    },
  },
  emits: ['update:street', 'update:houseNumber', 'update:city', 'update:zip'],
  setup(props, { emit }) {
    const streetField = computed({
      get: () => props.street,
      set: (value: string) => emit('update:street', value),
    });

    const houseNumberField = computed({
      get: () => props.houseNumber,
      set: (value: string) => emit('update:houseNumber', value),
    });

    const cityField = computed({
      get: () => props.city,
      set: (value: string) => emit('update:city', value),
    });

    const zipField = computed({
      get: () => props.zip,
      set: (value: string) => emit('update:zip', value),
    });

    const { isFilled, isZip } = useValidation();

    return {
      streetField,
      houseNumberField,
      cityField,
      zipField,
      FormAddressFields,
      isFilled,
      isZip,
      onTrack,
    };
  },
});
</script>

<template>
  <div class="row q-col-gutter-lg">
    <div class="col-12 col-sm-6">
      <!-- Street -->
      <form-field-text-required
        v-model="streetField"
        :name="`${fieldPrefix}-${FormAddressFields.street}`"
        label="form.labelStreet"
        :data-cy="`form-${fieldPrefix}-street`"
        v-click-track-evt
        @click-track="onTrack"
      />
    </div>
    <div class="col-12 col-sm-6">
      <!-- House number -->
      <form-field-text-required
        v-model="houseNumberField"
        :name="`${fieldPrefix}-${FormAddressFields.houseNumber}`"
        label="form.labelHouseNumber"
        :data-cy="`form-${fieldPrefix}-house-number`"
        v-click-track-evt
        @click-track="onTrack"
      />
    </div>
    <div class="col-12 col-sm-6">
      <!-- City -->
      <form-field-text-required
        v-model="cityField"
        :name="`${fieldPrefix}-${FormAddressFields.city}`"
        label="form.labelCity"
        :data-cy="`form-${fieldPrefix}-city`"
        v-click-track-evt
        @click-track="onTrack"
      />
    </div>
    <div class="col-12 col-sm-6">
      <!-- Zip -->
      <div :data-cy="`form-${fieldPrefix}-${FormAddressFields.zip}`">
        <!-- Label -->
        <label
          :for="`form-${fieldPrefix}-${FormAddressFields.zip}`"
          class="text-grey-10 text-caption text-bold"
        >
          {{ $t('form.labelZip') }}
        </label>
        <!-- Input -->
        <div v-click-track-evt @click-track="onTrack">
          <q-input
            dense
            outlined
            v-model="zipField"
            lazy-rules
            :rules="[
              (val) =>
                isFilled(val) ||
                $t('form.messageFieldRequired', {
                  fieldName: $t('form.labelZip'),
                }),
              (val) => isZip(val) || $t('form.messageZipInvalid'),
            ]"
            class="q-mt-sm"
            :id="`form-${fieldPrefix}-${FormAddressFields.zip}`"
            :name="`${fieldPrefix}-${FormAddressFields.zip}`"
            :data-cy="`form-${fieldPrefix}-${FormAddressFields.zip}-input`"
            ref="inputRef"
            mask="### ##"
            fill-mask="_"
            unmasked-value
          />
        </div>
      </div>
    </div>
  </div>
</template>
