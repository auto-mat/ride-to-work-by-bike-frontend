<script lang="ts">
/**
 * RouteListDisplay Component
 *
 * @description * Use this component to render routes in a list view as a
 * summary.
 *
 * @props
 * - `routes` (RouteItem, required): The object representing a list of routes.
 *   It should be of type `RouteItem`.
 *
 * @components
 * - `RouteItemDisplay`: Component to render a single route in display mode.
 *
 * @example
 * <route-list-display :routes="routes" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104042&mode=dev)
 */

// libraries
import { computed, defineComponent } from 'vue';

// components
import RouteItemDisplay from './RouteItemDisplay.vue';

// composables
import { useRoutes } from 'src/composables/useRoutes';

// types
import type { RouteItem, RouteListDay } from '../types/Route';

export default defineComponent({
  name: 'RouteListDisplay',
  props: {
    routes: {
      type: Array as () => RouteItem[],
    },
  },
  components: {
    RouteItemDisplay,
  },
  setup(props) {
    const { formatDate, formatDateName, getDays } = useRoutes();
    const days = computed((): RouteListDay[] => {
      return getDays(props.routes);
    });

    return {
      days,
      formatDate,
      formatDateName,
    };
  },
});
</script>

<template>
  <div data-cy="route-list-display">
    <div
      v-for="day in days"
      :key="day.date"
      class="q-my-xl"
      data-cy="route-list-day"
    >
      <h3 class="text-h6 text-grey-10" data-cy="route-list-day-date">
        {{ formatDateName(day.date) }} ({{ formatDate(day.date) }})
      </h3>
      <route-item-display
        v-for="route in day.routes"
        :route="route"
        :key="route.id"
        class="q-my-md"
        data-cy="route-list-item"
      />
    </div>
  </div>
</template>
