<script lang='ts'>
// libraries
import { defineComponent, computed } from 'vue';
import { useMediaQuery } from '@vueuse/core';

// types
import { CardProgress, ItemPrize } from './types';

export default defineComponent({
  name: 'VueCardProgress',
  props: {
    card: {
      type: Object as () => CardProgress,
      required: true
    }
  },
  setup() {
    const isLargeScreen = useMediaQuery('(min-width: 600px)')

    const circleSize = computed(() => {
      return isLargeScreen.value ? '220px' : '128px';
    })

    const isFirst = (prize: ItemPrize) => {
      return prize.placement === 1
    }

    return {
      circleSize,
      isFirst
    }
  }
})
</script>

<template>
  <q-card
    :flat="true"
    :bordered="true"
    class="bg-white text-grey-10 rounded-20"
    data-cy="card"
  >
    <q-card-section
      class="flex items-center justify-center gap-16 z-1"
      data-cy="card-progress-header"
    >
      <div class="flex items-center gap-16 text-body1">
        <q-icon :name="card.icon" size="18px" color="blue-grey-5" />
        <component
          :is="card.url ? 'a' : 'div'"
          :href="card.url"
          class="text-grey-10 text-weight-bold"
          data-cy="card-progress-title"
        >
          <h3 class="text-body1 text-weight-bold">{{ card.title }}</h3>
        </component>
      </div>
    </q-card-section>
    <q-card-section class="w-full card-image-section-content">
      <div class="gap-16 justify-center items-center" data-cy="card-progress-content">
        <div class="relative-position" data-cy="card-progress-percentage">
          <q-circular-progress
            rounded
            class="q-ma-md"
            :value="card.progress"
            :size="circleSize"
            :thickness="0.08"
            color="blue-grey-6"
            track-color="blue-grey-2"
            data-cy="card-progress-circular"
          >
          </q-circular-progress>
          <div class="absolute-center text-center">
            <div class="text-circular-progress q-mt-xs">{{ card.progress }}%</div>
          </div>
        </div>
        <q-list dense>
          <q-item v-for="(prize, index) in card.prizes" :key="'prize' + index" class="prizes-value min-h-36 flex items-center justify-center !q-pa-none" data-cy="card-progress-prizes">
            <q-icon :name="prize.icon" size="24px" color="blue-grey-5" />&nbsp;
            <div class="flex items-baseline">
              <span class="text-weight-bold" :class="{ 'text-h5': isFirst(prize) }" data-cy="card-progress-prize-placement">{{ prize.placement }}</span>.&nbsp;
              {{ prize.label }}&nbsp;
            </div>
          </q-item>
        </q-list>
      </div>

      <q-separator color="blue-grey-8" />

      <div class="card-image-section-content" data-cy="card-progress-footer-mobile">
        Share
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss">
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
.min-h-36 {
  min-height: 36px;
}
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
</style>
