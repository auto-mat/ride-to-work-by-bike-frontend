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

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BannerAppButtons',
});
</script>

<template>
  <div
    class="q-pa-md text-grey-10"
    style="background-color: rgba(255, 255, 255, 0.5); border-radius: 8px"
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
      <a href="#" data-cy="banner-app-buttons-google-play">
        <q-img
          src="~assets/svg/googleplay.svg"
          :ratio="3.375"
          height="40px"
          width="135px"
          :alt="$t('login.bannerAppButtons.googlePlayAltText')"
        />
      </a>
      <!-- Button: App Store -->
      <a href="#" data-cy="banner-app-buttons-app-store">
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
