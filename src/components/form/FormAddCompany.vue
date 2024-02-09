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
 * - `variant` (String as 'default', 'simple'): The variant of the form.
 *   `simple` only shows `name` and `vatId` fields.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `FormFieldTextRequired`: Component to render required field.
 * - `FormFieldVatId`: Component to render registration number field.
 *
 * @example
 * <form-add-company v-model="companyNew" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6014%3A46090&mode=dev)
 */

// libraries
import { defineComponent, nextTick, ref } from 'vue';

// components
import FormFieldTextRequired from 'src/components/global/FormFieldTextRequired.vue';
import FormFieldVatId from 'src/components/form/FormFieldVatId.vue';

// types
import type { FormCompanyFields } from 'src/components/types/Form';

export default defineComponent({
  name: 'FormAddCompany',
  components: {
    FormFieldTextRequired,
    FormFieldVatId,
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

    const onUpdate = (): void => {
      // wait for next tick to emit the value after update
      nextTick((): void => {
        emit('update:formValues', company.value);
      });
    };

    return {
      company,
      onUpdate,
    };
  },
});
</script>

<template>
  <div>
    <h3 class="text-body1 text-bold text-black q-mt-none q-mb-md">
      {{ $t('form.labelCompanyShort') }}
    </h3>
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm">
        <!-- Input: Company name -->
        <form-field-text-required
          v-model="company.name"
          name="name"
          label="form.labelTitle"
          @update:model-value="onUpdate"
          data-cy="form-add-company-name"
        />
      </div>
      <div class="col-12 col-sm">
        <!-- Input: VAT ID -->
        <form-field-vat-id
          v-model="company.vatId"
          name="vatId"
          label="form.labelVatId"
          @update:model-value="onUpdate"
          data-cy="form-add-company-vat-id"
        />
      </div>
    </div>
  </div>
</template>
