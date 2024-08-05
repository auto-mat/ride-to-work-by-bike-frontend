<script lang="ts">
/**
 * RoutesMap Component
 *
 * @description * Use this component to render a map that allows to log and
 * view user's routes.
 *
 * Uses Vue 3 OpenLayers library to render the map.
 * @see https://vue3openlayers.netlify.app/
 *
 * @props
 * - `selectedRoutes` - (RouteItem[], optional): The routes to be drawn.
 *
 * @example
 * <routes-map />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104125&t=WHwfwyUaREf6VA9M-1)
 */

// libraries
import { colors, date, Notify, Screen } from 'quasar';
import { computed, defineComponent, ref } from 'vue';
import {
  Map,
  MapControls,
  Layers,
  Sources,
  Interactions,
  Styles,
} from 'vue3-openlayers';
import { LineString } from 'ol/geom';

// components
import RoutesMapToolbar from './RoutesMapToolbar.vue';

// composables
import { i18n } from '../../boot/i18n';
import { useGeocoding } from '../../composables/useGeocoding';
import { useRoutesMap } from '../../composables/useRoutesMap';
import { useRoutesMapDraw } from '../../composables/useRoutesMapDraw';
import { useRoutesMapStorage } from '../../composables/useRoutesMapStorage';
import { useRoutesMapTooltip } from '../../composables/useRoutesMapTooltip';
import { useRoutesMapVectorLayer } from '../../composables/useRoutesMapVectorLayer';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// types
import type { Ref } from 'vue';
import type { DrawEvent } from 'ol/interaction/Draw';
import type { ModifyEvent } from 'ol/interaction/Modify';
import type { RouteFeature, RouteItem } from '../types/Route';
import type { TransportType } from '../types/Route';
import type XYZ from 'ol/source/XYZ';

// fixtures
import selectedRoutesFixture from '../../../test/cypress/fixtures/routeListSelected.json';

