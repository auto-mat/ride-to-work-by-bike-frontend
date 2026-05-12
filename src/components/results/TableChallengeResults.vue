<script lang="ts">
/**
 * TableChallengeResults Component
 *
 * @description * Use this component to display a table of competition results.
 * It shows participant names and is designed to be extended in future slices.
 *
 * @props
 * - `rows` (CompetitionResult[], required): Array of result rows.
 * - `competitionType` (CompetitionType, required): Type of competition.
 *
 * @example
 * <table-challenge-results :rows="results" :competition-type="competition.competition_type" />
 */

// libraries
import { defineComponent } from 'vue';

// enums
import { CompetitionType } from '../enums/Challenge';

// types
import type { PropType } from 'vue';
import type { CompetitionResult } from '../types/Competition';

export default defineComponent({
  name: 'TableChallengeResults',
  props: {
    rows: {
      type: Array as PropType<CompetitionResult[]>,
      required: true,
    },
    competitionType: {
      type: String as PropType<CompetitionType>,
      required: true,
    },
  },
});
</script>

<template>
  <div data-cy="table-challenge-results">
    <!-- Empty state -->
    <div
      v-if="rows.length === 0"
      class="text-grey-8"
      data-cy="table-challenge-results-empty"
    >
      {{ $t('results.emptyStateChallengeResults') }}
    </div>
    <!-- Results list -->
    <q-list v-else separator style="margin: -1rem">
      <q-item
        v-for="row in rows"
        :key="row.place"
        data-cy="table-challenge-results-row"
      >
        <q-item-section>
          <q-item-label data-cy="table-challenge-results-name">
            {{ row.name }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
