<script lang="ts">
/**
 * CardPrizeSkeleton Component
 *
 * @description A skeleton loading component that mimics the structure of a CardPrize component.
 * Used to show a loading state while the actual prize data is being fetched.
 *
 * @example
 * <template v-if="isLoading">
 *   <card-prize-skeleton />
 * </template>
 */

// libraries
import { defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'CardPrizeSkeleton',
  setup() {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    return {
      borderRadius,
    };
  },
});
</script>

<template>
  <q-card flat bordered :style="{ borderRadius }" data-cy="card-prize-skeleton">
    <!-- Image -->
    <q-skeleton height="280px" animation="fade" />
    <!-- Title -->
    <q-card-section>
      <q-skeleton type="text" class="text-subtitle2" animation="fade" />
      <q-skeleton
        type="text"
        width="50%"
        class="text-subtitle2"
        animation="fade"
      />
    </q-card-section>
  </q-card>
</template>
