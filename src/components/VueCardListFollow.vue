<script lang="ts">
import { defineComponent } from 'vue';

// import components
import VueCardFollow from './VueCardFollow.vue';

// import styles
import { CardFollow } from 'components/types';

export default defineComponent({
  name: 'VueCardListFollow',
  components: {
    VueCardFollow,
  },
  props: {
    cards: {
      type: Array as () => CardFollow[],
      required: true,
    },
  },
});
</script>

<template>
  <div class="row q-col-gutter-lg items-center" data-cy="card-list-follow">
    <div class="col-12 col-sm-6 col-md-4" data-cy="card-list-follow-col-title">
      <h2
        class="text-h6 q-mt-none q-mb-none text-regular"
        data-cy="card-list-follow-title"
      >
        {{ $t('index.cardListFollow.title') }}
      </h2>
    </div>
    <div
      v-for="card in cards"
      :key="card.title"
      class="col-12 col-sm-6 col-md-4"
      data-cy="card-list-follow-item"
    >
      <vue-card-follow :card="card" />
    </div>
  </div>
</template>
