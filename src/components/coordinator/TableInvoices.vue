<script lang="ts">
/**
 * TableInvoices Component
 *
 * @description * Use this component to display a table with invoice information.
 * Shown on the invoices management page.
 *
 * @example
 * <table-invoices />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-105324&t=bpoq22gURhREo0rw-1)
 */

// libraries
import { QTable } from 'quasar';
import { defineComponent, onMounted, ref } from 'vue';

// composables
import { paginationLabel } from '../../composables/useTable';
import { useTableInvoices } from '../../composables/useTable';
import { useTableInvoicesData } from '../../composables/useTableInvoicesData';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

import { InvoicesTableColumns } from '../../components/types/Table';

export default defineComponent({
  name: 'TableInvoices',

  setup() {
    const tableRef = ref<QTable | null>(null);
    // sort by exposureDate initially
    onMounted(() => {
      if (tableRef.value) {
        tableRef.value.sort('exposureDate');
      }
    });

    const { columns, visibleColumns } = useTableInvoices();
    const { invoicesData } = useTableInvoicesData();
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    return {
      borderRadius,
      columns,
      InvoicesTableColumns,
      invoicesData,
      tableRef,
      visibleColumns,
      paginationLabel,
    };
  },
});
</script>

<template>
  <div data-cy="table-invoices">
    <!-- Table -->
    <q-table
      ref="tableRef"
      flat
      bordered
      binary-state-sort
      :rows="invoicesData"
      :columns="columns"
      :visible-columns="visibleColumns"
      :row-key="InvoicesTableColumns.orderNumber"
      :style="{ borderRadius }"
      :no-data-label="$t('table.textNoData')"
      :no-results-label="$t('table.textNoResults')"
      :loading-label="$t('table.textLoading')"
      :rows-per-page-label="$t('table.textRowsPerPage')"
      :pagination-label="paginationLabel"
      data-cy="table-invoices-table"
    >
      <template v-slot:body="props">
        <q-tr :props="props" class="text-grey-10" data-cy="table-invoices-row">
          <!-- Exposure Date -->
          <q-td
            :key="InvoicesTableColumns.exposureDate"
            :props="props"
            data-cy="table-invoices-exposure-date"
          >
            <!-- Loop over data to get formatted content -->
            <template v-for="col in props.cols" :key="col.field">
              <span v-if="col.field === InvoicesTableColumns.exposureDate">
                {{ col.value }}
              </span>
            </template>
          </q-td>
          <!-- Order Number -->
          <q-td
            :key="InvoicesTableColumns.orderNumber"
            :props="props"
            data-cy="table-invoices-order-number"
          >
            {{ props.row.orderNumber }}
          </q-td>
          <!-- Invoice URL -->
          <q-td
            :key="InvoicesTableColumns.invoiceUrl"
            :props="props"
            data-cy="table-invoices-url"
          >
            <div class="flex flex-wrap gap-4">
              <!-- Button: Fakturoid invoice -->
              <q-btn
                dense
                flat
                no-caps
                rounded
                :href="props.row.invoiceUrl"
                v-if="props.row.invoiceUrl"
              >
                <!-- Icon -->
                <q-icon
                  :name="'svguse:icons/table_invoices/icons.svg#tabler:file-type-pdf'"
                  size="18px"
                  color="primary"
                  class="q-mr-xs"
                  data-cy="table-invoices-file-icon"
                />
                <!-- Label -->
                <span data-cy="table-invoices-file-label">
                  {{ $t('table.labelFakturoid') }}
                </span>
              </q-btn>
            </div>
          </q-td>
          <!-- Payment Count -->
          <q-td
            :key="InvoicesTableColumns.paymentCount"
            :props="props"
            data-cy="table-invoices-payment-count"
          >
            {{ props.row.paymentCount }}
          </q-td>
          <!-- Total Amount -->
          <q-td
            :key="InvoicesTableColumns.totalAmount"
            :props="props"
            data-cy="table-invoices-total-amount"
          >
            {{ props.row.totalAmount }}
          </q-td>
          <!-- Paid Date -->
          <q-td
            :key="InvoicesTableColumns.paidDate"
            :props="props"
            data-cy="table-invoices-paid-date"
          >
            <!-- Loop over data to get formatted content -->
            <template v-for="col in props.cols" :key="col.field">
              <span
                v-if="col.field === InvoicesTableColumns.paidDate && col.value"
              >
                {{ col.value }}
              </span>
            </template>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
