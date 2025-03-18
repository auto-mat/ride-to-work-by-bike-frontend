<script lang="ts">
/**
 * CardOfferSkeleton Component
 *
 * @description A skeleton loading component that mimics the structure of a CardOffer component.
 * Used to show a loading state while the actual offer data is being fetched.
 *
 * @example
 * <template v-if="isLoading">
 *   <card-offer-skeleton />
 * </template>
 */

// libraries
import { defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'CardOfferSkeleton',
  setup() {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    return {
      borderRadius,
    };
  },
});
</script>

<template>
  <q-card
    flat
    bordered
    class="q-pa-sm"
    :style="{ borderRadius }"
    data-cy="card-offer-skeleton"
  >
    <q-item>
      <!-- Avatar -->
      <q-item-section avatar>
        <q-skeleton type="QAvatar" size="48px" animation="fade" />
      </q-item-section>
      <!-- Title -->
      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" animation="fade" />
          <q-skeleton type="text" animation="fade" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>
