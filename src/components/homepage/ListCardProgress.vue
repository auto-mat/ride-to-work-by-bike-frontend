<script lang="ts">
/**
 * ListCardProgress Component
 *
 * The `ListCardProgress` component renders a list of cards that display
 * progress statistics related to challenges.
 *
 * @description
 * This component showcases progress statistics in card format.
 * The list can show additional statistics in top bar and a button.
 * Items are displayed in a 3 col grid.
 *
 * @props
 * - `title` (String, required): The heading or title for the list of
 *   progress cards.
 * - `cards` (Array of CardProgressType, required): An array of card items to
 *   be displayed, each representing progress statistics.
 * - `button` (Object of Link type): An object defining the button properties.
 *
 * @components
 * - `CardProgress`: Component to render individual progress cards.
 * - `SectionHeading`: Component to render a heading.
 * - `StatsBar`: Component to render a stats bar.
 *
 * @example
 * <list-card-progress
 *  :title="progressTitle"
 *  :cards="progressList"
 *  :stats="statisticsItems"
 *  :button="buttonDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A106436&mode=dev)
 */

// libraries
import { computed, defineComponent } from 'vue';

// fixtures
import memberResultsFixture from '../../../test/cypress/fixtures/memberResults.json';

// components
import CardProgress from './CardProgress.vue';
import SectionHeading from '../global/SectionHeading.vue';
import StatsBar from '../global/StatsBar.vue';

// composables
import { useStats } from 'src/composables/useStats';

// enums
import { StatisticsId } from '../types/Statistics';

// types
import type { ItemStatistics } from '../types/Statistics';
import type { MemberResponse } from '../types/Results';
import { CardProgress as CardProgressType, Link } from '../types';

export default defineComponent({
  name: 'ListCardProgress',
  props: {
    title: {
      type: String,
      required: true,
    },
    cards: {
      type: Array as () => CardProgressType[],
      required: true,
    },
    button: {
      type: Object as () => Link,
      required: false,
    },
  },
  components: {
    CardProgress,
    SectionHeading,
    StatsBar,
  },
  setup() {
    const memberResults = memberResultsFixture as MemberResponse;

    const { getResultStatistics } = useStats();
    // define which stats are shown
    const shownStatsIds = [
      StatisticsId.routes,
      StatisticsId.distance,
      StatisticsId.co2,
    ];
    const stats = computed<ItemStatistics[]>(() =>
      getResultStatistics(memberResults.results, shownStatsIds),
    );

    return {
      stats,
    };
  },
});
</script>

<template>
  <!-- Component displaying challenge statistics with progress loaders -->
  <!-- Internal Figma link: https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A106399&mode=design&t=x3DpoanmIFk5i6MU-1 -->
  <div>
    <div class="row q-col-gutter-lg q-mb-lg" data-cy="card-list-progress">
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
    <!-- Result cards -->
    <div class="row q-col-gutter-lg" data-cy="card-list-progress-wrapper">
      <div
        v-for="card in cards"
        :key="card.title"
        class="col-12 col-sm-6 col-lg-4"
        data-cy="card-list-progress-item"
      >
        <card-progress :card="card"></card-progress>
      </div>
    </div>
    <!-- Link to all results -->
    <div v-if="button" class="text-center q-pt-md">
      <q-btn
        rounded
        color="grey-10"
        unelevated
        outline
        :to="button.url"
        :label="button.title"
        data-cy="card-list-progress-button"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gap-x-40 {
  column-gap: 40px;
}
</style>
