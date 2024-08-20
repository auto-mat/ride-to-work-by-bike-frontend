// libraries
import { computed, ref, watch } from 'vue';

// enums
import { TransportType } from 'src/components/types/Route';

// types
import type { ComputedRef } from 'vue';
import type { RouteInputType, RouteItem } from 'src/components/types/Route';

export const useLogRoutes = (routes: ComputedRef<RouteItem[]>) => {
  const routesCount = computed((): number => routes.value.length);

  const action = ref<RouteInputType>('input-number');
  const distance = ref<number>(0);
  const transportType = ref<TransportType>(TransportType.bike);

  /**
   * Sets the panel input data based on the provided routes.
   * @param {RouteItem[]} routes - An array of route items.
   * @return {void}
   */
  const setInputsFromRoute = (routes: RouteItem[]): void => {
    if (routes.length === 1) {
      action.value = routes[0].inputType || 'input-number';
      distance.value = routes[0].distance || 0;
      transportType.value = routes[0].transport || TransportType.bike;
    } else {
      action.value = 'input-number';
      distance.value = 0;
      transportType.value = TransportType.bike;
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

  /**
   * Checks if the given transport type has distance.
   * @param {TransportType} transport - The transport type to check.
   * @return {boolean} Whether the transport has distance.
   */
  const hasTransportDistance = (transport: TransportType): boolean => {
    return (
      transport === TransportType.bike ||
      transport === TransportType.walk ||
      transport === TransportType.bus
    );
  };

  return {
    action,
    distance,
    routesCount,
    transportType,
    isShownDistance,
    hasTransportDistance,
  };
};
