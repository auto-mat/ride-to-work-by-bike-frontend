<script lang="ts">
/**
 * TabCoordinatorAttendance Component
 *
 * @description * Use this component to show attendance tab on the Coordinator page.
 *
 * @components
 * - `HeaderOrganization`: Component to display a header with organization information.
 * - `TableAttendance`: Component to display tables with attendance data.
 *
 * @example
 * <tab-coordinator-attendance />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104524&t=cE89xyWvJn6O0GHe-1)
 */

// libraries
import { defineComponent } from 'vue';

// components
import HeaderOrganization from './HeaderOrganization.vue';
import TableAttendance from './TableAttendance.vue';

export default defineComponent({
  name: 'TabCoordinatorAttendance',
  components: {
    HeaderOrganization,
    TableAttendance,
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <div>
    <header-organization class="q-mt-sm" />
    <table-attendance class="q-mt-xl" />
  </div>
</template>
