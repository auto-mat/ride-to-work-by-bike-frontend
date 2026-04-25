<script lang="ts">
/**
 * TabCoordinatorAttendance Component
 *
 * @description * Use this component to show attendance tab on the Coordinator page.
 *
 * @components
 * - `HeaderOrganization`: Component to display a header with organization information.
 * - `TableAttendanceTabs`: Component to display tables with attendance data.
 *
 * @example
 * <tab-coordinator-attendance />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104524&t=cE89xyWvJn6O0GHe-1)
 */

// libraries
import { defineComponent, inject } from 'vue';

// components
import HeaderOrganization from './HeaderOrganization.vue';
import TableAttendanceTabs from './TableAttendanceTabs.vue';

// composables
import { useApiGetExportAttendance } from '../../composables/useApiGetExportAttendance';

// enums
import { ExportFileType } from '../enums/Coordinator';

// types
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'TabCoordinatorAttendance',
  components: {
    HeaderOrganization,
    TableAttendanceTabs,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const { load } = useApiGetExportAttendance(logger);

    const handleExport = (fileType: ExportFileType): void => {
      load(fileType);
    };

    return {
      handleExport,
    };
  },
});
</script>

<template>
  <div>
    <header-organization class="q-mt-sm" @export="handleExport" />
    <table-attendance-tabs class="q-mt-xl" />
  </div>
</template>
