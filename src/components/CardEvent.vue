<script lang="ts">
import { defineComponent, ref } from 'vue';
import { date, Screen } from 'quasar';

// import types
import { CardEvent as CardEventType, ConfigGlobal } from 'components/types';

// import config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);

const { formatDate } = date;

export default defineComponent({
  name: 'CardEvent',
  props: {
    card: {
      type: Object as () => CardEventType,
    },
  },
  setup(props) {
    const modalOpened = ref(false);
    const eventDateTime = formatDate(
      props?.card?.dates,
      'ddd D. MMM. YYYY, HH:mm'
    );
    const setHorizontalPosition = (): boolean => (Screen.xs ? false : true);
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    return {
      borderRadius,
      modalOpened,
      eventDateTime,
      setHorizontalPosition,
    };
  },
});
</script>

<template>
  <div>
    <q-card
      flat
      class="bg-white"
      :style="{ 'border-radius': borderRadius }"
      data-cy="card"
    >
      <q-card-section
        :horizontal="setHorizontalPosition()"
        class="q-pa-none"
        data-cy="card-section"
      >
        <!-- Bg image -->
        <q-img
          :ratio="3 / 2"
          :img-style="{
            borderRadius: setHorizontalPosition()
              ? `${borderRadius} 0 0 ${borderRadius}`
              : `${borderRadius} ${borderRadius} 0 0`,
          }"
          class="col-sm-2"
          :src="card?.thumbnail?.src"
          :alt="card?.thumbnail?.alt"
          data-cy="card-image"
        />
        <!-- Content -->
        <q-card-section
          horizontal
          class="col-grow flex items-center"
          data-cy="card-content"
        >
          <div class="col-grow q-px-md q-py-lg">
            <!-- Event name link for open modal dialog -->
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
            <!-- Event date and place description -->
            <div
              v-if="eventDateTime || card?.location"
              class="meta flex items-center gap-8 q-mt-sm"
            >
              <div
                v-if="eventDateTime"
                class="dates flex items-center"
                data-cy="card-dates"
              >
                <!-- Event calendar icon -->
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
                <!-- Event place icon -->
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
          <!-- Add to calendar btn -->
          <div class="overflow-hidden flex items-center">
            <div class="q-px-md">
              <q-btn round outline data-cy="calendar-button">
                <q-icon name="fa-solid fa-calendar-plus" size="xs"></q-icon>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card-section>

      <!-- Modal dialog -->
      <q-dialog persistent v-model="modalOpened" square data-cy="card-dialog">
        <q-card class="relative-position">
          <!-- Header -->
          <q-card-section class="q-pt-none" data-cy="dialog-header">
            <h3 v-if="card?.title" class="text-h6 q-mt-sm q-pt-xs q-mb-none">
              {{ card?.title }}
            </h3>

            <div
              v-if="eventDateTime || card?.location"
              class="meta flex items-center q-mt-sm"
            >
              <!-- Event datetime -->
              <div
                v-if="eventDateTime"
                class="dates flex items-center q-pr-md"
                data-cy="dialog-dates"
              >
                <!-- Event calendar icon -->
                <q-icon
                  name="event"
                  size="sm"
                  class="q-pr-xs"
                  color="blue-grey-2"
                />
                {{ eventDateTime }}
              </div>
              <!-- Event location -->
              <div
                v-if="card?.location"
                class="location flex items-center"
                data-cy="dialog-location"
              >
                <!-- Event place icon -->
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

          <!-- Content -->
          <q-card-section
            horizontal
            class="scroll"
            data-cy="dialog-content"
            style="max-height: 50vh; flex-wrap: wrap"
          >
            <!-- Text -->
            <div class="col-12 col-md-6 q-px-md q-py-md">
              <div
                v-if="card?.content"
                v-html="card?.content"
                data-cy="dialog-text"
              ></div>
            </div>

            <!-- Image -->
            <div class="col-12 col-md-6 q-px-md q-py-md">
              <q-img
                :src="card?.image?.src"
                :alt="card?.image?.alt"
                :ratio="1"
                data-cy="dialog-image"
              />
            </div>

            <!-- Add event to calendar btn -->
            <q-btn
              color="black"
              unelevated
              rounded
              class="q-ma-md"
              data-cy="dialog-button"
            >
              <div class="flex items-center no-wrap">
                <q-icon left name="fa-solid fa-calendar-plus" size="xs" />
                <div class="text-center">
                  {{ $t('index.cardEvent.addToCalendar') }}
                </div>
              </div>
            </q-btn>
          </q-card-section>

          <!-- Close dialog btn -->
          <q-card-actions
            class="dialog-close-btn inline-block absolute-top-right q-pa-none"
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
.gap-8 {
  gap: 8px;
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

.dialog-close-btn {
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
