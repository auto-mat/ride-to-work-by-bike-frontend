<script lang="ts">
/**
 * TableCompanyChallenge Component
 *
 * @description * Use this component to display a company challenge table.
 * Note: Used on `CompanyCoordinatorPage`.
 *
 * @example
 * <table-company-challenge />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-105355&t=S3zaCcFdhkmkXEey-1)
 */

// libraries
import { QTable } from 'quasar';
import { computed, defineComponent, inject, onMounted, ref } from 'vue';

// components
import DialogDefault from '../global/DialogDefault.vue';
import TableChallengeResults from '../results/TableChallengeResults.vue';

// composables
import { useApiGetCompetitionResults } from '../../composables/useApiGetCompetitionResults';
import {
  paginationLabel,
  useTableCompanyChallenge,
} from '../../composables/useTable';
import { useTableCompanyChallengeData } from '../../composables/useTableCompanyChallengeData';
import { useRoutes } from '../../composables/useRoutes';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

import { useAdminCompetitionStore } from '../../stores/adminCompetition';

// types
import { CompanyChallengeTableColumns } from '../../components/types/Table';
import type { TableCompanyChallengeRow } from '../../composables/useTableCompanyChallengeData';

export default defineComponent({
  name: 'TableCompanyChallenge',
  emits: ['edit-challenge'],
  components: {
    DialogDefault,
    TableChallengeResults,
  },
  setup(_, { emit }) {
    const logger = inject('vuejs3-logger') as Logger | null;
    const tableRef = ref<QTable | null>(null);
    const { columns, visibleColumns } = useTableCompanyChallenge();
    const { tableData } = useTableCompanyChallengeData();
    const { getRouteIcon } = useRoutes();
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    const isDialogOpen = ref(false);
    const selectedCompetition = ref<Competition | null>(null);
    const adminCompetitionStore = useAdminCompetitionStore();
    const competitions = computed(() => adminCompetitionStore.getCompetitions);

    const onEditChallenge = (row: TableCompanyChallengeRow): void => {
      emit('edit-challenge', row);
    };

    // sort by challenge name
    onMounted(() => {
      if (tableRef.value) {
        tableRef.value.sort(CompanyChallengeTableColumns.name);
      }
    });

    const { results, isLoading, loadCompetitionResults } =
      useApiGetCompetitionResults(logger);

    const onShowCompetitionResultDialog = (
      row: TableCompanyChallengeRow,
    ): void => {
      const competition = competitions.value.filter(
        (competition) => competition.name === row.name,
      );
      selectedCompetition.value = competition[0];
      isDialogOpen.value = true;
      loadCompetitionResults(competition[0].slug);
    };

    return {
      borderRadius,
      columns,
      CompanyChallengeTableColumns,
      getRouteIcon,
      isDialogOpen,
      isLoading,
      onEditChallenge,
      onShowCompetitionResultDialog,
      loadCompetitionResults,
      paginationLabel,
      results,
      selectedCompetition,
      tableData,
      tableRef,
      visibleColumns,
    };
  },
});
</script>

<template>
  <div data-cy="table-company-challenge">
    <!-- Table -->
    <q-table
      ref="tableRef"
      flat
      bordered
      binary-state-sort
      :rows="tableData"
      :columns="columns"
      :visible-columns="visibleColumns"
      :row-key="CompanyChallengeTableColumns.name"
      :style="{ borderRadius }"
      :no-data-label="$t('table.textNoData')"
      :no-results-label="$t('table.textNoResults')"
      :loading-label="$t('table.textLoading')"
      :rows-per-page-label="$t('table.textRowsPerPage')"
      :pagination-label="paginationLabel"
      data-cy="table-company-challenge-table"
    >
      <template v-slot:body="props">
        <q-tr
          :props="props"
          class="text-grey-10"
          data-cy="table-company-challenge-row"
        >
          <!-- Challenge Name -->
          <q-td
            :key="CompanyChallengeTableColumns.name"
            :props="props"
            data-cy="table-company-challenge-name"
          >
            {{ props.row.name }}
          </q-td>

          <!-- Start Date -->
          <q-td
            :key="CompanyChallengeTableColumns.startDate"
            :props="props"
            data-cy="table-company-challenge-start-date"
          >
            <template v-for="col in props.cols" :key="col.field">
              <span v-if="col.field === CompanyChallengeTableColumns.startDate">
                {{ col.value }}
              </span>
            </template>
          </q-td>

          <!-- End Date -->
          <q-td
            :key="CompanyChallengeTableColumns.endDate"
            :props="props"
            data-cy="table-company-challenge-end-date"
          >
            <template v-for="col in props.cols" :key="col.field">
              <span v-if="col.field === CompanyChallengeTableColumns.endDate">
                {{ col.value }}
              </span>
            </template>
          </q-td>

          <!-- Competition Type -->
          <q-td
            :key="CompanyChallengeTableColumns.competitionType"
            :props="props"
            data-cy="table-company-challenge-competition-type"
          >
            <template v-for="col in props.cols" :key="col.field">
              <span
                v-if="
                  col.field === CompanyChallengeTableColumns.competitionType
                "
              >
                {{ col.value }}
              </span>
            </template>
          </q-td>

          <!-- Competitor Type -->
          <q-td
            :key="CompanyChallengeTableColumns.competitorType"
            :props="props"
            data-cy="table-company-challenge-competitor-type"
          >
            <template v-for="col in props.cols" :key="col.field">
              <span
                v-if="col.field === CompanyChallengeTableColumns.competitorType"
              >
                {{ col.value }}
              </span>
            </template>
          </q-td>

          <!-- Transport Types -->
          <q-td
            :key="CompanyChallengeTableColumns.transportTypes"
            :props="props"
            data-cy="table-company-challenge-transport-types"
          >
            <div class="flex gap-8">
              <q-icon
                v-for="transportType in props.row.transportTypes"
                :key="transportType"
                :name="getRouteIcon(transportType)"
                size="18px"
                color="grey-10"
                :data-cy="`table-company-challenge-transport-icon-${transportType}`"
              />
            </div>
          </q-td>

          <!-- Actions -->
          <q-td
            :key="CompanyChallengeTableColumns.actions"
            :props="props"
            data-cy="table-company-challenge-actions"
          >
            <q-btn
              flat
              round
              dense
              icon="edit"
              color="primary"
              size="sm"
              @click="onEditChallenge(props.row)"
              data-cy="button-edit-company-challenge"
            >
              <q-tooltip>{{
                $t('coordinator.buttonEditCompanyChallenge')
              }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="visibility"
              color="primary"
              size="sm"
              @click="onShowCompetitionResultDialog(props.row)"
              data-cy="button-show-organization-challenge-result"
              class="q-ml-md"
            >
              <q-tooltip>{{
                $t('index.cardListChallenge.buttonShowResults')
              }}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Dialog: Challenge results -->
    <dialog-default
      v-if="selectedCompetition"
      v-model="isDialogOpen"
      data-cy="dialog-challenge-results"
    >
      <template #title>
        <span data-cy="dialog-challenge-results-title">
          {{ selectedCompetition.name }}
        </span>
      </template>
      <template #content>
        <!-- Loading spinner -->
        <div
          v-if="isLoading"
          class="flex flex-center q-pa-lg"
          data-cy="dialog-challenge-results-spinner"
        >
          <q-spinner color="primary" size="3em" />
        </div>
        <!-- Results table -->
        <table-challenge-results
          v-else
          :rows="results"
          :competition-type="selectedCompetition.competition_type"
        />
      </template>
    </dialog-default>
  </div>
</template>
