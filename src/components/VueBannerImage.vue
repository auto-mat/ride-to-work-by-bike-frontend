<script lang="ts">
import { setCssVar } from 'quasar';
import { defineComponent } from 'vue';

// import types
import { BannerImage, ConfigGlobal } from 'components/types';

// import config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
setCssVar('grey-2', rideToWorkByBikeConfig.colorGrayLight);

export default defineComponent({
  name: 'VueBannerImage',
  props: {
    banner: {
      type: Object as () => BannerImage,
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
      class="overflow-hidden row bg-grey-2"
      :style="{ 'border-radius': borderRadius }"
      data-cy="banner"
    >
      <q-img
        :src="banner?.image?.src"
        :ratio="3 / 1"
        :alt="banner?.image?.alt"
        class="col-sm-6"
        data-cy="banner-half"
      />
      <div
        class="col-sm-6 flex items-center q-px-md q-py-lg"
        data-cy="banner-half"
      >
        <div>
          <div
            v-if="banner.title"
            class="text-dark text-subtitle1"
            data-cy="banner-title"
          >
            {{ banner.title }}
          </div>
          <div
            v-if="banner.perex"
            class="text-dark text-caption q-mt-sm"
            data-cy="banner-perex"
          >
            {{ banner.perex }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
