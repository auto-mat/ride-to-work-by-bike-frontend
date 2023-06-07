<script lang="ts">
import { setCssVar } from 'quasar';
import { defineComponent } from 'vue';

import { BannerImage } from 'components/types';

const rideToWorkByBikeConfig: object = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
setCssVar('gray-light', rideToWorkByBikeConfig.colorGrayLight);

export default defineComponent({
  name: 'VueBannerImage',
  props: {
    banner: {
      type: Object as () => BannerImage,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <div>
    <q-card :flat="true" class="rounded-20 row" data-cy="banner">
      <q-img :src="banner?.image" :ratio="3 / 1" class="col-sm-6" data-cy="banner-half" />
      <div class="col-sm-6 flex items-center q-px-md q-py-lg" data-cy="banner-half">
        <div>
          <div v-if="banner.title" class="text-dark text-subtitle1" data-cy="banner-title">
            {{ banner.title }}
          </div>
          <div v-if="banner.perex" class="text-dark text-caption q-mt-sm" data-cy="banner-perex">
            {{ banner.perex }}
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
.rounded-20 {
  border-radius: 20px;
  background-color: var(--q-gray-light);
}

.q-card>div:first-child {
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
@media (max-width: $breakpoint-sm-max) {
  .q-card>div:first-child {
    border-top-left-radius: inherit;
    border-bottom-left-radius: 0;
    border-top-right-radius: inherit;
    border-bottom-right-radius: 0;
  }
}

@media (min-width: $breakpoint-lg-min) {
  .q-card>div:last-child {
    padding: 48px;
  }
}
</style>
