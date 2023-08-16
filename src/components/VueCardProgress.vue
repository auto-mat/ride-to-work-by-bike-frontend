<script lang="ts">
import { defineComponent, computed } from 'vue';

// types
import { CardProgress } from './types';

export default defineComponent({
  name: 'VueCardProgress',
  props: {
    card: {
      type: Object as () => CardProgress,
      required: true,
    },
  },
  setup(props) {
    const timelineValue = computed(() => {
      return props.card.duration.current / props.card.duration.total;
    });

    return {
      timelineValue,
    };
  },
});
</script>

<template>
  <q-card
    :dark="true"
    :flat="true"
    :bordered="true"
    class="bg-blue-grey-1 rounded-20"
    data-cy="card"
  >
    <q-img :src="card?.image">
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
            {{ card.title }}
          </component>
        </div>
        <div clas="min-w-180" data-cy="card-progress-timeline">
          <div class="text-subtitle2 text-right">
            {{ card.duration.current }} / {{ card.duration.total }}
            {{ $t('index.cardProgress.timeline') }}
          </div>
          <q-linear-progress :value="timelineValue" color="white" rounded />
        </div>
      </q-card-section>
      <q-card-section class="w-full h-full flex !q-pa-none">
        <div class="gap-16 flex flex-wrap items-center q-pa-xl">
          <div class="relative-position" data-cy="card-progress-percentage">
            <q-circular-progress
              rounded
              class="text-white q-ma-md"
              :value="card.progress"
              size="220px"
              :thickness="0.05"
              color="white"
              track-color="blue-grey-10"
              data-cy="card-progress-circular"
            >
            </q-circular-progress>
            <div class="text-white absolute-center text-center">
              <div class="text-caption">
                {{ $t('index.cardProgress.toDate') }}
              </div>
              <div class="text-h3 q-mt-xs">{{ card.progress }}&nbsp;%</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-img>
  </q-card>
</template>

<style scoped>
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
</style>
