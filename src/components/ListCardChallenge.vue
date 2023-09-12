<script lang="ts">
import { defineComponent } from 'vue';

// components
import CardChallenge from 'components/CardChallenge.vue';

// types
import { CardChallenge as CardChallengeType } from 'components/types';

export default defineComponent({
  name: 'ListCardChallenge',
  props: {
    cards: {
      type: Array as () => CardChallengeType[],
    },
  },
  components: {
    CardChallenge,
  },
});
</script>

<template>
  <div>
    <!-- Title -->
    <h2 class="text-h6 q-mt-none text-weight-bold" data-cy="card-list-title">
      {{ $t('index.cardListChallenge.title') }}
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
        <card-challenge :card="card" />
      </div>
    </div>
  </div>
</template>
