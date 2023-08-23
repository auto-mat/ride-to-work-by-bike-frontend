<script lang="ts">
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
      required: true,
    },
  },
  setup() {
    const isLargeScreen = useMediaQuery('(min-width: 600px)');

    const circleSize = computed(() => {
      return isLargeScreen.value ? '220px' : '128px';
    });

    const isFirst = (card: CardProgress): boolean => {
      const prizes = card.prizes;
      const firstPrize = prizes?.filter(
        (item: ItemPrize) => item.placement === 1
      ).length;
      return firstPrize ? true : false;
    };

    return {
      circleSize,
      isFirst,
    };
  },
});
</script>

<template>
  <q-card
    :flat="true"
    :dark="isFirst(card)"
    :bordered="true"
    class="rounded-20"
    :class="
      isFirst(card) ? 'bg-blue-grey-6 text-white' : 'bg-white text-grey-10'
    "
    data-cy="card"
  >
    <q-card-section
      class="flex items-center justify-center gap-16 z-1"
      data-cy="card-progress-header"
    >
      <div class="flex items-center gap-16 text-body1">
        <q-icon
          :name="card.icon"
          size="18px"
          :color="isFirst(card) ? 'white' : 'blue-grey-5'"
        />
        <component
          :is="card.url ? 'a' : 'div'"
          :href="card.url"
          class="text-weight-bold"
          :class="isFirst(card) ? 'text-white' : 'text-grey-10'"
          data-cy="card-progress-title"
        >
          <h3 class="text-body1 text-weight-bold">{{ card.title }}</h3>
        </component>
      </div>
    </q-card-section>
    <q-card-section>
      <div
        class="gap-16 justify-center items-center"
        data-cy="card-progress-content"
      >
        <div
          class="relative-position flex justify-center"
          data-cy="card-progress-percentage"
        >
          <q-circular-progress
            rounded
            class="q-my-md q-mx-auto"
            :value="card.progress"
            :size="circleSize"
            :thickness="0.08"
            :color="isFirst(card) ? 'white' : 'blue-grey-6'"
            :track-color="isFirst(card) ? 'blue-grey-4' : 'blue-grey-2'"
            data-cy="card-progress-circular"
          >
          </q-circular-progress>
          <div class="absolute-center text-center">
            <div class="text-circular-progress q-mt-xs">
              {{ card.progress }}%
            </div>
          </div>
        </div>
        <q-list dense class="q-mb-sm">
          <q-item
            v-for="(prize, index) in card.prizes"
            :key="'prize' + index"
            class="prizes-value min-h-36 flex items-center justify-center !q-pa-none"
            data-cy="card-progress-prizes"
          >
            <q-icon
              :name="prize.icon"
              size="24px"
              color="white"
              data-cy="card-progress-prizes-icon"
            />&nbsp;
            <div class="flex items-baseline">
              <span
                class="text-weight-bold"
                :class="{ 'text-h5': isFirst(card) }"
                data-cy="card-progress-prize-placement"
                >{{ prize.placement }}</span
              >.&nbsp;
              <span data-cy="card-progress-prize-label">{{ prize.label }}</span
              >&nbsp;
            </div>
          </q-item>
        </q-list>
      </div>

      <q-separator
        :color="isFirst(card) ? 'blue-grey-7' : 'blue-grey-1'"
        data-cy="card-progress-separator"
      />

      <q-list dense class="q-mt-md">
        <q-item
          clickable
          :to="card.url"
          class="justify-center items-center text-uppercase text-weight-bold q-py-sm rounded-20"
          data-cy="card-progress-share"
        >
          <q-icon
            name="share"
            size="18px"
            :color="isFirst(card) ? 'white' : 'grey-10'"
            class="q-mr-xs"
            data-cy="card-progress-share-icon"
          />
          <span
            class="leading-1"
            :class="isFirst(card) ? 'text-white' : 'text-grey-10'"
            >{{ $t('index.cardProgress.share') }}</span
          >
        </q-item>
      </q-list>
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

.leading-1 {
  line-height: 1;
}

.z-1 {
  z-index: 1;
}

.rounded-20 {
  border-radius: 20px;
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

.\!q-pa-none {
  padding: 0 !important;
}
</style>
