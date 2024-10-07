// libraries
import { computed } from 'vue';
import { Layers } from 'vue3-openlayers';

// types
import type { Ref } from 'vue';
import type { Feature } from 'ol';

export const useRoutesMapVectorLayer = (
  vectorLayer: Ref<InstanceType<typeof Layers.OlVectorLayer> | null>,
) => {
  // vector layer source
  const source = computed(
    () => vectorLayer && vectorLayer.value?.vectorLayer.getSource(),
  );

  /**
   * Adds the drawn route on the map.
   * @param feature Feature
   * @return {void}
   */
  const addMapRoute = (feature: Feature): void => {
    if (source.value) {
      source.value.addFeature(feature);
    }
  };

  /**
   * Clears all drawn routes from the map.
   * @return {void}
   */
  const clearMapRoutes = (): void => {
    const source = vectorLayer && vectorLayer.value?.vectorLayer.getSource();
    if (source) {
      source.clear();
    }
  };

  /**
   * Renders selected route on the map.
   * First clears all previously drawn routes from the map.
   * @param feature Feature
   * @return {void}
   */
  const renderRoute = (feature: Feature): void => {
    clearMapRoutes();
    addMapRoute(feature);
  };

  return {
    addMapRoute,
    clearMapRoutes,
    renderRoute,
  };
};
