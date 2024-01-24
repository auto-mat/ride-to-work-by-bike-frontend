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
 * - `modelValue` (string, required): The object representing user input.
 *   It should be of type `string`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `DialogForm`: Used to render a dialog window with form as content.
 *
 * @example
 * <form-field-company />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25476&mode=dev)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';
import { QForm } from 'quasar';

// components
import DialogForm from 'src/components/global/DialogForm.vue';

// composables
import { useValidation } from 'src/composables/useValidation';

// constants
const stringOptions: string[] = ['Company 1', 'Company 2'];

export default defineComponent({
  name: 'FormFieldCompany',
  components: {
    DialogForm,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const options = ref<string[]>([]);
    const isDialogOpen = ref<boolean>(false);
    const formRef = ref<typeof QForm | null>(null);

    const company = computed({
      get: () => props.modelValue,
      set: (value: string) => {
        emit('update:modelValue', value);
      },
    });

    const companyNew = {
      name: '',
    };

    // handles select input
    const onInputValue = (val: string) => {
      company.value = val;
    };

    /**
     * Provides autocomplete functionality
     * Upon typing, find strings which contain query entered into the select
     *
     * Limitation: does not support fuzzy search
     *
     * Quasar types are not implemented yet so we provide custom typing
     * for update function.
     * See https://github.com/quasarframework/quasar/issues/8914#issuecomment-1313783889
     *
     * See https://quasar.dev/vue-components/select#example--text-autocomplete
     */
    const onFilter = (val: string, update: (fn: () => void) => void) => {
      update(() => {
        const valLowerCase = val.toLocaleLowerCase();
        options.value = stringOptions.filter(
          (option) => option.toLocaleLowerCase().indexOf(valLowerCase) > -1,
        );
      });
    };

    const { isFilled } = useValidation();

    return {
      company,
      companyNew,
      formRef,
      isDialogOpen,
      options,
      isFilled,
      onFilter,
      onInputValue,
    };
  },
});
</script>

<template>
  <div data-cy="form-company">
    <!-- Label -->
    <label for="form-company" class="text-caption text-bold">
      {{ $t('form.labelCompany') }}
    </label>
    <div class="row">
      <div class="col-12 col-sm" data-cy="col-input">
        <!-- Input: Autocomplete -->
        <q-select
          dense
          outlined
          use-input
          hide-selected
          fill-input
          hide-bottom-space
          input-debounce="0"
          :model-value="company"
          :options="options"
          class="q-mt-sm"
          id="form-company"
          name="company"
          :rules="[
            (val) =>
              isFilled(val) ||
              $t('form.messageFieldRequired', {
                fieldName: $t('form.labelCompanyShort'),
              }),
          ]"
          @filter="onFilter"
          @input-value="onInputValue"
          data-cy="form-company-input"
        >
          <!-- Item: No option -->
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ $t('form.messageNoCompany') }}
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
          data-cy="button-add-company"
          @click.prevent="isDialogOpen = true"
        >
          <!-- Label -->
          <span class="inline-block q-pl-xs">
            {{ $t('register.challenge.buttonAddCompany') }}
          </span>
        </q-btn>
      </div>
    </div>
    <!-- Dialog: Add company -->
    <dialog-form
      v-model="isDialogOpen"
      :form-ref="formRef"
      data-cy="dialog-add-company"
    >
      <template v-slot:content>
        <q-form ref="formRef">
          <q-input
            dense
            outlined
            v-model="companyNew.name"
            label="Company name"
            name="company"
            data-cy="dialog-add-company-input"
          />
        </q-form>
      </template>
      <template v-slot:buttons="{ close, submit }">
        <q-btn
          flat
          color="primary"
          data-cy="dialog-add-company-button"
          @click="submit"
        >
          {{ $t('register.challenge.buttonAddCompany') }}
        </q-btn>
        <q-btn
          flat
          color="primary"
          data-cy="dialog-add-company-button-cancel"
          @click="close"
        >
          {{ $t('register.challenge.buttonCancel') }}
        </q-btn>
      </template>
    </dialog-form>
  </div>
</template>
