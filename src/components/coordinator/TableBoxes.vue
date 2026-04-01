<script lang="ts">
/**
 * TableBoxes Component
 *
 * @description * Use this component to display a table with box/package information.
 * Shows tracking numbers, delivery status, recipients, and last modified dates.
 * Grouped by subsidiary address.
 * Uses data from adminOrganisation store.
 *
 * @example
 * <table-boxes />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-106474&t=ToXiwpZEeyNIGsXv-1)
 */

// libraries
import { QTable } from 'quasar';
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';

// components
import DialogDefault from '../global/DialogDefault.vue';

// composables
import {
  paginationLabel,
  useTable,
  useTableBoxes,
} from '../../composables/useTable';
import { useTableBoxesData } from '../../composables/useTableBoxesData';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import { BoxesTableColumns } from '../../components/types/Table';

export default defineComponent({
  name: 'TableBoxes',
  components: {
    DialogDefault,
  },
  setup() {
    const tableRef = ref<QTable | null>(null);
    const { columns, visibleColumns } = useTableBoxes();
    const { sortByAddress } = useTable();
    const { boxesData } = useTableBoxesData();
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;
    const isDialogRecipientsOpen = ref(false);
    const selectedRecipientNames = ref<string[]>([]);

    // sort by lastModified initially
    onMounted(() => {
      if (tableRef.value) {
        tableRef.value.sort('lastModified');
      }
    });
    watch(
      () => boxesData.value,
      () => {
        nextTick(() => {
          if (tableRef.value) {
            tableRef.value.sort('lastModified');
          }
        });
      },
    );

    /**
     * Get package status icon name
     * @param {boolean} dispatched - Whether package is dispatched
     * @returns {string} - Icon name
     */
    const getStatusIcon = (dispatched: boolean): string => {
      return dispatched
        ? 'svguse:icons/table_boxes/icons.svg#tabler:truck'
        : 'svguse:icons/table_boxes/icons.svg#tabler:package';
    };

    /**
     * Get package status label
     * @param {boolean} dispatched - Whether package is dispatched
     * @returns {string} - Status label
     */
    const getStatusLabel = (dispatched: boolean): string => {
      return dispatched
        ? 'table.labelPackageDispatched'
        : 'table.labelPackageProcessing';
    };

    /**
     * Open dialog with recipient names list
     * @param {string[]} names - Array of recipient names
     */
    const onShowRecipients = (names: string[]): void => {
      selectedRecipientNames.value = names;
      isDialogRecipientsOpen.value = true;
    };

    return {
      borderRadius,
      BoxesTableColumns,
      boxesData,
      columns,
      getStatusIcon,
      getStatusLabel,
      isDialogRecipientsOpen,
      onShowRecipients,
      paginationLabel,
      selectedRecipientNames,
      sortByAddress,
      tableRef,
      visibleColumns,
    };
  },
});
</script>

<template>
  <div data-cy="table-boxes">
    <!-- Table -->
    <q-table
      ref="tableRef"
      flat
      bordered
      binary-state-sort
      :rows="boxesData"
      :columns="columns"
      :visible-columns="visibleColumns"
      :row-key="BoxesTableColumns.trackingNumber"
      :sort-method="sortByAddress"
      :style="{ borderRadius }"
      :no-data-label="$t('table.textNoData')"
      :no-results-label="$t('table.textNoResults')"
      :loading-label="$t('table.textLoading')"
      :rows-per-page-label="$t('table.textRowsPerPage')"
      :pagination-label="paginationLabel"
      data-cy="table-boxes-table"
    >
      <template v-slot:body="props">
        <!-- Group header by address -->
        <q-tr
          v-if="props.row.isFirst"
          class="bg-primary text-weight-bold text-white"
          data-cy="table-boxes-address-header"
        >
          <q-td :colspan="4">
            {{ props.row.address }}
          </q-td>
        </q-tr>
        <!-- Data row -->
        <q-tr :props="props" class="text-grey-10" data-cy="table-boxes-row">
          <!-- Tracking Number -->
          <q-td
            :key="BoxesTableColumns.trackingNumber"
            :props="props"
            data-cy="table-boxes-tracking-number"
          >
            <!-- has tracking number AND tracking link -->
            <q-btn
              v-if="props.row.trackingNumber && props.row.trackingLink"
              flat
              dense
              no-caps
              :href="props.row.trackingLink"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              class="rounded-borders q-pa-xs"
              data-cy="table-boxes-tracking-link"
            >
              <q-icon
                name="svguse:icons/table_boxes/icons.svg#tabler:external-link"
                size="18px"
                color="primary"
                class="q-mr-sm"
                data-cy="table-boxes-tracking-icon"
              />
              <span>{{ props.row.trackingNumber }}</span>
            </q-btn>
            <!-- has tracking number but no tracking link -->
            <span v-else-if="props.row.trackingNumber">
              {{ props.row.trackingNumber }}
            </span>
            <!-- no tracking number -->
            <span v-else>
              {{ $t('table.labelCellEmpty') }}
            </span>
          </q-td>
          <!-- Package Status -->
          <q-td
            :key="BoxesTableColumns.packageStatus"
            :props="props"
            data-cy="table-boxes-status"
          >
            <div class="flex items-center gap-8">
              <q-icon
                :name="getStatusIcon(props.row.packageStatus)"
                size="18px"
                :color="props.row.packageStatus ? 'positive' : 'primary'"
                data-cy="table-boxes-status-icon"
              />
              <span data-cy="table-boxes-status-label">
                {{ $t(getStatusLabel(props.row.packageStatus)) }}
              </span>
            </div>
          </q-td>
          <!-- Recipients -->
          <q-td
            :key="BoxesTableColumns.recipients"
            :props="props"
            data-cy="table-boxes-recipients"
          >
            <q-btn
              v-if="props.row.recipientCount > 1"
              flat
              dense
              no-caps
              size="13px"
              color="primary"
              class="rounded-borders q-px-sm q-py-xs"
              data-cy="table-boxes-recipients-button"
              @click="onShowRecipients(props.row.recipientNames)"
            >
              {{ props.row.recipients }}
            </q-btn>
            <span v-else>
              {{ props.row.recipients }}
            </span>
          </q-td>
          <!-- Addressee -->
          <q-td
            :key="BoxesTableColumns.addressee"
            :props="props"
            data-cy="table-boxes-addressee"
          >
            {{ props.row.addressee }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Dialog: Recipients list -->
    <dialog-default
      v-model="isDialogRecipientsOpen"
      min-width="250px"
      data-cy="dialog-recipients"
    >
      <template #title>
        {{ $t('table.titleDialogRecipients') }}
      </template>
      <template #content>
        <q-list
          separator
          data-cy="dialog-recipients-list"
          style="margin: -1rem"
        >
          <q-item
            v-for="(name, index) in selectedRecipientNames"
            :key="index"
            data-cy="dialog-recipients-item"
          >
            <q-item-section>{{ name }}</q-item-section>
          </q-item>
        </q-list>
      </template>
    </dialog-default>
  </div>
</template>
