<script lang="ts">
import { defineComponent } from "vue";
import { CardChallenge } from 'components/types'


export default defineComponent({
  name: "CardList",
  props: {
    cards: {
      type: Array as () => CardChallenge[],
    }
  },
  components: {
    // CardChallenge
  }
})
</script>

<template>
  <div>
    <h2 class="text-h6 q-mt-none q-pt-lg text-weight-bold" data-testid="card-list-title">{{ $t('index.cardList.title') }}
    </h2>
  </div>
  <div class="row" data-testid="card-list">
    <div v-for="card in cards" :key="card.title" class="col-12 col-sm-6 col-lg-4" data-testid="card-list-item">
      {{ card.title }}
    </div>
  </div>
</template>
