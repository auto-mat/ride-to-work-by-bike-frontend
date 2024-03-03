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
 * - `modelValue` (String, required): The object representing selected
 *   company.
 * - `options` (Array<FormSelectTableOption>, required): The object
 *   representing the options.
 * - `label` (string, required): The translation for the label.
 * - `labelButton` (string): The translation for the add button.
 * - `labelButtonDialog` (string): The translation for the add
 *   button inside the dialog.
 * - `titleDialog` (string): The translation for the dialog title.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `DialogDefault`: Used to render a dialog window with form as content.
 * - `FormAddCompany`: Used to render form for registering a new company.
 *
 * @example
 * <form-field-select-table />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5366%3A28607&mode=dev)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';
import { QForm } from 'quasar';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// components
import DialogDefault from '../global/DialogDefault.vue';
import FormAddCompany from '../form/FormAddCompany.vue';
import FormAddTeam from '../form/FormAddTeam.vue';

// composables
import { useValidation } from '../../composables/useValidation';

// types
import {
  FormCompanyFields,
  FormOption,
  FormSelectTableOption,
  FormTeamFields,
} from '../types/Form';

export default defineComponent({
  name: 'FormFieldSelectTable',
  components: {
    DialogDefault,
    FormAddCompany,
    FormAddTeam,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Array as () => FormSelectTableOption[] | FormOption[],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    labelButton: {
      type: String,
      required: true,
    },
    labelButtonDialog: {
      type: String,
      required: true,
    },
    titleDialog: {
      type: String,
      required: true,
    },
    variant: {
      type: String as () => 'company' | 'school' | 'group' | 'team',
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    // user input for filtering
    const query = ref<string>('');
    const formRef = ref<typeof QForm | null>(null);
    const companyNew = ref<FormCompanyFields>({
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
    });
    const teamNew = ref<FormTeamFields>({
      name: '',
    });

    /**
     * Provides autocomplete functionality via computed property
     * This is different from the approach in `FormFieldCompany` as we have
     * a separate input field which controls the list of options.
     */
    const filteredOptions = computed(() => {
      return props.options.filter(
        (option: FormSelectTableOption | FormOption): boolean =>
          option.label
            .toLocaleLowerCase()
            .indexOf(query.value.toLocaleLowerCase()) > -1,
      );
    });

    // v-model value
    const inputValue = computed({
      get(): string {
        return props.modelValue;
      },
      set(value: string): void {
        emit('update:modelValue', value);
      },
    });

    const { borderRadiusCardSmall: borderRadius, contactEmail } =
      rideToWorkByBikeConfig;

    const { isFilled } = useValidation();

    // controls dialog visibility
    const isDialogOpen = ref<boolean>(false);

    // close dialog
    const onClose = (): void => {
      if (formRef.value) {
        formRef.value.reset();
      }
      isDialogOpen.value = false;
    };

    /**
     * Validates the form.
     * If form is valid it submits the data.
     */
    const onSubmit = async (): Promise<void> => {
      if (formRef.value) {
        const isFormValid: boolean = await formRef.value.validate();

        if (isFormValid) {
          // TODO: Submit through API
          isDialogOpen.value = false;
        } else {
          formRef.value.$el.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }
    };

    return {
      borderRadius,
      companyNew,
      contactEmail,
      filteredOptions,
      formRef,
      inputValue,
      isDialogOpen,
      query,
      teamNew,
      isFilled,
      onClose,
      onSubmit,
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
      data-cy="form-select-table-field"
    >
      <q-card
        flat
        bordered
        class="full-width q-mt-sm"
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
          <q-scroll-area style="height: 250px">
            <q-option-group
              v-model="inputValue"
              :options="filteredOptions"
              color="primary"
              class="q-pr-sm"
              data-cy="form-select-table-option-group"
            >
              <!-- Slot: Option label -->
              <template v-slot:label="opt">
                <div class="full-width row items-center justify-between">
                  <span>{{ opt.label }}</span>
                  <!-- Members count -->
                  <template v-if="opt.members">
                    <div class="flex">
                      <div :class="{ 'text-weight-bold': opt.members > 4 }">
                        {{ opt.members }} / {{ opt.maxMembers }}
                        {{ $tc('form.team.labelMembers', opt.maxMembers) }}
                      </div>
                      <!-- Member dot icons -->
                      <div class="d-flex gap-4">
                        <q-icon
                          v-for="i in 5"
                          :key="i"
                          name="circle"
                          size="8px"
                          class="q-ml-sm"
                          :class="[
                            i <= opt.members ? 'text-teal-4' : 'text-grey-4',
                          ]"
                        />
                      </div>
                    </div>
                  </template>
                </div>
              </template>
            </q-option-group>
          </q-scroll-area>
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
            @click.prevent="isDialogOpen = true"
          >
            <!-- Label -->
            <span class="inline-block q-pl-xs">
              {{ labelButton }}
            </span>
          </q-btn>
        </q-card-section>
        <!-- Dialog: Add new -->
        <dialog-default v-model="isDialogOpen" data-cy="dialog-add-option">
          <template #title>
            {{ titleDialog }}
          </template>
          <template #content>
            <q-form ref="formRef">
              <form-add-company
                v-if="variant === 'company'"
                class="q-mb-lg"
                :form-values="companyNew"
                @update:form-values="companyNew = $event"
              ></form-add-company>
              <form-add-team
                v-if="variant === 'team'"
                class="q-mb-lg"
                :form-values="teamNew"
                @update:form-values="teamNew = $event"
              ></form-add-team>
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
                  {{ labelButtonDialog }}
                </q-btn>
              </div>
            </div>
          </template>
        </dialog-default>
      </q-card>
    </q-field>
    <div
      v-if="variant === 'company'"
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
