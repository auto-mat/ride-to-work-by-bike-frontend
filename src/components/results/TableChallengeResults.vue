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
 * - `competitionName` (String, required): Competition name
 *
 * @example
 * <table-challenge-results
 *   :rows="results"
 *   :competition-type="competition.competition_type"
 *   :competition-name="competition.name"
 *  />
 */

// libraries
import { defineComponent, computed } from 'vue';
import { Notify } from 'quasar';

// composables
import { i18n } from 'src/boot/i18n';
import { useExportOrganizationChallengeTable } from '../../composables/useExportOrganizationChallengeResultsTable';
import { useExportTable } from '../../composables/useExportTable';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// enums
import { CompetitionType } from '../enums/Challenge';

// types
import type { PropType } from 'vue';
import type { QTableProps } from 'quasar';
import type { CompetitionResult } from '../types/Competition';
import { ExportFileType } from '../enums/Coordinator';

import { normalizeFileName } from '../../utils/';

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
    competitionName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
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
        name: 'frequency',
        label: `${i18n.global.t('results.labelColumnFrequency')} (%)`,
        field: 'frequency',
        align: 'right',
        sortable: true,
      },
      {
        name: 'distance',
        label: `${i18n.global.t('results.labelColumnDistance')} (km)`,
        field: 'distance',
        align: 'right',
        sortable: true,
      },
      {
        name: 'co2',
        label: `${i18n.global.t('results.labelColumnCo2')} (g)`,
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

    const onExportChallengeResult = (fileType: ExportFileType): void => {
      if (props.rows.length === 0) {
        Notify.create({
          message: i18n.global.t('coordinator.messageExportNoData'),
          color: 'warning',
        });
        return;
      }

      const { getChallengeResultData } = useExportOrganizationChallengeTable();
      const {
        downloadOdsFileFormat,
        downloadXlsFileFormat,
        downloadCsvFileFormat,
      } = useExportTable();

      const fileName = normalizeFileName(props.competitionName);

      const dataRows: string[] = getChallengeResultData(
        fileType,
        columns.value,
        props.rows,
        competitionResultDecimalNumber,
      );

      // Download ODS, XLS, CSV file format
      if (fileType === 'csv') {
        downloadCsvFileFormat(`${fileName}.csv`, dataRows).then(
          (status): void => {
            if (status !== true) {
              Notify.create({
                message: i18n.global.t('coordinator.messageExportFailed'),
                color: 'negative',
              });
            }
          },
        );
      } else if (fileType === 'xls') {
        downloadXlsFileFormat(
          `${fileName}.xls`,
          dataRows,
          i18n.global.t('results.titleResults'),
        ).then((status) => {
          if (status !== true) {
            Notify.create({
              message: i18n.global.t('coordinator.messageExportFailed'),
              color: 'negative',
            });
          }
        });
      } else if (fileType === 'ods') {
        downloadOdsFileFormat(
          `${fileName}.ods`,
          dataRows,
          i18n.global.t('results.titleResults'),
        ).then((status) => {
          if (status !== true) {
            Notify.create({
              message: i18n.global.t('coordinator.messageExportFailed'),
              color: 'negative',
            });
          }
        });
      }
    };

    return {
      borderRadius,
      columns,
      competitionResultDecimalNumber,
      ExportFileType,
      onExportChallengeResult,
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
          <!-- Frequency in % unit -->
          <q-td
            key="frequency"
            :props="props"
            data-cy="table-challenge-results-frequency"
          >
            {{ $n(props.row.frequency * 100, competitionResultDecimalNumber) }}
          </q-td>
          <!-- Distance in km unit-->
          <q-td
            key="distance"
            :props="props"
            data-cy="table-challenge-results-distance"
          >
            {{ $n(props.row.distance, competitionResultDecimalNumber) }}
          </q-td>
          <!-- Saved emissions in g unit-->
          <q-td key="co2" :props="props" data-cy="table-challenge-results-co2">
            {{ $n(props.row.emissions.co2, competitionResultDecimalNumber) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Button: Export dropdown -->
    <q-btn-dropdown
      unelevated
      rounded
      outline
      color="primary"
      class="q-ml-auto q-mt-md"
      data-cy="organization-challenge-results-button-export"
    >
      <template #label>
        <q-icon name="mdi-download" size="18px" class="q-mr-sm" />
        {{
          $t(
            'tableOrganizationChallengeResult.buttonExportOrganizationChallengeResult',
          )
        }}
      </template>
      <q-list>
        <q-item
          v-close-popup
          clickable
          data-cy="organization-challenge-results-button-export-xls"
          @click="onExportChallengeResult(ExportFileType.xls)"
        >
          <q-item-section class="text-uppercase">{{
            ExportFileType.xls
          }}</q-item-section>
        </q-item>
        <q-item
          v-close-popup
          clickable
          data-cy="organization-challenge-results-button-export-ods"
          @click="onExportChallengeResult(ExportFileType.ods)"
        >
          <q-item-section class="text-uppercase">{{
            ExportFileType.ods
          }}</q-item-section>
        </q-item>
        <q-item
          v-close-popup
          clickable
          data-cy="organization-challenge-results-button-export-csv"
          @click="onExportChallengeResult(ExportFileType.csv)"
        >
          <q-item-section class="text-uppercase">{{
            ExportFileType.csv
          }}</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>
