<script lang="ts">
import { defineComponent } from 'vue';

// components
import CardEvent from 'components/CardEvent.vue';

// types
import { CardEvent as CardEventType } from 'components/types';

export default defineComponent({
  name: 'ListCardEvent',
  props: {
    heading: {
      type: String,
    },
    cards: {
      type: Array as () => CardEventType[],
    },
  },
  components: {
    CardEvent,
  },
});
</script>

<template>
  <!-- Cards are stacked vertically -->
  <div>
    <card-event
      v-for="card in cards"
      :key="card.title"
      :card="card"
      class="q-mt-lg"
      data-cy="card-list-item"
    ></card-event>
  </div>
</template>
