<script lang="ts">
/**
 * BannerImage Component
 *
 * The `BannerImage` component displays a banner with a specified image.
 *
 * @description
 * Use this component to showcase banners with images.
 * Border radius can be controlled by `config` parameter.
 *
 * @props
 * - `banner` (Object, required): The banner object with details, including the
 *   image to display. It should be of type `BannerImageType`.
 *
 * @example
 * <banner-image
 *   :banner="imageBannerDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105621&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// types
import { BannerImage as BannerImageType } from '../types';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

export default defineComponent({
  name: 'BannerImage',
  props: {
    banner: {
      type: Object as () => BannerImageType,
      required: true,
    },
  },
  setup() {
    const { borderRadiusCard, maxWidthBanner } = rideToWorkByBikeConfig;

    return { borderRadiusCard, maxWidthBanner };
  },
});
</script>

<template>
  <div>
    <div
      class="overflow-hidden row bg-white border-grey-5 q-mx-auto"
      :style="{
        'border-radius': borderRadiusCard,
        'max-width': maxWidthBanner,
      }"
      data-cy="banner"
    >
      <!-- Image (half) -->
      <q-img
        :src="banner?.image?.src"
        :ratio="2 / 1"
        :alt="banner?.image?.alt"
        class="col-sm-6"
        data-cy="banner-half"
      />
      <!-- Text (half) -->
      <div class="col-sm-6 flex items-center q-pa-xl" data-cy="banner-half">
        <div>
          <!-- Title -->
          <div
            v-if="banner.title"
            class="text-weight-bold text-grey-10 text-subtitle1"
            data-cy="banner-title"
          >
            {{ banner.title }}
          </div>
          <!-- Description -->
          <div
            v-if="banner.perex"
            class="text-body2 text-grey-8 q-mt-sm"
            data-cy="banner-perex"
          >
            {{ banner.perex }}
          </div>
          <div
            v-if="banner.buttons.length"
            class="flex flex-wrap gap-8 q-mt-lg"
          >
            <q-btn
              unelevated
              rounded
              outline
              v-for="button in banner.buttons"
              :key="button.url"
              :href="button.url"
              :label="button.title"
              color="primary"
              data-cy="banner-button"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.border-grey-5 {
  border: 1px solid $grey-5;
}
</style>
