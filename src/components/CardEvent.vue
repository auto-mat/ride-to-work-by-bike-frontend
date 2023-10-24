<script lang="ts">
/**
 * CardEvent Component
 *
 * The `CardEvent` component presents event-related details in a card format.
 *
 * @description
 * This component is used to display event details, such as date and time. It
 * also integrates with a modal dialog for displaying additional event details.
 * Border radius can be controlled by `config` parameter.
 *
 * Note: This component is commonly used within the `ListCardEvent`
 * component.
 *
 * @props
 * - `card` (Object): The card object containing event details. It should be of
 *   type `CardEventType`.
 *
 * @components
 * - `DialogCard`: Used to display detailed information about the offer in a
 *   modal dialog.
 *
 * @example
 * <card-event
 *   :card="eventDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105625&mode=dev)
 */

// libraries
import { defineComponent, ref } from 'vue';
import { date, Screen } from 'quasar';

// components
import DialogCard from './DialogCard.vue';

// types
import { CardEvent as CardEventType, ConfigGlobal } from './types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);

const { formatDate } = date;

export default defineComponent({
  name: 'CardEvent',
  components: {
    DialogCard,
  },
  props: {
    card: {
      type: Object as () => CardEventType,
      required: true,
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
        <div
          class="col-grow flex wrap items-center q-py-lg"
          data-cy="card-content"
        >
          <div class="col-grow q-px-md">
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
          <div class="overflow-hidden flex items-center q-mt-md">
            <div class="q-px-md">
              <q-btn round outline data-cy="calendar-button">
                <q-icon name="fa-solid fa-calendar-plus" size="xs"></q-icon>
              </q-btn>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Modal dialog -->
      <dialog-card v-model="modalOpened" data-cy="dialog-card-event">
        <!-- Title -->
        <template #title>
          {{ card?.title }}
        </template>
        <!-- Metadata -->
        <template v-if="eventDateTime || card?.location" #metadata>
          <div class="flex flex-wrap items-center gap-x-32 gap-y-8 q-mt-sm">
            <div
              v-if="eventDateTime"
              class="flex items-center text-blue-grey-7"
              data-cy="dialog-meta"
            >
              <q-icon
                name="event"
                size="18px"
                class="q-pr-xs"
                color="blue-grey-3"
              />
              {{ eventDateTime }}
            </div>
            <div
              v-if="card?.location"
              class="flex items-center text-blue-grey-7"
              data-cy="dialog-meta"
            >
              <q-icon
                name="pedal_bike"
                size="18px"
                class="q-pr-xs"
                color="blue-grey-3"
              />
              {{ card?.location }}
            </div>
          </div>
        </template>
        <!-- Content -->
        <template v-if="card?.content" #content>
          <div v-html="card.content" data-cy="dialog-content" />
        </template>
        <template #buttons>
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
        </template>
        <!-- Image -->
        <template v-if="card?.image" #image>
          <q-img
            :src="card.image.src"
            :alt="card.image.alt"
            :ratio="1"
            data-cy="dialog-image"
          />
        </template>
      </dialog-card>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
.gap-y-8 {
  row-gap: 8px;
}

.gap-x-32 {
  column-gap: 32px;
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
