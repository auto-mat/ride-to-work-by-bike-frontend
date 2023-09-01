<script lang="ts">
import { defineComponent, ref } from 'vue';
import { date, Screen } from 'quasar';

// import types
import { CardEvent, ConfigGlobal } from 'components/types';

// import config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);

const { formatDate } = date

export default defineComponent({
  name: 'VueCardEvent',
  props: {
    card: {
      type: Object as () => CardEvent,
    },
  },
  setup(props) {
    const modalOpened = ref(false);
    const eventDateTime = formatDate(props?.card?.dates, 'ddd D. MMM. YYYY, HH:mm');
    const isLargeScreen = Screen.gt.sm;
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    return {
      borderRadius,
      modalOpened,
      eventDateTime,
      isLargeScreen,
    };
  },
});
</script>

<template>
  <div>
    <q-card
      flat
      class="bg-white"
      :style="{ 'border-radius' : borderRadius }"
      data-cy="card"
    >
      <q-img
        v-if="!isLargeScreen"
        :ratio="3 / 2"
        :src="card?.thumbnail?.src"
        :alt="card?.thumbnail?.alt"
        class="lt-md"
        data-cy="card-image"
      />
      <q-card-section
        horizontal
        class="q-pa-none"
        data-cy="card-section"
      >
        <q-img
          :ratio="3 / 2"
          class="col-sm-2 gt-sm"
          :src="card?.thumbnail?.src"
          :alt="card?.thumbnail?.alt"
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

      <q-dialog square persistent v-model="modalOpened" data-cy="card-dialog">
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
            data-cy="dialog-content"
            style="max-height: 50vh; flex-wrap: wrap"
          >
            <div class="col-12 col-md-6 q-px-md q-py-md">
              <div
                v-if="card?.content"
                v-html="card?.content"
                data-cy="dialog-text"
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
                :src="card?.image?.src"
                :alt="card?.image?.alt"
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

.gap-8 {
  gap: 8px;
}

.card-link {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.q-dialog__inner > div {
  overflow: visible !important;
}

.dialog-close {
  top: -21px;
  right: -21px;
}
</style>
