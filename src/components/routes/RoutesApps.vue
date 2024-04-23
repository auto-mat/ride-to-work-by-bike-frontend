<script lang="ts">
/**
 * RoutesApps Component
 *
 * @description * Use this component to render the App view in `RouteTabs`.
 *
 * @components
 * - `BannerRoutesApp`: Component to display a banner for an App.
 *
 * @example
 * <routes-apps></routes-apps>
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5190%3A125828&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// fixtures
import apps from '../../../test/cypress/fixtures/bannerRoutesAppList.json';

// types
import type { BannerRoutesApp } from '../types/Banner';

export default defineComponent({
  name: 'RoutesApps',
  setup() {
    return {
      apps: apps as BannerRoutesApp[],
    };
  },
});
</script>

<template>
  <div data-cy="route-app">
    <section>
      <h2 class="text-h6 text-black" data-cy="route-app-title-automatic">
        {{ $t('routes.titleAutomaticLogging') }}
      </h2>
      <p class="" data-cy="route-app-hint-automatic">
        {{ $t('routes.hintAutomaticLogging') }}
      </p>
      <div class="flex column gap-16">
        <banner-routes-app
          v-for="app in apps"
          :app="app"
          :key="app.title"
          data-cy="banner-routes-app"
        />
      </div>
    </section>
    <section>
      <h2 class="text-h6 text-black" data-cy="route-app-title-manual">
        {{ $t('routes.titleManualLogging') }}
      </h2>
      <p class="" data-cy="route-app-hint-manual">
        {{ $t('routes.hintManualLogging') }}
      </p>
    </section>
  </div>
</template>
