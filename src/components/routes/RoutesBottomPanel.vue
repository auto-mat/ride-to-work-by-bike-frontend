<script lang="ts">
/**
 * RoutesBottomPanel Component
 *
 * @description * Use this component to render action panel to log a route..
 *
 * @props
 * - `route` (RouteItem, required): The object representing a route.
 *   It should be of type `RouteItem`.
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
import { defineComponent, ref } from 'vue';

// components
import RouteItemEdit from './RouteItemEdit.vue';

// types
import type { RouteItem } from '../types/Route';

export default defineComponent({
  name: 'RoutesBottomPanel',
  components: {
    RouteItemEdit,
  },
  props: {
    route: {
      type: Object as () => RouteItem,
    },
  },
  setup() {
    const isDialogOpen = ref(false);

    return {
      isDialogOpen,
    };
  },
});
</script>

<template>
  <!-- Dialog -->
  <q-dialog
    v-model="isDialogOpen"
    position="bottom"
    data-cy="footer-panel-menu-dialog"
  >
    <route-item-edit v-if="route" :route="route" data-cy="route-list-item" />
  </q-dialog>
</template>
