<script lang="ts">
/**
 * ListCardOffer Component
 *
 * The `ListCardOffer` component renders a list of cards that represent
 * various offers.
 *
 * @description
 * This component takes an array of card items and displays each card using
 * the `CardOffer` component. Items are displayed in 3 col grid.
 *
 * @props
 * - `title` (String): The heading or title for the list of offer cards.
 * - `cards` (Array of CardOfferType, required): An array of card items to be
 *   displayed. Each item is of type `CardOfferType`.
 *
 * @components
 * - `CardOffer`: Component to render individual follow cards.
 *
 * @example
 * <list-card-offer :cards="followList" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105632&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';

// components
import CardOffer from './CardOffer.vue';

// types
import { CardOffer as CardOfferType } from '../types';

export default defineComponent({
  name: 'ListCardOffer',
  components: {
    CardOffer,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    cards: {
      type: Array as () => CardOfferType[],
      required: true,
    },
  },
  setup(props) {
    const MAX_CARDS = 6;

    const renderedCards = computed((): CardOfferType[] => {
      return props.cards.slice(0, MAX_CARDS);
    });

    const hasMoreCards = computed((): boolean => {
      return props.cards.length > MAX_CARDS;
    });

    return {
      renderedCards,
      hasMoreCards,
    };
  },
});
</script>

<template>
  <div>
    <!-- Title -->
    <h2
      class="text-h6 q-mt-none text-weight-semibold"
      data-cy="card-list-post-title"
    >
      {{ title }}
    </h2>
    <!-- Cards grid -->
    <div class="row q-col-gutter-lg q-row-gutter-md" data-cy="list-card-offer">
      <div
        v-for="card in renderedCards"
        :key="card.title"
        class="col-12 col-sm-6 col-lg-4"
        data-cy="list-card-offer-item"
      >
        <!-- Card -->
        <card-offer :card="card" />
      </div>
    </div>
    <!-- Link more offers -->
    <div v-if="hasMoreCards" class="text-center">
      <q-btn
        rounded
        color="black"
        unelevated
        outline
        :label="$t('index.cardListOffer.button', { count: cards?.length })"
        class="q-mt-md"
        data-cy="list-card-offer-button"
      />
    </div>
  </div>
</template>
