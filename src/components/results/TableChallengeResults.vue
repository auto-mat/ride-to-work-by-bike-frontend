<script lang="ts">
/**
 * TableChallengeResults Component
 *
 * @description * Use this component to display a table of competition results.
 * It shows participant ranking with place, name, result, frequency, distance,
 * and CO₂ emissions columns.
 *
 * @props
 * - `rows` (CompetitionResult[], required): Array of result rows.
 * - `competitionType` (CompetitionType, required): Type of competition.
 *
 * @example
 * <table-challenge-results :rows="results" :competition-type="competition.competition_type" />
 */

// libraries
import { defineComponent, computed } from 'vue';

// composables
import { i18n } from 'src/boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// enums
import { CompetitionType } from '../enums/Challenge';

// types
import type { PropType } from 'vue';
import type { QTableProps } from 'quasar';
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
  setup() {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    const competitionResultDecimalNumber = 'competitionResultDecimalNumber';

    const columns = computed<QTableProps['columns']>(() => [
      {
        name: 'place',
        label: i18n.global.t('results.labelColumnPlace'),
        field: 'place',
        align: 'center',
        sortable: true,
      },
      {
        name: 'name',
        label: i18n.global.t('results.labelColumnName'),
        field: 'name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'result',
        label: i18n.global.t('results.labelColumnResult'),
        field: 'result',
        align: 'right',
        sortable: true,
        format: (value: number | string) =>
          i18n.global.n(value, competitionResultDecimalNumber),
      },
      {
        name: 'frequency',
        label: i18n.global.t('results.labelColumnFrequency'),
        field: 'frequency',
        align: 'right',
        sortable: true,
      },
      {
        name: 'distance',
        label: i18n.global.t('results.labelColumnDistance'),
        field: 'distance',
        align: 'right',
        sortable: true,
      },
      {
        name: 'co2',
        label: i18n.global.t('results.labelColumnCo2'),
        field: (row: CompetitionResult) => row.emissions.co2,
        align: 'right',
        sortable: true,
      },
    ]);

    const pagination = { rowsPerPage: 0 };

    const placeIconColor = (place: number): string => {
      if (place === 1) return 'amber-4';
      if (place === 2) return 'blue-grey-2';
      return 'brown-3';
    };

    return {
      borderRadius,
      columns,
      competitionResultDecimalNumber,
      pagination,
      placeIconColor,
    };
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
    <!-- Results table -->
    <q-table
      v-else
      flat
      bordered
      :rows="rows"
      :columns="columns"
      :pagination="pagination"
      row-key="place"
      hide-pagination
      data-cy="table-challenge-results-table"
      :style="{ borderRadius }"
    >
      <template v-slot:body="props">
        <q-tr :props="props" data-cy="table-challenge-results-row">
          <!-- Place -->
          <q-td
            key="place"
            :props="props"
            data-cy="table-challenge-results-place"
          >
            <!-- Icon: 1st, 2nd, 3rd place -->
            <q-avatar
              v-if="props.row.place <= 3"
              size="24px"
              color="primary"
              class="q-mr-sm"
              data-cy="table-challenge-results-place-icon"
            >
              <q-icon
                size="16px"
                name="svguse:/icons/table_challenge_results/icons.svg#lucide:trophy"
                :color="placeIconColor(props.row.place)"
              />
            </q-avatar>
            {{ props.row.place }}.
          </q-td>
          <!-- Name -->
          <q-td
            key="name"
            :props="props"
            data-cy="table-challenge-results-name"
          >
            {{ props.row.name }}
          </q-td>
          <!-- Result -->
          <q-td
            key="result"
            :props="props"
            data-cy="table-challenge-results-result"
          >
            {{ $n(props.row.result, 'routeDistanceDecimalNumber') }}
          </q-td>
          <!-- Frequency -->
          <q-td
            key="frequency"
            :props="props"
            data-cy="table-challenge-results-frequency"
          >
            {{ $n(props.row.frequency, competitionResultDecimalNumber) }}
          </q-td>
          <!-- Distance -->
          <q-td
            key="distance"
            :props="props"
            data-cy="table-challenge-results-distance"
          >
            {{ $n(props.row.distance, competitionResultDecimalNumber) }}
          </q-td>
          <!-- Saved emissions -->
          <q-td key="co2" :props="props" data-cy="table-challenge-results-co2">
            {{ $n(props.row.emissions.co2, competitionResultDecimalNumber) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
