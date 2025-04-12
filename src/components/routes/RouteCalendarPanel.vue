<script lang="ts">
/**
 * RouteCalendarPanel Component
 *
 * @description * Use this component to log routes in the calendar.
 * Upon calendar click, it displays a dismissable dialog panel.
 * Interaction with page is allowed outside the dialog.
 * Panel contains inputs for specifying the entered route.
 * Upon confirmation, it logs the entered route.
 * It is used in combination with `RoutesCalendar` component.
 *
 * @props
 * - `modelValue` (boolean, required): The "isOpen" state of the dialog.
 * - `routes` (RouteItem[], required): The list of routes to log.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 * - `update:route`: Emitted when route is updated.
 *
 * @components
 * - `RouteInputDistance`: Component to render distance input.
 * - `RouteInputTransportType`: Component to render transport type selector.
 *
 * @example
 * <route-calendar-panel v-model="isOpen" :routes="routes" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=8279-39418&t=Uzwf1ZVoIaYMizTE-1)
 */

// libraries
import { Notify } from 'quasar';
import { computed, defineComponent, inject } from 'vue';

// components
import RouteInputDistance from './RouteInputDistance.vue';
import RouteInputTransportType from './RouteInputTransportType.vue';

// composables
import { i18n } from '../../boot/i18n';
import { useRoutes } from 'src/composables/useRoutes';
import { useLogRoutes } from '../../composables/useLogRoutes';
import { useApiPostTrips } from '../../composables/useApiPostTrips';

// adapters
import { tripsAdapter } from '../../adapters/tripsAdapter';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// enums
import { RouteInputType } from '../types/Route';

// stores
import { useTripsStore } from '../../stores/trips';

// types
import type { RouteItem } from '../types/Route';
import type { Logger } from '../types/Logger';
import type { FormOption } from '../types/Form';

// utils
import { routeFormFieldOptions } from './utils/';

export default defineComponent({
  name: 'RouteCalendarPanel',
  components: {
    RouteInputDistance,
    RouteInputTransportType,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    routes: {
      type: Array as () => RouteItem[],
      required: true,
    },
  },
  emits: ['save', 'update:modelValue'],
  setup(props, { emit }) {
    const logger = inject('vuejs3-logger') as Logger | null;
    // styles
    const minWidth = '65vw';

    const { defaultDistanceZero } = rideToWorkByBikeConfig;

    const isOpen = computed({
      get: (): boolean => props.modelValue,
      set: (value: boolean): void => {
        emit('update:modelValue', value);
      },
    });

    const optionsAction: FormOption[] = [
      ...routeFormFieldOptions,
      /* Disable trace to map action option menu item
      {
        label: i18n.global.t('routes.actionTraceMap'),
        value: RouteInputType.inputMap,
      },
      */
    ];

    // Make props into computed ref so it can be passed as a reactive value.
    const routes = computed(() => props.routes);
    // Get panel input state from a composable.
    const {
      action,
      distance,
      routesCount,
      transportType,
      isShownDistance,
      file,
    } = useLogRoutes(routes);

    // Initialize API composable
    const { postTrips } = useApiPostTrips(logger);

    // Initialize trips store
    const tripsStore = useTripsStore();

    const { isEntryEnabled } = useRoutes();

    // Determines if save button should be disabled.
    const isSaveBtnDisabled = computed((): boolean => {
      const noTransport = transportType.value === null;
      const noRoutes = routesCount.value === 0;
      const noDistance =
        isShownDistance.value && distance.value === defaultDistanceZero;
      const noFile = file.value === null;
      return (
        noRoutes ||
        (noDistance && noFile) ||
        noTransport ||
        tripsStore.getIsLoading
      );
    });

    /**
     * Triggered when panel save button is clicked.
     * Sends API request to update selected routes with panel data.
     * If unsuccessful, it shows error message.
     * If successful, closes panel.
     */
    const onSave = async (): Promise<void> => {
      // if entry is not enabled, show notification
      if (!isEntryEnabled.value) {
        Notify.create({
          type: 'negative',
          message: i18n.global.t('postTrips.messageEntryNotEnabled'),
        });
        return;
      }
      // reset input values based on selected action
      if (action.value === RouteInputType.uploadFile) {
        distance.value = defaultDistanceZero;
      }
      if (action.value === RouteInputType.inputNumber) {
        file.value = null;
      }
      // create route items with settings from panel
      const routeItems: RouteItem[] = routes.value.map((route) => ({
        ...route,
        transport: transportType.value,
        distance: isShownDistance.value ? distance.value : route.distance,
        file: file.value ? file.value : null,
      }));
      logger?.debug(
        `Saving route items <${JSON.stringify(routeItems, null, 2)}>.`,
      );
      // send to API
      const response = await postTrips(routeItems);
      // handle success
      if (
        response.success &&
        response.data?.trips &&
        response.data.trips.length > 0
      ) {
        logger?.info('Routes saved successfully.');
        logger?.debug(
          `Saved trips <${JSON.stringify(response.data.trips, null, 2)}>.`,
        );
        // convert saved trips to route items
        const savedRouteItems = response.data.trips.map((trip) =>
          tripsAdapter.toRouteItem(trip),
        );
        logger?.info('Saving new routes to store.');
        // update store with new route items
        tripsStore.updateRouteItems(savedRouteItems);
        logger?.debug(
          `Updated store route items <${JSON.stringify(tripsStore.getRouteItems, null, 2)}>.`,
        );
        // emit save event
        emit('save');
      }
    };

    return {
      action,
      distance,
      file,
      routesCount,
      isOpen,
      isSaveBtnDisabled,
      isShownDistance,
      minWidth,
      optionsAction,
      transportType,
      onSave,
    };
  },
});
</script>

