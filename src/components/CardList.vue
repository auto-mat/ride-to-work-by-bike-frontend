<script lang="ts">
import { defineComponent } from "vue";
import VueCardChallenge from "components/VueCardChallenge.vue";

import { CardChallenge } from 'components/types'


export default defineComponent({
  name: "CardList",
  props: {
    cards: {
      type: Array as () => CardChallenge[],
    }
  },
  components: {
    VueCardChallenge
  }
})
</script>

<template>
  <div>
    <h2 class="text-h6 q-mt-none q-pt-lg text-weight-bold" data-testid="card-list-title">{{ $t('index.cardList.title') }}
    </h2>
  </div>
  <div class="row q-col-gutter-lg" data-testid="card-list">
    <div v-for="card in cards" :key="card.title" class="col-12 col-sm-6 col-lg-4" data-testid="card-list-item">
      <vue-card-challenge :card="card"></vue-card-challenge>
    </div>
  </div>
</template>
