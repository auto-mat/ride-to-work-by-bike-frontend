<script lang="ts">
import { defineComponent } from 'vue';
import { Navigation, A11y } from 'swiper/modules';

// types
import { CardProgress, Link, ItemStatistics } from './types';

// components
import { Swiper, SwiperSlide } from 'swiper/vue';
import VueCardProgressSlider from './VueCardProgressSlider.vue';

export default defineComponent({
  name: 'VueProgressSlider',
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
    <div class="flex flex-wrap items-center justify-between gap-x-40 gap-y-16">
      <h2 class="text-h6" data-cy="progress-slider-title">{{ title }}</h2>
      <q-list
        class="list-unstyled flex flex-wrap items-center q-p-none gap-x-40 gap-y-16"
      >
        <q-item
          v-for="item in stats"
          :key="item.icon"
          data-cy="progress-slider-stats-item"
          class="text-grey-10"
        >
          <q-icon :name="item.icon" color="blue-grey-3" size="18px" />&nbsp;
          <strong>{{ item.value }}</strong
          >&nbsp;
          <span>{{ item.label }}</span>
        </q-item>
      </q-list>
    </div>
    <div>
      <div class="q-mt-lg">
        <swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="24"
          navigation
          data-cy="progress-slider-swiper"
        >
          <swiper-slide
            v-for="card in cards"
            :key="card.title"
            class="swiper-slide"
          >
            <vue-card-progress-slider :card="card" />
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div v-if="button" class="text-sm-center absolute-bottom">
      <q-btn
        rounded
        color="grey-10"
        unelevated
        outline
        :to="button.url"
        :label="button.title"
        class="z-1"
        data-cy="progress-slider-button"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.z-1 {
  z-index: 1;
}

.text-sm-center {
  text-align: left;

  @media (min-width: $breakpoint-sm-min) {
    text-align: center;
  }
}

.list-unstyled {
  list-style: none;
}

.gap-x-40 {
  row-gap: 40px;
}

.gap-y-16 {
  column-gap: 16px;
}

.progress-slider :deep(.swiper) {
  padding-bottom: 64px;
  overflow: hidden;
}

.progress-slider :deep(.swiper-button) {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

.progress-slider :deep(.swiper-button-next),
.progress-slider :deep(.swiper-button-prev) {
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

.progress-slider :deep(.swiper-button-prev) {
  left: auto;
  right: 56px;

  &:after {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 16 16'%3E%3Cpath fill='currentColor' fill-rule='evenodd' d='M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
}

.progress-slider :deep(.swiper-button-next) {
  left: auto;
  right: 0;

  &:after {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 16 16'%3E%3Cpath fill='currentColor' fill-rule='evenodd' d='M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
