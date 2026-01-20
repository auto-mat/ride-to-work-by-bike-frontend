<script lang="ts">
/**
 * TableResults Component
 *
 * @description * Use this component to display tables with member diploma information.
 *
 * Note: Used in `TabCoordinatorResults` component.
 *
 * @example
 * <table-results />
 */

// libraries
import { QTable } from 'quasar';
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';

// composables
import {
  paginationLabel,
  useTable,
  useTableResults,
} from '../../composables/useTable';
import { useTableAttendanceData } from '../../composables/useTableAttendanceData';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import type { TableAttendanceSubsidiaryData } from '../../composables/useTableAttendanceData';

export default defineComponent({
  name: 'TableResults',
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

    const { columns, visibleColumns } = useTableResults();
    const { sortByTeam } = useTable();
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    // table pagination settings
    const pagination = ref({
      rowsPerPage: 0,
    });

    /**
     * Helper function to get team diploma by ID
     * @param {TableAttendanceSubsidiaryData} subsidiaryData - Data
     * @param {number} teamId - Team ID to get diploma for
     */
    const getTeamDiploma = (
      subsidiaryData: TableAttendanceSubsidiaryData,
      teamId: number,
    ): string | null => {
      const team = subsidiaryData.subsidiary.teams.find((t) => t.id === teamId);
      return team?.diploma ?? null;
    };

    const downloadDiploma = (diplomaUrl: string | null): void => {
      if (!diplomaUrl) return;
      window.open(diplomaUrl, '_blank');
    };

    return {
      borderRadius,
      columns,
      downloadDiploma,
      getTeamDiploma,
      pagination,
      paginationLabel,
      sortByTeam,
      subsidiariesData,
      tableRefs,
      visibleColumns,
    };
  },
});
</script>

