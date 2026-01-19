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
import { computed, defineComponent, inject, onMounted } from 'vue';

import { i18n } from '../boot/i18n';
import { defaultLocale } from '../i18n/def_locale';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// components
import PageHeading from '../components/global/PageHeading.vue';
import CoordinatorTabs from '../components/coordinator/CoordinatorTabs.vue';

// stores
import { useAdminOrganisationStore } from '../stores/adminOrganisation';
import { useAdminCompetitionStore } from '../stores/adminCompetition';
import { useFeedStore } from '../stores/feed';

// utils
import { getApiBaseUrlWithLang } from '../utils/get_api_base_url_with_lang';

// types
import type { Logger } from '../components/types/Logger';

export default defineComponent({
  name: 'CompanyCoordinatorPage',
  components: {
    PageHeading,
    CoordinatorTabs,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const isCoordinatorEnabled = true;
    const adminOrganisationStore = useAdminOrganisationStore();
    const adminCompetitionStore = useAdminCompetitionStore();
    const feedStore = useFeedStore();

    const urlRideToWorkByBikeOldFrontendDjangoApp = computed(() => {
      return getApiBaseUrlWithLang(
        logger,
        rideToWorkByBikeConfig.urlRideToWorkByBikeOldFrontendDjangoApp,
        defaultLocale,
        i18n,
      );
    });

    onMounted(async () => {
      // for independent data sets, we fetch in parallel
      const promises = [];
      if (adminOrganisationStore.getAdminOrganisations.length === 0) {
        promises.push(adminOrganisationStore.loadAdminOrganisations());
      }
      if (adminOrganisationStore.getAdminInvoices.length === 0) {
        promises.push(adminOrganisationStore.loadAdminInvoices());
      }
      if (adminCompetitionStore.getCompetitions.length === 0) {
        promises.push(adminCompetitionStore.loadCompetitions());
      }
      if (feedStore.getCities.length === 0) {
        promises.push(feedStore.loadCities());
      }
      await Promise.all(promises);
    });

    return {
      isCoordinatorEnabled,
      urlRideToWorkByBikeOldFrontendDjangoApp,
    };
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
    <coordinator-tabs
      v-if="isCoordinatorEnabled"
      class="bg-white q-pb-xl"
      data-cy="coordinator-tabs"
    />
    <div v-else class="q-pa-lg">
      <p
        class="text-body1"
        v-html="
          $t('coordinator.textCompanyCoordinatorDisabled', {
            url: urlRideToWorkByBikeOldFrontendDjangoApp,
          })
        "
        data-cy="company-coordinator-disabled-text"
      />
    </div>
  </q-page>
</template>
