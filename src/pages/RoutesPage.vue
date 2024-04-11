<template>
  <q-page class="overflow-hidden bg-white" data-cy="q-main">
    <div class="q-px-lg">
      <h1
        class="text-h5 q-mt-none q-pt-lg text-weight-bold"
        data-cy="routes-page-title"
      >
        {{ $t('routes.titleRoutes') }}
      </h1>
      <div data-cy="routes-page-instructions">
        <p>{{ $t('routes.instructionRouteLogTimeframe') }}</p>
        <p>{{ $t('routes.instructionRouteCombination') }}</p>
      </div>
    </div>
    <RouteTabs data-cy="route-tabs" />
  </q-page>
</template>

<script lang="ts">
// libraries
import { defineComponent } from 'vue';

// components
import RouteTabs from 'src/components/routes/RouteTabs.vue';

export default defineComponent({
  name: 'RoutesPage',
  components: {
    RouteTabs,
  },
});
</script>

<style lang="scss" scoped>
main {
  min-height: 100vh;
}
</style>
