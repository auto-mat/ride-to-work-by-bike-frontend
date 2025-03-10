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
import { defineComponent, onMounted, ref, computed, inject } from 'vue';

// composables
import { useApiGetTeams } from 'src/composables/useApiGetTeams';
import { useSelectSearch } from 'src/composables/useSelectSearch';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

// types
import type { FormSelectTableOption } from 'src/components/types/Form';
import type { Logger } from 'src/components/types/Logger';

export default defineComponent({
  name: 'FormUpdateTeam',
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

    onMounted(() => {
      // initialize selected team
      const selectedTeamOption = options.value.find(
        (team) => team.value === props.modelValue,
      );
      if (selectedTeamOption) {
        selectedTeam.value = selectedTeamOption;
      }
    });

    const closeDialog = (): void => {
      props.onClose();
    };

    const onUpdateTeam = (): void => {
      emit('update:modelValue', selectedTeam.value?.value);
      props.onClose();
    };

    const { mapTeamToOption } = useApiGetTeams(logger);
    const isLoading = computed(() => registerChallengeStore.isLoadingTeams);
    const teams = computed(() => registerChallengeStore.getTeams);
    const options = computed<FormSelectTableOption[]>(() =>
      teams.value.map(mapTeamToOption),
    );

    const { optionsFiltered, onFilter } = useSelectSearch(options);

    return {
      selectedTeam,
      closeDialog,
      onUpdateTeam,
      isLoading,
      optionsFiltered,
      onFilter,
    };
  },
});
</script>

<template>
  <q-form @submit.prevent="onUpdateTeam" data-cy="form-update-team">
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
    <div class="q-mt-xl flex justify-end gap-8">
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
      <!-- Button: Save -->
      <q-btn
        rounded
        unelevated
        type="submit"
        color="primary"
        :label="$t('navigation.save')"
        :loading="loading"
        data-cy="form-button-save"
      />
    </div>
  </q-form>
</template>