export default defineComponent({
  name: 'RoutesMap',
  components: {
    OlMap: Map.OlMap,
    OlView: Map.OlView,
    OlOverlay: Map.OlOverlay,
    OlTileLayer: Layers.OlTileLayer,
    OlVectorLayer: Layers.OlVectorLayer,
    OlSourceVector: Sources.OlSourceVector,
    OlStyle: Styles.OlStyle,
    OlInteractionModify: Interactions.OlInteractionModify,
    OlInteractionDraw: Interactions.OlInteractionDraw,
    OlInteractionSnap: Interactions.OlInteractionSnap,
    OlZoomControl: MapControls.OlZoomControl,
    OlZoomsliderControl: MapControls.OlZoomsliderControl,
    OlSourceXyz: Sources.OlSourceXyz,
    RoutesMapToolbar,
  },
  props: {
    selectedRoutes: {
      type: Array as () => RouteItem[],
      default: () => [],
    },
  },
  setup(props) {
    // styles
    const { borderRadiusCard: borderRadius } = rideToWorkByBikeConfig;
    const { getPaletteColor } = colors;
    const colorWhite = getPaletteColor('white');
    const colorGrey4 = getPaletteColor('grey-4');
    const listHeight = computed((): string => {
      if (Screen.gt.sm) {
        // list header = scroll area is 48px lower than the map
        return '552px';
      }
      return '150px';
    });
    const mapHeight = '600px';

    // map
    const {
      center,
      interactions,
      mapRef,
      projection,
      source,
      zoom,
      centerMapOnRoute,
      centerOnCurrentLocation,
      getRouteLength,
      getRouteLengthLabel,
      styleFunction,
    } = useRoutesMap();

    const mapSourceRef = ref<{ source: XYZ } | null>(null);

    // map routes
    const { savedRoutes, saveRoutes } = useRoutesMapStorage();

    // drawing
    const drawEnabled = ref<boolean>(false);
    const deleteEnabled = ref<boolean>(false);
    // by default, edited routes are those selected in the calendar.

    const editedRoutes = ref<RouteItem[]>(
      props.selectedRoutes.length
        ? props.selectedRoutes
        : (selectedRoutesFixture as RouteItem[]),
    ) as Ref<RouteItem[]>;
    const transportType = ref<TransportType>('bike');

    // geocoding
    const { getRouteNames } = useGeocoding();
    // draw
    const {
      drawRoute,
      drawRouteHistory,
      clearDrawHistory,
      updateDrawRoute,
      undoDrawRoute,
    } = useRoutesMapDraw();
    // tooltip
    const {
      tooltipCoord,
      tooltipText,
      clearTooltip,
      onDrawStartLength,
      onDrawEndLength,
    } = useRoutesMapTooltip({ routes: editedRoutes, transport: transportType });
    // vector layer
    const vectorLayer = ref<InstanceType<typeof Layers.OlVectorLayer> | null>(
      null,
    );
    const { addMapRoute, clearMapRoutes, renderRoute } =
      useRoutesMapVectorLayer(vectorLayer);

    /**
     * Called when a new path is being drawn on the map.
     * @return {void}
     */
    const onDrawStart = (event: DrawEvent): void => {
      clearMapRoutes();
      onDrawStartLength(event);
    };

    /**
     * Called after a new path is drawn on the map.
     * @param event DrawEvent
     * @return {void}
     */
    const onDrawEnd = (event: DrawEvent): void => {
      const feature = event.feature;
      updateDrawRoute(feature);
      onDrawEndLength();
    };

    /**
     * Called after a path is modified on the map.
     * @param event ModifyEvent
     * @return {void}
     */
    const onModifyEnd = (event: ModifyEvent): void => {
      // get first feature (there should always be only one)
      const feature = event.features.getArray()[0];
      updateDrawRoute(feature);
    };

    /**
     * Toggles the draw mode.
     * When switched off, resets currently edited route to initial state.
     */
    const toggleDrawEnabled = (): void => {
      // do not allow if no routes are selected
      if (!editedRoutes.value.length) {
        Notify.create({
          type: 'warning',
          message: i18n.global.t('notify.noRouteSelected'),
        });
        return;
      }
      if (drawEnabled.value === true) {
        drawEnabled.value = false;
        clearTooltip();
        resetEditedRoute();
        clearDrawHistory();
      } else {
        drawEnabled.value = true;
        // reset history only if delete has not been enabled before
        if (!deleteEnabled.value) {
          setEditedRouteHistory();
        }
      }
      // switch off delete mode
      deleteEnabled.value = false;
    };

    /**
     * Toggles the delete mode.
     * When switched off, resets currently edited route to initial state.
     */
    const toggleDeleteEnabled = (): void => {
      // do not allow if no routes are selected
      if (!editedRoutes.value.length) {
        Notify.create({
          type: 'warning',
          message: i18n.global.t('notify.noRouteSelected'),
        });
        return;
      }
      if (deleteEnabled.value === true) {
        deleteEnabled.value = false;
        clearTooltip();
        resetEditedRoute();
        clearDrawHistory();
      } else {
        deleteEnabled.value = true;
        // reset history only if draw has not been enabled before
        if (!drawEnabled.value) {
          setEditedRouteHistory();
        }
      }
      // switch off draw mode
      drawEnabled.value = false;
    };

    /**
     * Sets the draw route history from the currently edited route.
     * @return {void}
     */
    const setEditedRouteHistory = (): void => {
      if (editedRoutes.value.length === 1) {
        const feature = editedRoutes.value[0].routeFeature?.feature;
        if (feature) {
          // set history entry
          const geometry = feature.clone().getGeometry();
          if (geometry instanceof LineString) {
            drawRouteHistory.value = [geometry.getCoordinates()];
          }
        }
      }
    };

    /**
     * Resets the edited route to the initial state.
     * Works if there is only one saved route.
     * @return {void}
     */
    const resetEditedRoute = (): void => {
      if (editedRoutes.value.length === 1) {
        const editedRoute = editedRoutes.value[0];
        if (editedRoute && editedRoute.routeFeature?.feature) {
          const newFeature = editedRoute.routeFeature.feature.clone();
          newFeature.setGeometry(new LineString(drawRouteHistory.value[0]));
          editedRoute.routeFeature.feature = newFeature;
          renderRoute(editedRoute.routeFeature.feature);
        }
      }
    };

    /**
     * If possible, undo last route modification and update route on the map.
     * If there are no changes in history, do nothing.
     * @return {void}
     */
    const onUndo = (): void => {
      const newFeature = undoDrawRoute();
      if (newFeature) {
        // update map
        clearMapRoutes();
        addMapRoute(newFeature);
      }
    };

    /**
     * Save drawRoute to local array of routes.
     * Before saving, get start and end names of the route.
     * @return {Promise<void>}
     */
    const onSaveRoute = async (): Promise<void> => {
      let routesToSave = [] as RouteItem[];
      if (drawRoute.value) {
        const { startName, endName } = await getRouteNames(drawRoute.value);
        const length = getRouteLength(drawRoute.value);
        // for each route being edited, set the routeFeature prop
        routesToSave = editedRoutes.value.map((route) => {
          const feature = drawRoute.value?.clone();
          route.routeFeature = {
            endName,
            length,
            feature: feature ? feature : null,
            startName,
          } as RouteFeature;
          return route;
        });
      }
      if (routesToSave) {
        // save routes locally
        saveRoutes(routesToSave);

        // TODO: Save routes via API request
      }
      clearDrawHistory();
      // disable drawing
      drawEnabled.value = false;
      deleteEnabled.value = false;
      // clear edited routes to avoid duplicate entries
      editedRoutes.value = [];
    };

    /**
     * Called when a saved routes list item is clicked.
     * Renders clicked route on the map.
     * @param route RouteItem
     * @return {void}
     */
    const onSavedRouteClick = (route: RouteItem): void => {
      if (route.routeFeature?.feature) {
        const feature = route.routeFeature.feature.clone();
        const newEditedRoute = {
          ...route,
          routeFeature: {
            ...route.routeFeature,
            feature,
          },
        };
        // ensures, that update does not happen until saved
        editedRoutes.value = [newEditedRoute];
        renderRoute(newEditedRoute.routeFeature.feature);
        centerMapOnRoute(newEditedRoute.routeFeature.feature);
      }
    };

    /**
     * Called when map source is changed.
     * Sets the given source and refreshes the tiles.
     * Official example did not work: https://vue3openlayers.netlify.app/componentsguide/sources/xyz/
     * @param selectedSource string - source url
     * @return {void}
     */
    const onUpdateSource = (selectedSource: string): void => {
      if (mapSourceRef.value) {
        source.value = selectedSource;
        mapSourceRef.value.source.setUrl(selectedSource);
        mapSourceRef.value.source.refresh();
      }
    };

    const isDrawDisabled = computed((): boolean => {
      return !editedRoutes.value.length;
    });

    const isDeleteDisabled = computed((): boolean => {
      return !editedRoutes.value.length;
    });

    const isSaveDisabled = computed((): boolean => {
      return drawRouteHistory.value.length <= 1;
    });

    const isUndoDisabled = computed((): boolean => {
      return drawRouteHistory.value.length <= 1;
    });

    /**
     * Returns CSS classes for a given route based on whether it is being
     * edited.
     * @param {RouteItem} route - The route to get classes for.
     * @return {string} The CSS classes.
     */
    const getRouteClasses = (route: RouteItem) => {
      const activeClasses = 'bg-secondary text-primary';
      const isActive = editedRoutes.value.some((editedRoute) => {
        return (
          editedRoute.date === route.date &&
          editedRoute.direction === route.direction
        );
      });
      return isActive ? activeClasses : '';
    };

    const { formatDate } = date;

    return {
      borderRadius,
      center,
      colorWhite,
      colorGrey4,
      deleteEnabled,
      drawEnabled,
      drawRouteHistory,
      editedRoutes,
      interactions,
      isDeleteDisabled,
      isDrawDisabled,
      isSaveDisabled,
      isUndoDisabled,
      listHeight,
      mapHeight,
      mapRef,
      mapSourceRef,
      projection,
      savedRoutes,
      source,
      tooltipCoord,
      tooltipText,
      transportType,
      vectorLayer,
      zoom,
      addMapRoute,
      centerOnCurrentLocation,
      formatDate,
      getRouteClasses,
      getRouteLengthLabel,
      onDrawStart,
      onDrawEnd,
      onModifyEnd,
      onSaveRoute,
      onSavedRouteClick,
      onUpdateSource,
      onUndo,
      renderRoute,
      styleFunction,
      toggleDeleteEnabled,
      toggleDrawEnabled,
    };
  },
});
</script>

