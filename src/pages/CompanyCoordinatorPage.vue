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
import { computed, defineComponent, inject } from 'vue';

import { i18n } from '../boot/i18n';
import { defaultLocale } from '../i18n/def_locale';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// components
import PageHeading from '../components/global/PageHeading.vue';
import CoordinatorTabs from '../components/coordinator/CoordinatorTabs.vue';

import { getApiBaseUrlWithLang } from '../utils/get_api_base_url_with_lang';

// types
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'CompanyCoordinatorPage',
  components: {
    PageHeading,
    CoordinatorTabs,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const isCoordinatorEnabled = false;

    const urlRideToWorkByBikeOldFrontendDjangoApp = computed(() => {
      return getApiBaseUrlWithLang(
        logger,
        rideToWorkByBikeConfig.urlRideToWorkByBikeOldFrontendDjangoApp,
        defaultLocale,
        i18n,
      );
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
