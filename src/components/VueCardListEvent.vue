<script lang="ts">
import { defineComponent } from 'vue';

// components
import VueCardEvent from 'components/VueCardEvent.vue';

// types
import { CardEvent } from 'components/types';

export default defineComponent({
  name: 'VueCardListEvent',
  props: {
    heading: {
      type: String,
    },
    cards: {
      type: Array as () => CardEvent[],
    },
  },
  components: {
    VueCardEvent,
  },
});
</script>

<template>
  <div>
    <vue-card-event
      v-for="card in cards"
      :key="card.title"
      :card="card"
      class="q-mt-lg"
      data-cy="card-list-item"
    ></vue-card-event>
  </div>
</template>
