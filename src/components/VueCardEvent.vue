<script lang="ts">
import { defineComponent, ref } from "vue";

import { CardEvent } from "./types";

import { useDateFormat } from "@vueuse/core";

export default defineComponent({
  name: 'VueCardEvent',
  props: {
    card: {
      type: Object as () => CardEvent
    }
  },
  setup(props) {
    const modalOpened = ref(false)
    const eventDateTime = useDateFormat(props?.card?.dates, 'ddd D. MMM. YYYY, HH:mm')

    return {
      modalOpened, eventDateTime
    };
  }
})
</script>

<template>
  <div>
    <q-card flat class="rounded-20 bg-white">
      <q-card-section horizontal>
        <q-img v-if="card?.thumbnail" class="col-2" :src="card?.thumbnail" data-testid="card-image" />
        <q-card-section horizontal class="col-grow">
          <div class="col-grow q-px-md q-py-lg">
            <div class="text-h6 text-bold" data-testid="card-title">
              <a href="#" class="card-link text-dark block" @click.prevent="modalOpened = true" data-testid="card-link">
                {{ card?.title }}
              </a>
            </div>
            <div v-if="eventDateTime || card?.location" class="meta flex items-center q-mt-sm">
              <div v-if="eventDateTime" class="dates flex items-center q-pr-md" data-testid="card-dates">
                <q-icon name="event" size="sm" class="q-pr-xs" color="blue-grey-2" />
                {{ eventDateTime }}
              </div>
              <div v-if="card?.location" class="location flex items-center" data-testid="card-location">
                <q-icon name="place" size="sm" class="q-pr-xs" color="blue-grey-2" />
                {{ card?.location }}
              </div>
            </div>
          </div>
          <div class="overflow-hidden">
            <q-btn flat round outline icon="calendar_plus" />
          </div>
        </q-card-section>
      </q-card-section>


      <q-dialog v-model="modalOpened" square>
        <q-card>

          <q-card-section class="q-pt-none">
            <h3 v-if="card?.title" class="text-h6 q-mt-sm q-pt-xs q-mb-none">{{ card?.title }}</h3>
            <div v-if="eventDateTime || card?.location" class="meta flex items-center q-mt-sm">
              <div v-if="eventDateTime" class="dates flex items-center q-pr-md" data-testid="card-dates">
                <q-icon name="event" size="sm" class="q-pr-xs" color="blue-grey-2" />
                {{ eventDateTime }}
              </div>
              <div v-if="card?.location" class="location flex items-center" data-testid="card-location">
                <q-icon name="place" size="sm" class="q-pr-xs" color="blue-grey-2" />
                {{ card?.location }}
              </div>
            </div>
          </q-card-section>

          <q-separator />


          <q-card-section horizontal>
            <div class="q-px-md q-py-md">
              <div v-if="card?.content" v-html="card?.content"></div>
              <q-btn color="black" unelevated rounded>
                <div class="flex items-center no-wrap">
                  <q-icon left name="fa-solid fa-calendar-plus" size="xs" />
                  <div class="text-center">
                    {{ $t('index.event.addToCalendar') }}
                  </div>
                </div>
              </q-btn>
            </div>
          </q-card-section>

          <q-img src="https://picsum.photos/380/380" />

          <q-card-section>
            <q-btn fab color="primary" icon="place" class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%);" />

            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">
                Cafe Basilico
              </div>
              <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                <q-icon name="place" />
                250 ft
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat color="primary" label="Reserve" />
            <q-btn v-close-popup flat color="primary" round icon="event" />
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

.overflow-hidden {
  overflow: hidden;
}

.card-link {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