<template>
  <q-dialog
    seamless
    square
    persistent
    v-model="isOpen"
    position="bottom"
    transition-show="slide-up"
    transition-hide="slide-down"
    data-cy="route-calendar-panel"
  >
    <q-card
      class="relative-position full-width overflow-visible bg-white"
      :style="{ minWidth: minWidth }"
      data-cy="dialog-card"
    >
      <!-- Section: Card header -->
      <q-card-section class="q-px-lg q-pt-sm q-pb-none" data-cy="dialog-header">
        <!-- Title -->
        <h3
          class="text-h5 text-weight-bold text-grey-10 q-mt-sm q-pt-xs q-mb-none"
          data-cy="dialog-title"
        >
          <template v-if="routesCount > 0">
            {{
              $t('routes.titleBottomPanel', routesCount, {
                count: routesCount,
              })
            }}
          </template>
          <template v-else>
            {{ $t('routes.titleBottomPanelNoRoutes') }}
          </template>
        </h3>
      </q-card-section>
      <q-card-section class="q-pa-lg">
        <div class="row q-col-gutter-lg items-start" data-cy="dialog-body">
          <!-- Input: Transport type -->
          <div class="col-12 col-sm-auto" data-cy="section-transport">
            <route-input-transport-type
              v-model="transportType"
              data-cy="route-input-transport-type"
            />
          </div>
          <!-- Input: Distance (or link to map) -->
          <div class="col-12 col-sm" data-cy="section-distance">
            <route-input-distance
              v-show="isShownDistance"
              v-model="distance"
              :modelFile="file"
              :modelAction="action"
              :optionsAction="optionsAction"
              @update:modelAction="action = $event"
              @update:modelFile="file = $event"
              class="q-mt-none"
              data-cy="route-input-distance"
            />
          </div>
          <!-- Button: Save -->
          <div class="col-12 col-sm-auto flex self-end justify-end">
            <q-btn
              unelevated
              round
              color="primary"
              :disabled="isSaveBtnDisabled"
              @click="onSave"
              data-cy="dialog-save-button"
            >
              <q-icon name="check" color="white" size="24px" />
            </q-btn>
          </div>
        </div>
      </q-card-section>
      <!-- Button: Close dialog -->
      <q-card-actions class="inline-block absolute-top-right q-pa-sm">
        <q-btn
          v-close-popup
          round
          unelevated
          color="white"
          text-color="primary"
          icon="close"
          data-cy="dialog-close"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
