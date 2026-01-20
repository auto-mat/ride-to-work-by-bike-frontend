<script lang="ts">
/**
 * TabCoordinatorResults Component
 *
 * @description * Wrapper for different sections of the Results tab.
 *
 * Used in `CoordinatorTabs` component.
 *
 * @components
 * - `TableResults.vue` - main results table with diploma downloads
 *
 * @example
 * <tab-coordinator-results />
 */

// libraries
import { defineComponent } from 'vue';

// components
import TableResults from './TableResults.vue';

export default defineComponent({
  name: 'TabCoordinatorResults',
  components: {
    TableResults,
  },
});
</script>

<template>
  <div data-cy="tab-coordinator-results">
    <table-results class="q-mt-xl" data-cy="table-results" />
  </div>
</template>
