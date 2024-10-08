<script lang="ts">
/**
 * Results Detail Page
 *
 * Shows results for a single user.
 *
 * @components
 * - `ResultsList`: Component to list of user's results.
 * - `ResultsTabs`: Component to render tabs with results views.
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858%3A105197&t=4cALO2fsjKI90AW1-1)
 **/

// libraries
import { defineComponent } from 'vue';

// components
import BreadcrumbTitle from 'src/components/global/BreadcrumbTitle.vue';
import ListCardSlider from '../components/global/ListCardSlider.vue';
import PageHeading from 'src/components/global/PageHeading.vue';
import ResultsList from '../components/results/ResultsList.vue';
import ResultsTabs from '../components/results/ResultsTabs.vue';

// fixtures
import prizes from '../../test/cypress/fixtures/listResultsPrizes.json';

// types
import type { CardPrizeType, Link } from '../components/types';

export default defineComponent({
  name: 'ResultsDetailPage',
  components: {
    BreadcrumbTitle,
    ListCardSlider,
    PageHeading,
    ResultsList,
    ResultsTabs,
  },
  setup() {
    // coerce types
    const { cards, button } = prizes as { cards: unknown; button: unknown };
    const cardsPrize = cards as CardPrizeType[];
    const cardsButton = button as Link;

    return {
      cardsButton,
      cardsPrize,
      prizes,
    };
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg bg-white q-pt-lg q-pb-xl">
      <page-heading data-cy="results-detail-page-title">
        <breadcrumb-title :title="$t('results.titleResultsYou')" />
      </page-heading>

      <results-list data-cy="results-list" />

      <list-card-slider
        :title="prizes.title"
        :perex="prizes.perex"
        :cards="cardsPrize"
        cardType="CardPrize"
        :button="cardsButton"
        class="q-pt-xl"
        data-cy="list-card-slider"
      />

      <results-tabs class="q-pt-xl" data-cy="results-tabs" />
    </div>
  </q-page>
</template>
