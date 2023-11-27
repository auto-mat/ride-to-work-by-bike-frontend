<script lang="ts">
/**
 * ListCardPost Component
 *
 * The `ListCardPost` component renders a list of cards that showcase
 * various offers. The items are displayed in a 3-column grid.
 *
 * @description
 * This component takes an array of card items and displays each card using
 * the `CardPost` component inside a carousel slider. Shows 4 slides per view.
 *
 * @props
 * - `title` (String): The heading or title for the list of offer cards.
 * - `cards` (Array of CardOfferType, required): An array of card items to be
 *   displayed. Each item is of type `CardOfferType`.
 * - `button` (Object of Link type): An object defining the button properties.
 *
 * @components
 * - `CardPost`: Component to render individual post cards.
 *
 * @example
 * <list-card-post
 *  :cards="postList"
 *  :title="postsTitle"
 *  :button="buttonDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105645&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';
import { Screen } from 'quasar';

// components
import CardPost from './CardPost.vue';

// types
import { CardPost as CardPostType, Link } from '../types';

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
