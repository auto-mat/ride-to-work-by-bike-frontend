<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDateFormat, useMediaQuery } from '@vueuse/core';

// import components
import VueDialogCard from 'components/VueDialogCard.vue';

// import types
import { CardEvent, DialogCard } from 'components/types';

export default defineComponent({
  name: 'VueCardEvent',
  components: {
    VueDialogCard,
  },
  props: {
    card: {
      type: Object as () => CardEvent,
      required: true,
    },
  },
  setup(props) {
    const modalOpened = ref(false);

    const eventDateTime = useDateFormat(
      props.card.dates,
      'ddd D. MMM. YYYY, HH:mm'
    );
    const modalDialog: DialogCard = {
      title: props.card.title,
      meta: [
        {
          icon: 'event',
          description: eventDateTime.value,
        },
        {
          icon: 'place',
          description: props.card.location,
        },
      ],
      content: props.card.content,
      image: props.card.image,
      calendar: true, // TODO: how are we going to generate calendar links?
    };

    const isLargeScreen = useMediaQuery('(min-width: 600px)');

    return {
      modalOpened,
      modalDialog,
      eventDateTime,
      isLargeScreen,
    };
  },
});
</script>

<template>
  <div>
    <q-card flat class="rounded-20 bg-white" data-cy="card">
      <q-card-section
        :horizontal="isLargeScreen"
        class="q-pa-none"
        data-cy="card-section"
      >
        <q-img
          :ratio="3 / 2"
          class="col-sm-2"
          :src="card?.thumbnail"
          data-cy="card-image"
        />
        <q-card-section
          horizontal
          class="col-grow flex items-center"
          data-cy="card-content"
        >
          <div class="col-grow q-px-md q-py-lg">
            <div class="text-subtitle1 text-bold" data-cy="card-title">
              <a
                href="#"
                class="card-link text-dark block"
                @click.prevent="modalOpened = true"
                data-cy="card-link"
              >
                {{ card?.title }}
              </a>
            </div>
            <div
              v-if="eventDateTime || card?.location"
              class="meta flex items-center gap-8 q-mt-sm"
            >
              <div
                v-if="eventDateTime"
                class="dates flex items-center"
                data-cy="card-dates"
              >
                <q-icon
                  name="event"
                  size="sm"
                  class="q-pr-xs"
                  color="blue-grey-2"
                />
                {{ eventDateTime }}
              </div>
              <div
                v-if="card?.location"
                class="location flex items-center"
                data-cy="card-location"
              >
                <q-icon
                  name="place"
                  size="sm"
                  class="q-pr-xs"
                  color="blue-grey-2"
                />
                {{ card?.location }}
              </div>
            </div>
          </div>
          <div class="overflow-hidden flex items-center">
            <div class="q-px-md">
              <q-btn round outline data-cy="calendar-button">
                <q-icon name="fa-solid fa-calendar-plus" size="xs"></q-icon>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card-section>

      <vue-dialog-card
        v-model="modalOpened"
        :dialog="modalDialog"
        data-cy="dialog-card-event"
      ></vue-dialog-card>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
.rounded-20 {
  border-radius: 20px;
}

.gap-8 {
  gap: 8px;
}

.overflow-hidden {
  overflow: hidden;
}

.q-dialog__inner > div {
  overflow: visible !important;
}

.card-link {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.dialog-close {
  top: -21px;
  right: -21px;
}

.q-card > div:first-child > .q-img {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

@media (min-width: $breakpoint-sm-min) {
  .q-card > div:first-child > .q-img {
    border-top-left-radius: inherit;
    border-top-right-radius: 0;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: 0;
  }
}
</style>
