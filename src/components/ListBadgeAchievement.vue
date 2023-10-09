<script lang="ts">
/**
 * ListBadgeAchievement Component
 *
 * The `ListBadgeAchievement` component renders a list of badges that represent
 * various achievements.
 *
 * @description
 * This component takes an array of badge items and displays each badge using
 * the `BadgeAchievement` component. Items are displayed in a 4 col grid.
 *
 * @props
 * - `items` (Array of ItemBadge, required): An array of badge items to be
 *   displayed. Each item is of type `ItemBadge`.
 *
 * @components
 * - `BadgeAchievement`: Component to render individual achievement badges.
 *
 * @example
 * <list-badge-achievement :items="badgeList" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A106380&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// types
import { ItemBadge } from './types';

// components
import BadgeAchievement from './BadgeAchievement.vue';

export default defineComponent({
  name: 'ListBadgeAchievement',
  components: {
    BadgeAchievement,
  },
  props: {
    items: {
      type: Array as () => ItemBadge[],
      required: true,
    },
  },
});
</script>

<template>
  <div class="row q-col-gutter-lg">
    <div
      v-for="item in items"
      :key="item.title"
      class="col-12 col-sm-6 col-lg-3"
      data-cy="badge-item"
    >
      <badge-achievement :badge="item" class="full-width" />
    </div>
  </div>
</template>
