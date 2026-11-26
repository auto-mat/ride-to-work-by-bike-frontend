<script lang="ts">
/**
 * EventLinkList Component
 *
 * @description * Use this component to render a list of event names
 * as links. Clicking a link opens the event detail dialog.
 *
 * Note: This component is used in `RoutesCalendar`, `RouteListEdit` and
 * `RouteListDisplay` to show events for a given day.
 *
 * @props
 * - `events` (CardOfferType[], required): Events to show.
 *
 * @components
 * - `OfferDetailDialog`: Used to display event details.
 *
 * @example
 * <event-link-list :events="eventsMap[day.date]" />
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import OfferDetailDialog from '@/components/offer/OfferDetailDialog.vue';

// types
import type { CardOffer as CardOfferType } from '../types';

export default defineComponent({
  name: 'EventLinkList',
  components: {
    OfferDetailDialog,
  },
  props: {
    events: {
      type: Array as () => CardOfferType[],
      required: true,
    },
  },
  setup() {
    const selectedEvent = ref<CardOfferType | null>(null);
    const isDialogOpen = ref<boolean>(false);

    const onClickEvent = (event: CardOfferType): void => {
      selectedEvent.value = event;
      isDialogOpen.value = true;
    };

    return {
      isDialogOpen,
      selectedEvent,
      onClickEvent,
    };
  },
});
</script>

<template>
  <div v-if="events.length" class="text-caption" data-cy="event-link-list">
    <span class="text-grey-7" data-cy="event-link-list-label">{{
      $t('routes.labelEvents')
    }}</span>&nbsp;<template v-for="(event, index) in events" :key="event.id"
      ><a
        href="#"
        class="text-primary"
        v-html="event.title"
        data-cy="event-link"
        @click.prevent.stop="onClickEvent(event)"
      /><template v-if="index < events.length - 1">, </template></template
    >
    <offer-detail-dialog
      v-if="selectedEvent"
      v-model="isDialogOpen"
      :card="selectedEvent"
    />
  </div>
</template>
