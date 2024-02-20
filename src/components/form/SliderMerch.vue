<script lang="ts">
/**
 * SliderMerch Component
 *
 * @description * Use this component to render a slider of images.
 *
 * Note: This component is commonly used in `FormFieldListMerch`.
 *
 * @props
 * - `items` (Array<Image>, required): The object representing list of images.
 *   It should be of type `Array`.
 *
 * @example
 * <slider-merch />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5408%3A22528&mode=dev)
 */

import { defineComponent } from 'vue';

// types
import { Image } from 'components/types';

export default defineComponent({
  name: 'SliderMerch',
  props: {
    items: {
      type: Array as () => Image[],
    },
  },
  setup() {},
});
</script>

<template>
  <div class="slider-merch relative-position" data-cy="slider-merch">
    <swiper-container
      :navigation="true"
      :pagination="true"
      :slides-per-view="1"
      data-cy="swiper-container"
    >
      <!-- Slider cards -->
      <swiper-slide
        v-for="(item, index) in items"
        :key="`slider-image-${index}`"
        class="swiper-slide"
      >
        <q-img :src="item.src" :alt="item.alt" data-cy="swiper-image" />
      </swiper-slide>
    </swiper-container>
  </div>
</template>

<style scoped lang="scss">
.slider-merch {
  padding-bottom: 19px;
  overflow: hidden;
}
swiper-container::part(button-prev),
swiper-container::part(button-next) {
  bottom: -19px;
}
swiper-container::part(button-prev) {
  right: 72px;
}
swiper-container::part(button-next) {
  right: 16px;
}
swiper-container::part(pagination) {
  bottom: -19px;
}
</style>
