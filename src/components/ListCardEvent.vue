<script lang="ts">
// libraries
import { defineComponent } from 'vue';

// components
import CardEvent from 'components/CardEvent.vue';

// types
import { CardEvent as CardEventType } from 'components/types';

// Component used to list events on Homepage
// Internal Figma link: https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105611&mode=design&t=UCzj0XWLzM4eVHYd-1
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
