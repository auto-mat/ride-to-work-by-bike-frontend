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
import { defineComponent, onMounted, ref } from 'vue';

// composables
import {
  paginationLabel,
  useTableCompanyChallenge,
} from '../../composables/useTable';
import { useTableCompanyChallengeData } from '../../composables/useTableCompanyChallengeData';
import { useRoutes } from '../../composables/useRoutes';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import { CompanyChallengeTableColumns } from '../../components/types/Table';
import type { TableCompanyChallengeRow } from '../../composables/useTableCompanyChallengeData';

export default defineComponent({
  name: 'TableCompanyChallenge',
  emits: ['edit-challenge'],
  setup(_, { emit }) {
    const tableRef = ref<QTable | null>(null);
    const { columns, visibleColumns } = useTableCompanyChallenge();
    const { tableData } = useTableCompanyChallengeData();
    const { getRouteIcon } = useRoutes();
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    const onEditChallenge = (row: TableCompanyChallengeRow): void => {
      emit('edit-challenge', row);
    };

    // sort by challenge name
    onMounted(() => {
      if (tableRef.value) {
        tableRef.value.sort(CompanyChallengeTableColumns.name);
      }
    });

    return {
      borderRadius,
      columns,
      CompanyChallengeTableColumns,
      getRouteIcon,
      onEditChallenge,
      paginationLabel,
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
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
