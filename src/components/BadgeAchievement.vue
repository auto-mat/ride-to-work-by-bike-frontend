<script lang="ts">
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
          <img :src="badge.image" />
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
