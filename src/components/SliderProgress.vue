<script lang="ts">
import { defineComponent } from 'vue';
import { Navigation, A11y } from 'swiper/modules';

// types
import { CardProgress, Link, ItemStatistics } from './types';

// components
import { Swiper, SwiperSlide } from 'swiper/vue';
import VueCardProgressSlider from './VueCardProgressSlider.vue';

export default defineComponent({
  name: 'SliderProgress',
  components: {
    Swiper,
    SwiperSlide,
    VueCardProgressSlider,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    stats: {
      type: Array as () => ItemStatistics[],
    },
    cards: {
      type: Array as () => CardProgress[],
      required: true,
    },
    button: {
      type: Object as () => Link,
      required: false,
    },
  },
  setup() {
    return {
      modules: [Navigation, A11y],
    };
  },
});
</script>

<template>
  <div class="progress-slider relative-position" data-cy="progress-slider">
    <div class="flex flex-wrap items-center justify-between gap-x-40">
      <h2 class="text-h6" data-cy="progress-slider-title">{{ title }}</h2>
      <q-list class="flex flex-wrap items-center q-p-none gap-x-40">
        <q-item v-for="item in stats" :key="item.icon" data-cy="progress-slider-stats-item" class="text-grey-10">
          <q-icon :name="item.icon" color="blue-grey-3" size="18px" />&nbsp;
          <strong>{{ item.value }}</strong>&nbsp;
          <span>{{ item.label }}</span>
        </q-item>
      </q-list>
    </div>
    <div>
      <swiper navigation :modules="modules" :slides-per-view="1" :space-between="24" class="overflow-visible"
        data-cy="progress-slider-swiper">
        <swiper-slide v-for="card in cards" :key="card.title" class="swiper-slide">
          <vue-card-progress-slider :card="card" />
        </swiper-slide>
      </swiper>
    </div>
    <div v-if="button" class="text-center absolute-bottom">
      <q-btn rounded color="grey-10" unelevated outline :to="button.url" :label="button.title"
        data-cy="progress-slider-button" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
// .overflow-visible {
//   overflow: visible;
// }

.gap-x-40 {
  column-gap: 40px;
}

// Progress slider: next card indication (mobile)
.progress-slider :deep(.swiper) {
  max-width: 90%;
  margin-left: 0;
  padding-bottom: 64px;

  @media (min-width: $breakpoint-md-min) {
    max-width: 100%;
  }
}

// Progress slider buttons
.progress-slider :deep(.swiper-button-next),
.progress-slider :deep(.swiper-button-prev) {
  display: none;

  @media (min-width: $breakpoint-md-min) {
    display: block;
    border-radius: 9999px;
    top: auto;
    bottom: 0;
    width: 38px;
    height: 38px;
    color: $grey-10;
    background-color: #fff;
    border: 1px solid $grey-10;

    &:after {
      width: 32px;
      height: 32px;
      content: '';
    }

    &.swiper-button-disabled {
      opacity: 1;
      border-color: $grey-5;

      &:after {
        opacity: 0.35;
      }
    }
  }
}

.progress-slider :deep(.swiper-button-prev) {
  left: auto;
  right: 56px;

  &:after {
    display: block;
    width: 36px;
    height: 36px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 16 16'%3E%3Cpath fill='currentColor' fill-rule='evenodd' d='M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
}

.progress-slider :deep(.swiper-button-next) {
  left: auto;
  right: 0;

  &:after {
    display: block;
    width: 36px;
    height: 36px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 16 16'%3E%3Cpath fill='currentColor' fill-rule='evenodd' d='M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
