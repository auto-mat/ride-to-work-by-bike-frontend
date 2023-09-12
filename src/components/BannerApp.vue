<script lang="ts">
// libraries
import { defineComponent, computed } from 'vue';
import { Screen } from 'quasar';
import { useStorage } from '@vueuse/core';

// types
import { BannerApp as BannerAppType, ConfigGlobal } from 'components/types';

const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);

export default defineComponent({
  name: 'VueBannerImage',
  props: {
    banner: {
      type: Object as () => BannerAppType,
      required: true,
    },
  },
  setup() {
    const state = useStorage('ride-to-work-by-bike', { showAppBanner: true });
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    const isHorizontal = computed(() => {
      return Screen.gt.xs;
    });

    return {
      borderRadius,
      isHorizontal,
      state,
    };
  },
});
</script>

<template>
  <div
    v-if="state.showAppBanner"
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
          @click.prevent="state.showAppBanner = false"
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
