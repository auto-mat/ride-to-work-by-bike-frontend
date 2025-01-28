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
 * If not subscribed, the button links to an Ecomail newsletter subscription.
 *
 * @props
 * - `modelValue` (Array<NewsletterType>, required): Array of newsletter IDs
 *    that the user is currently subscribed to.
 * - `item` (NewsletterItemType, required): The newsletter item to display.
 * - `loading` (Boolean, optional): Whether the component is in loading state,
 *    disabling the toggle button. Defaults to false.
 *
 * @emits
 * - `update:modelValue`: Emitted when the subscription state changes.
 *    Payload is the new array of subscribed newsletter IDs.
 *
 * @example
 * <newsletter-item v-model="followedNewsletters" :item="newsletterItem" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105656&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';
import { colors } from 'quasar';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import { NewsletterItem as NewsletterItemType, NewsletterType } from '../types';

const { getPaletteColor, changeAlpha } = colors;

export default defineComponent({
  name: 'NewsletterItem',
  props: {
    modelValue: {
      type: Array as () => NewsletterType[],
      required: true,
    },
    item: {
      type: Object as () => NewsletterItemType,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const model = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });

    const colorPrimaryOpacity = changeAlpha(
      getPaletteColor('primary'),
      rideToWorkByBikeConfig.colorPrimaryOpacity,
    );

    const avatarSize = '38px';
    const iconSize = '18px';

    const isFollowing = computed(() => {
      return model.value.includes(props.item.id);
    });

    return {
      avatarSize,
      colorPrimaryOpacity,
      iconSize,
      model,
      isFollowing,
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
      class="flex no-wrap items-center gap-12"
      data-cy="newsletter-item-content"
    >
      <q-avatar
        :size="avatarSize"
        :style="{ background: colorPrimaryOpacity }"
        data-cy="newsletter-item-avatar"
      >
        <!-- Icon -->
        <q-icon
          :name="item.icon"
          :size="iconSize"
          color="primary"
          data-cy="newsletter-item-icon"
        ></q-icon>
      </q-avatar>
      <!-- Title -->
      <div class="text-body2 text-grey-10" data-cy="newsletter-item-title">
        {{ item.title }}
      </div>
    </div>
    <!-- Button -->
    <q-toggle
      v-model="model"
      :val="item.id"
      :disable="loading"
      color="primary"
      class="min-w-200"
      data-cy="newsletter-item-toggle"
    >
      <!-- Icon -->
      <q-icon
        v-show="isFollowing"
        name="check"
        :size="iconSize"
        color="grey-10"
        class="q-mr-xs"
        data-cy="newsletter-follow-icon"
      />
      <!-- Label -->
      <span v-if="isFollowing">
        {{ $t('index.newsletterFeature.following') }}
      </span>
      <span v-if="!isFollowing">
        {{ $t('index.newsletterFeature.follow') }}
      </span>
    </q-toggle>
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
