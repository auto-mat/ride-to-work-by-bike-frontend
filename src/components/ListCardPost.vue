<script lang="ts">
// libraries
import { defineComponent, computed } from 'vue';
import { Screen } from 'quasar';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, A11y } from 'swiper/modules';

// components
import CardPost from './CardPost.vue';

// types
import { CardPost as CardPostType, Link } from './types';

export default defineComponent({
  name: 'ListCardPost',
  components: {
    Swiper,
    SwiperSlide,
    CardPost,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    cards: {
      type: Array as () => CardPostType[],
      required: true,
    },
    button: {
      type: Object as () => Link,
      required: false,
    },
  },
  setup() {
    const isLargeScreen = computed((): boolean => {
      return Screen.gt.sm;
    });

    const buttonWidth = computed((): string => {
      return isLargeScreen.value ? 'auto' : '100%';
    });

    return {
      buttonWidth,
      modules: [Navigation, A11y],
    };
  },
});
</script>

<template>
  <!-- Component displaying a slider with news -->
  <!-- Internal Figma link: https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105611&mode=design&t=x3DpoanmIFk5i6MU-1 -->
  <div class="relative-position" data-cy="card-list-post">
    <!-- Title -->
    <h2
      class="text-h6 q-mt-none text-weight-semibold"
      data-cy="card-list-post-title"
    >
      {{ title }}
    </h2>
    <!-- Swiper for news cards -->
    <swiper
      navigation
      :modules="modules"
      :slides-per-view="4"
      :space-between="24"
      :breakpoints="{
        0: {
          slidesPerView: 1,
          spaceBetween: 24,
        },
        600: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
        1440: {
          slidesPerView: 4,
        },
      }"
      class="overflow-visible overflow-lg-hidden"
    >
      <swiper-slide
        v-for="(card, index) in cards"
        :key="`${card.title}-${index}`"
        class="swiper-slide"
      >
        <card-post :card="card" data-cy="card-list-post-item" />
      </swiper-slide>
    </swiper>
    <!-- Link to more news -->
    <div
      v-if="button"
      class="text-center absolute-bottom"
      data-cy="card-list-post-buttons"
    >
      <q-btn
        rounded
        unelevated
        outline
        color="grey-10"
        class="z-1"
        :to="button.url"
        :label="button.title"
        :style="{ width: buttonWidth }"
        data-cy="card-list-post-button"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.z-1 {
  z-index: 1;
}

// Display overflowing: next card indication (mobile)
.swiper.overflow-visible {
  overflow: visible;
}

// Default overflow to test as standalone (desktop)
.swiper.overflow-lg-hidden {
  @media (min-width: $breakpoint-lg-min) {
    overflow: hidden;
  }
}

// Styles for Swiper.js
.swiper {
  max-width: 90%;
  margin-left: 0;
  padding-bottom: 64px;

  @media (min-width: $breakpoint-md-min) {
    max-width: 100%;
  }
}

:deep(.swiper-button) {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  border-radius: 9999px;
  top: auto;
  bottom: 0;
  width: 38px;
  height: 38px;
  color: $grey-10;
  background-color: #fff;
  border: 1px solid $grey-10;

  visibility: hidden;

  @media (min-width: $breakpoint-md-min) {
    visibility: visible;
  }

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

:deep(.swiper-button-prev) {
  left: auto;
  right: 56px;

  &:after {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 16 16'%3E%3Cpath fill='currentColor' fill-rule='evenodd' d='M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
}

:deep(.swiper-button-next) {
  left: auto;
  right: 0;

  &:after {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 16 16'%3E%3Cpath fill='currentColor' fill-rule='evenodd' d='M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
