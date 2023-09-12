<script lang="ts">
import { setCssVar } from 'quasar';
import { defineComponent } from 'vue';

// types
import { BannerImage as BannerImageType, ConfigGlobal } from 'components/types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
setCssVar('info', rideToWorkByBikeConfig.colorGrayLight);

export default defineComponent({
  name: 'BannerImage',
  props: {
    banner: {
      type: Object as () => BannerImageType,
      required: true,
    },
  },
  setup() {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    return { borderRadius };
  },
});
</script>

<template>
  <div>
    <div
      class="overflow-hidden row bg-info"
      :style="{ 'border-radius': borderRadius }"
      data-cy="banner"
    >
      <!-- Image (half) -->
      <q-img
        :src="banner?.image?.src"
        :ratio="3 / 1"
        :alt="banner?.image?.alt"
        class="col-sm-6"
        data-cy="banner-half"
      />
      <!-- Text (half) -->
      <div
        class="col-sm-6 flex items-center q-px-md q-py-lg"
        data-cy="banner-half"
      >
        <div>
          <!-- Title -->
          <div
            v-if="banner.title"
            class="text-weight-medium text-subtitle1"
            data-cy="banner-title"
          >
            {{ banner.title }}
          </div>
          <!-- Description -->
          <div
            v-if="banner.perex"
            class="text-caption q-mt-sm"
            data-cy="banner-perex"
          >
            {{ banner.perex }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
