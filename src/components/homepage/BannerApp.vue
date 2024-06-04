<script lang="ts">
/**
 * BannerApp Component
 *
 * The `BannerApp` component displays an application banner.
 *
 * @description
 * Use this component to showcase application-specific banners. The visibility
 * and content of the banner can be controlled via props and local storage.
 * Border radius can be controlled by `config` parameter.
 *
 * @props
 * - `banner` (Object, required): The banner object with details for display.
 *   It should be of type `BannerAppType`.
 *
 * @example
 * <banner-app
 *   :banner="appBannerDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5308%3A125428&mode=dev)
 */

// libraries
import { defineComponent, ref, computed, onMounted } from 'vue';
import { Screen } from 'quasar';

// types
import { BannerApp as BannerAppType } from '../types';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'BannerApp',
  props: {
    banner: {
      type: Object as () => BannerAppType,
      required: true,
    },
  },
  setup() {
    const isBannerAppShown = ref(true);

    const getBannerData = (): boolean => {
      // load from local storage
      const localStorageData = localStorage.getItem('ride-to-work-by-bike');
      if (!localStorageData) return true;

      // try parsing data as JSON
      let parsedStorageData = null;
      try {
        parsedStorageData = JSON.parse(localStorageData);
      } catch {
        return true;
      }

      // check if banner data exists
      if (!parsedStorageData.hasOwnProperty('showAppBanner')) {
        return true;
      }

      // return showAppBanner key
      return parsedStorageData.showAppBanner;
    };

    onMounted(() => {
      isBannerAppShown.value = getBannerData();
    });

    const hideBanner = (): void => {
      // update UI
      isBannerAppShown.value = false;
      // set persistant value
      localStorage.setItem(
        'ride-to-work-by-bike',
        JSON.stringify({ showAppBanner: false }),
      );
    };

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    const isHorizontal = computed((): boolean => {
      return Screen.gt.xs;
    });

    return {
      borderRadius,
      isHorizontal,
      isBannerAppShown,
      hideBanner,
    };
  },
});
</script>

<template>
  <div
    v-if="isBannerAppShown"
    class="row relative-position overflow-hidden bg-blue-grey-8 text-white"
    data-cy="banner-app"
    :style="{ 'border-radius': borderRadius }"
  >
    <!-- Image -->
    <q-img
      :src="banner.image.src"
      :alt="banner.image.alt"
      :img-style="{
        borderRadius: isHorizontal
          ? `${borderRadius} 0 0 ${borderRadius}`
          : `${borderRadius} ${borderRadius} 0 0`,
      }"
      :ratio="3 / 1"
      class="col-sm-6"
      data-cy="banner-app-half"
    />
    <div
      class="col-sm-6 flex items-center q-px-md q-py-lg"
      data-cy="banner-app-half"
    >
      <!-- Close button -->
      <div class="absolute-top-right q-p-md">
        <q-btn
          flat
          round
          color="white"
          icon="close"
          @click.prevent="hideBanner"
        />
      </div>
      <div class="q-pr-sm-lg">
        <!-- Title -->
        <div
          v-if="banner.title"
          class="text-weight-medium text-subtitle1"
          data-cy="banner-app-title"
        >
          {{ banner.title }}
        </div>
        <!-- Link to mobile app -->
        <q-btn
          v-if="banner.button && banner.button.url"
          rounded
          color="white"
          unelevated
          :to="banner.button.url"
          :label="banner.button.title"
          class="z-1 q-mt-md text-grey-10"
          data-cy="banner-app-button"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.q-pr-sm-lg {
  @media (min-width: $breakpoint-sm-min) {
    padding-right: 24px;
  }
}
</style>
