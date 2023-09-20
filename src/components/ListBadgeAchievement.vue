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
  <div class="row q-col-gutter-lg">
    <div
      v-for="item in items"
      :key="item.title"
      class="col-12 col-sm-6 col-lg-3"
    >
      <badge-achievement
        :badge="item"
        data-cy="badge-item"
        class="full-width"
      />
    </div>
  </div>
</template>
