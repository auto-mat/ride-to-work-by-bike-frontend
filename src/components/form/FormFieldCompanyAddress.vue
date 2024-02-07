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

// composables
import { useValidation } from 'src/composables/useValidation';

// types
import type {
  FormCompanyAddressFields,
  FormOption,
} from 'src/components/types/Form';

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
    const address = ref<string | null>(null);
    const isDialogOpen = ref<boolean>(false);

    const options: FormOption[] = [
      {
        label: 'Address 1',
        value: 'address-1',
      },
      {
        label: 'Address 2',
        value: 'address-2',
      },
    ];

    // Lookup dictionary which provides the full values based on address ID.
    // TODO: validate the possibility of using this method
    const addresses: { [key: string]: FormCompanyAddressFields } = {
      'address-1': {
        street: 'Street 1',
        streetNumber: '123',
        city: 'City 1',
        zip: '1234',
        referenceCity: 'Ref City 1',
        department: 'Department 1',
      },
      'address-2': {
        street: 'Street 2',
        streetNumber: '123',
        city: 'City 2',
        zip: '1234',
        referenceCity: 'Ref City 2',
        department: 'Department 2',
      },
    };

    const onUpdate = (): void => {
      // wait for next tick to emit the value after update
      nextTick((): void => {
        if (address.value) {
          emit('update:formValue', addresses[address.value as string]);
        }
      });
    };

    const onClose = (): void => {
      isDialogOpen.value = false;
    };

    const onSubmit = async (): Promise<void> => {
      // noop
      isDialogOpen.value = false;
    };

    const { isFilled } = useValidation();

    return {
      address,
      isDialogOpen,
      options,
      isFilled,
      onClose,
      onSubmit,
      onUpdate,
    };
  },
});
</script>

<template>
  <div data-cy="form-company-address">
    <label
      for="form-company-address"
      class="text-caption text-bold text-grey-10"
      data-cy="form-company-address-label"
    >
      {{ $t('form.company.labelAddress') }}
    </label>
    <div class="row q-mt-sm q-col-gutter-md">
      <div class="col-12 col-sm" data-cy="col-input">
        <!-- Input: Autocomplete -->
        <q-select
          dense
          outlined
          emit-value
          map-options
          id="form-company-address"
          v-model="address"
          :hint="$t('form.company.hintAddress')"
          :options="options"
          :rules="[
            (val) =>
              isFilled(val) ||
              $t('form.messageFieldRequired', {
                fieldName: $t('form.labelAddress'),
              }),
          ]"
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
        class="col-12 col-sm-auto flex items-start justify-end q-pl-md"
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
          data-cy="button-add-address"
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
      <q-form>
        <!-- TODO: add FormAddress -->
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
