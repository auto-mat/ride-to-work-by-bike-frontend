<script lang="ts">
/**
 * RoutesApps Component
 *
 * @description * Use this component to render the App view in `RouteTabs`.
 *
 * @components
 * - `BannerRoutesApp`: Component to display a banner for an App.
 * - `SectionHeading`: Component to render a heading.
 *
 * @example
 * <routes-apps></routes-apps>
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5190%3A125828&mode=dev)
 */

// libraries
import { computed, defineComponent, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

// components
import BannerRoutesApp from './BannerRoutesApp.vue';
import SectionHeading from '../global/SectionHeading.vue';

// composables
import { i18n } from '../../boot/i18n';
import { useTripsStore } from '../../stores/trips';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import type { BannerRoutesAppType } from '../types/Banner';

export default defineComponent({
  name: 'RoutesApps',
  components: {
    BannerRoutesApp,
    SectionHeading,
  },
  setup() {
    const enabledAppsForManualLogging = false;
    const urlAppStore = rideToWorkByBikeConfig.urlAppStore;
    const urlGooglePlay = rideToWorkByBikeConfig.urlGooglePlay;

    const tripsStore = useTripsStore();
    const {
      getUrlAppCyclers,
      getUrlAppNaKolePrahou,
      getIsLoadingOpenAppWithRestToken,
    } = storeToRefs(tripsStore);

    onMounted(async () => {
      // load app URLs if not already loaded
      if (!getUrlAppCyclers.value && !getUrlAppNaKolePrahou.value) {
        await tripsStore.loadOpenAppWithRestToken();
      }
    });

    const apps = computed<BannerRoutesAppType[]>(() => {
      const result: BannerRoutesAppType[] = [];
      if (getUrlAppCyclers.value) {
        result.push({
          title: i18n.global.t('routes.appCyclers'),
          button: {
            title: i18n.global.t('routes.appCyclers'),
            url: getUrlAppCyclers.value,
          },
          image: {
            src: '/image/logo-cyclers.webp',
            alt: '',
          },
          linked: false,
          linkable: true,
        });
      }
      if (getUrlAppNaKolePrahou.value) {
        result.push({
          title: i18n.global.t('routes.appNaKolePrahou'),
          button: {
            title: i18n.global.t('routes.appNaKolePrahou'),
            url: getUrlAppNaKolePrahou.value,
          },
          image: {
            src: '/image/logo-na-kole-prahou.webp',
            alt: '',
          },
          linked: false,
          linkable: true,
        });
      }
      return result;
    });

    return {
      apps,
      enabledAppsForManualLogging,
      isLoading: getIsLoadingOpenAppWithRestToken,
      urlAppStore,
      urlGooglePlay,
    };
  },
});
</script>

<template>
  <div data-cy="routes-apps" class="q-my-xl">
    <!-- Section: Apps for automatic logging -->
    <section>
      <!-- Title -->
      <section-heading class="q-mb-md" data-cy="routes-apps-title-auto">
        {{ $t('routes.titleAutomaticLogging') }}
        <template #perex>
          {{ $t('routes.hintAutomaticLogging') }}
        </template>
      </section-heading>
      <!-- App banners -->
      <div class="flex column gap-16">
        <banner-routes-app
          v-for="app in apps"
          :app="app"
          :key="app.title"
          :loading="isLoading"
          data-cy="banner-routes-app"
        />
      </div>
    </section>
    <!-- Section: Apps for manual logging (DISABLED) -->
    <section v-if="enabledAppsForManualLogging" class="q-mt-md">
      <!-- Title -->
      <section-heading class="q-mb-md" data-cy="routes-apps-title-manual">
        {{ $t('routes.titleManualLogging') }}
        <template #perex>
          {{ $t('routes.hintManualLogging') }}
        </template>
      </section-heading>
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
