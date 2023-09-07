<script lang="ts">
import { defineComponent, computed } from 'vue';

// components
import VueCardOffer from './VueCardOffer.vue';

// types
import { CardOffer } from 'components/types';

export default defineComponent({
  name: 'VueCardListOffer',
  components: {
    VueCardOffer,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    cards: {
      type: Array as () => CardOffer[],
      required: true,
    },
  },
  setup(props) {
    const maxCards = 6;
    const renderedCards = computed(() => {
      return props.cards.slice(0, maxCards);
    });

    const hasMoreCards = computed(() => {
      return props.cards.length > maxCards;
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
    <div
      class="row q-col-gutter-lg q-row-gutter-md"
      data-cy="card-list-offer"
    >
      <div
        v-for="card in renderedCards"
        :key="card.title"
        class="col-12 col-sm-6 col-lg-4"
      >
        <!-- Card -->
        <vue-card-offer
          :card="card"
          data-cy="card-list-offer-item"
          >
        </vue-card-offer>
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
        data-cy="card-list-offer-button"
      />
    </div>
  </div>
</template>
