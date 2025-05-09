<script lang="ts">
/**
 * CalendarItemDisplay Component
 *
 * @description * Use this component to display a single route item in
 * the calendar.
 * You can adjust its appearance by specifying the `to-work` or `from-work`
 * props. Each shows arrow pointing in a different direction.
 *
 * @props
 * - `day` (RouteDay, default - null): The object representing the associated route.
 *   It should be of type `RouteDay`.
 * - `toWork` (boolean, optional): Whether the route is to work.
 * - `fromWork` (boolean, optional): Whether the route is from work.
 * - `active` (boolean, optional): Whether the route is active (currently
 *   being edited).
 * - `disabled` (boolean, optional): Whether the route is disabled.
 *
 * @events
 * - `item-click`: Emitted when the item is clicked.
 *   payload:
 *     - `direction` (TransportDirection): The direction of the route.
 *     - `timestamp` (Timestamp): The timestamp of the route.
 *
 * @example
 * <calendar-item
 *  direction="toWork"
 *  :day="routeCalendarDay"
 *  :timestamp="timestamp"
 * />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=8279-39418&t=baRxKn3ERzsqCVyl-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

// composables
import { useRoutes } from 'src/composables/useRoutes';

// enums
import { TransportDirection, TransportType } from '../types/Route';

// types
import type { Timestamp } from '@quasar/quasar-ui-qcalendar';
import type { RouteDay, RouteItem } from '../types/Route';

export default defineComponent({
  name: 'CalendarItemDisplay',
  props: {
    day: {
      type: Object as () => RouteDay | null,
      default: null,
    },
    direction: {
      type: String as () => TransportDirection,
      required: true,
    },
    timestamp: {
      type: Object as () => Timestamp,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['item-click'],
  setup(props, { emit }) {
    const iconSize = '18px';

    function onClick(): void {
      emit('item-click', {
        timestamp: props.timestamp,
        direction: props.direction,
      });
    }

    const route = computed((): RouteItem | null => {
      if (!props.day) return null;
      return props.day[props.direction] ? props.day[props.direction] : null;
    });

    /**
     * Determines if route should be displayed as logged.
     * Routes with transport type `none` are displayed as empty.
     */
    const isLogged = computed((): boolean => {
      return !!route.value?.id && route.value?.transport !== null;
    });

    const { getRouteDistance, getRouteIcon } = useRoutes();

    const customSVGIconsFilePath = 'icons/routes_calendar/icons.svg';
    const customSVGIconViewPort = '0 0 133 40';

    return {
      customSVGIconsFilePath,
      customSVGIconViewPort,
      iconSize,
      route,
      TransportDirection,
      TransportType,
      getRouteDistance,
      getRouteIcon,
      onClick,
      isLogged,
    };
  },
});
</script>

<template>
  <div class="q-my-sm" data-cy="calendar-item-display">
    <q-item
      dense
      :active="active"
      :clickable="!disabled"
      :v-ripple="!disabled"
      class="relative-position flex justify-center items-center text-center gap-8"
      @click.prevent="onClick()"
      data-cy="calendar-item-display-item"
    >
      <!-- Background: To work -->
      <template v-if="direction === TransportDirection.toWork">
        <!-- Icon: To work - active -->
        <q-icon
          v-if="active"
          color="primary"
          class="full-width full-height absolute-full"
          :name="`svguse:${customSVGIconsFilePath}#route-bg-towork-active|${customSVGIconViewPort}`"
          data-cy="calendar-item-icon-towork-active"
        />
        <!-- Icon: To work - logged -->
        <q-icon
          v-else-if="route && isLogged"
          color="secondary"
          class="full-width full-height absolute-full"
          :name="`svguse:${customSVGIconsFilePath}#route-bg-towork-logged|${customSVGIconViewPort}`"
          style="opacity: 0.4"
          data-cy="calendar-item-icon-towork-logged"
        />
        <!-- Icon: To work - empty -->
        <q-icon
          v-else
          color="primary"
          class="full-width full-height absolute-full"
          :name="`svguse:${customSVGIconsFilePath}#route-bg-towork-empty|${customSVGIconViewPort}`"
          style="opacity: 0.5"
          data-cy="calendar-item-icon-towork-empty"
        />
      </template>
      <!-- Background: From work -->
      <template v-if="direction === TransportDirection.fromWork">
        <!-- Icon: From work - active -->
        <q-icon
          v-if="active"
          color="primary"
          class="full-width full-height absolute-full"
          :name="`svguse:${customSVGIconsFilePath}#route-bg-fromwork-active|${customSVGIconViewPort}`"
          data-cy="calendar-item-icon-fromwork-active"
        />
        <!-- Icon: From work - logged -->
        <q-icon
          v-else-if="route && isLogged"
          color="secondary"
          class="full-width full-height absolute-full"
          :name="`svguse:${customSVGIconsFilePath}#route-bg-fromwork-logged|${customSVGIconViewPort}`"
          style="opacity: 0.4"
          data-cy="calendar-item-icon-fromwork-logged"
        />
        <!-- Icon: From work - empty -->
        <q-icon
          v-else
          color="primary"
          class="full-width full-height absolute-full"
          :name="`svguse:${customSVGIconsFilePath}#route-bg-fromwork-empty|${customSVGIconViewPort}`"
          style="opacity: 0.5"
          data-cy="calendar-item-icon-fromwork-empty"
        />
      </template>

      <!-- Content: Route logged -->
      <template v-if="route && isLogged">
        <!-- Icon: Transport type -->
        <q-icon
          :color="active ? 'white' : 'primary'"
          :name="getRouteIcon(route.transport)"
          :size="iconSize"
          data-cy="calendar-item-icon-transport"
        />
        <!-- Distance -->
        <span
          class="relative-position text-subtitle2"
          :class="[active ? 'text-white' : 'text-primary']"
          data-cy="calendar-item-distance"
        >
          {{ getRouteDistance(route) }}
        </span>
      </template>
      <!-- Content: Route empty -->
      <template v-else>
        <!-- Icon: Plus -->
        <q-icon
          :color="active ? 'white' : 'primary'"
          name="mdi-plus"
          :size="iconSize"
          data-cy="calendar-item-icon-plus"
        />
      </template>
    </q-item>
  </div>
</template>
