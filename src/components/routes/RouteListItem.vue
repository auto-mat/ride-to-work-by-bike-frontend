<script lang="ts">
/**
 * RouteListItem Component
 *
 * @description * Use this component to render an item in a list of routes.
 *
 * @props
 * - `route` (object, required): The object representing the route.
 *   It should be of type `object` with properties:
 *   - id (string)
 *   - date (string)
 *   - type (string)
 *   - distance (number)
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

// types
import type { FormOption } from '../types/Form';

export default defineComponent({
  name: 'RouteListItem',
  props: {
    route: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const action = ref<string>('input-distance');
    const optionsAction: FormOption[] = [
      {
        label: i18n.global.t('routes.actionInputDistance'),
        value: 'input-distance',
      },
    ];

    const distance = ref<number>(0);

    const transport = ref<string>('bike');
    const optionsTransport: FormOption[] = [
      {
        label: '',
        description: i18n.global.t('routes.transportByBike'),
        value: 'bike',
        icon: 'pedal_bike',
      },
      {
        label: '',
        description: i18n.global.t('routes.transportOnFoot'),
        value: 'walk',
        icon: 'directions_walk',
      },
      {
        label: '',
        description: i18n.global.t('routes.transportPublicTransport'),
        value: 'bus',
        icon: 'directions_bus',
      },
      {
        label: '',
        description: i18n.global.t('routes.transportByCar'),
        value: 'car',
        icon: 'directions_car',
      },
      {
        label: '',
        description: i18n.global.t('routes.transportNone'),
        value: 'none',
        icon: 'block',
      },
    ];
    const transportDescription = computed(() => {
      const option = optionsTransport.find((option) => {
        return option.value === transport.value;
      });
      return option?.description;
    });

    return {
      action,
      distance,
      optionsAction,
      optionsTransport,
      transport,
      transportDescription,
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
              {{ transportDescription }}
            </div>
          </div>
        </div>
        <!-- Column: Distance -->
        <div class="col-12 col-sm-8" data-cy="column-distance">
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
