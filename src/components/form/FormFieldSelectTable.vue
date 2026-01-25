<script lang="ts">
/**
 * FormFieldSelectTable Component
 *
 * The `FormFieldSelectTable`
 *
 * @description * Use this component to display company select with search
 * field.
 *
 * Note: This component is commonly used in `RegisterChallengePage`.
 *
 * @props
 * - `modelValue` (Number, required): The ID representing selected
 *   company.
 * - `options` (Array<FormSelectTableOption>, required): The object
 *   representing the options.
 * - `organizationLevel` (OrganizationLevel, required): The organization
 *   level - table is used for organization or team selection.
 * - `organizationType` (OrganizationType,
 *   default: OrganizationType.organization): The organization type.
 * - `loading` (Boolean): Loading (options data from the API) state
 *   default: null
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 * - `create:option`: Emitted when a new option is created.
 *
 * @components
 * - `DialogDefault`: Used to render a dialog window with form as content.
 * - `FormAddCompany`: Used to render form for registering a new company.
 * - `FormAddTeam`: Used to render form for registering a new team.
 *
 * @example
 * <form-field-select-table
 *  v-model="organizationId"
 *  :organization-level="OrganizationLevel.organization"
 *  :options="organizationOptions"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5366%3A28607&mode=dev)
 */

// libraries
import {
  computed,
  defineComponent,
  defineExpose,
  inject,
  nextTick,
  ref,
  watch,
} from 'vue';
import { QForm, QSelect, QVirtualScroll } from 'quasar';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// components
import DialogDefault from '../global/DialogDefault.vue';
import FormAddCompany from '../form/FormAddCompany.vue';
import FormAddTeam from '../form/FormAddTeam.vue';

// composables
import { useOrganizations } from '../../composables/useOrganizations';
import { useSelectTable } from '../../composables/useSelectTable';
import { useValidation } from '../../composables/useValidation';
import { useApiPostTeam } from '../../composables/useApiPostTeam';
import { useApiPostOrganization } from '../../composables/useApiPostOrganization';
import { useApiPostSubsidiary } from '../../composables/useApiPostSubsidiary';

// enums
import { OrganizationType, OrganizationLevel } from '../types/Organization';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// types
import type { Logger } from '../types/Logger';
import {
  FormCompanyFields,
  FormOption,
  FormSelectTableOption,
  FormTeamFields,
} from '../types/Form';
import type { OrganizationSubsidiary } from '../types/Organization';

// utils
import { deepObjectWithSimplePropsCopy } from '../../utils';

const emptyFormCompanyFields: FormCompanyFields = {
  name: '',
  vatId: '',
  orgAddress: {
    street: '',
    houseNumber: '',
    city: '',
    zip: '',
  },
  subsidiaryAddress: {
    street: '',
    houseNumber: '',
    city: '',
    zip: '',
    cityChallenge: null,
    department: '',
  },
};

