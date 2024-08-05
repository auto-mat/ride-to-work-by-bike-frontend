// libraries
import { ref } from 'vue';
import { LineString } from 'ol/geom';

// types
import type { Feature } from 'ol';
import type { RouteItem } from '../components/types/Route';

export const useRoutesMapStorage = () => {
  // list of saved routes
  const savedRoutes = ref<RouteItem[]>([]);

  /**
   * Compares two features' geometries.
   * @param {Feature} feature1 - The first feature.
   * @param {Feature} feature2 - The second feature.
   * @return {boolean} Returns true if the geometries are equal.
   */
  const compareFeatures = (feature1: Feature, feature2: Feature): boolean => {
    const geom1 = feature1.getGeometry();
    const geom2 = feature2.getGeometry();
    if (!(geom1 instanceof LineString && geom2 instanceof LineString)) {
      return false;
    }
    const coords1 = geom1?.getCoordinates();
    const coords2 = geom2?.getCoordinates();
    return JSON.stringify(coords1) === JSON.stringify(coords2);
  };

  /**
   * Saves a route to the list of saved routes.
   * @param {RouteItem[]} routes - The route to be saved.
   * @return {void}
   */
  const saveRoutes = (routes: RouteItem[]): void => {
    routes.forEach((route) => {
      const index = findSavedRouteIndex(route);
      // if route is already in the list, update it
      if (index !== -1) {
        savedRoutes.value[index] = route;
      } else {
        // add new route
        savedRoutes.value.push(route);
      }
    });
  };

  /**
   * Return index of the given route in the list of saved routes.
   * @param {RouteItem} route - Searched route.
   * @return {number} Index of the route.
   */
  const findSavedRouteIndex = (route: RouteItem): number => {
    return savedRoutes.value.findIndex((savedRoute) => {
      return (
        savedRoute.date === route.date &&
        savedRoute.direction === route.direction
      );
    });
  };

  return {
    savedRoutes,
    saveRoutes,
    compareFeatures,
  };
};
