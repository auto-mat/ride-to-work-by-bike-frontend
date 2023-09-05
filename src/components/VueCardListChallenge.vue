<script lang="ts">
import { defineComponent } from 'vue';

// import components
import VueCardChallenge from 'components/VueCardChallenge.vue';

// import types
import { CardChallenge } from 'components/types';

export default defineComponent({
  name: 'VueCardListChallenge',
  props: {
    cards: {
      type: Array as () => CardChallenge[],
    },
  },
  components: {
    VueCardChallenge,
  },
});
</script>

<template>
  <div>
    <h2 class="text-h6 q-mt-none text-weight-bold" data-cy="card-list-title">
      {{ $t('index.cardList.title') }}
    </h2>
    <!-- 3 col grid on desktop -->
    <div class="row q-col-gutter-lg" data-cy="card-list">
      <div
        v-for="card in cards"
        :key="card.title"
        class="col-12 col-sm-6 col-lg-4"
        data-cy="card-list-item"
      >
        <!-- Card -->
        <vue-card-challenge :card="card" />
      </div>
    </div>
  </div>
</template>
