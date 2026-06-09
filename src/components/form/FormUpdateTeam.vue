<script lang="ts">
/**
 * FormUpdateTeam Component
 *
 * @description * Use this component to render a form for updating team.
 * Note: Used in `DetailsItem` component on `ProfilePage`.
 *
 * @props
 * - `modelValue` (number | null, required): Team ID value.
 * - `onClose` (function, required): Function to close the dialog.
 * - `loading` (boolean, optional): Loading state.
 *
 * @events
 * - `update:modelValue`: Emitted when value successfully changes.
 *
 * @example
 * <form-update-team v-model="teamId" @close="onClose">
 */

// libraries
import { defineComponent, ref, computed, inject } from 'vue';
import { Notify } from 'quasar';

// components
import FormAddTeam from './FormAddTeam.vue';

// composables
import { useApiGetTeams } from 'src/composables/useApiGetTeams';
import { useApiPostTeam } from 'src/composables/useApiPostTeam';
import { useSelectSearch } from 'src/composables/useSelectSearch';

// i18n
import { i18n } from 'src/boot/i18n';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

// types
import type {
  FormSelectTableOption,
  FormTeamFields,
} from 'src/components/types/Form';
import type { Logger } from 'src/components/types/Logger';

export default defineComponent({
  name: 'FormUpdateTeam',
  components: {
    FormAddTeam,
  },
  props: {
    modelValue: {
      type: Number as () => number | null,
      required: true,
      default: null,
    },
    onClose: {
      type: Function,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { emit }) {
    const logger = inject('vuejs3-logger') as Logger | null;
    const registerChallengeStore = useRegisterChallengeStore();
    const selectedTeam = ref<FormSelectTableOption | null>(null);
    const isCreateMode = ref<boolean>(false);
    const teamNew = ref<FormTeamFields>({ name: '' });

    const closeDialog = (): void => {
      // reset mode when closing dialog
      isCreateMode.value = false;
      teamNew.value = { name: '' };
      props.onClose();
    };

    // toggle between create mode and select mode
    const toggleMode = (): void => {
      isCreateMode.value = !isCreateMode.value;
      if (isCreateMode.value) {
        teamNew.value = { name: '' };
      } else {
        selectedTeam.value = null;
      }
    };

    // create team state
    const { createTeam } = useApiPostTeam(logger);
    const isCreatingTeam = ref<boolean>(false);

    // create new team handler
    const onCreateTeam = async (): Promise<void> => {
      const subsidiaryId = registerChallengeStore.getSubsidiaryId;
      if (!subsidiaryId) {
        logger?.error('No subsidiary ID found.');
        Notify.create({
          type: 'negative',
          message: i18n.global.t('form.team.messageMissingSubsidiaryId'),
        });
        return;
      }
      isCreatingTeam.value = true;
      const data = await createTeam(subsidiaryId, teamNew.value.name);
      isCreatingTeam.value = false;
      // if successful, emit team ID and close
      if (data?.id) {
        logger?.debug(
          `Team created with ID <${data.id}>, name <${data.name}>.`,
        );
        emit('update:modelValue', data.id);
        props.onClose();
      }
    };

    const onSubmit = async (): Promise<void> => {
      if (isCreateMode.value) {
        await onCreateTeam();
      } else {
        emit('update:modelValue', selectedTeam.value?.value);
        props.onClose();
      }
    };

    const { mapTeamToOption } = useApiGetTeams(logger);
    const isLoading = computed(() => registerChallengeStore.isLoadingTeams);
    const teams = computed(() => registerChallengeStore.getTeams);
    const options = computed<FormSelectTableOption[]>(() =>
      teams.value
        .map(mapTeamToOption)
        .filter((option) => option.value !== props.modelValue),
    );

    const { optionsFiltered, onFilter } = useSelectSearch(options);

    // button submit label
    const submitButtonLabel = computed<string>((): string => {
      return isCreateMode.value
        ? i18n.global.t('form.team.buttonCreateAndJoin')
        : i18n.global.t('navigation.save');
    });

    // loading state
    const isSubmitLoading = computed<boolean>((): boolean => {
      return isCreatingTeam.value || props.loading;
    });

    return {
      selectedTeam,
      closeDialog,
      onSubmit,
      isLoading,
      optionsFiltered,
      onFilter,
      onCreateTeam,
      isCreateMode,
      teamNew,
      toggleMode,
      submitButtonLabel,
      isSubmitLoading,
    };
  },
});
</script>

<template>
  <q-form @submit.prevent="onSubmit" data-cy="form-update-team">
    <!-- Mode: Select existing team -->
    <div v-if="!isCreateMode">
      <!-- Label -->
      <label
        for="form-team"
        class="text-grey-10 text-caption text-bold"
        data-cy="form-label"
      >
        {{ $t('form.labelTeam') }}
      </label>
      <!-- Select -->
      <q-select
        dense
        outlined
        use-input
        hide-selected
        fill-input
        hide-bottom-space
        input-debounce="0"
        v-model="selectedTeam"
        :options="optionsFiltered"
        :loading="isLoading"
        :rules="[
          (val) =>
            val !== null ||
            $t('form.messageFieldRequired', {
              fieldName: $t('form.labelTeam'),
            }),
        ]"
        class="q-mt-sm"
        id="form-team"
        name="team"
        @filter="onFilter"
        data-cy="form-select"
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
      <!-- Link to create mode -->
      <div class="q-mt-md">
        <q-btn
          flat
          dense
          no-caps
          color="primary"
          :label="$t('form.team.linkCreateNewTeam')"
          @click.prevent="toggleMode"
          data-cy="form-link-create-mode"
        />
      </div>
    </div>

    <!-- Mode: Create new team -->
    <div v-else>
      <form-add-team
        :form-values="teamNew"
        @update:form-values="teamNew = $event"
        data-cy="form-add-team"
      />
      <!-- Link back to select mode -->
      <div class="q-mt-md">
        <q-btn
          flat
          dense
          no-caps
          color="primary"
          :label="$t('form.team.linkSelectExistingTeam')"
          @click.prevent="toggleMode"
          data-cy="form-link-select-mode"
        />
      </div>
    </div>

    <!-- Action buttons -->
    <div class="q-mt-lg flex justify-end gap-8">
      <!-- Button: Cancel -->
      <q-btn
        rounded
        unelevated
        outline
        color="primary"
        :label="$t('navigation.discardChanges')"
        @click.prevent="closeDialog"
        data-cy="form-button-cancel"
      />
      <!-- Button: Save/Create -->
      <q-btn
        rounded
        unelevated
        type="submit"
        color="primary"
        :label="submitButtonLabel"
        :loading="isSubmitLoading"
        data-cy="form-button-save"
      />
    </div>
  </q-form>
</template>
