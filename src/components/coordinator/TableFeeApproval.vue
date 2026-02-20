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

// composables
import {
  paginationLabel,
  useTable,
  useTableFeeApproval,
} from '../../composables/useTable';

// stores
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';

// types
import type { TableFeeApprovalRow } from '../../components/types/AdminOrganisation';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'TableFeeApproval',
  components: {
    DialogDefault,
  },
  props: {
    approved: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const adminOrganisationStore = useAdminOrganisationStore();
    const selected = computed<TableFeeApprovalRow[]>({
      get: () => adminOrganisationStore.getSelectedPaymentsToApprove,
      set: (value) => {
        adminOrganisationStore.setSelectedPaymentsToApprove(value);
      },
    });
    const tableRef = ref<QTable | null>(null);

    const { columns, visibleColumns } = useTableFeeApproval();
    const { sortByAddress } = useTable();

    const feeApprovalData = computed<TableFeeApprovalRow[]>(() => {
      return adminOrganisationStore.getFeeApprovalData(props.approved);
    });
    const paymentRewards = computed(
      () => adminOrganisationStore.paymentRewards,
    );
    const paymentAmounts = computed(
      () => adminOrganisationStore.paymentAmounts,
    );

    /**
     * initialize paymentRewards and amounts in store when data changes
     * only for non-approved table (where editing is allowed)
     */
    if (!props.approved) {
      watch(
        feeApprovalData,
        (newData) => {
          adminOrganisationStore.initializePaymentRewards(newData);
          adminOrganisationStore.initializePaymentAmounts(newData);
        },
        { immediate: true },
      );
    }

    // update reward status in store
    const updateRewardStatus = (
      memberId: number,
      value: boolean | null,
    ): void => {
      adminOrganisationStore.setPaymentReward(memberId, value);
    };

    // sort by dateCreated descending
    const sortByDateCreated = (): void => {
      if (tableRef.value) {
        tableRef.value.setPagination({
          sortBy: 'dateCreated',
          descending: true,
        });
      }
    };

    onMounted(() => {
      sortByDateCreated();
    });

    watch(feeApprovalData, () => {
      nextTick(() => {
        sortByDateCreated();
      });
    });

    const approveSelectedPayments = async (): Promise<void> => {
      await adminOrganisationStore.approveSelectedPayments();
    };

    const isLoadingApprovePayments = computed<boolean>(() => {
      return adminOrganisationStore.getIsLoadingApprovePayments;
    });

    const isLoading = computed<boolean>(() => {
      return adminOrganisationStore.isLoadingOrganisations;
    });

    const isDialogDisapproveOpen = ref(false);

    const openDisapproveDialog = (): void => {
      if (selected.value.length > 0) {
        isDialogDisapproveOpen.value = true;
      }
    };

    const disapproveSelectedPayments = async (): Promise<void> => {
      await adminOrganisationStore.disapproveSelectedPayments();
      isDialogDisapproveOpen.value = false;
    };

    const isLoadingDisapprovePayments = computed<boolean>(() => {
      return adminOrganisationStore.getIsLoadingDisapprovePayments;
    });

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    return {
      borderRadius,
      columns,
      feeApprovalData,
      isLoading,
      isLoadingApprovePayments,
      isLoadingDisapprovePayments,
      selected,
      tableRef,
      visibleColumns,
      approveSelectedPayments,
      disapproveSelectedPayments,
      isDialogDisapproveOpen,
      openDisapproveDialog,
      paginationLabel,
      sortByAddress,
      updateRewardStatus,
      paymentRewards,
      paymentAmounts,
    };
  },
});
</script>

<template>
  <div data-cy="table-fee-approval">
    <div>
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
        :loading="isLoading"
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
            <q-td :colspan="approved ? 7 : 8">
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
              <!-- Only non-approved payments show user-edited value -->
              <template v-if="approved">{{ props.row.amount }}</template>
              <template v-else>
                {{ paymentAmounts[props.row.id] ?? props.row.amount }}
              </template>
            </q-td>
            <!-- Name -->
            <q-td key="name" :props="props" data-cy="table-fee-approval-name">
              {{ props.row.name }}
            </q-td>
            <!-- Reward -->
            <q-td
              key="reward"
              :props="props"
              data-cy="table-fee-approval-reward"
            >
              <!-- Only non-approved payments show user-edited value -->
              <q-checkbox
                v-if="approved"
                disable
                :model-value="props.row.reward"
                color="primary"
                data-cy="table-fee-approval-reward-checkbox"
              />
              <q-checkbox
                v-else
                :model-value="paymentRewards[props.row.id] ?? props.row.reward"
                color="primary"
                data-cy="table-fee-approval-reward-checkbox"
                @update:model-value="
                  (value) => updateRewardStatus(props.row.id, value)
                "
              />
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
      <div class="flex justify-end gap-8">
        <!-- Button: Disapprove selected -->
        <q-btn
          rounded
          unelevated
          :label="$t('table.buttonFeeDisapproval')"
          :disable="
            selected.length === 0 ||
            isLoadingDisapprovePayments ||
            isLoadingApprovePayments
          "
          color="negative"
          data-cy="table-fee-disapproval-button"
          @click.prevent="openDisapproveDialog"
        />
        <!-- Button: Approve selected -->
        <q-btn
          rounded
          unelevated
          :label="$t('table.buttonFeeApproval')"
          :loading="isLoadingApprovePayments"
          :disable="
            selected.length === 0 ||
            isLoadingApprovePayments ||
            isLoadingDisapprovePayments
          "
          color="primary"
          data-cy="table-fee-approval-button"
          @click.prevent="approveSelectedPayments"
        />
      </div>

      <!-- Dialog: Confirm disapproval -->
      <dialog-default
        v-model="isDialogDisapproveOpen"
        data-cy="dialog-disapprove-payments"
      >
        <!-- Title -->
        <template #title>
          {{ $t('table.titleDialogDisapprovePayments') }}
        </template>
        <!-- Content -->
        <template #content>
          <div data-cy="dialog-disapprove-description">
            {{
              $t('table.labelDisapprovePaymentsDescription', {
                count: selected.length,
              })
            }}
          </div>
          <!-- Buttons -->
          <div class="flex justify-end gap-8 q-mt-md">
            <!-- Button: Cancel -->
            <q-btn
              unelevated
              rounded
              outline
              color="primary"
              @click="isDialogDisapproveOpen = false"
              data-cy="dialog-disapprove-cancel"
            >
              {{ $t('global.cancel') }}
            </q-btn>
            <!-- Button: Disapprove -->
            <q-btn
              unelevated
              rounded
              color="negative"
              :loading="isLoadingDisapprovePayments"
              @click="disapproveSelectedPayments"
              data-cy="dialog-disapprove-confirm"
            >
              {{ $t('table.buttonConfirmDisapprove') }}
            </q-btn>
          </div>
        </template>
      </dialog-default>
    </div>
  </div>
</template>
