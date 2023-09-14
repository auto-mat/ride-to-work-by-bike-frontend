<script lang="ts">
// libraries
import { defineComponent } from 'vue';

// types
import { CardStats, ConfigGlobal } from './types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);

export default defineComponent({
  name: 'CardStats',
  props: {
    card: {
      type: Object as () => CardStats,
      required: true,
    },
  },
  setup() {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    return {
      borderRadius,
    };
  },
});
</script>

<template>
  <div class="q-pt-lg max-w-420">
    <q-card
      flat
      bordered
      :style="{ 'border-radius': borderRadius }"
      data-cy="card-stats"
    >
      <!-- Card icon -->
      <q-card-section avatar class="q-py-none">
        <!-- Icon -->
        <q-icon
          :name="card.icon"
          size="48px"
          class="text-blue-grey-3"
          style="margin-top: -24px"
          data-cy="card-stats-icon"
        />
      </q-card-section>

      <!-- Card title -->
      <q-card-section>
        <!-- Title -->
        <h3
          class="text-body1 text-weight-bold text-black q-mt-none q-mb-md"
          data-cy="card-stats-title"
        >
          {{ card.title }}
        </h3>
        <!-- List stats -->
        <q-list class="q-pa-none">
          <q-item
            v-for="item in card.stats"
            :key="item.id"
            class="q-px-none text-black"
            data-cy="card-stats-item"
          >
            <q-item-section avatar class="text-blue-grey-3">
              <!-- Icon -->
              <q-icon :name="item.icon" size="14px" />
            </q-item-section>
            <q-item-section>
              <!-- Label -->
              <q-item-label>
                {{ item.text }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<style>
.max-w-420 {
  max-width: 420px;
}
</style>
