// libraries
import { computed, ref } from 'vue';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import {
  RouteInputType,
  TransportDirection,
  TransportType,
} from '../components/types/Route';

// types
import type { Ref } from 'vue';
import type {
  RouteCalendarActive,
  RouteDay,
  RouteItem,
} from '../components/types/Route';

export const useCalendarRoutes = (days: Ref<RouteDay[]>) => {
  const { defaultDistanceZero } = rideToWorkByBikeConfig;

  /**
   * Map of days with logged routes by key for an easy lookup.
   * - key: date
   * - value: RouteDay
   */
  const routesMap = computed((): Record<string, RouteDay> => {
    const routesObject = {} as Record<string, RouteDay>;
    if (days.value.length > 0) {
      days.value.forEach((route: RouteDay) => {
        routesObject[route.date] = route;
      });
    }
    return routesObject;
  });

  /**
   * Simplified version of active routes.
   * Each item contains timestamp and direction.
   * Mutable.
   */
  const activeRoutes = ref<RouteCalendarActive[]>([]);

  /**
   * Computed property of active routes.
   * Each item contains full information about the route.
   * Immutable.
   */
  const activeRouteItems = computed((): RouteItem[] => {
    const routes = [] as RouteItem[];
    activeRoutes.value.forEach((activeRoute: RouteCalendarActive): void => {
      if (activeRoute.timestamp && activeRoute.direction) {
        const day: RouteDay = routesMap.value[activeRoute.timestamp.date];
        if (
          dayHasToWorkRoute(day) &&
          activeRoute.direction === TransportDirection.toWork
        ) {
          // Route is already logged - load data.
          routes.push({ ...day.toWork });
        } else if (
          dayHasFromWorkRoute(day) &&
          activeRoute.direction === TransportDirection.fromWork
        ) {
          // Route is already logged - load data.
          routes.push({ ...day.fromWork });
        } else {
          // Route is not logged - create empty route.
          routes.push({
            id: '',
            date: activeRoute.timestamp.date,
            direction: activeRoute.direction,
            transport: TransportType.bike,
            distance: defaultDistanceZero,
            inputType: RouteInputType.inputNumber,
            routeFeature: null,
          });
        }
      }
    });
    return routes;
  });

  const isActiveRouteLogged = computed((): boolean => {
    return activeRoutes.value.reduce(
      (accumulator: boolean, activeRoute: RouteCalendarActive): boolean => {
        return isCalendarRouteLogged(activeRoute) || accumulator;
      },
      false,
    );
  });

  /**
   * Checks if a given calendar route is already logged.
   * @param {RouteCalendarActive} activeRoute - The route to check.
   * @return {boolean} True if the route is logged, false otherwise.
   */
  function isCalendarRouteLogged(activeRoute: RouteCalendarActive): boolean {
    if (activeRoute.timestamp && activeRoute.direction) {
      const day: RouteDay = routesMap.value[activeRoute.timestamp.date];
      const isLoggedToWork =
        activeRoute.direction === TransportDirection.toWork &&
        dayHasToWorkRoute(day);
      const isLoggedFromWork =
        activeRoute.direction === TransportDirection.fromWork &&
        dayHasFromWorkRoute(day);
      return isLoggedToWork || isLoggedFromWork;
    } else {
      return false;
    }
  }

  /**
   * Checks if a given day has a logged to work route.
   * @param {RouteDay | null} day - Day to check or null.
   * @return {boolean}
   */
  function dayHasToWorkRoute(day: RouteDay | null): boolean {
    return !!day?.toWork && day?.toWork?.transport !== null;
  }

  /**
   * Checks if a given day has a logged from work route.
   * @param {RouteDay | null} day - Day to check or null.
   * @return {boolean}
   */
  function dayHasFromWorkRoute(day: RouteDay | null): boolean {
    return !!day?.fromWork && day?.fromWork?.transport !== null;
  }

  /**
   * Determines if route item is active.
   * It checks timestamp and direction against stored routes.
   * @param {RouteCalendarActive} route
   * @return {boolean}
   */
  function isActive({ timestamp, direction }: RouteCalendarActive): boolean {
    if (
      !timestamp ||
      !direction ||
      !activeRoutes.value ||
      !activeRoutes.value.length
    ) {
      return false;
    }
    return getActiveIndex({ timestamp, direction }) > -1;
  }

  /**
   * Finds the index of given route based in the active array.
   * @param {RouteCalendarActive} route
   * @return {number} The index of the active route or -1 if route not found.
   */
  function getActiveIndex({
    timestamp,
    direction,
  }: RouteCalendarActive): number {
    if (
      !timestamp ||
      !direction ||
      !activeRoutes.value ||
      !activeRoutes.value.length
    ) {
      return -1;
    }
    return activeRoutes.value.findIndex((activeRoute) => {
      return (
        activeRoute.timestamp?.date === timestamp?.date &&
        activeRoute.direction === direction
      );
    });
  }

  return {
    activeRoutes,
    activeRouteItems,
    isActiveRouteLogged,
    routesMap,
    getActiveIndex,
    isActive,
    isCalendarRouteLogged,
  };
};
