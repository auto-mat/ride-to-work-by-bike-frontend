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
import { computed, defineComponent, nextTick, ref } from 'vue';

// components
import FormAddSubsidiary from './FormAddSubsidiary.vue';
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';
import FormFieldBusinessId from '../form/FormFieldBusinessId.vue';

// composables
import { useOrganizations } from '../../composables/useOrganizations';
import { useValidation } from '../../composables/useValidation';

// enums
import { OrganizationType } from '../types/Organization';
import { FormAddCompanyVariantProp } from '../enums/Form';

// types
import type { FormCompanyFields } from '../types/Form';

export default defineComponent({
  name: 'FormAddCompany',
  components: {
    FormAddSubsidiary,
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

    return {
      company,
      titleDialog,
      OrganizationType,
      isCompany,
      isFilled,
      onUpdate,
      FormAddCompanyVariantProp,
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
        />
      </div>
    </div>
    <div v-if="variant === FormAddCompanyVariantProp.default" class="q-mt-lg">
      <div class="q-mb-md">
        <h3 class="text-body1 text-bold text-black q-my-none">
          {{ $t('form.company.titleSubsidiaryAddress') }}
        </h3>
        <p>
          {{ $t('form.company.textSubsidiaryAddress') }}
        </p>
      </div>
      <!-- Subsidiary address fields -->
      <form-add-subsidiary
        v-model="company.address"
        @update:model-value="onUpdate"
        data-cy="form-add-company-subsidiary"
      />
    </div>
  </div>
</template>
