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
import { defineComponent } from 'vue';

// components
import TableFeeApproval from './TableFeeApproval.vue';

export default defineComponent({
  name: 'TabCoordinatorFeeApproval',
  components: {
    TableFeeApproval,
  },
});
</script>

<template>
  <div>
    <div class="q-mt-xl">
      <!-- Title -->
      <h3 class="text-h6" data-cy="table-fee-approval-not-approved-title">
        {{ $t('table.titleFeeApprovalNotApproved') }}
      </h3>
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
