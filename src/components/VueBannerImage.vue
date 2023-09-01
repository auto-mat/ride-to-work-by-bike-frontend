<script lang="ts">
import { setCssVar } from 'quasar';
import { defineComponent } from 'vue';

// import types
import { BannerImage } from 'components/types';

const rideToWorkByBikeConfig: object = JSON.parse(
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
    return {};
  },
});
</script>

<template>
  <div>
    <div class="rounded-20 overflow-hidden row bg-grey-2" data-cy="banner">
      <q-img
        :src="banner?.image"
        :ratio="3 / 1"
        :alt="banner?.title"
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

<style scoped lang="scss">
.rounded-20 {
  border-radius: 20px;
}
</style>
