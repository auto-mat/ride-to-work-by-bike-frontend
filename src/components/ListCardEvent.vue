<script lang="ts">
/**
 * ListCardEvent Component
 *
 * The `ListCardEvent` component renders a list of cards that represent
 * various events.
 *
 * @description
 * This component takes an array of card items and displays each card using
 * the `CardEvent` component. Items are displayed in 1 column.
 *
 * @props
 * - `heading` (String): The heading or title for the list of event cards.
 * - `cards` (Array of CardEventType, required): An array of card items to be
 *   displayed. Each item is of type `CardEventType`.
 *
 * @components
 * - `CardEvent`: Component to render individual event cards.
 *
 * @example
 * <list-card-event :heading="eventHeading" :cards="eventList" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105623&mode=dev)
 */

// libraries
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
      required: true,
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
