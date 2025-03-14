<script lang="ts">
/**
 * RouteInputTransportType Component
 *
 * @description * Use this component to render toggle buttons for selecting
 * transport type.
 * This component is used in `RouteItemEdit` and `RouteCalendarPanel`.
 *
 * @props
 * - `modelValue` (string, required): The object representing selected value.
 *   It should be of type `string`.
 * - `horizontal` (boolean, default: false): Whether the buttons and label
 *   should be displayed side by side in a row.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <route-input-transport-type v-model="transportType">
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=8283-9639&t=Jd5ZtRb87eFdDC2q-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

// composables
import { useRoutes } from '../../composables/useRoutes';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// stores
import { useTripsStore } from '../../stores/trips';

// enums
import { TransportType } from '../types/Route';

export default defineComponent({
  name: 'RouteInputTransportType',
  props: {
    modelValue: {
      type: String as () => TransportType | null,
      required: true,
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { colorGray: borderColor } = rideToWorkByBikeConfig;
    const { getRouteIcon, getTransportLabel } = useRoutes();
    const tripsStore = useTripsStore();

    const optionsTransport = computed(() => {
      const modes = tripsStore.getCommuteModes;
      return modes.map((mode) => ({
        value: mode.slug,
        icon: getRouteIcon(mode.slug),
        eco: mode.eco,
      }));
    });

    const transport = computed({
      get: (): TransportType => {
        if (!props.modelValue) {
          return TransportType.bike;
        }
        return props.modelValue;
      },
      set: (value: TransportType): void => {
        emit('update:modelValue', value);
      },
    });

    return {
      borderColor,
      optionsTransport,
      transport,
      getRouteIcon,
      getTransportLabel,
    };
  },
});
</script>

<template>
  <div data-cy="route-input-transport-type">
    <!-- Label -->
    <div
      class="text-caption text-weight-bold text-grey-10"
      data-cy="label-transport"
    >
      {{ $t('routes.labelTransportType') }}
    </div>
    <div
      class="q-mt-sm"
      :class="{ 'flex flex-wrap items-center gap-8': horizontal }"
      data-cy="select-transport"
    >
      <div
        class="inline-block"
        :style="{
          padding: '2px',
          'border-radius': '9999px',
          border: `1px solid ${borderColor}`,
        }"
        data-cy="button-toggle-wrapper"
      >
        <!-- Buttons -->
        <q-btn
          dense
          round
          unelevated
          v-for="(option, index) in optionsTransport"
          :key="option.value"
          color="transparent"
          text-color="primary"
          class="q-pa-none q-ma-none"
          :class="{ 'q-ml-sm': index > 0 }"
          @click.prevent="transport = option.value"
          data-cy="button-toggle-transport"
          :data-value="option.value"
        >
          <q-avatar
            :color="transport === option.value ? 'secondary' : 'white'"
            size="32px"
            class="q-pa-none q-ma-none"
            data-cy="avatar-transport"
          >
            <q-icon
              :name="option.icon"
              color="primary"
              size="18px"
              data-cy="icon-transport"
            />
          </q-avatar>
        </q-btn>
      </div>
      <!-- Description -->
      <div
        class="text-subtitle2 text-grey-10 text-weight-regular"
        :class="{ 'q-mt-sm': !horizontal }"
        data-cy="description-transport"
      >
        {{ getTransportLabel(transport) }}
      </div>
    </div>
  </div>
</template>
