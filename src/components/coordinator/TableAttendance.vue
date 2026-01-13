<script lang="ts">
/**
 * TableAttendance Component
 *
 * @description * Use this component to display tables with attendance information.
 * Shown on `CoordinatorAttendance` page. Displays one table per subsidiary,
 * with members grouped by team within each table.
 *
 * @components
 * - DialogDefault.vue - default dialog wrapper
 * - FormMoveMember.vue - used to move a member to another team
 * - FormAddTeam.vue - used to add a new team to a subsidiary
 *
 * @example
 * <table-attendance />
 */

// libraries
import { QForm, QTable } from 'quasar';
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue';

// components
import DialogDefault from '../global/DialogDefault.vue';
import FormAddTeam from '../form/FormAddTeam.vue';
import FormMoveMember from '../form/FormMoveMember.vue';

// composables
import {
  paginationLabel,
  useTable,
  useTableAttendance,
} from '../../composables/useTable';
import { useTableAttendanceData } from '../../composables/useTableAttendanceData';
import { useCopyToClipboard } from '../../composables/useCopyToClipboard';
import { useTeamMemberApprovalStatus } from '../../composables/useTeamMemberApprovalStatus';

// enums
import { PaymentState } from '../enums/Payment';
import { TeamMemberStatus } from '../enums/TeamMember';

// enum
import {
  AttendanceTableFeeColumnIcons,
  AttendanceTableFeeColumnIconsColors,
  AttendanceTablePayColumnIconsColors,
} from '../types/Table';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// stores
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';

// types
import type { FormTeamFields, FormMoveMemberFields } from '../types/Form';
import type { TableAttendanceRow } from '../../composables/useTableAttendanceData';

