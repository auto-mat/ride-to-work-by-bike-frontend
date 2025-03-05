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
 *
 * @example
 * <list-card-offer :cards="followList" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105632&mode=dev)
 */

// libraries
import { defineComponent, computed, inject, onMounted } from 'vue';

// adapters
import { feedAdapter } from '../../adapters/feedAdapter';

// components
import CardOffer from './CardOffer.vue';
import SectionHeading from '../global/SectionHeading.vue';

// composables
import { useApiGetPosts } from '../../composables/useApiGetPosts';

// config
import { routesConf } from 'src/router/routes_conf';

// types
import type { CardOffer as CardOfferType } from '../types';
import type { Logger } from '../types/Logger';

// utils
import { getOffersFeedParamSet } from '../../utils/get_feed_param_set';

export default defineComponent({
  name: 'ListCardOffer',
  components: {
    CardOffer,
    SectionHeading,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const maxCards = 6;

    const { posts, isLoading, loadPosts } = useApiGetPosts(logger);
    onMounted(() => {
      loadPosts(getOffersFeedParamSet());
    });
    const cards = computed(() => feedAdapter.toCardOffer(posts.value));

    const renderedCards = computed((): CardOfferType[] => {
      return cards.value.slice(0, maxCards);
    });

    const hasMoreCards = computed((): boolean => {
      return cards.value.length > maxCards;
    });

    return {
      cards,
      isLoading,
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
    <div class="row q-col-gutter-lg q-row-gutter-md" data-cy="list-card-offer">
      <div
        v-for="card in renderedCards"
        :key="card.title"
        class="col-12 col-sm-6 col-lg-4"
        data-cy="list-card-offer-item"
      >
        <!-- Card -->
        <card-offer :card="card" style="height: 100%" />
      </div>
    </div>
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
