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
 * - `SectionHeading`: Component to render a heading.
 * - `StatsBar`: Component to render stats.
 *
 * @example
 * <slider-progress
 *   title="sliderProgressTitle"
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
import SectionHeading from '../global/SectionHeading.vue';
import StatsBar from '../global/StatsBar.vue';

// composables
import { useStats } from '../../composables/useStats';

// fixtures
import memberResultsFixture from '../../../test/cypress/fixtures/memberResults.json';

// types
import type { MemberResponse } from '../types/Results';
import { CardProgress, Link } from '../types';
import type { ItemStatistics } from '../types/Statistics';

export default defineComponent({
  name: 'SliderProgress',
  components: {
    CardProgressSlider,
    SectionHeading,
    StatsBar,
  },
  props: {
    title: {
      type: String,
      required: true,
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
    const memberResults = memberResultsFixture as MemberResponse;
    const { getResultStatistics } = useStats();
    const stats = computed<ItemStatistics[]>(() =>
      getResultStatistics(memberResults.results),
    );

    const isLargeScreen = computed((): boolean => {
      return Screen.gt.sm;
    });

    const buttonWidth = computed((): string => {
      return isLargeScreen.value ? 'auto' : '100%';
    });

    return {
      buttonWidth,
      stats,
    };
  },
});
</script>

<template>
  <div class="progress-slider relative-position" data-cy="slider-progress">
    <div class="row q-col-gutter-lg q-mb-lg">
      <!-- Title -->
      <section-heading
        class="col-12 col-sm-auto"
        data-cy="progress-slider-section-title"
      >
        {{ title }}
      </section-heading>
      <!-- List of statistics -->
      <div class="col-12 col-sm" data-cy="progress-slider-section-stats">
        <stats-bar
          v-if="stats"
          :stats="stats"
          data-cy="progress-slider-stats"
        />
      </div>
    </div>
    <swiper-container
      v-if="cards.length > 0"
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
        color="primary"
        :to="button.url"
        :label="button.title"
        :style="{ width: buttonWidth }"
        data-cy="progress-slider-button"
      />
    </div>
  </div>
</template>
