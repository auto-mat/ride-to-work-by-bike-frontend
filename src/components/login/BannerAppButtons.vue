<script lang="ts">
/**
 * BannerAppButtons Component
 *
 * The `BannerAppButtons` component renders a banner with links for downloading
 * the RTWBB app on App Store and Google Play.
 *
 * @description * Use this component to render the banner with download links.
 *
 * Note: This component is commonly used in `FormLogin`.
 *
 * @example
 * <banner-app-buttons />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6274%3A28824&mode=dev)
 */

// libraries
import { colors } from 'quasar';
import { defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'BannerAppButtons',
  setup() {
    const { getPaletteColor, changeAlpha } = colors;
    const white = getPaletteColor('white');
    const whiteOpacity = changeAlpha(
      white,
      rideToWorkByBikeConfig.opacityWhiteBackground,
    );
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;
    const urlGooglePlay = rideToWorkByBikeConfig.urlGooglePlay;
    const urlAppStore = rideToWorkByBikeConfig.urlAppStore;

    return {
      borderRadius,
      urlGooglePlay,
      urlAppStore,
      whiteOpacity,
    };
  },
});
</script>

<template>
  <div
    class="q-pa-md text-white"
    :style="{
      'background-color': whiteOpacity,
      'border-radius': borderRadius,
    }"
    data-cy="banner-app-buttons"
  >
    <h2
      class="text-subtitle2 text-bold q-my-none"
      data-cy="banner-app-buttons-title"
    >
      {{ $t('login.bannerAppButtons.title') }}
    </h2>
    <p
      class="text-caption q-mt-xs q-mb-md"
      data-cy="banner-app-buttons-description"
    >
      {{ $t('login.bannerAppButtons.description') }}
    </p>
    <div class="flex item-center gap-16" data-cy="banner-app-buttons-container">
      <!-- Button: Google Play -->
      <a
        :href="urlGooglePlay"
        target="_blank"
        data-cy="banner-app-buttons-google-play"
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
      <a
        :href="urlAppStore"
        target="_blank"
        data-cy="banner-app-buttons-app-store"
      >
        <q-img
          src="~assets/svg/appstore.svg"
          :ratio="3"
          height="40px"
          width="120px"
          :alt="$t('login.bannerAppButtons.appStoreAltText')"
        />
      </a>
    </div>
  </div>
</template>
