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

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// fixtures
import apps from '../../../test/cypress/fixtures/bannerRoutesAppList.json';

// types
import type { BannerRoutesApp } from '../types/Banner';

export default defineComponent({
  name: 'RoutesApps',
  setup() {
    const urlAppStore = rideToWorkByBikeConfig.urlAppStore;
    const urlGooglePlay = rideToWorkByBikeConfig.urlGooglePlay;

    return {
      apps: apps as BannerRoutesApp[],
      urlAppStore,
      urlGooglePlay,
    };
  },
});
</script>

<template>
  <div data-cy="route-app">
    <!-- Section: Apps for automatic logging -->
    <section>
      <!-- Title -->
      <h2 class="text-h6 text-black" data-cy="route-app-title-automatic">
        {{ $t('routes.titleAutomaticLogging') }}
      </h2>
      <!-- Hint -->
      <p class="" data-cy="route-app-hint-automatic">
        {{ $t('routes.hintAutomaticLogging') }}
      </p>
      <!-- App banners -->
      <div class="flex column gap-16">
        <banner-routes-app
          v-for="app in apps"
          :app="app"
          :key="app.title"
          data-cy="banner-routes-app"
        />
      </div>
    </section>
    <!-- Section: Apps for manual logging -->
    <section>
      <!-- Title -->
      <h2 class="text-h6 text-black" data-cy="route-app-title-manual">
        {{ $t('routes.titleManualLogging') }}
      </h2>
      <!-- Hint -->
      <p class="" data-cy="route-app-hint-manual">
        {{ $t('routes.hintManualLogging') }}
      </p>
      <div class="flex item-center gap-16" data-cy="routes-apps-buttons">
        <!-- Button: Google Play -->
        <a
          :href="urlGooglePlay"
          target="_blank"
          data-cy="routes-apps-google-play"
        >
          <q-img
            src="~assets/svg/googleplay.svg"
            :ratio="3.375"
            height="40px"
            width="135px"
            :alt="$t('login.bannerAppButtons.googlePlayAltText')"
          />
        </a>
        <!-- Button: App Store -->
        <a :href="urlAppStore" target="_blank" data-cy="routes-apps-app-store">
          <q-img
            src="~assets/svg/appstore.svg"
            :ratio="3"
            height="40px"
            width="120px"
            :alt="$t('login.bannerAppButtons.appStoreAltText')"
          />
        </a>
      </div>
    </section>
  </div>
</template>
