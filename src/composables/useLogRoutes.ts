// libraries
import { computed, ref, watch } from 'vue';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { RouteInputType, TransportType } from 'src/components/types/Route';

// types
import type { Ref } from 'vue';
import type { RouteItem } from 'src/components/types/Route';

// utils
import { hasTransportDistance } from '../utils/has_transport_distance';

export const useLogRoutes = (routes: Ref<RouteItem[]>) => {
  const { defaultDistanceZero } = rideToWorkByBikeConfig;
  const routesCount = computed((): number => routes.value.length);

  const action = ref<RouteInputType>(RouteInputType.inputNumber);
  const distance = ref<string>(defaultDistanceZero);
  const transportType = ref<TransportType | null>(null);
  const file = ref<File | null>(null);

  /**
   * Sets the panel input data based on the provided routes.
   * @param {RouteItem[]} routes - An array of route items.
   * @return {void}
   */
  const setInputsFromRoute = (routes: RouteItem[]): void => {
    if (routes.length === 1) {
      action.value = routes[0].inputType || RouteInputType.inputNumber;
      distance.value = routes[0].distance || defaultDistanceZero;
      transportType.value = routes[0].transport || null;
      file.value = routes[0].file || null;
    } else {
      // multiple routes = unlogged - set default entry values
      action.value = RouteInputType.inputNumber;
      distance.value = defaultDistanceZero;
      transportType.value = TransportType.bike;
      file.value = null;
    }
  };

  // update panel input data when routes change (user clicks on calendar route).
  setInputsFromRoute(routes.value);
  watch(routes, () => {
    setInputsFromRoute(routes.value);
  });

  const isShownDistance = computed((): boolean => {
    return hasTransportDistance(transportType.value);
  });

  return {
    action,
    distance,
    file,
    routesCount,
    transportType,
    isShownDistance,
  };
};
