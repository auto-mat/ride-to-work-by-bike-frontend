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
import { defineComponent } from 'vue';

// components
import TableBoxes from './TableBoxes.vue';

export default defineComponent({
  name: 'TabCoordinatorBoxes',
  components: {
    TableBoxes,
  },
});
</script>

<template>
  <div data-cy="tab-coordinator-boxes">
    <div>
      <!-- Title -->
      <h3 class="text-h6" data-cy="table-boxes-title">
        {{ $t('coordinator.titleBoxes') }}
      </h3>
      <!-- Progress bar: Delivered -->
      <q-linear-progress
        class="q-mt-md"
        color="primary"
        :value="0.75"
        data-cy="table-boxes-progress-bar-delivered"
      />
    </div>
    <table-boxes data-cy="table-boxes" />
  </div>
</template>
