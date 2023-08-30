<script lang="ts">
import { defineComponent, computed } from 'vue';

// types
import { ItemBadge } from './types';

export default defineComponent({
  name: 'VueBadge',
  props: {
    badge: {
      type: Object as () => ItemBadge,
      required: true,
    },
  },
  setup(props) {
    const isDark = computed(() => {
      return props.badge.variant === 'dark';
    });

    return {
      isDark,
    };
  },
});
</script>

<template>
  <div class="flex justify-center pt-48">
    <q-card
      :dark="isDark"
      square
      :bordered="false"
      flat
      class="text-center max-w-40ch"
      :class="[isDark ? 'bg-blue-grey-7 text-white' : 'text-grey-9']"
      data-cy="badge-card"
    >
      <q-card-section avatar class="q-pa-none">
        <q-avatar
          class="-mt-48"
          size="96px"
          color="grey-3"
          data-cy="badge-image"
        >
          <img :src="badge.image" />
        </q-avatar>
      </q-card-section>
      <q-card-section class="absolute-top-right">
        <q-btn flat round icon="share" size="sm" />
      </q-card-section>
      <q-card-section class="q-pa-md" data-cy="badge-card-content">
        <h3
          class="text-subtitle2 text-weight-bold q-mb-xs"
          data-cy="badge-title"
        >
          {{ badge.title }}
        </h3>
        <p class="text-caption" data-cy="badge-description">
          {{ badge.description }}
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.max-w-40ch {
  max-width: 36ch;
}
.pt-48 {
  padding-top: 48px;
}
.-mt-48 {
  margin-top: -48px;
}
</style>
