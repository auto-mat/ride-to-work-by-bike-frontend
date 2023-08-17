<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useMediaQuery } from '@vueuse/core';

// types
import { CardProgress } from './types';

export default defineComponent({
  name: 'VueCardProgressSlider',
  props: {
    card: {
      type: Object as () => CardProgress,
      required: true,
    },
  },
  setup(props) {
    const isLargeScreen = useMediaQuery('(min-width: 600px)')

    const timelineValue = computed(() => {
      if (!props.card.duration?.current || !props.card.duration?.total) {
        return 0;
      }
      return props.card.duration?.current / props.card.duration?.total;
    });

    const circleSize = computed(() => {
      return isLargeScreen.value ? '220px' : '128px';
    })

    return {
      timelineValue,
      circleSize
    };
  },
});
</script>

<template>
  <q-card
    :dark="true"
    :flat="true"
    :bordered="true"
    class="bg-blue-grey-3 rounded-20"
    data-cy="card"
  >
    <q-img :src="card?.image" class="card-image">
      <q-card-section
        class="absolute-top flex items-center justify-between gap-16 z-1"
        data-cy="card-progress-header"
      >
        <div class="flex items-center gap-16 text-body1">
          <q-icon :name="card.icon" size="18px" color="blue-grey-1" />
          <component
            :is="card.url ? 'a' : 'div'"
            :href="card.url"
            class="text-white text-weight-bold"
            data-cy="card-progress-title"
          >
            <h3 class="text-body1 text-weight-bold">{{ card.title }}</h3>
          </component>
        </div>
        <div data-cy="card-progress-timeline" class="min-w-180 gt-xs">
          <div class="text-subtitle2 text-right">
            {{ card.duration?.current }} / {{ card.duration?.total }}
            {{ $t('index.cardProgressSlider.timeline') }}
          </div>
          <q-linear-progress :value="timelineValue" color="white" rounded class="q-mt-xs" />
        </div>
      </q-card-section>
      <q-card-section class="card-image-section-content w-full h-full !q-pa-none !q-pt-92">
        <div class="gap-16 gap-sm-72 flex flex-wrap justify-center justify-sm-start items-center q-pa-xl" data-cy="card-progress-content">
          <div class="relative-position" data-cy="card-progress-percentage">
            <q-circular-progress
              rounded
              class="text-white q-ma-md"
              :value="card.progress"
              :size="circleSize"
              :thickness="0.05"
              color="white"
              track-color="blue-grey-10"
              data-cy="card-progress-circular"
            >
            </q-circular-progress>
            <div class="text-white absolute-center text-center">
              <div class="text-caption">
                {{ $t('index.cardProgressSlider.toDate') }}
              </div>
              <div class="text-circular-progress q-mt-xs">{{ card.progress }}%</div>
            </div>
          </div>
          <div class="flex column gap-16 gt-xs">
            <div v-for="stat in card.stats" :key="stat.title" data-cy="card-progress-stats">
              <div class="stats-title text-uppercase text-caption">{{ stat.title }}</div>
              <q-list dark dense class="q-mt-lg">
                <q-item v-for="item in stat.items" :key="item.id" class="stats-value !q-pa-none">
                  {{ item.text }}
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator color="blue-grey-8" />

      <q-card-section class="card-image-section-content lt-sm" data-cy="card-progress-footer-mobile">
        <div class="min-w-180" data-cy="card-progress-timeline">
          <div class="text-subtitle2 text-center">
            {{ card.duration?.current }} / {{ card.duration?.total }}
            {{ $t('index.cardProgressSlider.timeline') }}
          </div>
          <q-linear-progress class="q-mt-xs" :value="timelineValue" color="white" rounded />
        </div>
      </q-card-section>
    </q-img>
  </q-card>
</template>

<style scoped lang="scss">
:deep(.q-list--dense > .q-item) {
  min-height: 24px;
}
:deep(.card-image > div) {
  padding-bottom: 0 !important;
}
:deep(.card-image > *) {
  position: relative !important;
}
:deep(.card-image > * > .card-image-section-content) {
  position: relative !important;
}
.text-circular-progress {
  font-size: 40px;
  font-weight: 500;
  line-height: 1;
  @media (min-width: $breakpoint-sm-min) {
    font-size: 48px;
  }
}
.z-1 {
  z-index: 1;
}
.rounded-20 {
  border-radius: 20px;
  background-color: var(--q-gray-light);
}
.gap-16 {
  gap: 16px;
}
.gap-sm-72 {
  @media (min-width: $breakpoint-sm-min) {
    gap: 72px;
  }
}
.justify-sm-start {
  @media (min-width: $breakpoint-sm-min) {
    justify-content: flex-start;
  }
}
.min-w-128 {
  min-width: 128px;
}
.min-w-180 {
  min-width: 180px;
}
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
.\!q-pa-none {
  padding: 0 !important;
}
.\!q-pt-92 {
  padding-top: 92px !important;
}
</style>
