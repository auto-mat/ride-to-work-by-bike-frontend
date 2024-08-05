// libraries
import { ref } from 'vue';
import { Feature } from 'ol';
import { LineString } from 'ol/geom';

// types
import type { Coordinate } from 'ol/coordinate';

export const useRoutesMapDraw = () => {
  const drawRoute = ref<Feature>();
  // each route is saved as an array of coordinates
  const drawRouteHistory = ref<Coordinate[][]>([[[0, 0]]]);

  /**
   * Updates current route after drawing on the map.
   * Also saves route coordinates into history.
   * @param feature Feature
   * @return {void}
   */
  const updateDrawRoute = (feature: Feature): void => {
    drawRoute.value = feature;
    saveRouteToHistory(feature);
  };

  /**
   * Saves route coordinates into history. To enable "undo" action.
   * @param route Feature
   * @return {void}
   */
  const saveRouteToHistory = (feature: Feature): void => {
    const geometry = feature.getGeometry();
    if (geometry instanceof LineString) {
      const coordinates = geometry.getCoordinates();
      if (coordinates) {
        drawRouteHistory.value.push(coordinates);
      }
    }
  };

  /**
   * Returns one-before-last element in history.
   * If there is only one element in history, returns null.
   * @return {Feature | null}
   */
  const undoDrawRoute = (): Feature | null => {
    if (drawRouteHistory.value.length === 1) {
      return null;
    }
    // remove last history item
    drawRouteHistory.value.pop();
    // get new last history item
    const lastElement =
      drawRouteHistory.value[drawRouteHistory.value.length - 1];
    if (lastElement) {
      // return new feature (LineString)
      const lineString = new LineString(lastElement);
      const feature = new Feature({
        geometry: lineString,
      });
      drawRoute.value = feature;
      return feature;
    }
    return null;
  };

  /**
   * Clears the draw route history.
   * @return {void}
   */
  const clearDrawHistory = (): void => {
    drawRouteHistory.value = [[[0, 0]]];
  };

  return {
    drawRoute,
    drawRouteHistory,
    clearDrawHistory,
    updateDrawRoute,
    undoDrawRoute,
  };
};
