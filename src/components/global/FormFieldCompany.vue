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
 * - `modelValue` (string, required): The object representing user input.
 *   It should be of type `string`.
 * - `label` (string, optional): The label for the form field.
 * - `organizationType` (string['company'|'school'|'family'], optional): Organization type
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
import { computed, defineComponent, inject, ref } from 'vue';
import { QForm } from 'quasar';

// components
import DialogDefault from 'src/components/global/DialogDefault.vue';
import FormAddCompany from 'src/components/form/FormAddCompany.vue';

// composables
import { i18n } from 'src/boot/i18n';
import { useApi } from 'src/composables/useApi';
import { useValidation } from 'src/composables/useValidation';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// enums
import { OrganizationType } from '../types/Organization';

// stores
import { useLoginStore } from 'src/stores/login';

// types
import type {
  FormCompanyFields,
  FormSelectOption,
} from 'src/components/types/Form';
import type { Logger } from 'src/components/types/Logger';
import type {
  GetOrganizationsResponse,
  PostOrganizationPayload,
  PostOrganizationsResponse,
} from 'src/components/types/Organization';

// utils
import { requestDefaultHeader, requestTokenHeader } from 'src/utils';
import { getApiBaseUrlWithLang } from 'src/utils/get_api_base_url_with_lang';

export const emptyFormCompanyFields: FormCompanyFields = {
  name: '',
  vatId: '',
  address: [
    {
      street: '',
      houseNumber: '',
      city: '',
      zip: '',
      cityChallenge: '',
      department: '',
    },
  ],
};

