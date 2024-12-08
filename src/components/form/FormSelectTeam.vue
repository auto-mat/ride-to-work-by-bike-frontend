<script lang="ts">
/**
 * FormSelectTeam Component
 *
 * @description Use this component to render a table for selecting a team.
 * Handles fetching teams from API.
 * Note: This component is used on `RegisterChallengePage`.
 *
 * @components
 * - `FormFieldSelectTable`: Base component for displaying selectable table options
 *
 * @example
 * <form-select-team />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=5366-26763&t=3zQmiCgIVO72EQBq-1)
 */

// libraries
import { defineComponent, inject, ref, watch } from 'vue';

// components
import FormFieldSelectTable from './FormFieldSelectTable.vue';

// composables
import { useApiGetTeams } from '../../composables/useApiGetTeams';

// enums
import { OrganizationLevel } from 'src/components/types/Organization';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

// types
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'FormSelectTeam',
  components: {
    FormFieldSelectTable,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const { options, isLoading, loadTeams } = useApiGetTeams(logger);

    // load teams when subsidiary ID changes
    const registerChallengeStore = useRegisterChallengeStore();
    watch(
      () => registerChallengeStore.getSubsidiaryId,
      (newValue: number | null) => {
        logger?.debug(
          `Resgister challenge store subsidiary ID updated to <${newValue}>`,
        );
        if (newValue) {
          loadTeams(newValue);
        }
      },
      { immediate: true },
    );

    const team = ref<number | null>(null);

    return {
      isLoading,
      options,
      team,
      OrganizationLevel,
    };
  },
});
</script>

<template>
  <div data-cy="form-select-team">
    <!-- Text: Info -->
    <div class="q-mb-lg" data-cy="form-select-team-info">
      {{ $t('register.challenge.textTeamInfo') }}
    </div>
    <!-- Select table -->
    <form-field-select-table
      v-model="team"
      :organization-level="OrganizationLevel.team"
      :options="options"
      :loading="isLoading"
      data-cy="form-select-table-team"
    />
  </div>
</template>
