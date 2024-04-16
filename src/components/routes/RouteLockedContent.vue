<script lang="ts">
/**
 * RouteLockedContent Component
 *
 * @description * Use this component to display information in routes tab
 * when route is locked.
 *
 * @example
 * <route-locked-content></route-locked-content>
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A106366&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'RouteLockedContent',
  setup() {
    const { urlVideoLoggingRoutes } = rideToWorkByBikeConfig;

    return {
      urlVideoLoggingRoutes,
    };
  },
});
</script>

<template>
  <div data-cy="route-locked-content">
    <div class="text-center text-subtitle2">
      <p class="text-black" data-cy="route-locked-hint-section">
        {{ $t('routes.hintLockedSection') }}
      </p>
      <p class="text-black text-weight-bold" data-cy="route-locked-hint-video">
        {{ $t('routes.hintWatchVideo') }}
      </p>
    </div>
    <q-video
      :ratio="16 / 9"
      :src="urlVideoLoggingRoutes"
      class="q-mt-lg"
      data-cy="route-locked-video"
    />
  </div>
</template>
