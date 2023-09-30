<script lang="ts">
/**
 * ListCardPost Component
 *
 * The `ListCardPost` component displays a slider with news cards.
 *
 * @description
 * Use this component to create a list of news cards with a slider. On mobile screens, it will show a part of the last element to indicate swipe action.
 *
 * @props
 * - `title` (String, required): The title for the list of news cards.
 * - `cards` (Array, required): An array of news card objects.
 * - `button` (Object, optional): An object representing a link/button to navigate to more news.
 *
 * @example
 * <list-card-post
 *   title="Latest News"
 *   :cards="newsCards"
 *   :button="readMoreLink"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105611&mode=design&t=x3DpoanmIFk5i6MU-1)
 */

// libraries
import { defineComponent, computed } from 'vue';
import { Screen } from 'quasar';
import { register } from 'swiper/element/bundle';

// components
import CardPost from './CardPost.vue';

// types
import { CardPost as CardPostType, Link } from './types';

export default defineComponent({
  name: 'ListCardPost',
  components: {
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
    // initialize swiper
    register();

    const isLargeScreen = computed((): boolean => {
      return Screen.gt.sm;
    });

    const buttonWidth = computed((): string => {
      return isLargeScreen.value ? 'auto' : '100%';
    });

    return {
      buttonWidth,
    };
  },
});
</script>

<template>
  <div class="relative-position" data-cy="card-list-post">
    <!-- Title -->
    <h2
      class="text-h6 q-mt-none text-weight-semibold"
      data-cy="card-list-post-title"
    >
      {{ title }}
    </h2>
    <!-- Swiper for news cards -->
    <swiper-container
      :navigation="true"
      :slides-per-view="4"
      :space-between="24"
      :breakpoints="{
        0: {
          slidesPerView: 1.2,
          spaceBetween: 24,
        },
        600: {
          slidesPerView: 2.2,
        },
        1024: {
          slidesPerView: 3,
        },
        1440: {
          slidesPerView: 4,
        },
      }"
      data-cy="swiper-container"
    >
      <swiper-slide
        v-for="(card, index) in cards"
        :key="`${card.title}-${index}`"
        class="swiper-slide"
      >
        <card-post :card="card" data-cy="card-list-post-item" />
      </swiper-slide>
    </swiper-container>
    <!-- Link to more news -->
    <div
      v-if="button"
      class="text-center q-pt-md"
      data-cy="card-list-post-buttons"
    >
      <q-btn
        rounded
        unelevated
        outline
        color="grey-10"
        :to="button.url"
        :label="button.title"
        :style="{ width: buttonWidth }"
        data-cy="card-list-post-button"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">

// Styles for Swiper.js
swiper-container::part(container) {
  overflow: visible;
}

swiper-container::part(button-prev),
swiper-container::part(button-next) {
  border-radius: 9999px;
  top: auto;
  bottom: -54px;
  width: 38px;
  height: 38px;
  color: transparent;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid $grey-10;
  visibility: hidden;

  @media (min-width: $breakpoint-md-min) {
    visibility: visible;
  }
}

swiper-container::part(button-prev) {
  left: auto;
  right: 56px;
  background-image: url("../assets/svg/mdi-arrow-back.svg");
}

swiper-container::part(button-next) {
  left: auto;
  right: 0;
  background-image: url("../assets/svg/mdi-arrow-forward.svg");
}
</style>
