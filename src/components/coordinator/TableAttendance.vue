<script lang="ts">
/**
 * TableAttendance Component
 *
 * @description * Use this component to display tables with attendance information.
 * Shown on `CoordinatorAttendance` page. Displays one table per subsidiary,
 * with members grouped by team within each table.
 *
 * @example
 * <table-attendance />
 */

// libraries
import { QTable } from 'quasar';
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';

// composables
import {
  paginationLabel,
  useTable,
  useTableAttendance,
} from '../../composables/useTable';
import { useTableAttendanceData } from '../../composables/useTableAttendanceData';
import { useCopyToClipboard } from '../../composables/useCopyToClipboard';

// enums
import { PaymentState } from '../enums/Payment';

// enum
import {
  AttendanceTableFeeColumnIcons,
  AttendanceTableFeeColumnIconsColors,
  AttendanceTablePayColumnIconsColors,
} from '../types/Table';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'TableAttendance',
  setup() {
    const tableRefs = ref<QTable[]>([]);
    const { subsidiariesData } = useTableAttendanceData();

    // sort by name initially
    onMounted(() => {
      sortGroups();
    });
    // sort when subsidiaries are reloaded
    watch(
      () => subsidiariesData.value,
      () => {
        nextTick(() => {
          sortGroups();
        });
      },
    );
    function sortGroups() {
      if (tableRefs.value && tableRefs.value.length > 0) {
        tableRefs.value.forEach((table) => {
          if (table) {
            table.sort('name');
          }
        });
      }
    }

    const { copyToClipboard } = useCopyToClipboard();
    const {
      columns,
      visibleColumns,
      getPaymentStateIcon,
      getPaymentStateLabel,
      getPaymentTypeLabel,
    } = useTableAttendance();
    const { sortByTeam } = useTable();
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    /**
     * Teams list is used to display empty team rows in the table.
     * If team does not have data (members), it will be displayed
     * based on this list.
     * It will be displayed before the next group header.
     * The row will contain "delete" and "rename" actions.
     */
    const teams = ref([
      // TODO: Add teams
    ]);

    const iconSize = '18px';

    return {
      AttendanceTableFeeColumnIcons,
      AttendanceTableFeeColumnIconsColors,
      AttendanceTablePayColumnIconsColors,
      borderRadius,
      columns,
      copyToClipboard,
      iconSize,
      subsidiariesData,
      tableRefs,
      teams,
      visibleColumns,
      getPaymentStateIcon,
      getPaymentStateLabel,
      getPaymentTypeLabel,
      paginationLabel,
      sortByTeam,
      PaymentState,
    };
  },
});
</script>

