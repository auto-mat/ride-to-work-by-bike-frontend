<script lang="ts">
/**
 * RouteListEdit Component
 *
 * @description * Use this component to render routes in a list view
 * for editing.
 *
 * @props
 * - `routes` (RouteItem, required): The object representing a list of routes.
 *   It should be of type `RouteItem`.
 *
 * @components
 * - `RouteItemEdit`: Component to render a single route in edit mode.
 *
 * @example
 * <route-list-edit :routes="routes" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104042&mode=dev)
 */

// libraries
import { computed, defineComponent, onMounted, ref } from 'vue';

// component
import RouteItemEdit from './RouteItemEdit.vue';

// composables
import { useRoutes } from 'src/composables/useRoutes';

// types
import type { RouteItem, RouteListDay } from '../types/Route';

export default defineComponent({
  name: 'RouteListEdit',
  props: {
    routes: {
      type: Array as () => RouteItem[],
    },
  },
  components: {
    RouteItemEdit,
  },
  setup(props) {
    const { formatDate, formatDateName, getDays } = useRoutes();
    const days = ref([] as RouteListDay[]);
    // initiate local routes object
    onMounted(() => {
      days.value = getDays(props.routes);
    });

    // dirty state will be tracked within UI to show change count
    const dirtyCount = computed((): number => {
      let count = 0;
      days.value.forEach((day) => {
        count += day.routes.filter((route) => route.dirty).length;
      });
      return count;
    });

    return {
      days,
      dirtyCount,
      formatDate,
      formatDateName,
    };
  },
});
</script>

<template>
  <div data-cy="route-list-edit">
    <!-- Item: Day -->
    <div
      v-for="day in days"
      :key="day.date"
      class="q-my-xl"
      data-cy="route-list-day"
    >
      <!-- Title: Date -->
      <h3 class="text-h6 text-grey-10" data-cy="route-list-day-date">
        {{ formatDateName(day.date) }} ({{ formatDate(day.date) }})
      </h3>
      <!-- Item: Route -->
      <route-item-edit
        display-label
        v-for="route in day.routes"
        :route="route"
        :key="route.id"
        class="q-my-md"
        data-cy="route-list-item"
        @update:route="route.dirty = $event"
      />
    </div>
    <div class="flex items-center justify-center">
      <q-btn rounded unelevated outline color="primary" data-cy="button-save">
        {{
          $tc('routes.buttonSaveChangesCount', dirtyCount, {
            count: dirtyCount,
          })
        }}
      </q-btn>
    </div>
  </div>
</template>
