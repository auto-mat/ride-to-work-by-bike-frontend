<script lang="ts">
/**
 * BadgeAchievement Component
 *
 * The `BadgeAchievement` component displays a badge to represent an
 * achievement.
 *
 * @description
 * Use this component to show a badge for various achievements. It can adjust
 * its appearance based on the badge's variant.
 * Badge has an image and a link for sharing.
 *
 * Note: This component is commonly used within the `ListBadgeAchievement`
 * component.
 *
 * @props
 * - `badge` (Object, required): The badge object representing the achievement.
 *   It should be of type `ItemBadge`.
 *
 * @example
 * <badge-achievement
 *   :badge="achievementBadge"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104259&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import { ItemBadge } from '../types';

export default defineComponent({
  name: 'BadgeAchievement',
  props: {
    badge: {
      type: Object as () => ItemBadge,
      required: true,
    },
  },
  setup(props) {
    const isDark = computed((): boolean => {
      return props.badge.variant === 'dark';
    });

    const { borderRadiusCard, maxWidthBanner } = rideToWorkByBikeConfig;

    return {
      borderRadiusCard,
      isDark,
      maxWidthBanner,
    };
  },
});
</script>

<template>
  <div class="full-width flex column">
    <q-card
      :dark="isDark"
      bordered
      flat
      class="full-width col-grow text-center"
      :class="[isDark ? 'bg-primary text-white' : 'bg-white text-grey-10']"
      :style="{
        'border-radius': borderRadiusCard,
        'max-width': maxWidthBanner,
      }"
      data-cy="badge-card"
    >
      <!-- Image -->
      <q-card-section avatar class="q-pb-none">
        <q-avatar size="96px" color="grey-3" data-cy="badge-image">
          <q-img :src="badge.image" alt="" ratio="1" />
        </q-avatar>
      </q-card-section>
      <!-- Share link -->
      <q-card-section class="absolute-top-right">
        <q-btn dense flat round data-cy="badge-share-button">
          <q-icon size="18px" name="share" data-cy="badge-share-icon" />
        </q-btn>
      </q-card-section>
      <!-- Content -->
      <q-card-section data-cy="badge-card-content">
        <!-- Title -->
        <h3
          class="text-subtitle2 text-weight-bold q-my-none"
          data-cy="badge-title"
        >
          {{ badge.title }}
        </h3>
        <!-- Description -->
        <p class="text-caption q-mt-xs q-mb-none" data-cy="badge-description">
          {{ badge.description }}
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>
