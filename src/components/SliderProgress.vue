<script lang="ts">
/**
 * SliderProgress Component
 *
 * The `SliderProgress` component renders a slider that showcases progress
 * cards with an optional title, statistics, and navigation button.
 *
 * @description
 * On mobile screens, a part of the last element is shown to indicate
 * the swipe action. Use this component to display a series of progress
 * cards in a slider format.
 *
 * @props
 * - `title` (String, required): The heading or title for the slider.
 * - `stats` (Array of ItemStatistics): An array of item statistics objects.
 * - `cards` (Array of CardProgress, required): An array of progress card objects.
 * - `button` (Link, optional): A navigation button object to
 *   view more progress items.
 *
 * @components
 * - `CardProgressSlider`: Component to render individual progress cards.
 *
 * @example
 * <slider-progress
 *   title="sliderProgressTitle"
 *   :stats="itemStats"
 *   :cards="progressCards"
 *   :button="viewAllButton"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5317%3A125505&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';
import { Screen } from 'quasar';

// components
import CardProgressSlider from './CardProgressSlider.vue';

// types
import { CardProgress, Link, ItemStatistics } from './types';

export default defineComponent({
  name: 'SliderProgress',
  components: {
    CardProgressSlider,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    stats: {
      type: Array as () => ItemStatistics[],
    },
    cards: {
      type: Array as () => CardProgress[],
      required: true,
    },
    button: {
      type: Object as () => Link,
      required: false,
    },
  },
  setup() {
    const isLargeScreen = computed((): boolean => {
      return Screen.gt.sm;
    });

    const buttonWidth = computed((): string => {
      return isLargeScreen.value ? 'auto' : '100%';
    });

    return {
      buttonWidth,
    };
  },
});
</script>

<template>
  <div class="progress-slider relative-position" data-cy="progress-slider">
    <div class="row q-col-gutter-lg">
      <!-- Title -->
      <h2 class="col-sm-5 text-h6 q-my-none" data-cy="progress-slider-title">
        {{ title }}
      </h2>
      <!-- List of statistics -->
      <q-list
        class="col-sm-7 flex flex-wrap items-center justify-end q-pr-md gap-x-40"
      >
        <q-item
          v-for="item in stats"
          :key="item.icon"
          data-cy="progress-slider-stats-item"
          class="text-grey-10 q-p-none"
        >
          <!-- Icon -->
          <q-icon :name="item.icon" color="blue-grey-3" size="18px" />&nbsp;
          <!-- Value -->
          <strong>{{ item.value }}</strong
          >&nbsp;
          <!-- Label -->
          <span>{{ item.label }}</span>
        </q-item>
      </q-list>
    </div>
    <swiper-container
      :navigation="true"
      :slides-per-view="1"
      :space-between="24"
      :breakpoints="{
        0: {
          slidesPerView: 1.2,
        },
        1024: {
          slidesPerView: 1,
        },
      }"
      data-cy="swiper-container"
    >
      <!-- Slider cards -->
      <swiper-slide
        v-for="card in cards"
        :key="card.title"
        class="swiper-slide"
      >
        <card-progress-slider :card="card" data-cy="slider-progress-item" />
      </swiper-slide>
    </swiper-container>
    <!-- Link to all results -->
    <div v-if="button" class="text-center q-pt-md">
      <q-btn
        rounded
        unelevated
        outline
        color="grey-10"
        :to="button.url"
        :label="button.title"
        :style="{ width: buttonWidth }"
        data-cy="progress-slider-button"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gap-x-40 {
  column-gap: 40px;
}
</style>
