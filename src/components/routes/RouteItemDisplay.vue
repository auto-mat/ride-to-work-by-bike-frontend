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

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

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
    const { borderRadiusCard: borderRadius, colorGray: borderColor } =
      rideToWorkByBikeConfig;

    const { getRouteDistance, getRouteIcon, getTransportLabel } = useRoutes();

    return {
      borderColor,
      borderRadius,
      getRouteDistance,
      getRouteIcon,
      getTransportLabel,
    };
  },
});
</script>

<template>
  <div
    class="text-grey-10"
    data-cy="route-item-display"
    :style="{
      'border-radius': borderRadius,
      border: `1px solid ${borderColor}`,
    }"
  >
    <div data-cy="section-direction">
      <!-- Column: Direction -->
      <div
        class="flex gap-8 text-body1 text-weight-bold q-pa-md"
        data-cy="label-direction"
      >
        <!-- From work -->
        <span v-if="route.direction === 'fromWork'">
          <q-icon
            name="arrow_back"
            color="grey-10"
            size="18px"
            data-cy="label-direction-icon"
          />
          {{ $t('routes.labelDirectionFromWork') }}
        </span>
        <!-- To work -->
        <span v-if="route.direction === 'toWork'">
          <q-icon
            name="arrow_forward"
            size="18px"
            data-cy="label-direction-icon"
          />
          {{ $t('routes.labelDirectionToWork') }}
        </span>
      </div>
    </div>
    <q-separator class="q-mx-md" />
    <div data-cy="section-distance">
      <!-- Column: Distance -->
      <div class="flex items-center justify-between gap-8 q-pa-md">
        <!-- Transport type -->
        <div class="flex no-wrap items-center gap-8">
          <!-- Icon -->
          <q-avatar
            size="32px"
            :color="route.transport ? 'secondary' : 'grey-2'"
            data-cy="avatar-transport"
          >
            <q-icon
              :color="route.transport ? 'primary' : 'grey-7'"
              :name="getRouteIcon(route.transport)"
              size="18px"
              data-cy="icon-transport"
            />
          </q-avatar>
          <!-- Label -->
          <span data-cy="description-transport">
            {{ getTransportLabel(route.transport) }}
          </span>
        </div>
        <!-- Distance -->
        <div
          v-if="route.distance"
          class="text-weight-bold"
          data-cy="label-distance"
        >
          {{ getRouteDistance(route) }}
        </div>
      </div>
    </div>
  </div>
</template>
