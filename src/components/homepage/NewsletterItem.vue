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
 * - `item` (NewsletterItemType, required): The newsletter item to be
 *   displayed. It includes properties like icon, title, and following status.
 *
 * @emits
 * - `follow` - Event indicating the user's choice to subscribe.
 *
 * @example
 * <newsletter-item :item="singleNewsletter" @follow="onFollow" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105656&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';
import { colors } from 'quasar';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import { NewsletterItem as NewsletterItemType } from '../types';

const { getPaletteColor, changeAlpha } = colors;

export default defineComponent({
  name: 'NewsletterItem',
  props: {
    item: {
      type: Object as () => NewsletterItemType,
      required: true,
    },
  },
  emits: ['follow'],
  setup(props, { emit }) {
    const buttonColor = computed((): string => {
      return props.item.following ? 'grey-10' : 'primary';
    });

    const colorPrimaryOpacity = changeAlpha(
      getPaletteColor('primary'),
      rideToWorkByBikeConfig.colorPrimaryOpacity,
    );

    const onFollow = (): void => {
      emit('follow');
    };

    const avatarSize = '38px';
    const iconSize = '18px';

    return {
      avatarSize,
      buttonColor,
      colorPrimaryOpacity,
      iconSize,
      onFollow,
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
    <q-btn
      rounded
      unelevated
      :href="item.url"
      :color="buttonColor"
      :outline="item.following"
      :disable="item.following"
      class="min-w-200"
      target="_blank"
      @click="onFollow"
      data-cy="newsletter-item-button"
    >
      <!-- Icon -->
      <q-icon
        v-show="item.following"
        name="check"
        :size="iconSize"
        color="grey-10"
        class="q-mr-xs"
        data-cy="newsletter-follow-icon"
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
