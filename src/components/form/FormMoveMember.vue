<script lang="ts">
/**
 * FormMoveMember Component
 *
 * @description * Use this component to move a team member to another team.
 *
 * Note: This component is used in `TableAttendance.vue`.
 *
 * @props
 *   - memberName: string - Name of member being moved (for display)
 *   - currentTeamName: string - Current team name (for display)
 *   - currentTeamId: number - Current team ID (filtered out from options)
 *   - formValues: FormMoveMemberFields - Current form state
 *
 * @emits
 *   - update:formValues - Emitted when form values change
 *
 * @example
 * <form-move-member
 *   :member-name="memberToMove.name"
 *   :current-team-name="memberToMove.teamName"
 *   :current-team-id="memberToMove.teamId"
 *   :form-values="moveMemberForm"
 *   @update:form-values="moveMemberForm = $event"
 * />
 */

import { computed, defineComponent, ref, watch } from 'vue';
import type { PropType } from 'vue';

// composables
import { useSelectSearch } from '../../composables/useSelectSearch';
import { useValidation } from '../../composables/useValidation';

// stores
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';

// types
import type {
  AdminOrganisation,
  AdminSubsidiary,
} from '../types/AdminOrganisation';
import type { FormSelectOption, FormMoveMemberFields } from '../types/Form';

export default defineComponent({
  name: 'FormMoveMember',
  props: {
    memberName: {
      type: String,
      required: true,
    },
    currentTeamName: {
      type: String,
      required: true,
    },
    currentTeamId: {
      type: Number,
      required: true,
    },
    formValues: {
      type: Object as PropType<FormMoveMemberFields>,
      required: true,
    },
  },
  emits: ['update:formValues'],
  setup(props, { emit }) {
    const adminOrganisationStore = useAdminOrganisationStore();

    const organisation = computed<AdminOrganisation | null>(() => {
      const org = adminOrganisationStore.getCurrentAdminOrganisation;
      return org ? org : null;
    });

    const subsidiaryLabel = (subsidiary: AdminSubsidiary): string =>
      subsidiary.name;

    const subsidiaryOptions = computed<FormSelectOption[]>(() => {
      return (
        organisation.value?.subsidiaries.map((subsidiary) => ({
          label: subsidiaryLabel(subsidiary),
          value: subsidiary.id,
        })) || []
      );
    });

    const teamOptions = computed<FormSelectOption[]>(() => {
      if (!props.formValues.subsidiaryId || !organisation.value) {
        return [];
      }
      const currentSubsidiary = organisation.value.subsidiaries.find(
        (subsidiary) => subsidiary.id === props.formValues.subsidiaryId,
      );
      return (
        currentSubsidiary?.teams
          .filter((team) => team.id !== props.currentTeamId)
          .map((team) => ({
            label: team.name,
            value: team.id,
          })) || []
      );
    });

    const selectedSubsidiary = ref<FormSelectOption | null>(null);
    const selectedTeam = ref<FormSelectOption | null>(null);

    // sync selected values with formValues
    watch(
      () => props.formValues.subsidiaryId,
      (newId) => {
        if (newId !== null) {
          selectedSubsidiary.value =
            subsidiaryOptions.value.find((opt) => opt.value === newId) || null;
        } else {
          selectedSubsidiary.value = null;
        }
      },
      { immediate: true },
    );
    watch(
      () => props.formValues.teamId,
      (newId) => {
        if (newId !== null) {
          selectedTeam.value =
            teamOptions.value.find((opt) => opt.value === newId) || null;
        } else {
          selectedTeam.value = null;
        }
      },
      { immediate: true },
    );
    // update form values when selection changes
    watch(selectedSubsidiary, (newValue) => {
      const newId = newValue ? (newValue.value as number) : null;
      if (newId !== props.formValues.subsidiaryId) {
        emit('update:formValues', {
          subsidiaryId: newId,
          teamId: null, // reset teamId
        });
      }
    });
    watch(selectedTeam, (newValue) => {
      const newId = newValue ? (newValue.value as number) : null;
      if (newId !== props.formValues.teamId) {
        emit('update:formValues', {
          ...props.formValues,
          teamId: newId,
        });
      }
    });

    // search filtering
    const {
      optionsFiltered: subsidiaryOptionsFiltered,
      onFilter: onFilterSubsidiary,
    } = useSelectSearch(subsidiaryOptions);
    const { optionsFiltered: teamOptionsFiltered, onFilter: onFilterTeam } =
      useSelectSearch(teamOptions);

    // validation
    const { isFilled } = useValidation();

    return {
      selectedSubsidiary,
      selectedTeam,
      subsidiaryOptionsFiltered,
      teamOptionsFiltered,
      onFilterSubsidiary,
      onFilterTeam,
      isFilled,
    };
  },
});
</script>

<template>
  <div>
    <!-- Member info -->
    <div>
      <div class="text-caption text-grey-7">
        {{ $t('coordinator.labelMemberName') }}
      </div>
      <div class="text-body1">{{ memberName }}</div>
    </div>
    <!-- Current team info -->
    <div class="q-mt-sm">
      <div class="text-caption text-grey-7">
        {{ $t('coordinator.currentTeam') }}
      </div>
      <div class="text-body1">{{ currentTeamName }}</div>
    </div>
    <!-- Subsidiary selector with search -->
    <div class="row q-mt-sm q-col-gutter-sm">
      <label
        for="form-select-subsidiary"
        class="col-12 text-caption text-bold text-grey-10"
        data-cy="form-select-subsidiary-label"
      >
        {{ $t('coordinator.selectSubsidiary') }}
      </label>
      <div class="col-12 col-sm" data-cy="form-select-subsidiary-wrapper">
        <q-select
          dense
          outlined
          use-input
          hide-selected
          fill-input
          hide-bottom-space
          input-debounce="0"
          id="form-select-subsidiary"
          v-model="selectedSubsidiary"
          :options="subsidiaryOptionsFiltered"
          :rules="[
            (val) =>
              isFilled(val) ||
              $t('form.messageFieldRequired', {
                fieldName: $t('coordinator.selectSubsidiary'),
              }),
          ]"
          @filter="onFilterSubsidiary"
          class="q-mb-md"
          data-cy="form-move-member-subsidiary"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ $t('form.messageNoResult') }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    <!-- Team selector with search -->
    <div class="row q-mt-sm q-col-gutter-sm">
      <label
        for="form-select-team"
        class="col-12 text-caption text-bold text-grey-10"
        data-cy="form-select-team-label"
      >
        {{ $t('coordinator.selectTeam') }}
      </label>
      <div class="col-12 col-sm" data-cy="form-select-team-wrapper">
        <q-select
          dense
          outlined
          use-input
          hide-selected
          fill-input
          hide-bottom-space
          input-debounce="0"
          id="form-select-team"
          v-model="selectedTeam"
          :options="teamOptionsFiltered"
          :disable="!formValues.subsidiaryId"
          :rules="[
            (val) =>
              isFilled(val) ||
              $t('form.messageFieldRequired', {
                fieldName: $t('coordinator.selectTeam'),
              }),
          ]"
          @filter="onFilterTeam"
          data-cy="form-move-member-team"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{
                  formValues.subsidiaryId
                    ? $t('form.messageNoResult')
                    : $t('coordinator.selectSubsidiary')
                }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
  </div>
</template>
