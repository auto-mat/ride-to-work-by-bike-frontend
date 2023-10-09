<script lang="ts">
/**
 * ListCardChallenge Component
 *
 * The `ListCardChallenge` component renders a list of cards that represent
 * different challenges.
 *
 * @description
 * This component takes an array of card items and displays each card using
 * the `CardChallenge` component. Items are displayed in a 3 col grid.
 *
 * @props
 * - `cards` (Array of CardChallengeType): An array of card items to be
 *   displayed. Each item is of type `CardChallengeType`.
 *
 * @components
 * - `CardChallenge`: Component to render individual challenge cards.
 *
 * @example
 * <list-card-challenge :cards="challengeList" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6178%3A131627&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// components
import CardChallenge from 'components/CardChallenge.vue';

// types
import { CardChallenge as CardChallengeType } from 'components/types';

export default defineComponent({
  name: 'ListCardChallenge',
  props: {
    cards: {
      type: Array as () => CardChallengeType[],
    },
  },
  components: {
    CardChallenge,
  },
});
</script>

<template>
  <div>
    <!-- Title -->
    <h2 class="text-h6 q-mt-none text-weight-bold" data-cy="card-list-title">
      {{ $t('index.cardListChallenge.title') }}
    </h2>
    <!-- 3 col grid on desktop -->
    <div class="row q-col-gutter-lg" data-cy="card-list">
      <div
        v-for="card in cards"
        :key="card.title"
        class="col-12 col-sm-6 col-lg-4"
        data-cy="card-list-item"
      >
        <!-- Card -->
        <card-challenge :card="card" />
      </div>
    </div>
  </div>
</template>
