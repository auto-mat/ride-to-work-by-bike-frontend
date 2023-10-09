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

// types
import { ItemBadge } from './types';

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

    return {
      isDark,
    };
  },
});
</script>

<template>
  <div class="full-width flex column pt-48">
    <q-card
      :dark="isDark"
      square
      :bordered="false"
      flat
      class="full-width col-grow text-center"
      :class="[isDark ? 'bg-blue-grey-7 text-white' : 'text-grey-9']"
      data-cy="badge-card"
    >
      <!-- Image -->
      <q-card-section avatar class="q-pa-none">
        <q-avatar
          class="mt--48"
          size="96px"
          color="grey-3"
          data-cy="badge-image"
        >
          <q-img :src="badge.image" alt="" ratio="1" />
        </q-avatar>
      </q-card-section>
      <!-- Share link -->
      <q-card-section class="absolute-top-right">
        <q-btn flat round icon="share" size="sm" />
      </q-card-section>
      <!-- Content -->
      <q-card-section class="q-pa-md" data-cy="badge-card-content">
        <!-- Title -->
        <h3
          class="text-subtitle2 text-weight-bold q-mb-xs"
          data-cy="badge-title"
        >
          {{ badge.title }}
        </h3>
        <!-- Description -->
        <p class="text-caption" data-cy="badge-description">
          {{ badge.description }}
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.pt-48 {
  padding-top: 48px;
}

.mt--48 {
  margin-top: -48px;
}
</style>
