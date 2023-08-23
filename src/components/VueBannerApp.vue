<script lang="ts">
// libraries
import { defineComponent } from 'vue';
import { useStorage } from '@vueuse/core';

// types
import { BannerApp } from 'components/types';

export default defineComponent({
  name: 'VueBannerImage',
  props: {
    banner: {
      type: Object as () => BannerApp,
      required: true,
    },
  },
  setup() {
    const state = useStorage('ride-to-work-by-bike', { showAppBanner: true });

    return {
      state,
    };
  },
});
</script>

<template>
  <q-card
    v-if="state.showAppBanner"
    flat
    dark
    class="rounded-20 row bg-blue-grey-8"
    data-cy="banner-app"
  >
    <q-img
      :src="banner.image"
      :ratio="3 / 1"
      class="col-sm-6"
      data-cy="banner-app-half"
    />
    <div
      class="col-sm-6 flex items-center q-px-md q-py-lg"
      data-cy="banner-app-half"
    >
      <q-card-actions vertical class="absolute-top-right q-p-md">
        <q-btn
          flat
          round
          color="white"
          icon="close"
          @click.prevent="state.showAppBanner = false"
        />
      </q-card-actions>
      <div class="q-pr-sm-lg">
        <div
          v-if="banner.title"
          class="text-weight-medium text-subtitle1"
          data-cy="banner-app-title"
        >
          {{ banner.title }}
        </div>
        <q-btn
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
  </q-card>
</template>

<style scoped lang="scss">
.rounded-20 {
  border-radius: 20px;
}

.q-card > div:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

@media (min-width: $breakpoint-sm-min) {
  .q-card > div:first-child {
    border-top-left-radius: inherit;
    border-top-right-radius: 0;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: 0;
  }
  .q-pr-sm-lg {
    padding-right: 24px;
  }
}

@media (min-width: $breakpoint-lg-min) {
  .q-card > div:last-child {
    padding: 48px;
  }
}
</style>
