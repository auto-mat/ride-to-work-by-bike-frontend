<script lang="ts">
/**
 * RouteItemDisplay Component
 *
 * @description * Use this component to render an item in a list only for
 * display.
 *
 * Note: This component is commonly used in `RouteListDisplay`.
 *
 * @props
 * - `route` (RouteItem, required): The object representing the route.
 *   It should be of type `RouteItem`.
 *
 * @example
 * <route-item-display :route="route" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104042&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// types
import type { RouteItem } from '../types/Route';

// composables
import { useRoutes } from 'src/composables/useRoutes';

export default defineComponent({
  name: 'RouteItemDisplay',
  props: {
    route: {
      type: Object as () => RouteItem,
      required: true,
    },
  },
  setup() {
    const { getRouteIcon } = useRoutes();

    return {
      getRouteIcon,
    };
  },
});
</script>

<template>
  <div class="row" data-cy="route-item-display">
    <div class="col-12 col-sm-2 no-wrap" data-cy="column-direction">
      <!-- Column: Direction -->
      <div
        class="flex gap-8 text-subtitle2 text-weight-bold text-grey-10 q-pa-sm"
        data-cy="label-direction"
      >
        <!-- From work -->
        <span v-if="route.direction === 'from_work'">
          <q-icon
            name="arrow_back"
            size="18px"
            data-cy="label-direction-icon"
          />
          {{ $t('routes.labelDirectionFromWork') }}
        </span>
        <!-- To work -->
        <span v-if="route.direction === 'to_work'">
          <q-icon
            name="arrow_forward"
            size="18px"
            data-cy="label-direction-icon"
          />
          {{ $t('routes.labelDirectionToWork') }}
        </span>
      </div>
    </div>
    <div class="col-12 col-sm-10" data-cy="column-distance">
      <!-- Column: Distance -->
      <div class="flex items-center justify-between gap-8 q-pa-sm bg-grey-2">
        <!-- Transport type -->
        <div v-if="route.transport" class="flex no-wrap items-center gap-8">
          <!-- Icon -->
          <q-icon
            :name="getRouteIcon(route.transport)"
            size="24px"
            data-cy="icon-transport"
          />
          <!-- Label -->
          <span data-cy="description-transport">
            {{ $t(`routes.transport.${route.transport}`) }}
          </span>
        </div>
        <!-- Distance -->
        <div v-if="route.distance" data-cy="label-distance">
          {{ route.distance }} {{ $t('global.km') }}
        </div>
      </div>
    </div>
  </div>
</template>
