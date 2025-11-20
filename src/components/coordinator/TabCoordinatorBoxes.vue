<script lang="ts">
/**
 * TabCoordinatorBoxes Component
 *
 * @description * Use this component to render a tab for showing boxes/packages
 * information.
 *
 * @components
 * - `TableBoxes`: Component to render boxes table.
 *
 * @example
 * <tab-coordinator-boxes />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-106474&t=kghHuf1lDyT1YAC6-1)
 */

// libraries
import { defineComponent, computed } from 'vue';

// stores
import { useAdminOrganisationStore } from '../../stores/adminOrganisation';

// components
import TableBoxes from './TableBoxes.vue';

export default defineComponent({
  name: 'TabCoordinatorBoxes',
  components: {
    TableBoxes,
  },
  setup() {
    const adminOrganisationStore = useAdminOrganisationStore();

    const totalBoxes = computed(() => adminOrganisationStore.getTotalBoxes);
    const deliveredBoxes = computed(
      () => adminOrganisationStore.getDeliveredBoxes,
    );
    const deliveryRatio = computed(() => {
      const total = totalBoxes.value;
      if (total === 0) {
        return 0;
      }
      return deliveredBoxes.value / total;
    });

    return {
      totalBoxes,
      deliveredBoxes,
      deliveryRatio,
    };
  },
});
</script>

<template>
  <div class="q-mt-xl" data-cy="tab-coordinator-boxes">
    <div class="row justify-between items-end gap-24 q-mb-md">
      <!-- Title -->
      <h3
        class="col-auto text-h6 text-grey-10 q-my-none"
        data-cy="table-boxes-title"
      >
        {{ $t('coordinator.titleBoxes') }}
      </h3>
      <div
        class="col"
        style="max-width: 186px"
        data-cy="table-boxes-delivery-status"
      >
        <!-- Delivery status label -->
        <div
          class="text-body2 text-grey-7 text-right"
          data-cy="table-boxes-delivery-status-label"
        >
          {{ deliveredBoxes }}/{{ totalBoxes }}
          {{ $t('coordinator.boxesDeliveryStatus', deliveredBoxes) }}
        </div>
        <!-- Progress bar: Delivered -->
        <q-linear-progress
          class="q-mt-sm"
          color="primary"
          :value="deliveryRatio"
          data-cy="table-boxes-delivery-progress-bar"
        />
      </div>
    </div>
    <table-boxes data-cy="table-boxes" />
  </div>
</template>
