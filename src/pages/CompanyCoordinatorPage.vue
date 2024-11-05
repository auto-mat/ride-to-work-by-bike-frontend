<script lang="ts">
/**
 * CompanyCoordinatorPage Component
 *
 * The `CompanyCoordinatorPage` displays information for company coordinators.
 *
 * @layout
 * - `MainLayout`: Default layout with sidebar on desktop.
 *
 * @components
 * - `PageHeading`: Page heading component.
 * - `CoordinatorTabs`: Coordinator tabs component.
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104283&t=tytgYP5xWlFWU054-1)
 */

// libraries
import { defineComponent } from 'vue';

// components
import PageHeading from '../components/global/PageHeading.vue';
import CoordinatorTabs from '../components/coordinator/CoordinatorTabs.vue';

export default defineComponent({
  name: 'CompanyCoordinatorPage',
  components: {
    PageHeading,
    CoordinatorTabs,
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="company-coordinator-page">
    <div class="q-px-lg bg-white q-pt-lg">
      <!-- Page title -->
      <page-heading data-cy="company-coordinator-page-title">
        {{ $t('coordinator.titleCompanyCoordinator') }}
      </page-heading>
    </div>
    <!-- Tabs -->
    <coordinator-tabs class="bg-white q-pb-xl" data-cy="coordinator-tabs" />
  </q-page>
</template>
