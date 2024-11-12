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
 * - `options` (FormOption[], required): Object representing address options.
 *   It should be of type `FormOption[]`.
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
import { computed, defineComponent, ref, watch } from 'vue';

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
    options: {
      type: Array as () => FormOption[],
      required: true,
    },
    modelValue: {
      type: Object as () => FormCompanyAddressFields | null,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const address = computed<FormCompanyAddressFields | null>({
      get: () => props.modelValue,
      set: (value: FormCompanyAddressFields | null) =>
        emit('update:modelValue', value),
    });

    watch(
      () => props.options,
      () => {
        address.value = null;
      },
    );

    const { isFilled } = useValidation();
    const { isDialogOpen, onClose } = useDialog();

    const onSubmit = async (): Promise<void> => {
      // TODO: Add address via API
      isDialogOpen.value = false;
    };

    /**
     * Provides dialog behaviour
     * @returns
     * - `isDialogOpen` (boolean): Whether the dialog is open.
     * - `onClose` (function): Runs when the dialog is closed.
     */
    function useDialog() {
      const isDialogOpen = ref<boolean>(false);

      const onClose = (): void => {
        isDialogOpen.value = false;
      };

      return {
        isDialogOpen,
        onClose,
      };
    }

    return {
      address,
      isDialogOpen,
      isFilled,
      onClose,
      onSubmit,
    };
  },
});
</script>

<template>
  <div data-cy="form-company-address">
    <div class="row q-mt-sm q-col-gutter-sm">
      <label
        for="form-company-address"
        class="col-12 text-caption text-bold text-grey-10"
        data-cy="form-company-address-label"
      >
        {{ $t('form.company.labelAddress') }}
      </label>
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
          data-cy="form-company-address-input"
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
            {{ $t('form.company.buttonAddSubsidiary') }}
          </q-btn>
        </div>
      </div>
    </template>
  </dialog-default>
</template>
