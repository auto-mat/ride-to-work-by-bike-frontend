<script lang="ts">
/**
 * RouteItemEdit Component
 *
 * @description * Use this component to render an item in an editable list
 * of routes.
 *
 * @props
 * - `route` (object, required): The object representing the route.
 *   It should be of type `object` with properties:
 *   - id (string)
 *   - date (string)
 *   - direction (string)
 *   - distance (number)
 *   - transport (string)
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `CHILD`: Component to ... .
 *
 * @example
 * <route-list-item />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104042&mode=dev)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';
import { i18n } from 'src/boot/i18n';

// composables
import { useRoutes } from 'src/composables/useRoutes';

// types
import type { FormOption } from '../types/Form';
import type { RouteItem } from '../types/Route';

export default defineComponent({
  name: 'RouteItemEdit',
  props: {
    route: {
      type: Object as () => RouteItem,
      required: true,
    },
  },
  setup() {
    const action = ref<string>('input-distance');
    const distance = ref<number>(0);

    const optionsAction: FormOption[] = [
      {
        label: i18n.global.t('routes.actionInputDistance'),
        value: 'input-distance',
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

    const transport = ref<string>('bike');
    const isShownDistance = computed((): boolean => {
      return (
        transport.value === 'bike' ||
        transport.value === 'walk' ||
        transport.value === 'bus'
      );
    });

    return {
      action,
      distance,
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
    <div class="col-12 col-sm-2" data-cy="column-direction">
      <!-- Column: Direction -->
      <div
        class="flex gap-8 text-subtitle2 text-weight-bold text-grey-10"
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
    <div class="col-12 col-sm-10">
      <div class="row">
        <!-- Column: Transport type -->
        <div class="col-12 col-sm-4" data-cy="column-transport">
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
          class="col-12 col-sm-8"
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
              <div class="col-12 col-sm-4">
                <div class="flex items-center gap-8">
                  <!-- Input -->
                  <q-input
                    dense
                    outlined
                    type="number"
                    v-model="distance"
                    :id="`route-item-distance-${route.id}`"
                    :name="`route-item-distance-${route.id}`"
                    data-cy="input-distance"
                  />
                  <span data-cy="units-distance">{{ $t('global.km') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>