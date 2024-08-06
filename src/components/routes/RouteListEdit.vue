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
      class="q-my-lg"
      data-cy="route-list-day"
    >
      <!-- Title: Date -->
      <h3 class="text-18 text-grey-10 q-my-none" data-cy="route-list-day-date">
        {{ formatDateName(day.date) }} ({{ formatDate(day.date) }})
      </h3>
      <div class="q-py-md">
        <div class="row q-col-gutter-lg">
          <!-- Item: Route -->
          <div
            v-for="route in day.routes"
            :key="route.id"
            class="col-12 col-sm-6"
            data-cy="route-list-item-wrapper"
          >
            <route-item-edit
              :route="route"
              class="full-height"
              data-cy="route-list-item"
              @update:route="route.dirty = $event"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center">
      <q-btn
        rounded
        unelevated
        color="primary"
        size="16px"
        class="text-weight-bold"
        data-cy="button-save"
      >
        {{
          $tc('routes.buttonSaveChangesCount', dirtyCount, {
            count: dirtyCount,
          })
        }}
      </q-btn>
    </div>
  </div>
</template>
