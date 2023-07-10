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
    title: {
      type: String,
      required: false,
    },
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
    <h2 class="text-h6 q-mt-none text-weight-semibold" data-cy="card-list-post-title">{{ title }}</h2>
    <div
      class="grid grid-cols-1 grid-cols-sm-2 grid-cols-lg-3 gap-x-24 gap-y-16"
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
        :label="$t('index.cardListOffer.button', { count: cards?.length })"
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
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-sm-2 {
  @media (min-width: $breakpoint-sm-min) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.grid-cols-lg-3 {
  @media (min-width: $breakpoint-lg-min) {
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