<template>
  <div>
    <div
      v-for="subsidiaryData in subsidiariesData"
      :key="subsidiaryData.subsidiary.id"
      class="q-mb-lg"
    >
      <!-- Subsidiary header -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-sm">
          <h3
            class="text-h6 q-my-none flex items-center gap-8"
            data-cy="table-results-subsidiary-header"
          >
            <span>{{ subsidiaryData.subsidiary?.name }}</span>
          </h3>
          <!-- Info: Subsidiary -->
          <div class="flex flex-wrap gap-y-8 gap-x-32">
            <div data-cy="table-results-city-challenge">
              {{ $t('coordinator.labelCityChallenge') }}:
              {{ subsidiaryData.subsidiary?.city }}
            </div>
            <div data-cy="table-results-teams">
              {{ subsidiaryData.subsidiary?.teams?.length }}
              {{
                $t(
                  'coordinator.labelTeams',
                  subsidiaryData.subsidiary?.teams?.length,
                )
              }}
            </div>
            <div data-cy="table-results-members">
              {{
                subsidiaryData.members.filter((member) => !member.isEmpty)
                  .length
              }}
              {{
                $t(
                  'coordinator.labelMembers',
                  subsidiaryData.members.filter((member) => !member.isEmpty)
                    .length,
                )
              }}
            </div>
          </div>
          <!-- Info: Subsidiary contact -->
          <div
            v-if="
              subsidiaryData.subsidiary?.box_addressee_name ||
              subsidiaryData.subsidiary?.box_addressee_telephone ||
              subsidiaryData.subsidiary?.box_addressee_email
            "
            class="flex flex-wrap gap-y-8 gap-x-32 q-mt-xs"
            data-cy="table-results-box-addressee"
          >
            <div>
              {{ $t('coordinator.labelBoxAddressee') }}:
              {{ subsidiaryData.subsidiary.box_addressee_name }}
            </div>
            <div v-if="subsidiaryData.subsidiary.box_addressee_telephone">
              <a
                class="text-grey-10"
                :href="`tel:${subsidiaryData.subsidiary.box_addressee_telephone.replace(/\s/g, '')}`"
              >
                <q-icon
                  size="16px"
                  name="svguse:icons/profile_coordinator_contact/icons.svg#phone"
                  color="primary"
                  class="q-mr-xs"
                  style="text-decoration: none"
                />{{ subsidiaryData.subsidiary.box_addressee_telephone }}
              </a>
            </div>
            <div v-if="subsidiaryData.subsidiary.box_addressee_email">
              <a
                class="text-grey-10"
                :href="`mailto:${subsidiaryData.subsidiary.box_addressee_email}`"
              >
                <q-icon
                  size="16px"
                  name="svguse:icons/profile_coordinator_contact/icons.svg#email"
                  color="primary"
                  class="q-mr-xs"
                  style="text-decoration: none"
                />{{ subsidiaryData.subsidiary.box_addressee_email }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
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
        :pagination="pagination"
        :style="{ borderRadius }"
        :no-data-label="$t('table.textNoData')"
        :no-results-label="$t('table.textNoResults')"
        :loading-label="$t('table.textLoading')"
        :rows-per-page-label="$t('table.textRowsPerPage')"
        :pagination-label="paginationLabel"
        data-cy="table-results"
      >
        <template v-slot:body="props">
          <!-- Team header row -->
          <q-tr
            v-if="props.row.isFirst"
            class="bg-primary text-weight-bold text-white"
            data-cy="table-results-team-header"
          >
            <q-td colspan="6">
              <div class="flex items-center justify-between gap-4">
                <span>{{ props.row.team }}</span>
                <div class="flex gap-4">
                  <!-- Button: Download team diploma -->
                  <q-btn
                    flat
                    dense
                    round
                    size="sm"
                    icon="download"
                    color="white"
                    :disable="!getTeamDiploma(subsidiaryData, props.row.teamId)"
                    @click="
                      downloadDiploma(
                        getTeamDiploma(subsidiaryData, props.row.teamId),
                      )
                    "
                    data-cy="table-results-button-download-team-diploma"
                  >
                    <q-tooltip>{{
                      $t('coordinator.downloadTeamDiploma')
                    }}</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-td>
          </q-tr>
          <!-- Member data row -->
          <q-tr
            v-if="!props.row.isEmpty"
            :props="props"
            class="text-grey-10"
            data-cy="table-results-row"
          >
            <!-- Name -->
            <q-td key="name" :props="props" data-cy="table-results-name">
              {{ props.row.name }}
            </q-td>
            <!-- Nickname -->
            <q-td
              key="nickname"
              :props="props"
              data-cy="table-results-nickname"
            >
              {{ props.row.nickname }}
            </q-td>
            <!-- Email -->
            <q-td key="email" :props="props" data-cy="table-results-email">
              <a
                v-if="props.row.email"
                class="text-grey-10"
                :href="`mailto:${props.row.email}`"
              >
                <q-icon
                  size="16px"
                  name="svguse:icons/profile_coordinator_contact/icons.svg#email"
                  color="primary"
                  class="q-mr-xs"
                  style="text-decoration: none"
                />{{ props.row.email }}
              </a>
            </q-td>
            <!-- Telephone -->
            <q-td
              key="telephone"
              :props="props"
              data-cy="table-results-telephone"
            >
              <a
                v-if="props.row.telephone"
                class="text-grey-10"
                :href="`tel:${props.row.telephone.replace(/\s/g, '')}`"
              >
                <q-icon
                  size="16px"
                  name="svguse:icons/profile_coordinator_contact/icons.svg#phone"
                  color="primary"
                  class="q-mr-xs"
                  style="text-decoration: none"
                />{{ props.row.telephone }}
              </a>
            </q-td>
            <!-- Diploma -->
            <q-td
              key="diploma"
              class="text-right"
              :props="props"
              data-cy="table-results-diploma"
            >
              <q-btn
                unelevated
                rounded
                color="primary"
                size="sm"
                :disable="!props.row.diploma"
                @click="downloadDiploma(props.row.diploma)"
                data-cy="table-results-button-download-diploma"
              >
                <q-icon name="download" size="18px" class="q-mr-xs" />
                {{ $t('coordinator.buttonDownloadDiploma') }}
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
