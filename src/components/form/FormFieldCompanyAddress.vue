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
 * - `FormAddress`: Component to render address form fields.
 *
 * @example
 * <form-field-company-address />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6485%3A29568&mode=dev)
 */

// libraries
import { defineComponent, nextTick, ref } from 'vue';

// components
import DialogDefault from 'src/components/global/DialogDefault.vue';

// types
import type { FormOption } from 'src/components/types/Form';

export default defineComponent({
  name: 'FormFieldCompanyAddress',
  components: {
    DialogDefault,
  },
  props: {
    companyId: {
      type: String,
    },
  },
  emits: ['update:formValue'],
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

    const onClose = (): void => {
      isDialogOpen.value = false;
    };

    const onSubmit = async (): Promise<void> => {
      // noop
      isDialogOpen.value = false;
    };

    return {
      addressValue,
      isDialogOpen,
      options,
      onClose,
      onSubmit,
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
    <div class="row q-mt-sm">
      <div class="col-12 col-sm" data-cy="col-input">
        <!-- Input: Autocomplete -->
        <q-select
          outlined
          id="form-company-address"
          v-model="addressValue"
          :hint="$t('form.company.hintAddress')"
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
  <!-- Dialog: Add address -->
  <dialog-default v-model="isDialogOpen" data-cy="dialog-add-address">
    <template #title>
      {{ $t('form.company.titleAddAddress') }}
    </template>
    <template #content>
      <q-form ref="formRef">
        <!-- <form-address
          :form-values="addressNew"
          variant="simple"
          @update:form-values="addressNew = $event"
        ></form-address> -->
      </q-form>
      <!-- Action buttons -->
      <div class="flex justify-end q-mt-sm">
        <div class="flex gap-8">
          <q-btn
            rounded
            unelevated
            outline
            color="primary"
            data-cy="dialog-button-cancel"
            @click="onClose"
          >
            {{ $t('navigation.discard') }}
          </q-btn>
          <q-btn
            rounded
            unelevated
            color="primary"
            data-cy="dialog-button-submit"
            @click="onSubmit"
          >
            {{ $t('form.company.buttonAddBranch') }}
          </q-btn>
        </div>
      </div>
    </template>
  </dialog-default>
</template>
