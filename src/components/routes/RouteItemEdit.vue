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
 * - `editedRoutes` (RouteItem[], optional): The array of edited routes.
 *   It should be of type `RouteItem[]`
 *
 * @components
 * - `RouteInputTransportType`: Component to render a transport type input.
 * - `RouteInputDistance`: Component to render a distance input.
 *
 * @example
 * <route-item-edit :route="route" :edited-routes="routeItemsDirty" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104042&mode=dev)
 */

// libraries
import { date, Notify } from 'quasar';
import { computed, defineComponent, inject } from 'vue';

// components
import RouteInputDistance from './RouteInputDistance.vue';
import RouteInputTransportType from './RouteInputTransportType.vue';

// composables
import { i18n } from '../../boot/i18n';
import { useLogRoutes } from '../../composables/useLogRoutes';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// enums
import {
  RouteInputType,
  TransportDirection,
  TransportType,
} from '../types/Route';

// stores
import { useTripsStore } from 'src/stores/trips';

// utils
import { routeFormFieldOptions } from './utils/';
import { localizedFloatNumStrToFloatNumber } from 'src/utils';

// types
import type { FormOption } from '../types/Form';
import type { Logger } from '../types/Logger';
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
    editedRoutes: {
      type: Array as () => RouteItem[],
      required: true,
    },
  },
  emits: ['update:route'],
  setup(props, { emit }) {
    const logger = inject('vuejs3-logger') as Logger | null;
    const tripsStore = useTripsStore();
    /**
     * Get route state from store.
     * Store holds current state of routes from the API.
     * Edits within this component can be compared with the current state.
     */
    const routeStateDefault = computed(() => {
      const storeRoute = tripsStore.getRouteItems.find(
        (route) => route.id === props.route.id,
      );
      if (!storeRoute) {
        return {
          transport: null,
          distance: defaultDistanceZero,
          inputType: RouteInputType.inputNumber,
        };
      }
      return storeRoute;
    });

    const {
      borderRadiusCard: borderRadius,
      colorGray: borderColor,
      defaultDistanceZero,
    } = rideToWorkByBikeConfig;

    const optionsAction: FormOption[] = [
      ...routeFormFieldOptions,
      {
        label: i18n.global.t('routes.actionCopyYesterday'),
        value: RouteInputType.copyYesterday,
      },
      /* Disable trace to map action option menu item
      {
        label: i18n.global.t('routes.actionTraceMap'),
        value: RouteInputType.inputMap,
      },
      */
    ];

    const routes = computed<RouteItem[]>(() => [props.route]);
    // create refs from the route object
    const { action, distance, file, transportType, isShownDistance } =
      useLogRoutes(routes);

    const onUpdateAction = (actionNew: RouteInputType): void => {
      /**
       * If action is changed to `copy-yesterday`, check if the day before
       * route exists and has non-zero distance value.
       * If so, copy the data to the current route.
       */
      if (actionNew === RouteInputType.copyYesterday) {
        // props.route.date is current route.
        const today = new Date(props.route.date);
        // get the day before
        const dayBefore = date.subtractFromDate(today, { day: 1 });
        // look for the day-before route in edited routes or store
        const dayBeforeRoute =
          props.editedRoutes.find(
            (route) =>
              date.isSameDate(new Date(route.date), dayBefore) &&
              route.direction === props.route.direction,
          ) ||
          tripsStore.getRouteItems.find(
            (route) =>
              date.isSameDate(new Date(route.date), dayBefore) &&
              route.direction === props.route.direction,
          );
        // if route has not been found, return with message
        if (!dayBeforeRoute) {
          Notify.create({
            type: 'warning',
            message: i18n.global.t('routes.messageCopyNoRoute'),
          });
          // we do not emit `actionNew` - we keep `input-number` action
          return;
        }
        // type-agnostic comparison - if no distance, return with message
        if (dayBeforeRoute.distance == 0) {
          Notify.create({
            type: 'warning',
            message: i18n.global.t('routes.messageCopyNoDistance'),
          });
          // we do not emit `actionNew` - we keep `input-number` action
          return;
        }
        onUpdateDistance(dayBeforeRoute.distance);
      } else {
        emit('update:route', {
          ...props.route,
          inputType: actionNew,
        });
      }
    };

    const onUpdateDistance = (distanceNew: string): void => {
      /**
       * @params {string} distanceNew - Route distance in km unit as
       *                                localized float number string
       *                                e.g. '12.50' or '12,50'
       */
      logger?.debug(
        `New route distance <${distanceNew}>,` +
          ` value type <${typeof distanceNew}>` +
          ` default route distance <${routeStateDefault.value?.distance}>` +
          ` value type <${typeof routeStateDefault.value?.distance}>.`,
      );
      const distanceNewFormatted =
        localizedFloatNumStrToFloatNumber(distanceNew);

      /**
       * Compare new distance with FLOAT NUMBER TYPE with
       * the distance from the store with FLOAT NUMBER STRING TYPE
       *
       * Usage '!=' provide type conversion
       *
       * (see ./src/components/adapters/tripsAdapter.ts
       *  `tripsAdapter` object `toRouteItem()` func,
       *   inner `distance()` func which convert route distance (REST API)
       *   INTEGER NUMBER type (meter unit) into FLOAT NUMBER STRING (km unit)
       *   1500 (m) to '1.50' (km), according localized (en lang) number format var
       *   numberFormatsAllLocales, routeDistanceDecimalNumber key inside
       *   app global config ride_to_work_by_bike_config.toml file.
       * )
       */
      const dirty = distanceNewFormatted != routeStateDefault.value?.distance;
      emit('update:route', {
        ...props.route,
        distance: distanceNew,
        inputType: action.value,
        // clear file (if previously uploaded)
        file: null,
        dirty,
      });
      distance.value = distanceNew;
    };

    const onUpdateTransportType = (transportTypeNew: TransportType): void => {
      // compare new transport type with the transport type from the store
      const dirty = transportTypeNew !== routeStateDefault.value?.transport;
      // if transport type is change to TransportType.none, set distance to 0
      if (transportTypeNew === TransportType.none) {
        const { defaultDistanceZero } = rideToWorkByBikeConfig;
        emit('update:route', {
          ...props.route,
          distance: defaultDistanceZero,
          transport: transportTypeNew,
          dirty,
        });
      } else {
        emit('update:route', {
          ...props.route,
          transport: transportTypeNew,
          dirty,
        });
      }
      transportType.value = transportTypeNew;
    };

    const onUpdateFile = (fileNew: File | null): void => {
      if (fileNew) {
        emit('update:route', {
          ...props.route,
          dirty: true,
          inputType: action.value,
          // set distance to zero (file has priority)
          distance: defaultDistanceZero,
          file: fileNew,
        });
      } else {
        emit('update:route', {
          ...props.route,
          dirty: true,
          inputType: action.value,
          file: null,
        });
      }
      file.value = fileNew;
    };

    const iconSize = '18px';

    return {
      action,
      borderRadius,
      borderColor,
      defaultDistanceZero,
      distance,
      file,
      iconSize,
      isShownDistance,
      transportType,
      TransportDirection,
      optionsAction,
      onUpdateTransportType,
      onUpdateDistance,
      onUpdateFile,
      onUpdateAction,
      routeStateDefault,
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
          :modelValue="transportType"
          @update:modelValue="onUpdateTransportType"
          class="q-mt-sm"
          data-cy="section-transport"
        />
        <!-- Section: Distance -->
        <route-input-distance
          v-if="isShownDistance"
          :modelValue="distance"
          :modelAction="action"
          :optionsAction="optionsAction"
          :modelFile="file"
          @update:modelValue="onUpdateDistance"
          @update:modelAction="onUpdateAction"
          @update:modelFile="onUpdateFile"
          class="q-mt-lg"
          data-cy="section-distance"
        />
      </div>
    </div>
  </div>
</template>
