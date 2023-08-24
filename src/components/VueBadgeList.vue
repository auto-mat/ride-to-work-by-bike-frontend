<script lang='ts'>
import { defineComponent } from 'vue';

// types
import { ItemBadge } from './types';

export default defineComponent({
  name: 'VueBadgeList',
  props: {
    items: {
      type: Array as () => ItemBadge[],
      required: true,
    }
  }
})
</script>

<template>
  <div class="row">
    <div v-for="item in items" :key="item.title" class="col-6 col-md-3" data-cy="badge-item">
      <div class="flex justify-center">
        <div class="text-grey-9 text-center q-pa-sm max-w-40ch">
          <q-avatar size="96px" color="grey-3" data-cy="badge-item-image">
            <img :src="item.image" />
          </q-avatar>
          <h3 class="text-subtitle2 text-weight-bold q-mb-xs" data-cy="badge-item-title">{{ item.title }}</h3>
          <p class="text-caption" data-cy="badge-item-description">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.max-w-40ch {
  max-width: 36ch;
}
</style>
