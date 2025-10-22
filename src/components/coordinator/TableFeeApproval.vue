<script lang="ts">
/**
 * TableFeeApproval Component
 *
 * @description * Use this component to display a table with fee payments for
 * approval.
 * Shown on `CompanyCoordinatoFees` page.
 *
 * @props
 * - `approved` (bool, optional): To showing fee not approved/approved team members.
 *                                Defaults to `false`.
 *
 * @example
 * <table-fee-approval />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104283&t=uDGm2WzHopjjpn5o-1)
 */

// libraries
import { QTable } from 'quasar';
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';

// composables
import {
  paginationLabel,
  useTable,
  useTableFeeApproval,
} from '../../composables/useTable';
import { useTableFeeApprovalData } from '../../composables/useTableFeeApprovalData';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'TableFeeApproval',
  props: {
    approved: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    // holds an array of currently selected rows
    const selected = ref([]);
    const tableRef = ref<QTable | null>(null);

    const { columns, visibleColumns } = useTableFeeApproval();
    const { sortByAddress } = useTable();
    const { feeApprovalData } = useTableFeeApprovalData(props.approved);

    // sort by dateCreated initially
    onMounted(() => {
      if (tableRef.value) {
        tableRef.value.sort('dateCreated');
      }
    });
    watch(
      () => feeApprovalData.value,
      () => {
        nextTick(() => {
          if (tableRef.value) {
            tableRef.value.sort('dateCreated');
          }
        });
      },
    );

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    return {
      borderRadius,
      columns,
      feeApprovalData,
      selected,
      tableRef,
      visibleColumns,
      paginationLabel,
      sortByAddress,
    };
  },
});
</script>

<template>
  <div class="q-pa-md" data-cy="table-fee-approval">
    <div>
      <!-- Title -->
      <h3
        class="text-body1 text-bold text-black q-my-none"
        data-cy="table-fee-approval-title"
      >
        {{ $t('table.titleFeeApproval') }}
      </h3>
    </div>
    <div class="q-my-lg">
      <!-- Table -->
      <q-table
        ref="tableRef"
        flat
        bordered
        binary-state-sort
        :rows="feeApprovalData"
        :columns="columns"
        :visible-columns="visibleColumns"
        row-key="name"
        :sort-method="sortByAddress"
        :selection="approved ? 'none' : 'multiple'"
        v-model:selected="selected"
        :style="{ borderRadius }"
        :no-data-label="$t('table.textNoData')"
        :no-results-label="$t('table.textNoResults')"
        :loading-label="$t('table.textLoading')"
        :rows-per-page-label="$t('table.textRowsPerPage')"
        :pagination-label="paginationLabel"
        data-cy="table-fee-approval-table"
      >
        <template v-slot:body="props">
          <!-- Group header -->
          <q-tr
            v-if="props.row.isFirst"
            class="bg-primary text-weight-bold text-white"
            data-cy="table-fee-approval-address-header"
          >
            <q-td :colspan="approved ? 6 : 7">
              {{ props.row.address }}
            </q-td>
          </q-tr>
          <!-- Row -->
          <q-tr
            :props="props"
            class="data-row text-grey-10"
            data-cy="table-fee-approval-row"
          >
            <!-- Checkbox -->
            <q-td v-if="!approved">
              <q-checkbox
                v-model="props.selected"
                color="primary"
                data-cy="table-fee-approval-checkbox"
              />
            </q-td>
            <!-- Amount -->
            <q-td
              key="amount"
              :props="props"
              data-cy="table-fee-approval-amount"
            >
              {{ props.row.amount }}
            </q-td>
            <!-- Name -->
            <q-td key="name" :props="props" data-cy="table-fee-approval-name">
              {{ props.row.name }}
            </q-td>
            <!-- Email -->
            <q-td key="email" :props="props" data-cy="table-fee-approval-email">
              {{ props.row.email }}
            </q-td>
            <!-- Nickname -->
            <q-td
              key="nickname"
              :props="props"
              data-cy="table-fee-approval-nickname"
            >
              {{ props.row.nickname }}
            </q-td>
            <!-- Address -->
            <q-td
              key="address"
              :props="props"
              data-cy="table-fee-approval-address"
            >
              {{ props.row.address }}
            </q-td>
            <!-- Date created -->
            <q-td
              key="dateCreated"
              :props="props"
              data-cy="table-fee-approval-date"
            >
              <template v-if="props.row.dateCreated">
                {{ $d(new Date(props.row.dateCreated), 'numeric') }}
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div v-if="!approved" class="q-mt-lg text-right">
      <!-- Button: Approve selected -->
      <q-btn
        rounded
        unelevated
        :label="$t('table.buttonFeeApproval')"
        color="primary"
        data-cy="table-fee-approval-button"
      />
    </div>
  </div>
</template>
