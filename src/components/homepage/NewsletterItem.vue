<script lang="ts">
/**
 * NewsletterItem Component
 *
 * The `NewsletterItem` component displays individual newsletter option
 * with an icon, title, and follow button.
 *
 * @description
 * This component takes in a newsletter item object as a prop and displays
 * details, including an icon, title, and a button indicating whether
 * the user is following the newsletter.
 *
 * @props
 * - `item` (NewsletterItemType, required): The newsletter item to be
 *   displayed. It includes properties like icon, title, and following status.
 *
 * @example
 * <newsletter-item :item="singleNewsletter" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105656&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';

// types
import { NewsletterItem as NewsletterItemType } from '../types';

export default defineComponent({
  name: 'NewsletterItem',
  props: {
    item: {
      type: Object as () => NewsletterItemType,
      required: true,
    },
  },
  setup(props) {
    const buttonTextColor = computed((): string => {
      return props.item.following ? 'grey-10' : 'white';
    });

    return {
      buttonTextColor,
    };
  },
});
</script>

<template>
  <div
    class="flex column row-sm gap-8 no-wrap items-sm-start justify-end justify-sm-between"
    data-cy="newsletter-item"
  >
    <!-- Label section -->
    <div
      class="flex no-wrap items-center gap-8"
      data-cy="newsletter-item-content"
    >
      <!-- Icon -->
      <q-icon
        :name="item.icon"
        size="32px"
        color="blue-grey-6"
        data-cy="newsletter-item-icon"
      ></q-icon>
      <!-- Title -->
      <div
        class="text-body2 text-grey-10"
        :class="{ 'text-bold': !item.following }"
        data-cy="newsletter-item-title"
      >
        {{ item.title }}
      </div>
    </div>

    <!-- Button -->
    <q-btn
      rounded
      color="grey-10"
      :text-color="buttonTextColor"
      unelevated
      :outline="item.following"
      data-cy="newsletter-item-button"
      class="min-w-200"
    >
      <!-- Icon -->
      <q-icon
        v-show="item.following"
        name="check"
        size="18px"
        color="grey-10"
        class="q-mr-xs"
        data-cy="newsletter-item-button-icon"
      />
      <!-- Label -->
      <span v-if="item.following">
        {{ $t('index.newsletterFeature.following') }}
      </span>
      <span v-if="!item.following">
        {{ $t('index.newsletterFeature.follow') }}
      </span>
    </q-btn>
  </div>
</template>

<style scoped lang="scss">
.row-sm {
  @media (min-width: $breakpoint-sm-min) {
    flex-direction: row !important;
  }
}

.justify-sm-between {
  @media (min-width: $breakpoint-sm-min) {
    justify-content: space-between;
  }
}

.items-sm-start {
  @media (min-width: $breakpoint-sm-min) {
    align-items: flex-start;
  }
}

.min-w-200 {
  min-width: 200px;
}
</style>
