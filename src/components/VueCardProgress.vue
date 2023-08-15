<script lang='ts'>
import { defineComponent, computed } from 'vue';

// types
import { CardProgress } from './types';

export default defineComponent({
  name: 'VueCardProgress',
  props: {
    card: {
      type: Object as () => CardProgress,
      required: true
    }
  },
  setup(props) {
    const timelineValue = computed(() => {
      return props.card.duration.current / props.card.duration.total;
    })

    return {
      timelineValue
    }
  }
})
</script>

<template>
  <q-card
    :dark="true"
    :flat="true"
    :bordered="true"
    class="rounded-20"
    data-cy="card"
  >
    <q-img :src="card?.image" :ratio="7 / 8">
      <q-card-section
        class="absolute-top flex items-center justify-between gap-16"
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
            {{ card.duration.current }} / {{ card.duration.total }} {{ $t('index.cardProgress.timeline') }}
          </div>
          <q-linear-progress :value="timelineValue" color="white" />
        </div>
      </q-card-section>
      <div
        v-if="card.dates"
        class="absolute-bottom text-center text-body2"
        data-cy="card-dates"
      >
        {{ $t('index.cardChallenge.dates') }}
        <span class="text-weight-bold">{{ card.dates }}</span>
      </div>
    </q-img>

    <div class="badge-wrapper" data-cy="card-company-wrapper">
      <q-badge
        v-if="card.company"
        class="text-caption q-px-sm bg-blue-grey-4"
        text-color="white"
        rounded
        data-cy="card-company"
      >
        {{ $t('index.cardChallenge.company') }}
      </q-badge>
    </div>
  </q-card>
</template>

<style scoped>
.gap-16 {
  gap: 16px;
}
.min-w-180 {
  min-width: 180px;
}
</style>
