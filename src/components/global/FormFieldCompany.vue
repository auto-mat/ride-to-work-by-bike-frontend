<script lang="ts">
/**
 * FormFieldCompany Component
 *
 * The `FormFieldCompany` renders company select
 *
 * @description * Use this component to allow user to select their company
 * and create a new company to register under.
 *
 * Used in `FormRegisterCoordinator`, `RegisterChallengePayment`.
 *
 * @props
 * - `modelValue` (number|string, required): The object representing user input.
 *                                           It should be of type `string` or `number`.
 * - `label` (string, optional): The label for the form field.
 * - `organizationType` (String as OrganizationType,
 *                       default: OrganizationType.company): The type of organization.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `DialogDefault`: Used to render a dialog window with form as content.
 * - `FormAddCompany`: Used to render form for registering a new company.
 *
 * @example
 * <form-field-company />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25476&mode=dev)
 */

// libraries
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  ref,
  watch,
  toRef,
} from 'vue';
import { QForm } from 'quasar';

// components
import DialogDefault from 'src/components/global/DialogDefault.vue';
import FormAddCompany from 'src/components/form/FormAddCompany.vue';

// composables
import { useApiGetOrganizations } from 'src/composables/useApiGetOrganizations';
import { useApiPostOrganization } from 'src/composables/useApiPostOrganization';
import { useOrganizations } from 'src/composables/useOrganizations';
import { useValidation } from 'src/composables/useValidation';
import { useSelectSearch } from 'src/composables/useSelectSearch';

// enums
import { FormAddCompanyVariantProp } from '../enums/Form';
import { OrganizationType } from '../types/Organization';

// types
import type {
  FormCompanyFields,
  FormSelectOption,
} from 'src/components/types/Form';
import type { Logger } from 'src/components/types/Logger';

// utils
import { deepObjectWithSimplePropsCopy } from 'src/utils';

export const emptyFormCompanyFields: FormCompanyFields = {
  name: '',
  vatId: '',
  address: {
    street: '',
    houseNumber: '',
    city: '',
    zip: '',
    cityChallenge: null,
    department: '',
  },
};

