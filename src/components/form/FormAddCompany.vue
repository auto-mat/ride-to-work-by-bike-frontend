<script lang="ts">
/**
 * FormAddCompany Component
 *
 * @description * Use this component to render form for registering a new
 * company.
 * You can adjust its appearance by changing the `variant` prop.
 *
 * Form uses organization address fields for subsidiary addresses.
 * Optionally users can choose to input a different address.
 * By default cityChallenge and department fields are shown for subsidiary.
 *
 * Note: This component is commonly used in `FormFieldCompany`,
 * `FormFieldSelectTable`.
 *
 * @props
 * - `modelValue` (Object, required): The object representing the form state.
 * - `organizationType` (String as OrganizationType,
 *                       default: OrganizationType.company): The type of organization.
 * - `variant` (String as FormAddCompanyVariantProp,
 *              default: FormAddCompanyVariantProp.default): The variant of the form.
 *                                                           `simple` only shows `name` and `vatId` fields.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
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
import {
  computed,
  defineComponent,
  inject,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue';

// components
import FormAddSubsidiary from './FormAddSubsidiary.vue';
import FormFieldAddress from './FormFieldAddress.vue';
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';
import FormFieldBusinessId from '../form/FormFieldBusinessId.vue';

// composables
import { useApiGetCities } from '../../composables/useApiGetCities';
import { useOrganizations } from '../../composables/useOrganizations';
import { useValidation } from '../../composables/useValidation';

import { onTrack } from '../../utils/track';

// enums
import { OrganizationType } from '../types/Organization';
import { FormAddCompanyVariantProp, FormSubsidiaryFields } from '../enums/Form';

// types
import type { FormCompanyFields, FormOption } from '../types/Form';
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'FormAddCompany',
  components: {
    FormAddSubsidiary,
    FormFieldAddress,
    FormFieldTextRequired,
    FormFieldBusinessId,
  },
  props: {
    modelValue: {
      type: Object as () => FormCompanyFields,
      required: true,
    },
    organizationType: {
      type: String as () => OrganizationType,
      default: OrganizationType.company,
    },
    variant: {
      type: String as () => FormAddCompanyVariantProp,
      default: FormAddCompanyVariantProp.default,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const company = ref(props.modelValue);
    const logger = inject('vuejs3-logger') as Logger | null;
    const isDifferentSubsidiaryAddress = ref<boolean>(false);

    const onUpdate = (): void => {
      // wait for next tick to emit the value after update
      nextTick((): void => {
        emit('update:modelValue', company.value);
      });
    };

    const { isFilled } = useValidation();

    const isCompany = computed((): boolean => {
      return props.organizationType === OrganizationType.company;
    });

    const { getOrganizationLabels } = useOrganizations();
    const titleDialog = computed((): string => {
      return getOrganizationLabels(props.organizationType).labelShort;
    });
    const sectionTitleSubsidiaryAddress = computed((): string => {
      return getOrganizationLabels(props.organizationType)
        .sectionTitleSubsidiaryAddress;
    });

    // cities API integration for minimal subsidiary fields
    const {
      isLoading: isCityLoading,
      cities,
      loadCities,
    } = useApiGetCities(logger);

    const cityOptions = computed<FormOption[]>(() =>
      cities.value.map((city) => ({
        label: city.name,
        value: city.id,
      })),
    );

    const labelCityChallenge = computed<string>((): string => {
      return getOrganizationLabels(props.organizationType).labelCityChallenge;
    });
    const hintCityChallenge = computed<string>((): string => {
      return getOrganizationLabels(props.organizationType).hintCityChallenge;
    });
    const showMinimalSubsidiaryFields = computed((): boolean => {
      return (
        props.variant === FormAddCompanyVariantProp.default &&
        !isDifferentSubsidiaryAddress.value
      );
    });
    const showFullSubsidiaryFields = computed((): boolean => {
      return (
        props.variant === FormAddCompanyVariantProp.default &&
        isDifferentSubsidiaryAddress.value
      );
    });

    // sync company address to subsidiary when addresses should be the same
    watch(
      [isDifferentSubsidiaryAddress, () => company.value.orgAddress],
      ([isDifferent, orgAddress]) => {
        if (!isDifferent && company.value.subsidiaryAddress && orgAddress) {
          // copy orgAddress fields to subsidiaryAddress
          company.value.subsidiaryAddress.street = orgAddress.street;
          company.value.subsidiaryAddress.houseNumber = orgAddress.houseNumber;
          company.value.subsidiaryAddress.city = orgAddress.city;
          company.value.subsidiaryAddress.zip = orgAddress.zip;
          onUpdate();
        }
      },
      { deep: true, immediate: true },
    );

    onMounted(() => {
      if (
        props.variant === FormAddCompanyVariantProp.default &&
        !cities.value.length
      ) {
        loadCities();
      }
    });

    return {
      company,
      titleDialog,
      OrganizationType,
      isCompany,
      isFilled,
      sectionTitleSubsidiaryAddress,
      onUpdate,
      FormAddCompanyVariantProp,
      isDifferentSubsidiaryAddress,
      cityOptions,
      isCityLoading,
      labelCityChallenge,
      hintCityChallenge,
      showMinimalSubsidiaryFields,
      showFullSubsidiaryFields,
      FormSubsidiaryFields,
      onTrack,
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
        {{ titleDialog }}
      </h3>
      <p
        v-if="variant === FormAddCompanyVariantProp.default && isCompany"
        class="q-mt-sm"
        data-cy="form-add-company-permission"
      >
        {{ $t('form.company.textCompanyPermission') }}
      </p>
    </div>
    <div class="row q-col-gutter-lg">
      <div class="col-12" :class="{ 'col-sm-6': isCompany }">
        <!-- Input: Company name -->
        <form-field-text-required
          v-model="company.name"
          name="name"
          label="form.labelTitle"
          @update:model-value="onUpdate"
          data-cy="form-add-company-name"
          v-click-track-evt
          @click-track="onTrack"
        />
      </div>
      <div class="col-12" :class="{ 'col-sm-6': isCompany }">
        <!-- Input: VAT ID -->
        <form-field-business-id
          v-if="isCompany"
          v-model="company.vatId"
          name="vatId"
          :label="$t('form.labelBusinessId')"
          @update:model-value="onUpdate"
          data-cy="form-add-company-vat-id"
          v-click-track-evt
          @click-track="onTrack"
        />
      </div>
    </div>
    <!-- Organization billing address -->
    <div class="q-mt-lg">
      <div class="q-mb-md">
        <h3
          class="text-body1 text-bold text-black q-my-none"
          data-cy="form-add-company-section-org-address-title"
        >
          {{ $t('form.company.titleOrganizationAddress') }}
        </h3>
        <p class="q-mt-sm" data-cy="form-add-company-org-address-description">
          {{ $t('form.company.textOrganizationAddress') }}
        </p>
      </div>
      <!-- Billing address fields -->
      <form-field-address
        v-model:street="company.orgAddress.street"
        v-model:house-number="company.orgAddress.houseNumber"
        v-model:city="company.orgAddress.city"
        v-model:zip="company.orgAddress.zip"
        field-prefix="orgAddress"
        @update:street="onUpdate"
        @update:house-number="onUpdate"
        @update:city="onUpdate"
        @update:zip="onUpdate"
        data-cy="form-add-company-org-address"
      />
    </div>
    <!-- Subsidiary location address (default variant only) -->
    <div v-if="variant === FormAddCompanyVariantProp.default" class="q-mt-lg">
      <div class="q-mb-md">
        <h3
          class="text-body1 text-bold text-black q-my-none"
          data-cy="form-add-company-section-subsidiary-title"
        >
          {{ sectionTitleSubsidiaryAddress }}
        </h3>
        <p class="q-mt-sm">
          {{ $t('form.company.textSubsidiaryAddress') }}
        </p>
      </div>
      <!-- Checkbox: Different subsidiary address -->
      <div class="q-mb-md">
        <q-checkbox
          dense
          v-model="isDifferentSubsidiaryAddress"
          color="primary"
          :label="$t('form.company.labelSubsidiaryAddressDifferent')"
          data-cy="form-add-company-checkbox-different-address"
        />
      </div>
      <!-- Full subsidiary form (when different subsidiary address) -->
      <form-add-subsidiary
        v-if="showFullSubsidiaryFields && company.subsidiaryAddress"
        v-model="company.subsidiaryAddress"
        @update:model-value="onUpdate"
        data-cy="form-add-company-subsidiary-full"
      />
      <!-- Minimal subsidiary fields -->
      <div
        v-if="showMinimalSubsidiaryFields && company.subsidiaryAddress"
        class="row q-col-gutter-lg"
      >
        <div
          class="col-12"
          data-cy="form-widget-subsidiary-city-challenge-minimal"
        >
          <!-- City challenge -->
          <label
            for="form-city-challenge-minimal"
            class="text-caption text-bold text-gray-10"
            >{{ labelCityChallenge }}</label
          >
          <q-select
            dense
            outlined
            emit-value
            map-options
            v-model="company.subsidiaryAddress.cityChallenge"
            :rules="[
              (val) =>
                isFilled(val) ||
                $t('form.messageFieldRequired', {
                  fieldName: $t('form.labelCity'),
                }),
            ]"
            id="form-city-challenge-minimal"
            :hint="hintCityChallenge"
            :options="cityOptions"
            :loading="isCityLoading"
            class="q-mt-sm"
            @update:model-value="onUpdate"
            data-cy="form-add-company-city-challenge-minimal"
            :name="FormSubsidiaryFields.cityChallenge"
            v-click-track-evt
            @click-track="onTrack"
          ></q-select>
        </div>
        <div class="col-12">
          <!-- Department (note) -->
          <label
            for="form-department-minimal"
            class="text-caption text-bold text-gray-10"
          >
            {{ $t('form.company.labelDepartment') }}
          </label>
          <q-input
            dense
            outlined
            lazy-rules
            hide-bottom-space
            v-model="company.subsidiaryAddress.department"
            id="form-department-minimal"
            :name="FormSubsidiaryFields.department"
            :hint="$t('form.company.hintDepartment')"
            class="q-mt-sm"
            @update:model-value="onUpdate"
            data-cy="form-add-company-department-minimal"
            v-click-track-evt
            @click-track="onTrack"
          />
        </div>
      </div>
    </div>
  </div>
</template>
