<template>
  <q-page class="overflow-hidden bg-white" data-cy="q-main">
    <div class="q-px-lg q-pt-lg">
      <page-heading data-cy="routes-page-title">
        {{ $t('routes.titleRoutes') }}
        <template #secondary>
          <div data-cy="routes-page-instructions">
            <p>
              {{
                $t(
                  'routes.instructionRouteLogTimeframe',
                  {
                    days: daysActive,
                  },
                  daysActive,
                )
              }}
            </p>
            <p class="q-mb-none">
              {{ $t('routes.instructionRouteCombination') }}
            </p>
          </div>
        </template>
      </page-heading>
    </div>
    <route-tabs :hidden="[RouteTab.map]" data-cy="route-tabs" />
  </q-page>
</template>

<script lang="ts">
// libraries
import { computed, defineComponent, inject, onMounted } from 'vue';

// components
import PageHeading from '@/components/global/PageHeading.vue';
import RouteTabs from '@/components/routes/RouteTabs.vue';

// enums
import { RouteTab } from '@/components/types/Route';

// stores
import { useChallengeStore } from '@/stores/challenge';
import { useFeedStore } from '@/stores/feed';
import { useRegisterChallengeStore } from '@/stores/registerChallenge';
import { useTripsStore } from '@/stores/trips';

// types
import type { Logger } from '@/components/types/Logger';

export default defineComponent({
  name: 'RoutesPage',
  components: {
    RouteTabs,
    PageHeading,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const challengeStore = useChallengeStore();
    const feedStore = useFeedStore();
    const registerChallengeStore = useRegisterChallengeStore();
    const tripsStore = useTripsStore();

    const daysActive = computed<number>(() => {
      return challengeStore.getDaysActive;
    });

    onMounted(async () => {
      if (!tripsStore.getCommuteModes.length) {
        await tripsStore.loadCommuteModes();
      }
      // if no trips, try to load them
      if (!tripsStore.routeItems.length) {
        await tripsStore.loadRoutesToStore();
      }
      // city events require city slug from register challenge data
      if (!registerChallengeStore.getCityWpSlug) {
        await registerChallengeStore.loadRegisterChallengeToStore();
      }
      if (registerChallengeStore.getCityWpSlug) {
        await feedStore.attemptFeedRefresh(
          registerChallengeStore.getCityWpSlug,
        );
      } else {
        logger?.info('No city WP slug available, city events are not loaded.');
      }
    });

    return {
      daysActive,
      RouteTab,
    };
  },
});
</script>

<style lang="scss" scoped>
main {
  min-height: 100vh;
}
</style>
