<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDateFormat, useMediaQuery } from '@vueuse/core';

// import types
import { CardEvent } from 'components/types';

export default defineComponent({
  name: 'VueCardEvent',
  props: {
    card: {
      type: Object as () => CardEvent,
    },
  },
  setup(props) {
    const modalOpened = ref(false);
    const eventDateTime = useDateFormat(
      props?.card?.dates,
      'ddd D. MMM. YYYY, HH:mm'
    );
    const isLargeScreen = useMediaQuery('(min-width: 600px)');

    return {
      modalOpened,
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

      <q-dialog v-model="modalOpened" square data-cy="card-dialog">
        <q-card class="relative-position overflow-visible">
          <q-card-section class="q-pt-none" data-cy="dialog-header">
            <h3 v-if="card?.title" class="text-h6 q-mt-sm q-pt-xs q-mb-none">
              {{ card?.title }}
            </h3>
            <div
              v-if="eventDateTime || card?.location"
              class="meta flex items-center q-mt-sm"
            >
              <div
                v-if="eventDateTime"
                class="dates flex items-center q-pr-md"
                data-cy="dialog-dates"
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
                data-cy="dialog-location"
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
          </q-card-section>

          <q-separator />

          <q-card-section
            horizontal
            class="scroll"
            data-cy="dialog-body"
            style="max-height: 50vh; flex-wrap: wrap"
          >
            <div class="col-12 col-md-6 q-px-md q-py-md">
              <div
                v-if="card?.content"
                v-html="card?.content"
                data-cy="dialog-content"
              ></div>
              <q-btn
                color="black"
                unelevated
                rounded
                class="q-mt-md"
                data-cy="dialog-button"
              >
                <div class="flex items-center no-wrap">
                  <q-icon left name="fa-solid fa-calendar-plus" size="xs" />
                  <div class="text-center">
                    {{ $t('index.cardEvent.addToCalendar') }}
                  </div>
                </div>
              </q-btn>
            </div>
            <div class="col-12 col-md-6 q-px-md q-py-md">
              <q-img
                src="https://picsum.photos/380/380"
                :ratio="1"
                data-cy="dialog-image"
              />
            </div>
          </q-card-section>

          <q-card-actions
            class="dialog-close inline-block absolute-top-right q-px-none q-py-none"
            data-cy="dialog-close"
          >
            <q-btn
              v-close-popup
              round
              color="blue-grey-8"
              icon="close"
              class="bg-blue-grey-2"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