export default defineComponent({
  name: 'TableAttendance',
  components: {
    DialogDefault,
    FormAddTeam,
    FormMoveMember,
  },
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
    const { getStatusLabel, getStatusColor, getStatusIcon } =
      useTeamMemberApprovalStatus();
    const { sortByTeam } = useTable();
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    // table pagination settings
    const pagination = ref({
      rowsPerPage: 0,
    });

    // dialog state for create team
    const adminOrganisationStore = useAdminOrganisationStore();
    const formRef = ref<QForm | null>(null);
    const isDialogOpen = ref<boolean>(false);
    const currentSubsidiaryId = ref<number | null>(null);
    const teamNew = ref<FormTeamFields>({ name: '' });

    const isLoading = computed<boolean>(
      () => adminOrganisationStore.getIsLoadingCreateTeam,
    );

    const onOpenDialog = (subsidiaryId: number): void => {
      currentSubsidiaryId.value = subsidiaryId;
      isDialogOpen.value = true;
    };

    const onCloseDialog = (): void => {
      if (formRef.value) {
        formRef.value.reset();
      }
      teamNew.value = { name: '' };
      isDialogOpen.value = false;
      currentSubsidiaryId.value = null;
    };

    const onSubmitTeam = async (): Promise<void> => {
      if (formRef.value && currentSubsidiaryId.value !== null) {
        const isFormValid: boolean = await formRef.value.validate();

        if (isFormValid) {
          await adminOrganisationStore.createTeamForSubsidiary(
            currentSubsidiaryId.value,
            teamNew.value.name,
          );
          onCloseDialog();
        } else {
          // scroll to form
          formRef.value.$el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // delete team state and methods
    const teamToDelete = ref<{
      id: number;
      name: string;
      subsidiaryId: number;
    } | null>(null);
    const isDeleteDialogOpen = ref<boolean>(false);

    const isLoadingDelete = computed<boolean>(
      () => adminOrganisationStore.getIsLoadingDeleteTeam,
    );

    const onOpenDeleteDialog = (
      teamId: number,
      teamName: string,
      subsidiaryId: number,
    ): void => {
      teamToDelete.value = { id: teamId, name: teamName, subsidiaryId };
      isDeleteDialogOpen.value = true;
    };

    const onCloseDeleteDialog = (): void => {
      teamToDelete.value = null;
      isDeleteDialogOpen.value = false;
    };

    const onConfirmDelete = async (): Promise<void> => {
      if (teamToDelete.value) {
        await adminOrganisationStore.deleteTeam(
          teamToDelete.value.subsidiaryId,
          teamToDelete.value.id,
        );
        onCloseDeleteDialog();
      }
    };

    // move member state
    const memberToMove = ref<{
      id: number;
      name: string;
      teamId: number;
      teamName: string;
      subsidiaryId: number;
      approvedForTeam: TeamMemberStatus;
    } | null>(null);
    const isMoveDialogOpen = ref<boolean>(false);
    const moveFormRef = ref<QForm | null>(null);
    const moveMemberForm = ref<FormMoveMemberFields>({
      subsidiaryId: null,
      teamId: null,
    });
    const isLoadingMove = computed<boolean>(
      () => adminOrganisationStore.getIsLoadingMoveMember,
    );

    const onOpenMoveDialog = (row: TableAttendanceRow): void => {
      memberToMove.value = {
        id: row.memberId,
        name: row.name,
        teamId: row.teamId,
        teamName: row.team,
        subsidiaryId: row.subsidiaryId,
        approvedForTeam: row.approvedForTeam,
      };
      isMoveDialogOpen.value = true;
    };

    const onCloseMoveDialog = (): void => {
      if (moveFormRef.value) {
        moveFormRef.value.reset();
      }
      moveMemberForm.value = {
        subsidiaryId: null,
        teamId: null,
      };
      memberToMove.value = null;
      isMoveDialogOpen.value = false;
    };

    const onSubmitMoveMember = async (): Promise<void> => {
      if (
        moveFormRef.value &&
        memberToMove.value &&
        moveMemberForm.value.teamId !== null
      ) {
        const isFormValid: boolean = await moveFormRef.value.validate();

        if (isFormValid) {
          await adminOrganisationStore.moveTeamMember(
            memberToMove.value.subsidiaryId,
            memberToMove.value.teamId,
            memberToMove.value.id,
            moveMemberForm.value.teamId,
            memberToMove.value.approvedForTeam,
          );
          onCloseMoveDialog();
        } else {
          // scroll to form
          moveFormRef.value.$el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

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
      currentSubsidiaryId,
      formRef,
      iconSize,
      isDialogOpen,
      isLoading,
      isLoadingMove,
      isMoveDialogOpen,
      memberToMove,
      moveMemberForm,
      moveFormRef,
      onCloseDialog,
      onCloseMoveDialog,
      onOpenDialog,
      onOpenMoveDialog,
      onSubmitMoveMember,
      onSubmitTeam,
      subsidiariesData,
      tableRefs,
      teamNew,
      teams,
      visibleColumns,
      getPaymentStateIcon,
      getPaymentStateLabel,
      getPaymentTypeLabel,
      getStatusLabel,
      getStatusColor,
      getStatusIcon,
      pagination,
      paginationLabel,
      sortByTeam,
      PaymentState,
      isDeleteDialogOpen,
      isLoadingDelete,
      onOpenDeleteDialog,
      onCloseDeleteDialog,
      onConfirmDelete,
      teamToDelete,
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
        {{ subsidiaryData.subsidiary?.name }}
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
          {{
            subsidiaryData.members.filter((member) => !member.isEmpty).length
          }}
          {{
            $t(
              'coordinator.labelMembers',
              subsidiaryData.members.filter((member) => !member.isEmpty).length,
            )
          }}
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
        :pagination="pagination"
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
            <q-td colspan="8">
              <div class="flex items-center justify-between">
                <span>{{ props.row.team }}</span>
                <!-- Delete button - only show for empty teams -->
                <q-btn
                  v-if="props.row.isEmpty"
                  flat
                  dense
                  round
                  size="sm"
                  icon="delete"
                  color="white"
                  :disable="isLoadingDelete"
                  :loading="isLoadingDelete"
                  @click="
                    onOpenDeleteDialog(
                      props.row.teamId,
                      props.row.team,
                      subsidiaryData.subsidiary.id,
                    )
                  "
                  data-cy="table-attendance-button-delete-team"
                >
                  <q-tooltip>{{ $t('coordinator.deleteTeam') }}</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
          <!-- Row -->
          <q-tr
            v-if="!props.row.isEmpty"
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
            <!-- Team Approval Status -->
            <q-td
              auto-width
              key="approvedForTeam"
              :props="props"
              data-cy="table-attendance-approved-for-team"
            >
              <q-icon
                :size="iconSize"
                :color="getStatusColor(props.row.approvedForTeam)"
                :name="getStatusIcon(props.row.approvedForTeam)"
                class="q-mr-xs"
                data-cy="table-attendance-approved-for-team-icon"
              />
              {{ getStatusLabel(props.row.approvedForTeam) }}
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
              <q-btn dense flat round data-cy="table-attendance-actions-button">
                <q-icon name="more_vert" />
                <!-- Dropdown menu -->
                <q-menu auto-close>
                  <q-list>
                    <!-- Move member action -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onOpenMoveDialog(props.row)"
                      data-cy="table-attendance-action-move"
                    >
                      <q-item-section>
                        {{ $t('coordinator.moveMember') }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
        <!-- Bottom slot: add team button + pagination -->
        <template v-slot:bottom>
          <div
            class="full-width row items-center gap-8 justify-between q-py-sm"
          >
            <!-- Button: add team -->
            <q-btn
              unelevated
              rounded
              color="primary"
              :disable="isLoading"
              :loading="isLoading"
              @click="onOpenDialog(subsidiaryData.subsidiary.id)"
              data-cy="table-attendance-button-add-team"
            >
              <q-icon size="18px" name="add" class="q-mr-xs" />
              {{ $t('coordinator.addTeam') }}
            </q-btn>
          </div>
        </template>
      </q-table>
    </div>

    <!-- Dialog: Add Team -->
    <dialog-default v-model="isDialogOpen" data-cy="dialog-add-team">
      <template #title>
        {{ $t('coordinator.addTeam') }}
      </template>
      <template #content>
        <q-form ref="formRef" @submit.prevent="onSubmitTeam">
          <form-add-team
            class="q-mb-lg"
            :form-values="teamNew"
            @update:form-values="teamNew = $event"
          />
          <!-- Hidden submit button enables Enter key to submit -->
          <q-btn type="submit" class="hidden" />
        </q-form>
        <!-- Action buttons -->
        <div class="flex justify-end q-mt-sm">
          <div class="flex gap-8">
            <q-btn
              rounded
              unelevated
              outline
              color="primary"
              @click="onCloseDialog"
              data-cy="dialog-button-cancel"
            >
              {{ $t('navigation.discard') }}
            </q-btn>
            <q-btn
              rounded
              unelevated
              color="primary"
              :loading="isLoading"
              :disable="isLoading"
              @click="onSubmitTeam"
              data-cy="dialog-button-submit"
            >
              {{ $t('coordinator.addTeam') }}
            </q-btn>
          </div>
        </div>
      </template>
    </dialog-default>

    <!-- Dialog: Delete Team -->
    <dialog-default v-model="isDeleteDialogOpen" data-cy="dialog-delete-team">
      <template #title>
        {{ $t('coordinator.deleteTeamConfirmTitle') }}
      </template>
      <template #content>
        <div>
          {{
            $t('coordinator.deleteTeamConfirmMessage', {
              teamName: teamToDelete?.name || '',
            })
          }}
        </div>
        <!-- Action buttons -->
        <div class="flex justify-end q-mt-lg">
          <div class="flex gap-8">
            <q-btn
              rounded
              unelevated
              outline
              color="primary"
              @click="onCloseDeleteDialog"
              :disable="isLoadingDelete"
              data-cy="dialog-button-cancel"
            >
              {{ $t('navigation.discard') }}
            </q-btn>
            <q-btn
              rounded
              unelevated
              color="negative"
              :loading="isLoadingDelete"
              :disable="isLoadingDelete"
              @click="onConfirmDelete"
              data-cy="dialog-button-confirm-delete"
            >
              {{ $t('coordinator.deleteTeam') }}
            </q-btn>
          </div>
        </div>
      </template>
    </dialog-default>

    <!-- Dialog: Move Member -->
    <dialog-default v-model="isMoveDialogOpen" data-cy="dialog-move-member">
      <template #title>
        {{ $t('coordinator.moveMemberTitle') }}
      </template>
      <template #content>
        <q-form ref="moveFormRef" @submit.prevent="onSubmitMoveMember">
          <form-move-member
            v-if="memberToMove"
            class="q-mb-lg"
            :member-name="memberToMove.name"
            :current-team-name="memberToMove.teamName"
            :current-team-id="memberToMove.teamId"
            :form-values="moveMemberForm"
            @update:form-values="moveMemberForm = $event"
          />
          <!-- Hidden submit button enables Enter key to submit -->
          <q-btn type="submit" class="hidden" />
        </q-form>
        <!-- Action buttons -->
        <div class="flex justify-end q-mt-sm">
          <div class="flex gap-8">
            <q-btn
              rounded
              unelevated
              outline
              color="primary"
              @click="onCloseMoveDialog"
              data-cy="dialog-button-cancel"
            >
              {{ $t('navigation.discard') }}
            </q-btn>
            <q-btn
              rounded
              unelevated
              color="primary"
              :loading="isLoadingMove"
              :disable="isLoadingMove"
              @click="onSubmitMoveMember"
              data-cy="dialog-button-submit"
            >
              {{ $t('coordinator.moveMember') }}
            </q-btn>
          </div>
        </div>
      </template>
    </dialog-default>
  </div>
</template>
