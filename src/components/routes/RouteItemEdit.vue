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
 * @example
 * <route-list-item :route="route" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104042&mode=dev)
 */

// libraries
import { computed, defineComponent, ref, watch } from 'vue';
import { i18n } from 'src/boot/i18n';

// composables
import { useRoutes } from 'src/composables/useRoutes';

// types
import type { FormOption } from '../types/Form';
import type { RouteItem, RouteInputType } from '../types/Route';

export default defineComponent({
  name: 'RouteItemEdit',
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
    const routeInitial: RouteItem = { ...props.route };

    const action = ref<RouteInputType>(
      props.route?.inputType || 'input-number',
    );
    const distance = ref<number>(props.route?.distance || 0);

    const optionsAction: FormOption[] = [
      {
        label: i18n.global.t('routes.actionInputDistance'),
        value: 'input-number',
      },
      {
        label: i18n.global.t('routes.actionTraceMap'),
        value: 'input-map',
      },
    ];

    const { getRouteIcon } = useRoutes();
    const optionsTransport: FormOption[] = [
      {
        label: '',
        value: 'bike',
        icon: getRouteIcon('bike'),
      },
      {
        label: '',
        value: 'walk',
        icon: getRouteIcon('walk'),
      },
      {
        label: '',
        value: 'bus',
        icon: getRouteIcon('bus'),
      },
      {
        label: '',
        value: 'car',
        icon: getRouteIcon('car'),
      },
      {
        label: '',
        value: 'none',
        icon: getRouteIcon('none'),
      },
    ];

    const transport = ref<string>(props.route.transport || '');
    // show distance input if transport is bike, walk or bus
    const isShownDistance = computed((): boolean => {
      return (
        transport.value === 'bike' ||
        transport.value === 'walk' ||
        transport.value === 'bus'
      );
    });

    // watcher for changes compared to the initial state (dirty)
    watch(
      [action, distance, transport],
      ([actionNew, distanceNew, transportNew]) => {
        // if settings are the same as initial, mark dirty as false
        if (
          actionNew === (routeInitial?.inputType || 'input-number') &&
          Number(distanceNew) === Number(routeInitial.distance) &&
          transportNew === routeInitial?.transport
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
      distance,
      iconSize,
      isShownDistance,
      optionsAction,
      optionsTransport,
      transport,
    };
  },
});
</script>

<template>
  <div class="row items-center" data-cy="route-list-item">
    <div v-if="displayLabel" class="col-12 col-sm-2" data-cy="column-direction">
      <!-- Column: Direction -->
      <div
        class="flex gap-8 text-subtitle2 text-weight-bold text-grey-10"
        data-cy="label-direction"
      >
        <!-- From work -->
        <span v-if="route.direction === 'from_work'">
          <q-icon
            name="arrow_back"
            :size="iconSize"
            data-cy="label-direction-icon"
          />
          {{ $t('routes.labelDirectionFromWork') }}
        </span>
        <!-- To work -->
        <span v-if="route.direction === 'to_work'">
          <q-icon
            name="arrow_forward"
            :size="iconSize"
            data-cy="label-direction-icon"
          />
          {{ $t('routes.labelDirectionToWork') }}
        </span>
      </div>
    </div>
    <div
      :class="[displayLabel ? 'col-12 col-sm-10' : 'col-12']"
      data-cy="column-transport-distance"
    >
      <div class="row">
        <!-- Column: Transport type -->
        <div
          :class="[displayLabel ? 'col-12 col-sm-4' : 'col-12 col-sm-5']"
          data-cy="column-transport"
        >
          <!-- Label -->
          <div
            class="text-caption text-weight-bold text-grey-10"
            data-cy="label-transport"
          >
            {{ $t('routes.labelTransportType') }}
          </div>
          <div class="q-mt-sm" data-cy="select-transport">
            <!-- Toggle Buttons -->
            <q-btn-toggle
              v-model="transport"
              no-caps
              rounded
              unelevated
              toggle-color="primary"
              color="white"
              text-color="primary"
              :options="optionsTransport"
              data-cy="button-toggle-transport"
            />
            <!-- Description -->
            <div
              class="text-caption text-black q-mt-sm"
              data-cy="description-transport"
            >
              {{ $t(`routes.transport.${transport}`) }}
            </div>
          </div>
        </div>
        <!-- Column: Distance -->
        <div
          v-show="isShownDistance"
          :class="[displayLabel ? 'col-12 col-sm-8' : 'col-12 col-sm-7']"
          data-cy="column-distance"
        >
          <!-- Label -->
          <div
            class="text-caption text-weight-bold text-grey-10"
            data-cy="label-distance"
          >
            {{ $t('routes.labelDistance') }}
          </div>
          <div class="q-mt-sm">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-4">
                <!-- Select: Action -->
                <q-select
                  dense
                  outlined
                  emit-value
                  map-options
                  v-model="action"
                  :id="`route-item-action-${route.id}`"
                  :options="optionsAction"
                  data-cy="select-action"
                ></q-select>
              </div>
              <div
                v-if="action === 'input-number'"
                class="col-8 col-sm-5 row items-center gap-8"
              >
                <!-- Input: Distance -->
                <div class="col">
                  <q-input
                    dense
                    outlined
                    type="number"
                    v-model="distance"
                    :id="`route-item-distance-${route.id}`"
                    :name="`route-item-distance-${route.id}`"
                    min="0"
                    max="999"
                    data-cy="input-distance"
                  />
                </div>
                <div class="col">
                  <span data-cy="units-distance">
                    {{ $t('global.routeLengthUnit') }}
                  </span>
                </div>
              </div>
              <div v-else-if="action === 'input-map'" class="col-8 col-sm-5">
                <!-- Button: Trace map -->
                <q-btn
                  unelevated
                  rounded
                  color="primary"
                  data-cy="button-trace-map"
                >
                  <!-- Icon -->
                  <q-icon name="edit" size="18px" class="q-mr-sm" />
                  <!-- Label -->
                  <span>{{ $t('routes.buttonTraceMap') }}</span>
                </q-btn>
              </div>
              <div class="col-2 flex items-center"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