export default defineComponent({
  name: 'FormFieldSelectTable',
  components: {
    DialogDefault,
    FormAddCompany,
    FormAddTeam,
  },
  props: {
    modelValue: {
      type: Number as () => number | null,
      required: false,
      default: null,
    },
    options: {
      type: Array as () => FormSelectTableOption[] | FormOption[],
      required: true,
    },
    organizationLevel: {
      type: String as () => OrganizationLevel,
      required: true,
    },
    organizationType: {
      type: String as () => OrganizationType,
      default: OrganizationType.company,
    },
    loading: {
      type: Boolean,
      default: null,
    },
  },
  emits: ['update:modelValue', 'create:option'],
  setup(props, { emit }) {
    const logger = inject('vuejs3-logger') as Logger | null;
    const virtualScrollRef = ref<typeof QVirtualScroll | null>(null);

    // user input for filtering
    const query = ref<string>('');
    const formRef = ref<typeof QForm | null>(null);
    const organizationNew = ref<FormCompanyFields>(
      deepObjectWithSimplePropsCopy(
        emptyFormCompanyFields,
      ) as FormCompanyFields,
    );
    const teamNew = ref<FormTeamFields>({ name: '' });
    const selectOrganizationRef = ref<typeof QSelect | null>(null);

    /**
     * Provides autocomplete functionality via computed property
     * This is different from the approach in `FormFieldCompany` as we have
     * a separate input field which controls the list of options.
     */
    const filteredOptions = computed(() => {
      return props.options?.filter(
        (option: FormSelectTableOption | FormOption): boolean =>
          option.label
            .toLocaleLowerCase()
            .indexOf(query.value.toLocaleLowerCase()) > -1,
      );
    });

    // v-model value
    const inputValue = computed({
      get(): number | null {
        return props.modelValue;
      },
      set(value: number | null): void {
        emit('update:modelValue', value);
      },
    });

    // wait for loading to finish and then scroll to the selected option
    watch(
      () => props.loading,
      (newVal) => {
        if (!newVal && inputValue.value) {
          // find index of inputValue in filteredOptions
          const index: number = filteredOptions.value.findIndex(
            (option) => option.value === inputValue.value,
          );
          scrollToIndex(index);
        }
      },
    );
    const scrollToIndex = (index: number) => {
      nextTick(() => {
        const opt = filteredOptions.value.filter(
          (opt) => opt.value === inputValue.value,
        );
        logger?.debug(
          `Scrolling to index <${index}> with option value <${JSON.stringify(opt)}>.`,
        );
        virtualScrollRef.value?.scrollTo(index);
      });
    };

    const { borderRadiusCardSmall: borderRadius, contactEmail } =
      rideToWorkByBikeConfig;

    const { isFilled } = useValidation();

    // controls dialog visibility
    const isDialogOpen = ref<boolean>(false);

    /**
     * Validates the form.
     * If form is valid it submits the data.
     */
    const onSubmit = async (): Promise<void> => {
      if (formRef.value) {
        const isFormValid: boolean = await formRef.value.validate();

        if (isFormValid) {
          await submitDialogForm();
          isDialogOpen.value = false;
        } else {
          formRef.value.$el.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }
    };

    const { createTeam } = useApiPostTeam(logger);
    const { isLoading: isLoadingCreateOrganization, createOrganization } =
      useApiPostOrganization(logger);
    const { isLoading: isLoadingCreateSubsidiary, createSubsidiary } =
      useApiPostSubsidiary(logger);
    const isLoading = computed(
      () =>
        isLoadingCreateOrganization.value || isLoadingCreateSubsidiary.value,
    );

    const registerChallengeStore = useRegisterChallengeStore();
    const subsidiaryId = computed<number | null>({
      get: (): number | null => registerChallengeStore.getSubsidiaryId,
      set: (value: number | null) =>
        registerChallengeStore.setSubsidiaryId(value),
    });

    /**
     * Triggered by clicking on an option.
     * If organization option was changed, resets subsidiary ID and reloads
     * subsidiaries.
     * @param {number | null} value - ID of the selected option.
     */
    const onChangeOption = (value: number | null): void => {
      if (props.organizationLevel === OrganizationLevel.organization) {
        logger?.debug(`Organizations option changed to <${value}>.`);
        logger?.info('Resetting subsidiary ID to null.');
        registerChallengeStore.setSubsidiaryId(null);
        logger?.info('Reloading subsidiaries data from the API.');
        registerChallengeStore.loadSubsidiariesToStore(logger);
      }
    };

    /**
     * Submit dialog form based on organization level
     * If `company`, create a new company (and subsidiary)
     * If `team`, create a new team
     * @returns {Promise<void>}
     */
    const submitDialogForm = async (): Promise<void> => {
      if (props.organizationLevel === OrganizationLevel.organization) {
        // create organization
        if (!props.organizationType) {
          logger?.info('No organization type provided.');
          return;
        }
        logger?.info('Create new organization.');
        const organizationData = await createOrganization(
          organizationNew.value.name,
          organizationNew.value.vatId,
          props.organizationType,
          organizationNew.value.orgAddress,
        );

        if (!organizationData?.id) {
          logger?.error('New organization ID not found.');
          return;
        }
        logger?.debug(
          `New organization was created with ID <${organizationData.id}> and name <${organizationData.name}>.`,
        );

        logger?.debug(
          `Updating organization model ID from <${inputValue.value}> to <${organizationData.id}>.`,
        );
        // set organization ID in store
        inputValue.value = organizationData.id;
        // emit event to append data to organization options
        emit('create:option', organizationData);

        // create subsidiary
        logger?.info('Create new subsidiary.');
        const subsidiaryData = await createSubsidiary(
          organizationData.id,
          organizationNew.value.subsidiaryAddress,
        );
        if (subsidiaryData?.id) {
          logger?.debug(
            `New subsidiary was created with data <${JSON.stringify(subsidiaryData, null, 2)}>.`,
          );
          // set subsidiary ID in store
          logger?.debug(
            `Updating subsidiary ID from <${subsidiaryId.value}> to <${subsidiaryData.id}>`,
          );
          registerChallengeStore.setSubsidiaryId(subsidiaryData.id);
          logger?.debug(`Subsidiary ID model set to <${subsidiaryId.value}>.`);
          // create a new subsidiary array
          const newSubsidiary: OrganizationSubsidiary = {
            id: subsidiaryData.id,
            address: {
              street: subsidiaryData.street,
              houseNumber: subsidiaryData.houseNumber,
              city: subsidiaryData.city,
              zip: subsidiaryData.zip,
              cityChallenge: subsidiaryData.cityChallenge,
              department: subsidiaryData.department,
            },
            teams: [],
          };
          // set subsidiary options to array with new subsidiary
          registerChallengeStore.setSubsidiaries([newSubsidiary]);
        } else {
          logger?.error('New subsidiary data not found.');
        }
        // close dialog
        onClose();
      } else if (props.organizationLevel === OrganizationLevel.team) {
        logger?.info('Create team.');
        const subsidiaryId = registerChallengeStore.getSubsidiaryId;
        if (subsidiaryId === null) {
          logger?.info('No subsidiary ID found in the store.');
          return;
        }
        const data = await createTeam(subsidiaryId, teamNew.value.name);
        if (data?.id) {
          logger?.debug(
            `New Team was created with ID <${data.id}> and name <${data.name}>.`,
          );
          // emit `create:option` event
          emit('create:option', data);
          // close dialog
          onClose();
          // store data in v-model (emits to parent component)
          inputValue.value = data.id;
          logger?.debug(`New team model ID set to <${inputValue.value}>.`);
        }
      }
    };

    // close dialog
    const onClose = (): void => {
      if (formRef.value) {
        formRef.value.reset();
      }
      // reset organizationNew and teamNew
      organizationNew.value = deepObjectWithSimplePropsCopy(
        emptyFormCompanyFields,
      ) as FormCompanyFields;
      teamNew.value = { name: '' };
      logger?.debug(
        `Reset new organization model value <${organizationNew.value}>.`,
      );
      logger?.debug(`Reset new team model value <${teamNew.value}>.`);
      // close dialog
      isDialogOpen.value = false;
      logger?.info('Close add option modal dialog.');
    };

    const { getOrganizationLabels } = useOrganizations();
    const { getSelectTableLabels } = useSelectTable();

    const label = computed(() => {
      // if level is organization, show label for correct type
      if (props.organizationLevel === OrganizationLevel.organization) {
        if (props.organizationType) {
          return getOrganizationLabels(props.organizationType).labelName;
        }
      }
      return getSelectTableLabels(props.organizationLevel).label;
    });

    const buttonAddNew = computed(() => {
      return getSelectTableLabels(props.organizationLevel).buttonAddNew;
    });

    const buttonDialog = computed(() => {
      // if level is organization, show button label for correct type
      if (props.organizationLevel === OrganizationLevel.organization) {
        if (props.organizationType) {
          return getOrganizationLabels(props.organizationType).buttonDialog;
        }
      }
      return getSelectTableLabels(props.organizationLevel).buttonDialog;
    });

    const titleDialog = computed(() => {
      // if level is organization, show title for correct type
      if (props.organizationLevel === OrganizationLevel.organization) {
        if (props.organizationType) {
          return getOrganizationLabels(props.organizationType).titleDialog;
        }
      }
      return getSelectTableLabels(props.organizationLevel).titleDialog;
    });

    defineExpose({
      selectOrganizationRef,
    });

    // return true if this is organization select and company is paying
    const isThisSelectOrganizationAndOrganizationPaying = computed<boolean>(
      (): boolean => {
        const isOrganizationSelect: boolean =
          props.organizationLevel === OrganizationLevel.organization;
        const isOrganizationPaying: boolean =
          registerChallengeStore.getIsPaymentSubjectOrganization;
        return isOrganizationSelect && isOrganizationPaying;
      },
    );

    const isDisabledOption = (option: FormSelectTableOption): boolean => {
      // if team select and team has max members
      if (props.organizationLevel === OrganizationLevel.team) {
        if (option?.members && option?.maxMembers) {
          return option.members.length >= option.maxMembers;
        }
      }
      const organizationId: number | null =
        registerChallengeStore.getOrganizationId;
      // if this is other than active option and paying company is selected
      return (
        isThisSelectOrganizationAndOrganizationPaying.value &&
        option.value !== organizationId
      );
    };

    return {
      borderRadius,
      organizationNew,
      contactEmail,
      filteredOptions,
      formRef,
      inputValue,
      isDialogOpen,
      label,
      buttonAddNew,
      buttonDialog,
      query,
      teamNew,
      titleDialog,
      isDisabledOption,
      isThisSelectOrganizationAndOrganizationPaying,
      isFilled,
      isLoading,
      virtualScrollRef,
      onClose,
      onSubmit,
      onChangeOption,
      OrganizationType,
      OrganizationLevel,
      selectOrganizationRef,
    };
  },
});
</script>

<template>
  <div>
    <!-- Label -->
    <label
      for="form-company"
      class="text-grey-10 text-caption text-bold"
      data-cy="form-select-table-query"
    >
      {{ label }}
    </label>
    <q-field
      borderless
      dense
      hide-bottom-space
      rounded
      v-model="inputValue"
      class="q-pa-none q-mb-sm"
      :rules="[
        (val: string) => isFilled(val) || $t('form.messageOptionRequired'),
      ]"
      ref="selectOrganizationRef"
      data-cy="form-select-table-field"
    >
      <q-card
        flat
        bordered
        class="full-width q-mt-sm relative-position"
        :style="{ 'border-radius': borderRadius }"
        data-cy="form-select-table-card"
      >
        <!-- Search field -->
        <q-card-section class="q-pa-sm" data-cy="form-select-table-search">
          <!-- Input -->
          <q-input
            dense
            outlined
            v-model="query"
            icon
            id="form-select-table-query"
          >
            <template v-slot:prepend>
              <q-icon name="search" class="q-pl-sm" />
            </template>
          </q-input>
        </q-card-section>
        <!-- Separator -->
        <q-separator />
        <!-- Options list -->
        <q-card-section class="q-pa-xs" data-cy="form-select-table-options">
          <q-virtual-scroll
            ref="virtualScrollRef"
            style="max-height: 250px"
            :items="filteredOptions"
            separator
            v-slot="{ item, index }"
          >
            <q-item :key="index" tag="label" v-ripple>
              <q-item-section>
                <q-radio
                  v-model="inputValue"
                  :val="item.value"
                  color="primary"
                  :disable="isDisabledOption(item)"
                  @update:model-value="onChangeOption"
                  data-cy="form-select-table-option"
                >
                  <div
                    class="full-width row q-gutter-x-md items-center justify-between"
                  >
                    <span>{{ item.label }}</span>
                    <template v-if="item.members?.length > 0">
                      <div class="row q-gutter-x-sm">
                        <div
                          :class="{
                            'text-weight-bold': item.members.length > 4,
                          }"
                        >
                          <span data-cy="member-count">{{
                            item.members.length
                          }}</span>
                          /
                          <span data-cy="member-max">{{
                            item.maxMembers
                          }}</span>
                          {{ $t('form.team.labelMembers', item.maxMembers) }}
                        </div>
                        <div class="d-flex gap-4" data-cy="member-icons">
                          <q-icon
                            v-for="i in item.maxMembers"
                            :key="i"
                            name="circle"
                            size="8px"
                            class="q-ml-sm"
                            :class="[
                              i <= item.members.length
                                ? 'text-secondary'
                                : 'text-grey-2',
                            ]"
                            data-cy="member-icon"
                          />
                        </div>
                      </div>
                    </template>
                  </div>
                </q-radio>
              </q-item-section>
            </q-item>
          </q-virtual-scroll>
        </q-card-section>
        <!-- Separator -->
        <q-separator />
        <!-- Button: Add company -->
        <q-card-section
          class="full-width flex items-center justify-center q-pa-sm"
          data-cy="form-select-table-button"
        >
          <!-- Button: Add company -->
          <q-btn
            flat
            rounded
            icon="mdi-plus"
            color="primary"
            data-cy="button-add-option"
            :disable="isThisSelectOrganizationAndOrganizationPaying"
            @click.prevent="isDialogOpen = true"
          >
            <!-- Label -->
            <span class="inline-block q-pl-xs">
              {{ buttonAddNew }}
            </span>
          </q-btn>
        </q-card-section>
        <!-- Dialog: Add new -->
        <dialog-default v-model="isDialogOpen" data-cy="dialog-add-option">
          <template #title>
            {{ titleDialog }}
          </template>
          <template #content>
            <q-form ref="formRef" @submit.prevent="onSubmit">
              <form-add-company
                v-if="organizationLevel === OrganizationLevel.organization"
                v-model="organizationNew"
                :organization-type="organizationType"
                class="q-mb-lg"
              ></form-add-company>
              <form-add-team
                v-if="organizationLevel === OrganizationLevel.team"
                class="q-mb-lg"
                :form-values="teamNew"
                @update:form-values="teamNew = $event"
              ></form-add-team>
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
                  {{ buttonDialog }}
                </q-btn>
              </div>
            </div>
          </template>
        </dialog-default>
        <!-- Loading options data progressbar -->
        <q-inner-loading
          :showing="loading"
          :label="$t('form.labelSpinnerProgressBar')"
          label-class="text-primary"
          data-cy="spinner-progress-bar"
        />
      </q-card>
    </q-field>
    <div
      v-if="organizationLevel === OrganizationLevel.organization"
      class="text-caption text-grey-7 q-mt-sm"
      data-cy="form-select-table-user-note"
    >
      <span
        v-html="
          $t('form.company.textUserExperience', {
            email: contactEmail,
          })
        "
      ></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.q-radio) {
  width: 100%;
}
// hide error icon for table box
:deep(.q-field__append) {
  display: none;
}
// display table icon for any common field
:deep(.q-field--outlined .q-field__append) {
  display: flex;
}
:deep(.q-radio__label) {
  display: block;
  width: 100%;
  color: $grey-10;
}
:deep(.text-negative .q-radio__label) {
  color: $negative;
}
</style>
