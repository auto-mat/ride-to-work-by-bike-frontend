<script lang="ts">
import { defineComponent } from "vue";

// import components
import VueCardOffer from "./VueCardOffer.vue";

// import types
import { Offer } from 'components/types';

export default defineComponent({
  name: 'VueCardListOffer',
  components: {
    VueCardOffer,
  },
  props: {
    cards: {
      type: Array as () => Offer[]
    }
  }
})
</script>

<template>
  <div>
    <vue-card-offer v-for="card in cards" :key="card.title" :card="card">
    </vue-card-offer>
  </div>
</template>
