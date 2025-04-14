<template>
  <q-page class="overflow-hidden bg-white" data-cy="q-main">
    <div class="q-px-lg q-pt-lg">
      <page-heading data-cy="routes-page-title">
        {{ $t('routes.titleRoutes') }}
        <template #secondary>
          <div data-cy="routes-page-instructions">
            <p>{{ $t('routes.instructionRouteLogTimeframe') }}</p>
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
import { defineComponent, onMounted } from 'vue';

// components
import PageHeading from 'src/components/global/PageHeading.vue';
import RouteTabs from 'src/components/routes/RouteTabs.vue';

// enums
import { RouteTab } from 'src/components/types/Route';

// stores
import { useTripsStore } from 'src/stores/trips';

export default defineComponent({
  name: 'RoutesPage',
  components: {
    RouteTabs,
    PageHeading,
  },
  setup() {
    const tripsStore = useTripsStore();

    onMounted(async () => {
      if (!tripsStore.getCommuteModes.length) {
        await tripsStore.loadCommuteModes();
      }
      // if no trips, try to load them
      if (!tripsStore.routeItems.length) {
        await tripsStore.loadRoutesToStore();
      }
    });

    return {
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
