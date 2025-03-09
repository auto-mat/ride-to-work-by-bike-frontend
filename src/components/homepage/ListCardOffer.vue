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
 * - `SectionHeading`: Component to render a heading.
 * - `SectionColumns`: Component to render a grid of cards.
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
import SectionHeading from '../global/SectionHeading.vue';
import SectionColumns from '../homepage/SectionColumns.vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { routesConf } from 'src/router/routes_conf';

// types
import type { CardOffer as CardOfferType } from '../types';

export default defineComponent({
  name: 'ListCardOffer',
  components: {
    CardOffer,
    SectionHeading,
    SectionColumns,
  },
  props: {
    cards: {
      type: Array as () => CardOfferType[],
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const maxCards = rideToWorkByBikeConfig.indexPageVisibleOfferCount;

    const renderedCards = computed((): CardOfferType[] => {
      return props.cards.slice(0, maxCards);
    });

    const hasMoreCards = computed((): boolean => {
      return props.cards.length > maxCards;
    });

    return {
      renderedCards,
      hasMoreCards,
      routesConf,
    };
  },
});
</script>

<template>
  <div v-if="renderedCards?.length > 0">
    <!-- Title -->
    <section-heading class="q-mb-md">
      {{ title }}
    </section-heading>
    <!-- Cards grid -->
    <section-columns
      :columns="3"
      class="q-col-gutter-lg q-mt-md"
      data-cy="list-card-offer"
    >
      <card-offer
        v-for="card in renderedCards"
        :key="card.title"
        :card="card"
        data-cy="list-card-offer-item"
      />
    </section-columns>
    <!-- Link more offers -->
    <div v-if="hasMoreCards" class="text-center">
      <q-btn
        :to="routesConf['prizes'].path"
        outline
        rounded
        color="primary"
        unelevated
        :label="$t('index.cardListOffer.button', { count: cards?.length })"
        class="q-mt-md"
        data-cy="list-card-offer-button"
      />
    </div>
  </div>
</template>
