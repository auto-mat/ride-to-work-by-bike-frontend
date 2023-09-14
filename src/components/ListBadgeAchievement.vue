<script lang="ts">
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
  <div class="row q-gutter-lg">
    <badge-achievement
      v-for="item in items"
      :key="item.title"
      :badge="item"
      class="col-6 col-md-3"
      data-cy="badge-item"
    />
  </div>
</template>
