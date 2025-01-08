<script lang="ts">
/**
 * FormAddSubsidiary Component
 *
 * @description * Use this component to render form for adding subsidiary.
 *
 * Note: This component is used in `FormAddCompany` and
 * `FormFieldCompanyAddress` components.
 *
 * @props
 * - `modelValue` (FormCompanyAddressFields, required): The object representing
 *   subsidiary address fields.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `FormFieldTextRequired`: Component to render required fields.
 *
 * @example
 * <form-add-subsidiary v-model="subsidiaryAddress" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=5366-25187&t=5mlrbbYMHyCGAh8l-1)
 */

// libraries
import { computed, defineComponent, inject, nextTick, onMounted } from 'vue';

// components
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';

// composables
import { useValidation } from 'src/composables/useValidation';
import { useApiGetCities } from '../../composables/useApiGetCities';
import { useOrganizations } from '../../composables/useOrganizations';

// enums
import { OrganizationType } from 'src/components/types/Organization';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

// types
import type { FormCompanyAddressFields } from '../types/Form';
import type { Logger } from '../types/Logger';

// enums
import { FormSubsidiaryAddressFields } from '../enums/Form';

export default defineComponent({
  name: 'FormAddSubsidiary',
  components: {
    FormFieldTextRequired,
  },
  props: {
    modelValue: {
      type: Object as () => FormCompanyAddressFields,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const subsidiary = computed({
      get(): FormCompanyAddressFields {
        return props.modelValue;
      },
      set(value: FormCompanyAddressFields) {
        nextTick((): void => {
          emit('update:modelValue', value);
        });
      },
    });

    const logger = inject('vuejs3-logger') as Logger | null;
    const { isLoading, options, loadCities } = useApiGetCities(logger);

    onMounted(() => {
      loadCities();
    });

    const { isFilled } = useValidation();

    const registerChallengeStore = useRegisterChallengeStore();
    const organizationType = computed<OrganizationType>(() => {
      return registerChallengeStore.getOrganizationType;
    });
    const { getOrganizationLabels } = useOrganizations();
    const hintCityChallenge = computed<string>((): string => {
      return getOrganizationLabels(
        organizationType.value || OrganizationType.company,
      ).hintCityChallenge;
    });
    const labelCityChallenge = computed<string>((): string => {
      return getOrganizationLabels(
        organizationType.value || OrganizationType.company,
      ).labelCityChallenge;
    });

    return {
      subsidiary,
      hintCityChallenge,
      isFilled,
      isLoading,
      labelCityChallenge,
      options,
      FormSubsidiaryAddressFields,
    };
  },
});
</script>

<template>
  <div class="row q-col-gutter-lg" data-cy="form-add-subsidiary">
    <div class="col-12 col-sm-6">
      <!-- Street -->
      <form-field-text-required
        v-model="subsidiary.street"
        :name="FormSubsidiaryAddressFields.street"
        label="form.labelStreet"
        data-cy="form-add-subsidiary-street"
      />
    </div>
    <div class="col-12 col-sm-6">
      <!-- House number -->
      <form-field-text-required
        v-model="subsidiary.houseNumber"
        :name="FormSubsidiaryAddressFields.houseNumber"
        label="form.labelHouseNumber"
        data-cy="form-add-subsidiary-house-number"
      />
    </div>
    <div class="col-12 col-sm-6">
      <!-- City -->
      <form-field-text-required
        v-model="subsidiary.city"
        :name="FormSubsidiaryAddressFields.city"
        label="form.labelCity"
        data-cy="form-add-subsidiary-city"
      />
    </div>
    <div class="col-12 col-sm-6">
      <!-- Zip -->
      <form-field-text-required
        v-model="subsidiary.zip"
        :name="FormSubsidiaryAddressFields.zip"
        label="form.labelZip"
        data-cy="form-add-subsidiary-zip"
      />
    </div>
    <div class="col-12" data-cy="form-widget-subsidiary-city-challenge">
      <!-- City challenge -->
      <label
        for="form-city-challenge"
        class="text-caption text-bold text-gray-10"
        >{{ labelCityChallenge }}</label
      >
      <q-select
        dense
        outlined
        emit-value
        map-options
        v-model="subsidiary.cityChallenge"
        :rules="[
          (val) =>
            isFilled(val) ||
            $t('form.messageFieldRequired', {
              fieldName: $t('form.labelCity'),
            }),
        ]"
        id="form-city-challenge"
        :hint="hintCityChallenge"
        :options="options"
        :loading="isLoading"
        class="q-mt-sm"
        data-cy="form-add-subsidiary-city-challenge"
        :name="FormSubsidiaryAddressFields.cityChallenge"
      ></q-select>
    </div>
    <div class="col-12">
      <!-- Department (note) -->
      <label for="form-department" class="text-caption text-bold text-gray-10">
        {{ $t('form.company.labelDepartment') }}
      </label>
      <q-input
        dense
        outlined
        lazy-rules
        hide-bottom-space
        v-model="subsidiary.department"
        id="form-department"
        :name="FormSubsidiaryAddressFields.department"
        :hint="$t('form.company.hintDepartment')"
        class="q-mt-sm"
        data-cy="form-add-subsidiary-department"
      />
    </div>
  </div>
</template>
