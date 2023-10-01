<script lang="ts">
// libraries
import { defineComponent, computed } from 'vue';
import { useCircleSize } from 'src/composables/useCircleSize';

// types
import { CardProgress as CardProgressType, ConfigGlobal } from './types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);

export default defineComponent({
  name: 'CardProgressSlider',
  props: {
    card: {
      type: Object as () => CardProgressType,
      required: true,
    },
  },
  setup(props) {
    const timelineValue = computed((): number => {
      if (!props.card.duration?.current || !props.card.duration?.total) {
        return 0;
      }
      return props.card.duration?.current / props.card.duration?.total;
    });

    const { circleSize } = useCircleSize();

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    return {
      timelineValue,
      circleSize,
      borderRadius,
    };
  },
});
</script>

<template>
  <q-card
    dark
    flat
    bordered
    :style="{ 'border-radius': borderRadius }"
    class="bg-blue-grey-3"
    data-cy="card"
  >
    <!-- Background image -->
    <q-img :src="card?.image" height="450px" fit="contain">
      <div class="q-pa-none" style="width: 100%; height: 100%">
        <!-- Card header -->
        <q-card-section
          class="absolute-top flex items-center justify-between q-px-lg gap-16 z-1"
          data-cy="card-progress-header"
        >
          <div class="flex items-center gap-16 text-body1">
            <!-- Card icon -->
            <q-icon :name="card.icon" size="18px" color="blue-grey-1" />
            <!-- Card title -->
            <component
              :is="card.url ? 'a' : 'div'"
              :href="card.url"
              class="text-white text-weight-bold"
              data-cy="card-progress-title"
            >
              <h3 class="text-body1 text-weight-bold q-my-none">
                {{ card.title }}
              </h3>
            </component>
          </div>

          <!-- Timeline showing the progress of the challenge -->
          <div data-cy="card-progress-timeline" class="min-w-180 gt-xs">
            <!-- Timeline label -->
            <div class="text-subtitle2 text-right">
              {{ card.duration?.current }} / {{ card.duration?.total }}
              {{ $t('index.cardProgressSlider.timeline') }}
            </div>
            <!-- Timeline progress bar -->
            <q-linear-progress
              :value="timelineValue"
              color="white"
              rounded
              class="q-mt-xs"
            />
          </div>
        </q-card-section>

        <!-- Card body -->
        <q-card-section class="full-width" style="padding: 92px 0 0">
          <div class="row items-center q-pa-xl" data-cy="card-progress-content">
            <!-- Section progress -->
            <div
              class="col-lg-4 flex justify-center justify-sm-start"
              data-cy="card-progress-percentage"
            >
              <div class="relative-position">
                <!-- Progress bar -->
                <q-circular-progress
                  rounded
                  class="text-white"
                  :value="card.progress"
                  :size="circleSize"
                  :thickness="0.05"
                  color="white"
                  track-color="blue-grey-10"
                  data-cy="card-progress-circular"
                />
                <!-- Progress label -->
                <div class="text-white absolute-center text-center">
                  <!-- Caption -->
                  <div class="text-caption">
                    {{ $t('index.cardProgressSlider.toDate') }}
                  </div>
                  <!-- Number -->
                  <div class="circular-progress-number q-mt-xs">
                    {{ card.progress }}%
                  </div>
                </div>
              </div>
            </div>

            <!-- Section stats -->
            <div class="col flex column gap-16 gt-xs q-pl-xl">
              <div
                v-for="stat in card.stats"
                :key="stat.title"
                data-cy="card-progress-stats"
              >
                <!-- Title stats -->
                <div class="stats-title text-uppercase text-caption">
                  {{ stat.title }}
                </div>
                <!-- List stats -->
                <q-list dark dense class="q-mt-lg">
                  <q-item
                    v-for="item in stat.items"
                    :key="item.id"
                    class="stats-value"
                    style="padding: 0"
                  >
                    {{ item.text }}
                  </q-item>
                </q-list>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator color="blue-grey-8 lt-sm" />

        <!-- Card footer (mobile) -->
        <q-card-section class="lt-sm" data-cy="card-progress-footer-mobile">
          <!-- Timeline showing the progress of the challenge -->
          <div class="min-w-180" data-cy="card-progress-timeline">
            <!-- Timeline label -->
            <div class="text-subtitle2 text-center">
              {{ card.duration?.current }} / {{ card.duration?.total }}
              {{ $t('index.cardProgressSlider.timeline') }}
            </div>
            <!-- Timeline progress bar -->
            <q-linear-progress
              class="q-mt-xs"
              :value="timelineValue"
              color="white"
              rounded
            />
          </div>
        </q-card-section>
      </div>
    </q-img>
  </q-card>
</template>

<style scoped lang="scss">
.z-1 {
  z-index: 1;
}
.gap-16 {
  gap: 16px;
}
.justify-sm-start {
  @media (min-width: $breakpoint-sm-min) {
    justify-content: flex-start;
  }
}
.min-w-180 {
  min-width: 180px;
}
</style>
