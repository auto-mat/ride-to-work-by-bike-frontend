<script lang="ts">
/**
 * RouteApp Component
 *
 * @description * Use this component to render the App view in `RouteTabs`.
 *
 * @components
 * - `CHILD`: Component to ... .
 *
 * @example
 * <route-app></route-app>
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5190%3A125828&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RouteApp',
});
</script>

<template>
  <div data-cy="route-app">
    <h2 class="text-h6 text-black" data-cy="route-app-title">
      {{ $t('routes.titleTabApp') }}
    </h2>
    <p class="" data-cy="route-app-hint">{{ $t('routes.hintTabApp') }}</p>
  </div>
</template>