export default defineComponent({
  name: 'FormFieldCompany',
  components: {
    DialogDefault,
    FormAddCompany,
  },
  props: {
    modelValue: {
      type: [Number],
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    organizationType: {
      type: String as () => OrganizationType,
      default: OrganizationType.company,
    },
  },
  setup(props, { emit }) {
    const logger = inject('vuejs3-logger') as Logger | null;
    const {
      options,
      isLoading: isLoadingGetOrganization,
      loadOrganizations,
    } = useApiGetOrganizations(logger);
    const { createOrganization, isLoading: isLoadinPostOrganization } =
      useApiPostOrganization(logger);
    logger?.debug(
      `Initial organization ID model value is <${props.modelValue}>.`,
    );

    const { optionsFiltered, onFilter } = useSelectSearch(options);

    // load options on component mount
    onMounted(async () => {
      await loadOrganizations(props.organizationType);
      setSelectedOrganization();
    });

    const selectedOrganization = ref<FormSelectOption | null>(null);
    const setSelectedOrganization = (): void => {
      if (options.value?.length) {
        selectedOrganization.value =
          options.value.find((option) => option.value === props.modelValue) ||
          null;
      }
    };
    watch(selectedOrganization, (newValue, oldValue) => {
      logger?.debug(
        `Selected organization changed from <${JSON.stringify(oldValue, null, 2)}>` +
          ` to <${JSON.stringify(newValue, null, 2)}>.`,
      );
      if (newValue) {
        emit('update:modelValue', parseInt(newValue.value as string));
      } else {
        emit('update:modelValue', null);
      }
    });

    /**
     * Logic for "Create company" action
     * Renders dialog for adding a new company
     * and handles form submission.
     */
    const isDialogOpen = ref<boolean>(false);
    // form ref
    const formRef = ref<typeof QForm | null>(null);
    // default form state (make a deep copy of empty state)
    const companyNew: FormCompanyFields = deepObjectWithSimplePropsCopy(
      emptyFormCompanyFields,
    ) as FormCompanyFields;
    /**
     * Close dialog
     * Resets form and closes dialog
     * @returns {void}
     */
    const onClose = (): void => {
      if (formRef.value) {
        formRef.value.reset();
        logger?.info('Close add company modal dialog and reset form.');
      }
      isDialogOpen.value = false;
    };
    /**
     * Submit new company form
     * Validates form and calls createOrganization() func
     * API if valid
     * @returns {Promise<void>}
     */
    const onSubmit = async (): Promise<void> => {
      if (formRef.value) {
        const isFormValid: boolean = await formRef.value.validate();

        logger?.debug(`Form is valid <${isFormValid}>.`);
        if (isFormValid) {
          logger?.info('Create organization.');
          const data = await createOrganization(
            companyNew.name,
            companyNew.vatId,
            props.organizationType,
          );
          if (data?.id) {
            logger?.debug(`Organization created with ID <${data.id}>.`);
            logger?.debug(`Organization created with name <${data.name}>.`);
            // close dialog
            isDialogOpen.value = false;
            logger?.info('Close add company modal dialog.');
            // Set organizations option to created organization
            logger?.debug(`Setting organizations options to ID <${data.id}>.`);
            const newCompanyOption: { label: string; value: number } = {
              label: data.name,
              value: data.id,
            };
            optionsFiltered.value.push(newCompanyOption);
            selectedOrganization.value = newCompanyOption;
            logger?.debug(
              `Append newly created organization <${JSON.stringify(
                newCompanyOption,
                null,
                2,
              )}>` + ' into select organizations widget options.',
            );
            // Append newly created organization option into all organization select widget options
            options.value.push(newCompanyOption);
          }
        } else {
          formRef.value.$el.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }
    };

    const { isFilled } = useValidation();

    const { getOrganizationLabels } = useOrganizations();

    const formFieldLabel = computed(() => {
      return props.label
        ? props.label
        : getOrganizationLabels(props.organizationType).label;
    });

    const addNewOrganizationDialogTitle = computed(() => {
      return getOrganizationLabels(props.organizationType).titleDialog;
    });

    const addNewOrganizationDialogBtn = computed(() => {
      return getOrganizationLabels(props.organizationType).buttonDialog;
    });

    const organizationFieldValidationTransStrings = computed(() => {
      return getOrganizationLabels(props.organizationType).labelShort;
    });

    const messageNoResult = computed(() => {
      return getOrganizationLabels(props.organizationType).messageNoResult;
    });

    const organizationType = toRef(props, 'organizationType');
    watch(organizationType, (newValue, oldValue) => {
      logger?.debug(
        `New organization type was selected, new value is  <${newValue}>, old value was <${oldValue}>.`,
      );
      // Erase select organization widget value
      selectedOrganization.value = null;
      logger?.debug(
        `Erase select organization widget value <${selectedOrganization.value}>.`,
      );
      // Organization type changed, load new options
      loadOrganizations(newValue);
    });

    return {
      addNewOrganizationDialogTitle,
      addNewOrganizationDialogBtn,
      companyNew,
      formFieldLabel,
      formRef,
      isDialogOpen,
      isFilled,
      isLoadingGetOrganization,
      isLoadinPostOrganization,
      optionsFiltered,
      messageNoResult,
      options,
      onClose,
      onFilter,
      onSubmit,
      organizationFieldValidationTransStrings,
      FormAddCompanyVariantProp,
      OrganizationType,
      selectedOrganization,
    };
  },
});
</script>

<template>
  <div data-cy="form-company">
    <!-- Label -->
    <label
      for="form-company"
      class="text-caption text-bold"
      data-cy="form-field-company-label"
    >
      {{ formFieldLabel }}
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
          :lazy-rules="true"
          v-model="selectedOrganization"
          :options="optionsFiltered"
          :loading="isLoadingGetOrganization"
          class="q-mt-sm"
          id="form-company"
          name="company"
          :rules="[
            (val) =>
              isFilled(val) ||
              $t('form.messageFieldRequired', {
                fieldName: organizationFieldValidationTransStrings,
              }),
          ]"
          @filter="onFilter"
          data-cy="form-company-input"
        >
          <!-- Item: No option -->
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ messageNoResult }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div
        class="col-12 col-sm-auto flex items-start justify-end q-pt-sm q-pl-md"
        data-cy="col-button"
      >
        <!-- Button: Add company -->
        <q-btn
          flat
          rounded
          icon="mdi-plus"
          color="primary"
          style="margin-top: 2px"
          @click.prevent="isDialogOpen = true"
          data-cy="button-add-company"
        >
          <!-- Label -->
          <span class="inline-block q-pl-xs">
            {{ $t('register.challenge.buttonAddCompany') }}
          </span>
        </q-btn>
      </div>
    </div>
    <!-- Dialog: Add company -->
    <dialog-default v-model="isDialogOpen" data-cy="dialog-add-company">
      <template #title>
        {{ addNewOrganizationDialogTitle }}
      </template>
      <template #content>
        <q-form ref="formRef" @submit.prevent="onSubmit">
          <form-add-company
            v-model="companyNew"
            :variant="FormAddCompanyVariantProp.simple"
            :organization-type="organizationType"
          ></form-add-company>
          <!-- Hidden submit button enables Enter key to submit -->
          <q-btn type="submit" class="hidden" />
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
              {{ addNewOrganizationDialogBtn }}
            </q-btn>
          </div>
        </div>
      </template>
    </dialog-default>
  </div>
</template>