<template>
  <div>
    <!-- Container: Map -->
    <div
      class="row q-my-lg"
      data-cy="routes-map"
      :style="{
        borderRadius,
        overflow: 'hidden',
        border: `1px solid ${colorGrey4}`,
      }"
    >
      <!-- Column: Drawn routes -->
      <div class="col-12 col-sm-2">
        <!-- List: Drawn routes -->
        <q-list separator data-cy="routes-list">
          <!-- List header -->
          <q-item
            class="bg-primary text-white text-weight-bold text-center"
            data-cy="routes-list-header"
          >
            <q-item-section class="text-subtitle2 text-uppercase">
              {{ $t('routes.titleYourRoutes') }}
            </q-item-section>
          </q-item>

          <q-scroll-area :style="{ height: listHeight }">
            <!-- Item: Drawn route -->
            <template v-if="savedRoutes.length">
              <q-item
                clickable
                v-ripple
                v-for="(route, index) in savedRoutes"
                :key="`route-${index}`"
                @click="onSavedRouteClick(route as RouteItem)"
                :class="getRouteClasses(route as RouteItem)"
                :data-cy="`route-list-item-${index}`"
              >
                <q-item-section
                  v-if="
                    route.routeFeature &&
                    route.routeFeature['startName'] &&
                    route.routeFeature['endName']
                  "
                >
                  <div>
                    <span data-cy="route-item-name-start">{{
                      route.routeFeature['startName']
                    }}</span>
                    <q-icon
                      name="sym_s_arrow_right_alt"
                      class="q-px-xs"
                      data-cy="route-item-name-icon"
                    />
                    <span data-cy="route-item-name-finish">{{
                      route.routeFeature['endName']
                    }}</span>
                  </div>
                  <div v-if="route.routeFeature['length']">
                    <small data-cy="route-item-length">
                      {{
                        getRouteLengthLabel(route.routeFeature as RouteFeature)
                      }}
                    </small>
                    <small class="q-px-xs"> - </small>
                    <small>
                      {{ formatDate(route.date, 'D. M.') }}
                    </small>
                    <small> ({{ $t(`global.${route.direction}`) }}) </small>
                  </div>
                </q-item-section>
              </q-item>
            </template>
            <template v-else>
              <q-item
                class="text-center text-grey-6"
                data-cy="routes-list-empty"
              >
                <q-item-section>
                  {{ $t('routes.textNoRoutes') }}
                </q-item-section>
              </q-item>
            </template>
          </q-scroll-area>
        </q-list>
      </div>

      <!-- Column: Map -->
      <div class="relative-position col-12 col-sm-10">
        <!-- Toolbar: Top -->
        <routes-map-toolbar
          :delete-enabled="deleteEnabled"
          :delete-disabled="isDeleteDisabled"
          :draw-enabled="drawEnabled"
          :draw-disabled="isDrawDisabled"
          :save-disabled="isSaveDisabled"
          :undo-disabled="isUndoDisabled"
          @current-position="centerOnCurrentLocation"
          @save:route="onSaveRoute"
          @update:source="onUpdateSource"
          @update:delete-enabled="toggleDeleteEnabled"
          @update:draw-enabled="toggleDrawEnabled"
          @undo="onUndo"
          data-cy="routes-map-toolbar"
        />
        <!-- Map -->
        <ol-map
          ref="mapRef"
          :loadTilesWhileAnimating="true"
          :loadTilesWhileInteracting="true"
          :style="{ height: mapHeight }"
          :interactions="interactions"
          data-cy="routes-map-map"
        >
          <!-- View -->
          <ol-view
            ref="view"
            :center="center"
            :zoom="zoom"
            :projection="projection"
          />
          <!-- Layer for OpenStreetMap tiles -->
          <ol-tile-layer>
            <!-- <ol-source-osm /> -->
            <ol-source-xyz ref="mapSourceRef" :url="source" />
          </ol-tile-layer>
          <!-- Zoom controls -->
          <ol-zoom-control />
          <ol-zoomslider-control />
          <!-- Layer for the drawn routes -->
          <ol-vector-layer ref="vectorLayer" title="routes">
            <ol-source-vector ref="vectorSource">
              <!-- Interaction modify handler -->
              <ol-interaction-modify
                v-if="drawEnabled"
                :delete-condition="() => false"
                @modifyend="onModifyEnd"
              />
              <!-- Interaction delete handler -->
              <ol-interaction-modify
                v-if="deleteEnabled"
                :delete-condition="() => true"
                @modifyend="onModifyEnd"
              />
              <!-- Interaction draw handler -->
              <ol-interaction-draw
                v-if="drawEnabled"
                type="LineString"
                @drawstart="onDrawStart"
                @drawend="onDrawEnd"
              />
              <!-- Interaction snap handler -->
              <ol-interaction-snap v-if="drawEnabled" />
              <!-- Style -->
              <ol-style :override-style-function="styleFunction" />
            </ol-source-vector>
          </ol-vector-layer>

          <!-- Tooltip on draw -->
          <ol-overlay
            v-if="tooltipCoord"
            :position="tooltipCoord"
            :offset="[0, -15]"
            positioning="bottom-center"
            :stopEvent="false"
            :insertFirst="false"
          >
            <div class="tooltip tooltip-measure" v-html="tooltipText" />
          </ol-overlay>
        </ol-map>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tooltip {
  position: relative;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  opacity: 0.9;
  white-space: nowrap;
  font-size: 12px;
  cursor: default;
  user-select: none;
}
.tooltip-measure {
  font-weight: bold;
}
.tooltip-measure:before {
  border-top: 6px solid rgba(0, 0, 0, 0.9);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: '';
  position: absolute;
  bottom: -6px;
  margin-left: -7px;
  left: 50%;
}
</style>
