<script lang="ts">
import { defineComponent } from 'vue';

// types
import { ItemBadge } from './types';

// components
import VueBadge from './VueBadge.vue';

export default defineComponent({
  name: 'VueBadgeList',
  components: {
    VueBadge,
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
    <vue-badge
      v-for="item in items"
      :key="item.title"
      :badge="item"
      class="col-6 col-md-3"
      data-cy="badge-item"
    />
  </div>
</template>