<template>
  <div data-cy="table-attendance">
    <!-- Loop through each subsidiary -->
    <div
      v-for="(subsidiaryData, index) in subsidiariesData"
      :key="subsidiaryData.subsidiary.id"
      :class="{ 'q-mt-xl': index > 0 }"
    >
      <!-- Subsidiary header -->
      <h3 class="text-h6 q-mb-xs" data-cy="table-attendance-subsidiary-header">
        {{ subsidiaryData.subsidiary?.street }}
        {{ subsidiaryData.subsidiary?.street_number }},
        {{ subsidiaryData.subsidiary?.city }}
      </h3>
      <div class="flex flex-wrap gap-y-8 gap-x-32 q-mb-lg">
        <div data-cy="table-attendance-city-challenge">
          {{ $t('coordinator.labelCityChallenge') }}:
          {{ subsidiaryData.subsidiary?.city }}
        </div>
        <div data-cy="table-attendance-teams">
          {{ subsidiaryData.subsidiary?.teams?.length }}
          {{
            $t(
              'coordinator.labelTeams',
              subsidiaryData.subsidiary?.teams?.length,
            )
          }}
        </div>
        <div data-cy="table-attendance-members">
          {{ subsidiaryData.members?.length }}
          {{ $t('coordinator.labelMembers', subsidiaryData.members?.length) }}
        </div>
      </div>

      <!-- Table for this subsidiary -->
      <q-table
        ref="tableRefs"
        flat
        bordered
        binary-state-sort
        :rows="subsidiaryData.members"
        :columns="columns"
        :visible-columns="visibleColumns"
        row-key="name"
        :sort-method="sortByTeam"
        :style="{ borderRadius }"
        :no-data-label="$t('table.textNoData')"
        :no-results-label="$t('table.textNoResults')"
        :loading-label="$t('table.textLoading')"
        :rows-per-page-label="$t('table.textRowsPerPage')"
        :pagination-label="paginationLabel"
        data-cy="table-attendance-table"
      >
        <template v-slot:body="props">
          <!-- Group header -->
          <q-tr
            v-if="props.row.isFirst"
            class="bg-primary text-weight-bold text-white"
            data-cy="table-attendance-team-header"
          >
            <q-td colspan="7">
              {{ props.row.team }}
            </q-td>
          </q-tr>
          <!-- Row -->
          <q-tr
            :props="props"
            class="text-grey-10"
            data-cy="table-attendance-row"
          >
            <!-- Name -->
            <q-td key="name" :props="props" data-cy="table-attendance-name">
              {{ props.row.name }}
            </q-td>
            <!-- Nickname -->
            <q-td
              key="nickname"
              :props="props"
              data-cy="table-attendance-nickname"
            >
              {{ props.row.nickname }}
            </q-td>
            <!-- Contact -->
            <q-td
              auto-width
              key="contact"
              :props="props"
              data-cy="table-attendance-contact"
            >
              <!-- Phone -->
              <q-btn
                flat
                dense
                round
                size="sm"
                :disable="!props.row.telephone"
                @click="
                  props.row.telephone && copyToClipboard(props.row.telephone)
                "
                data-cy="table-attendance-contact-phone-icon"
              >
                <q-tooltip>
                  {{ $t('coordinator.textClickToCopy') }}:
                  {{ props.row.telephone }}
                </q-tooltip>
                <q-icon
                  :size="iconSize"
                  :color="props.row.telephone ? 'primary' : 'grey-5'"
                  name="svguse:icons/profile_coordinator_contact/icons.svg#phone"
                />
              </q-btn>
              <!-- Email -->
              <q-btn
                flat
                dense
                round
                size="sm"
                class="q-ml-xs"
                :disable="!props.row.email"
                @click="props.row.email && copyToClipboard(props.row.email)"
                data-cy="table-attendance-contact-email-icon"
              >
                <q-tooltip>
                  {{ $t('coordinator.textClickToCopy') }}: {{ props.row.email }}
                </q-tooltip>
                <q-icon
                  :size="iconSize"
                  :color="props.row.email ? 'primary' : 'grey-5'"
                  name="svguse:icons/profile_coordinator_contact/icons.svg#email"
                />
              </q-btn>
            </q-td>
            <!-- Fee Approved -->
            <q-td
              auto-width
              key="isFeeApproved"
              :props="props"
              data-cy="table-attendance-fee-approved"
            >
              <q-icon
                :size="iconSize"
                :name="
                  props.row.isFeeApproved
                    ? AttendanceTableFeeColumnIcons.approved
                    : AttendanceTableFeeColumnIcons.unapproved
                "
                :color="
                  props.row.isFeeApproved
                    ? AttendanceTableFeeColumnIconsColors.approved
                    : AttendanceTableFeeColumnIconsColors.unapproved
                "
                data-cy="table-attendance-fee-approved-icon"
              />
            </q-td>
            <!-- Payment Type -->
            <q-td
              key="paymentType"
              :props="props"
              data-cy="table-attendance-payment-type"
            >
              {{ getPaymentTypeLabel(props.row.paymentType) }}
            </q-td>
            <!-- Payment State -->
            <q-td
              key="paymentState"
              :props="props"
              data-cy="table-attendance-payment-state"
            >
              <q-icon
                :name="getPaymentStateIcon(props.row.paymentState)"
                :size="iconSize"
                :color="
                  props.row.paymentState === PaymentState.done
                    ? AttendanceTablePayColumnIconsColors.done
                    : AttendanceTablePayColumnIconsColors.default
                "
                class="q-mr-xs"
              />
              {{ getPaymentStateLabel(props.row.paymentState) }}
            </q-td>
            <!-- Action buttons -->
            <q-td
              auto-width
              key="actions"
              :props="props"
              data-cy="table-attendance-actions"
            >
              <!-- Button: More actions -->
              <q-btn dense flat round>
                <q-icon name="more_vert" />
                <!-- Dropdown menu -->
                <q-menu auto-close>
                  <!-- TODO: Add actions -->
                </q-menu>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
