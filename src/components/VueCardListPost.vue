<script lang="ts">
import { defineComponent } from 'vue';

// import components
import VueCardPost from './VueCardPost.vue';
import { Navigation, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';

// import types
import { CardPost, Link } from './types';

export default defineComponent({
  name: 'VueCardListPost',
  components: {
    VueCardPost,
    Swiper,
    SwiperSlide,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    cards: {
      type: Array as () => CardPost[],
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
  <div class="card-list-post relative-position" data-cy="card-list-post">
    <h2
      class="text-h6 q-mt-none text-weight-semibold"
      data-cy="card-list-post-title"
    >
      {{ title }}
    </h2>
    <swiper
      :modules="modules"
      :slides-per-view="4"
      :space-between="24"
      :breakpoints="{
        0: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        600: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      }"
      navigation
    >
      <swiper-slide
        v-for="card in cards"
        :key="card.title"
        class="swiper-slide"
      >
        <vue-card-post :card="card" data-cy="card-list-post-item" />
      </swiper-slide>
    </swiper>
    <div
      v-if="button"
      class="text-sm-center absolute-bottom"
      data-cy="card-list-post-buttons"
    >
      <q-btn
        rounded
        color="grey-10"
        unelevated
        outline
        :to="button.url"
        :label="button.title"
        class="z-1"
        data-cy="card-list-post-button"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.z-1 {
  z-index: 1;
}
.text-sm-center {
  text-align: left;
  @media (min-width: $breakpoint-sm-min) {
    text-align: center;
  }
}
.card-list-post :deep(.swiper) {
  padding-bottom: 64px;
  overflow: hidden;
}
.card-list-post :deep(.swiper-button) {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

.card-list-post :deep(.swiper-button-next),
.card-list-post :deep(.swiper-button-prev) {
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

.card-list-post :deep(.swiper-button-prev) {
  left: auto;
  right: 56px;

  &:after {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 16 16'%3E%3Cpath fill='currentColor' fill-rule='evenodd' d='M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
}
.card-list-post :deep(.swiper-button-next) {
  left: auto;
  right: 0;

  &:after {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 16 16'%3E%3Cpath fill='currentColor' fill-rule='evenodd' d='M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
