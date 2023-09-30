<script lang="ts">
// libraries
import { defineComponent } from 'vue';

// components
import CardFollow from './CardFollow.vue';

// types
import { CardFollow as CardFollowType } from 'components/types';

export default defineComponent({
  name: 'ListCardFollow',
  components: {
    CardFollow,
  },
  props: {
    cards: {
      type: Array as () => CardFollowType[],
      required: true,
    },
  },
});
</script>

<template>
  <div class="row q-col-gutter-lg items-center" data-cy="card-list-follow">
    <div class="col-12 col-lg-4" data-cy="card-list-follow-col-title">
      <!-- Title -->
      <h2
        class="text-h6 q-mt-none q-mb-none text-regular"
        data-cy="card-list-follow-title"
      >
        {{ $t('index.cardListFollow.title') }}
      </h2>
    </div>
    <!-- List of folow cards -->
    <div
      v-for="card in cards"
      :key="card.title"
      class="col-12 col-sm-6 col-lg-4"
      data-cy="card-list-follow-item"
    >
      <card-follow :card="card" />
    </div>
  </div>
</template>
