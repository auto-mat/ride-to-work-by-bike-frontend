// libraries
import { date } from 'quasar';
import { computed, ref } from 'vue';
import { getLength } from 'ol/sphere';
import { LineString } from 'ol/geom';
import { unByKey } from 'ol/Observable';

// composables
import { useRoutesMap } from './useRoutesMap';
import { i18n } from '../boot/i18n';

// types
import type { Ref } from 'vue';
import type { Coordinate } from 'ol/coordinate';
import type { EventsKey } from 'ol/events';
import type { Feature } from 'ol';
import type { DrawEvent } from 'ol/interaction/Draw';
import type { RouteItem } from '../components/types/Route';

export const useRoutesMapTooltip = (selectedRoutes: Ref<RouteItem[]>) => {
  // parallel to drawn route
  const route = ref<Feature | null>(null);
  const tooltipCoord = ref<Coordinate | null>(null);
  const tooltipLength = ref('');
  let listener: EventsKey;

  const { formatLength } = useRoutesMap();

  /**
   * Generates the content of the tooltip.
   * Displays date of the first route being logged + count of all routes.
   * Displays current route length
   */
  const moreRoutesCount = computed(
    (): number => selectedRoutes.value.length - 1,
  );
  const tooltipText = computed((): string => {
    const textMoreRoutes = moreRoutesCount.value
      ? ` (+${moreRoutesCount.value} ${i18n.global.tc('global.routes', moreRoutesCount.value)})`
      : '';
    return `
      <div>
        ${i18n.global.t('routes.tooltipDrawing')}: ${date.formatDate(selectedRoutes.value[0].date, 'D. M.')}${textMoreRoutes}
      </div>
      <div>
        ${i18n.global.t('routes.tooltipRouteLength')}: ${tooltipLength.value}
      </div>
    `;
  });

  /**
   * Handles the start of a draw event for measuring the length of a line.
   * @param {DrawEvent} evt - The draw event object.
   * @return {void} This function does not return anything.
   */
  const onDrawStartLength = (evt: DrawEvent): void => {
    route.value = evt.feature;
    const geom = route.value.getGeometry();
    if (geom instanceof LineString) {
      tooltipCoord.value = geom.getLastCoordinate();
      // sets listener to the route geometry object
      listener = geom.on('change', (evt) => {
        const geom = evt.target;
        if (geom instanceof LineString) {
          tooltipLength.value = formatGeometryLength(geom);
          tooltipCoord.value = geom.getLastCoordinate();
        }
      });
    }
  };

  /**
   * Called after draw is finished.
   * Cleans up the drawn route, unsets the tooltip, and cleans up event listeners.
   * @return {void} This function does not return anything.
   */
  const onDrawEndLength = (): void => {
    // remove drawn route
    route.value = null;
    // unset tooltip so that a new one can be created
    tooltipCoord.value = null;
    tooltipLength.value = '';
    // cleanup listeners
    unByKey(listener);
  };

  /**
   * Calculates the length of a LineString geometry.
   * Returns the length in kilometers.
   * @param {LineString} line - The LineString geometry.
   * @return {string} The length in kilometers.
   */
  const formatGeometryLength = (line: LineString): string => {
    const length = getLength(line);
    return formatLength(length);
  };

  return {
    route,
    tooltipCoord,
    tooltipLength,
    tooltipText,
    onDrawStartLength,
    onDrawEndLength,
  };
};
