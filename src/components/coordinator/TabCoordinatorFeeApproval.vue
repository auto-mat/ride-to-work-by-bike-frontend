<script lang="ts">
/**
 * TabCoordinatorFeeApproval Component
 *
 * @description * Use this component to render the fee approval tables.
 *
 * @components
 * - `TableFeeApproval`: Component to render the fee approval tables.
 *
 * @example
 * <tab-coordinator-fee-approval />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104283&t=UNQSEssco9YZOBNd-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

// components
import TableFeeApproval from './TableFeeApproval.vue';

// stores
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';

export default defineComponent({
  name: 'TabCoordinatorFeeApproval',
  components: {
    TableFeeApproval,
  },
  setup() {
    const adminOrganisationStore = useAdminOrganisationStore();

    const isLoadingOrganisations = computed<boolean>(
      () => adminOrganisationStore.isLoadingOrganisations,
    );

    const refreshFeeApprovalData = async (): Promise<void> => {
      await adminOrganisationStore.loadAdminOrganisations();
    };

    return {
      isLoadingOrganisations,
      refreshFeeApprovalData,
    };
  },
});
</script>

<template>
  <div>
    <div class="q-mt-xl">
      <div class="row q-col-gutter-md q-mb-lg">
        <!-- Title -->
        <h3
          class="col-sm text-h6 q-my-none"
          data-cy="table-fee-approval-not-approved-title"
        >
          {{ $t('table.titleFeeApprovalNotApproved') }}
        </h3>
        <div class="col-sm-auto">
          <!-- Button: Refresh data -->
          <q-btn
            flat
            rounded
            color="grey-7"
            class="text-caption"
            :loading="isLoadingOrganisations"
            @click="refreshFeeApprovalData"
            data-cy="tab-coordinator-fee-approval-button-refresh"
          >
            {{ $t('coordinator.buttonRefreshFeeData') }}
            <q-icon name="refresh" size="18px" color="grey-7" class="q-ml-sm" />
          </q-btn>
        </div>
      </div>
      <table-fee-approval data-cy="table-fee-approval-not-approved" />
    </div>
    <div class="q-mt-xl">
      <!-- Title -->
      <h3 class="text-h6" data-cy="table-fee-approval-approved-title">
        {{ $t('table.titleFeeApprovalApproved') }}
      </h3>
      <table-fee-approval approved data-cy="table-fee-approval-approved" />
    </div>
  </div>
</template>
