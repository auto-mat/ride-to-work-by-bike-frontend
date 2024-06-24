<script lang="ts">
/**
 * FormAddCompany Component
 *
 * @description * Use this component to render form for registering a new
 * company.
 * You can adjust its appearance by changing the `variant` prop.
 *
 * Note: This component is commonly used in `FormFieldCompany`,
 * `FormFieldSelectTable`.
 *
 * @props
 * - `formValues` (Object, required): The object representing the form state.
 * - `variant` (String as 'default', 'simple'): The variant of the form.
 *   `simple` only shows `name` and `vatId` fields.
 *
 * @events
 * - `update:formValues`: Emitted as a part of v-model structure.
 *
 * @components
 * - `FormFieldTextRequired`: Component to render required field.
 * - `FormFieldBusinessId`: Component to render registration number field.
 *
 * @example
 * <form-add-company v-model="companyNew" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6014%3A46090&mode=dev)
 */

// libraries
import { defineComponent, nextTick, ref } from 'vue';

// components
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';
import FormFieldBusinessId from '../form/FormFieldBusinessId.vue';

// composables
import { useValidation } from '../../composables/useValidation';

// types
import type { FormCompanyFields, FormOption } from '../types/Form';

export default defineComponent({
  name: 'FormAddCompany',
  components: {
    FormFieldTextRequired,
    FormFieldBusinessId,
  },
  props: {
    formValues: {
      type: Object as () => FormCompanyFields,
      required: true,
    },
    variant: {
      type: String as () => 'default' | 'simple',
      default: 'default',
    },
  },
  emits: ['update:formValues'],
  setup(props, { emit }) {
    const company = ref(props.formValues);

    const optionsCityChallenge: FormOption[] = [
      {
        label: 'City 1',
        value: 'city-1',
      },
      {
        label: 'City 2',
        value: 'city-2',
      },
      {
        label: 'City 3',
        value: 'city-3',
      },
    ];

    const onUpdate = (): void => {
      // wait for next tick to emit the value after update
      nextTick((): void => {
        emit('update:formValues', company.value);
      });
    };

    const { isFilled } = useValidation();

    const addressIndex = 0;

    return {
      addressIndex,
      company,
      optionsCityChallenge,
      isFilled,
      onUpdate,
    };
  },
});
</script>

<template>
  <div>
    <div class="q-mb-md">
      <h3
        class="text-body1 text-bold text-black q-my-none"
        data-cy="form-add-company-title"
      >
        {{ $t('form.labelCompanyShort') }}
      </h3>
      <p
        v-if="variant === 'default'"
        class="q-mt-sm"
        data-cy="form-add-company-permission"
      >
        {{ $t('form.company.textCompanyPermission') }}
      </p>
    </div>
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-6">
        <!-- Input: Company name -->
        <form-field-text-required
          v-model="company.name"
          name="name"
          label="form.labelTitle"
          @update:model-value="onUpdate"
          data-cy="form-add-company-name"
        />
      </div>
      <div class="col-12 col-sm-6">
        <!-- Input: VAT ID -->
        <form-field-business-id
          v-model="company.vatId"
          name="vatId"
          :label="$t('form.labelBusinessId')"
          @update:model-value="onUpdate"
          data-cy="form-add-company-vat-id"
        />
      </div>
    </div>
    <div v-if="variant === 'default'" class="q-mt-lg">
      <div class="q-mb-md">
        <h3 class="text-body1 text-bold text-black q-my-none">
          {{ $t('form.company.titleSubdivisionAddress') }}
        </h3>
        <p>
          {{ $t('form.company.textSubdivisionAddress') }}
        </p>
      </div>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-sm-6">
          <form-field-text-required
            v-model="company.address[addressIndex].street"
            name="street"
            label="form.labelStreet"
            @update:model-value="onUpdate"
            data-cy="form-add-company-street"
          />
        </div>
        <div class="col-12 col-sm-6">
          <form-field-text-required
            v-model="company.address[addressIndex].houseNumber"
            name="houseNumber"
            label="form.labelHouseNumber"
            @update:model-value="onUpdate"
            data-cy="form-add-company-house-number"
          />
        </div>
        <div class="col-12 col-sm-6">
          <form-field-text-required
            v-model="company.address[addressIndex].city"
            name="city"
            label="form.labelCity"
            @update:model-value="onUpdate"
            data-cy="form-add-company-city"
          />
        </div>
        <div class="col-12 col-sm-6">
          <form-field-text-required
            v-model="company.address[addressIndex].zip"
            name="zip"
            label="form.labelZip"
            @update:model-value="onUpdate"
            data-cy="form-add-company-zip"
          />
        </div>
        <div class="col-12">
          <label
            for="form-city-challenge"
            class="text-caption text-bold text-gray-10"
            >{{ $t('form.company.labelCityChallenge') }}</label
          >
          <q-select
            dense
            outlined
            emit-value
            map-options
            v-model="company.address[addressIndex].cityChallenge"
            :rules="[
              (val) =>
                isFilled(val) ||
                $t('form.messageFieldRequired', {
                  fieldName: $t('form.labelCity'),
                }),
            ]"
            id="form-city-challenge"
            :hint="$t('form.company.hintCityChallenge')"
            :options="optionsCityChallenge"
            class="q-mt-sm"
            data-cy="form-add-company-city-challenge"
          ></q-select>
        </div>
        <div class="col-12">
          <label
            for="form-department"
            class="text-caption text-bold text-gray-10"
          >
            {{ $t('form.company.labelDepartment') }}
          </label>
          <q-input
            dense
            outlined
            lazy-rules
            hide-bottom-space
            v-model="company.address[addressIndex].department"
            id="form-department"
            name="department"
            :hint="$t('form.company.hintDepartment')"
            class="q-mt-sm"
            data-cy="form-add-company-department"
          />
        </div>
      </div>
    </div>
  </div>
</template>