export default defineComponent({
  name: 'FormFieldCompany',
  components: {
    DialogDefault,
    FormAddCompany,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    organizationType: {
      type: String as () => OrganizationType,
    },
  },
  setup(props, { emit }) {
    const logger = inject('vuejs3-logger') as Logger | null;
    const options = ref<FormSelectOption[]>([]);
    const optionsDefault = ref<FormSelectOption[]>([]);
    const isOptionsLoading = ref<boolean>(false);
    const loginStore = useLoginStore();
    const { apiFetch } = useApi();
    // get API base URL
    const { apiBase, apiDefaultLang, urlApiOrganizations } =
      rideToWorkByBikeConfig;
    const apiBaseUrl = getApiBaseUrlWithLang(
      null,
      apiBase,
      apiDefaultLang,
      i18n,
    );
    const urlApiOrganizationsLocalized = `${apiBaseUrl}${urlApiOrganizations}`;
    /**
     * Load options
     * Fetches organizations and saves them into default options
     * @returns {Promise<void>}
     */
    const loadOptions = async (): Promise<void> => {
      logger?.info('Get organizations from the API.');
      isOptionsLoading.value = true;
      // append access token into HTTP header
      const requestTokenHeader_ = { ...requestTokenHeader };
      requestTokenHeader_.Authorization += loginStore.getAccessToken;
      // fetch organizations
      const { data } = await apiFetch<GetOrganizationsResponse>({
        endpoint: urlApiOrganizationsLocalized,
        method: 'get',
        translationKey: 'getOrganizations',
        showSuccessMessage: false,
        headers: Object.assign(requestDefaultHeader, requestTokenHeader_),
        logger,
      });
      // save default option array
      if (data?.results?.length) {
        logger?.info('Organizations fetched. Saving to default options.');
        logger?.debug(
          `Setting default options to <${JSON.stringify(data.results)}>.`,
        );
        optionsDefault.value = data.results.map((option) => {
          return {
            label: option.name,
            value: option.id,
          };
        });
        logger?.debug(
          `Default options set to <${JSON.stringify(optionsDefault.value)}>.`,
        );
      }
      isOptionsLoading.value = false;
    };
    // load options on component mount
    loadOptions();

    // company v-model
    const company = computed({
      get: () => props.modelValue,
      set: (value: string) => {
        logger?.debug(`Company set to <${value}>.`);
        emit('update:modelValue', value);
      },
    });

    /**
     * Autocomplete functionality for company select
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
        options.value = optionsDefault.value.filter(
          (option) =>
            option.label.toLocaleLowerCase().indexOf(valLowerCase) > -1,
        );
      });
    };

    /**
     * Logic for "Create company" action
     * Renders dialog for adding a new company
     * and handles form submission.
     */
    const isDialogOpen = ref<boolean>(false);
    // form ref
    const formRef = ref<typeof QForm | null>(null);
    // default form state (make a deep copy of empty state)
    const companyNew: FormCompanyFields = JSON.parse(
      JSON.stringify(emptyFormCompanyFields),
    );
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
     * Validates form and calls createOrganization API if valid
     * @returns {Promise<void>}
     */
    const onSubmit = async (): Promise<void> => {
      if (formRef.value) {
        const isFormValid: boolean = await formRef.value.validate();

        logger?.debug(`Form is valid <${isFormValid}>.`);
        if (isFormValid) {
          logger?.info('Create organization.');
          createOrganization();
        } else {
          formRef.value.$el.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }
    };
    /**
     * Create organization
     * Creates a new organization in database
     * @returns {Promise<void>}
     */
    const createOrganization = async (): Promise<void> => {
      logger?.info('Post new organization to API.');
      // append access token into HTTP header
      const requestTokenHeader_ = { ...requestTokenHeader };
      requestTokenHeader_.Authorization += loginStore.getAccessToken;
      // data
      logger?.debug(`Create organization with name <${companyNew.name}>.`);
      logger?.debug(`Create organization with vatId <${companyNew.vatId}>.`);
      const payload: PostOrganizationPayload = {
        name: companyNew.name,
        vatId: companyNew.vatId,
      };
      // fetch organizations
      const { data } = await apiFetch<PostOrganizationsResponse>({
        endpoint: urlApiOrganizationsLocalized,
        method: 'post',
        translationKey: 'createOrganization',
        headers: Object.assign(requestDefaultHeader, requestTokenHeader_),
        payload: payload,
        logger,
      });
      if (data?.id) {
        logger?.debug(`Organization created with ID <${data.id}>.`);
        logger?.debug(`Organization created with name <${data.name}>.`);
        // close dialog
        isDialogOpen.value = false;
        logger?.info('Close add company modal dialog.');
        // refetch organizations
        logger?.info('Refetching organizations.');
        await loadOptions();
        // set company to new organization
        logger?.debug(`Setting organization to ID <${data.id}>.`);
        const newCompanyOption: FormSelectOption = {
          label: data.name,
          value: data.id,
        };
        options.value.push(newCompanyOption);
        company.value = newCompanyOption.value;
      }
    };

    const { isFilled } = useValidation();

    const formFieldLabel = computed(
      () => props.label || i18n.global.t('form.labelCompany'),
    );

    return {
      company,
      companyNew,
      formFieldLabel,
      formRef,
      isDialogOpen,
      isFilled,
      isOptionsLoading,
      options,
      onClose,
      onFilter,
      onSubmit,
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
          emit-value
          map-options
          hide-selected
          fill-input
          hide-bottom-space
          input-debounce="0"
          :model-value="company"
          :options="options"
          :loading="isOptionsLoading"
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
          @update:model-value="company = $event"
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
    <dialog-default
      v-model="isDialogOpen"
      :form-ref="formRef"
      data-cy="dialog-add-company"
    >
      <template #title>
        {{ $t('form.company.titleAddCompany') }}
      </template>
      <template #content>
        <q-form ref="formRef">
          <form-add-company
            v-model="companyNew"
            variant="simple"
            :organization-type="organizationType"
          ></form-add-company>
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
              {{ $t('form.company.buttonAddCompany') }}
            </q-btn>
          </div>
        </div>
      </template>
    </dialog-default>
  </div>
</template>
