<script lang="ts">
/**
 * RoutesBottomPanel Component
 *
 * @description * Use this component to render action panel to log a route..
 *
 * @props
 * - `isOpen` (boolean, optional): Whether the panel is open.
 * - `route` (RouteItem, required): The object representing a route.
 *   It should be of type `RouteItem`.
 * - `routeCount` (number): The number of routes affected.
 *
 * @components
 * - `RouteItemEdit`: Component to display an editable route.
 *
 * @example
 * <routes-bottom-panel></routes-bottom-panel>
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103954&mode=dev)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';
import { Screen } from 'quasar';

// components
import RouteItemEdit from './RouteItemEdit.vue';

// fixtures
import routeList from '../../../test/cypress/fixtures/routeList.json';

// types
import type { RouteItem } from '../types/Route';

export default defineComponent({
  name: 'RoutesBottomPanel',
  components: {
    RouteItemEdit,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    route: {
      type: Object as () => RouteItem,
    },
    routeCount: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const isDialogOpen = ref(props.isOpen);

    const routeSource: RouteItem = props.route
      ? ({ ...props.route } as RouteItem)
      : ({ ...routeList[0] } as RouteItem);

    const panelWidth = computed((): string => {
      if (Screen.gt.md) {
        return '920px';
      }
      return 'auto';
    });

    return {
      isDialogOpen,
      panelWidth,
      routeSource,
    };
  },
});
</script>

<template>
  <!-- Dialog -->
  <q-dialog
    v-model="isDialogOpen"
    position="bottom"
    data-cy="route-bottom-panel"
  >
    <div class="bg-white q-pa-md" :style="{ 'min-width': panelWidth }">
      <!-- Section: Header -->
      <div class="row justify-between">
        <!-- Title -->
        <h2
          class="q-my-none text-h6 font-weight-normal"
          data-cy="bottom-panel-title"
        >
          {{
            $tc('routes.titleBottomPanel', routeCount, { count: routeCount })
          }}
        </h2>
        <!-- Button: Close -->
        <q-btn
          dense
          unelevated
          icon="close"
          size="sm"
          @click="isDialogOpen = false"
          data-cy="bottom-panel-close"
        />
      </div>
      <!-- Section: Main -->
      <div v-if="routeSource" class="row q-mt-lg">
        <div class="col-12 col-lg-11">
          <!-- Item: Route edit -->
          <route-item-edit :route="routeSource" data-cy="route-item-edit" />
        </div>
        <div class="col-12 col-lg-1">
          <div class="flex justify-end q-mt-md">
            <!-- Button: Save -->
            <q-btn
              unelevated
              round
              color="primary"
              icon="check"
              @click="isDialogOpen = false"
              data-cy="bottom-panel-save"
            />
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
