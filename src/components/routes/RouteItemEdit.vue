<script lang="ts">
/**
 * RouteItemEdit Component
 *
 * @description * Use this component to render an item in a list with the
 * option to edit data.
 *
 * Note: This component is commonly used in `RouteListEdit`.
 *
 * @props
 * - `route` (RouteItem, required): The object representing the route.
 *   It should be of type `RouteItem`
 * - `displayLabel` (boolean, optional): Whether to display direction label.`
 *
 * @components
 * - `RouteInputTransportType`: Component to render a transport type input.
 * - `RouteInputDistance`: Component to render a distance input.
 *
 * @example
 * <route-item-edit :route="route" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104042&mode=dev)
 */

// libraries
import { computed, defineComponent, watch } from 'vue';

// components
import RouteInputDistance from './RouteInputDistance.vue';
import RouteInputTransportType from './RouteInputTransportType.vue';

// composables
import { useLogRoutes } from '../../composables/useLogRoutes';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// enums
import { TransportDirection } from '../types/Route';

// types
import type { RouteItem } from '../types/Route';

export default defineComponent({
  name: 'RouteItemEdit',
  components: {
    RouteInputDistance,
    RouteInputTransportType,
  },
  props: {
    route: {
      type: Object as () => RouteItem,
      required: true,
    },
    displayLabel: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:route'],
  setup(props, { emit }) {
    const { borderRadiusCard: borderRadius, colorGray: borderColor } =
      rideToWorkByBikeConfig;
    const routes = computed(() => [props.route]);
    const { action, distance, transportType, isShownDistance } =
      useLogRoutes(routes);

    // watcher for changes compared to the initial state (dirty)
    watch(
      [action, distance, transportType],
      ([actionNew, distanceNew, transportNew]) => {
        // if settings are the same as initial, mark dirty as false
        if (
          actionNew === (props.route?.inputType || 'input-number') &&
          Number(distanceNew) === Number(props.route?.distance || 0) &&
          transportNew === props.route?.transport
        ) {
          emit('update:route', false);
        }
        // if settings are different from initial, mark dirty as true
        else {
          emit('update:route', true);
        }
      },
    );

    const iconSize = '18px';

    return {
      action,
      borderRadius,
      borderColor,
      distance,
      iconSize,
      isShownDistance,
      transportType,
      TransportDirection,
    };
  },
});
</script>

<template>
  <div
    v-if="route"
    class="text-grey-10"
    :style="{
      'border-radius': borderRadius,
      border: `1px solid ${borderColor}`,
    }"
    data-cy="route-item-edit"
  >
    <div class="q-pa-md" data-cy="section-direction">
      <!-- Section: Direction -->
      <div
        class="flex gap-8 text-subtitle2 text-weight-bold text-grey-10"
        data-cy="label-direction"
      >
        <!-- From work -->
        <span v-if="route.direction === TransportDirection.fromWork">
          <q-icon
            name="arrow_back"
            :size="iconSize"
            data-cy="label-direction-icon"
          />
          {{ $t('routes.labelDirectionFromWork') }}
        </span>
        <!-- To work -->
        <span v-if="route.direction === TransportDirection.toWork">
          <q-icon
            name="arrow_forward"
            :size="iconSize"
            data-cy="label-direction-icon"
          />
          {{ $t('routes.labelDirectionToWork') }}
        </span>
      </div>
    </div>
    <q-separator class="q-mx-md" />
    <div class="q-pa-md" data-cy="section-transport-distance">
      <div>
        <!-- Section: Transport type -->
        <route-input-transport-type
          horizontal
          v-model="transportType"
          class="q-mt-sm"
          data-cy="section-transport"
        />
        <!-- Section: Distance -->
        <route-input-distance
          v-show="isShownDistance"
          v-model="distance"
          :modelAction="action"
          @update:modelAction="action = $event"
          class="q-mt-lg"
          data-cy="section-distance"
        />
      </div>
    </div>
  </div>
</template>
