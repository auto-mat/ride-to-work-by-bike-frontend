<template>
  <q-card :style="{ width: rideToWorkByBikeConfig.width }" data-cy="q-card">
    <!-- Deployed app version -->
    <q-card-section
      v-if="rideToWorkByBikeDeployedAppVersion.version"
      class="bg-primary text-white"
    >
      Deployed app Docker image version:
      <span class="text-bold">{{
        rideToWorkByBikeDeployedAppVersion.version
      }}</span>
    </q-card-section>

    <q-card-section class="bg-primary text-white" data-cy="q-card-section">
      <!-- Title -->
      <div class="text-h6" data-cy="q-card-section-title">
        <span>{{ rideToWorkByBikeConfig.title }}</span>
      </div>

      <!-- Subtitle -->
      <div class="text-subtitle2" data-cy="q-card-section-subtitle">
        {{ rideToWorkByBikeConfig.subtitle }}
      </div>

      <!-- Text -->
      <div class="q-mb-xl">
        <div>
          {{ getString('Test text') }}
        </div>
        <div
          class="text-red text-weight-bold"
          v-t="{ path: 'totalQuestions' }"
        ></div>
      </div>

      <!-- Select lang -->
      <q-select
        use-input
        fill-input
        hide-selected
        outlined
        color="secondary"
        label-color="secondary"
        bg-color="teal-1"
        v-model="$i18n.locale"
        :options="Object.keys($i18n.messages)"
        :label="$t('lang')"
        input-class="text-secondary text-weight-bold"
        style="width: 25%"
      >
        <template v-slot:prepend>
          <q-icon name="language" color="secondary" />
        </template>
      </q-select>
    </q-card-section>

    <!-- Image -->
    <q-img
      :src="`/${rideToWorkByBikeConfig.image}`"
      alt="test"
      width="100%"
      fit="contain"
      spinner-color="primary"
      data-cy="q-card-img"
    />
  </q-card>
</template>

<script lang="ts">
import { setCssVar } from 'quasar';
import { defineComponent, inject } from 'vue';

import { getString } from '../utils';

const rideToWorkByBikeConfig: object = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);

const rideToWorkByBikeDeployedAppVersion: object = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_DEPLOYED_VERSION
);

setCssVar('primary', rideToWorkByBikeConfig.primaryColor);
setCssVar('gray-light', rideToWorkByBikeConfig.colorGrayLight);

export default defineComponent({
  name: 'RideToWorkByBike',
  props: {},
  mounted() {
    if (window.Cypress) {
      window.RideToWorkByBike = this;
    }
  },
  setup() {
    const logger = inject('vuejs3-logger');
    if (process.env.DEV) {
      logger.debug('Ride to work by bike config', rideToWorkByBikeConfig);
    }
    return {
      rideToWorkByBikeConfig,
      rideToWorkByBikeDeployedAppVersion,
      logger,
      getString,
    };
  },
});
</script>
<style lang="scss" scoped></style>
