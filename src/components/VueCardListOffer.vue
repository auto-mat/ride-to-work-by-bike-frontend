<script lang="ts">
import { defineComponent, computed } from 'vue';

// import components
import VueCardOffer from './VueCardOffer.vue';

// import types
import { Offer } from 'components/types';

export default defineComponent({
  name: 'VueCardListOffer',
  components: {
    VueCardOffer,
  },
  props: {
    cards: {
      type: Array as () => Offer[],
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
    <div
      class="grid grid-cols-2 grid-cols-md-3 gap-x-24 gap-y-16"
      data-cy="card-list-offer"
    >
      <vue-card-offer
        v-for="card in renderedCards"
        :key="card.title"
        :card="card"
        data-cy="card-list-offer-item"
      >
      </vue-card-offer>
    </div>
    <div v-if="hasMoreCards" class="text-center">
      <q-btn
        rounded
        color="black"
        unelevated
        outline
        :label="$t('index.cardListOffer.allOffers', { count: cards?.length })"
        class="q-mt-md"
        data-cy="card-list-offer-button"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid {
  display: grid;
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-md-3 {
  @media (min-width: $breakpoint-md-min) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.gap-x-24 {
  column-gap: 24px;
}
.gap-y-16 {
  row-gap: 16px;
}
</style>
