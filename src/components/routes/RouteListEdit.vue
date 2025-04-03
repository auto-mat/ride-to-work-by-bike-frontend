<script lang="ts">
/**
 * RouteListEdit Component
 *
 * @description * Use this component to render routes which can be edited
 * by the user. The number of routes to log is defined by global config var
 * `challengeLoggingWindowDays`.
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
import { computed, defineComponent, ref, watch } from 'vue';

// component
import RouteItemEdit from './RouteItemEdit.vue';

// composables
import { useRoutes } from 'src/composables/useRoutes';

// stores
import { useTripsStore } from 'src/stores/trips';

// types
import type { RouteItem, RouteDay } from '../types/Route';

export default defineComponent({
  name: 'RouteListEdit',
  components: {
    RouteItemEdit,
  },
  setup() {
    const tripsStore = useTripsStore();
    // route composables
    const { getLoggableDaysWithRoutes, formatDate, formatDateName } =
      useRoutes();
    // get route items from store
    const routeItems = computed<RouteItem[]>(() => tripsStore.getRouteItems);

    const days = ref<RouteDay[]>(getLoggableDaysWithRoutes(routeItems.value));
    // update current days when route items change in store
    watch(routeItems, () => {
      days.value = getLoggableDaysWithRoutes(routeItems.value);
    });

    // dirty state will be tracked within UI to show change count
    const dirtyCount = computed((): number => {
      let count = 0;
      days.value.forEach((day) => {
        if (day.fromWork?.dirty) {
          count += 1;
        }
        if (day.toWork?.dirty) {
          count += 1;
        }
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
          <!-- Item: Route to work -->
          <div class="col-12 col-sm-6" data-cy="route-list-item-wrapper">
            <route-item-edit
              :route="day.toWork"
              class="full-height"
              data-cy="route-list-item"
              :data-id="day.toWork?.id"
              @update:route="day.toWork = $event"
            />
          </div>
          <!-- Item: Route from work -->
          <div class="col-12 col-sm-6" data-cy="route-list-item-wrapper">
            <route-item-edit
              :route="day.fromWork"
              class="full-height"
              data-cy="route-list-item"
              :data-id="day.fromWork?.id"
              @update:route="day.fromWork = $event"
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
          $t('routes.buttonSaveChangesCount', dirtyCount, {
            count: dirtyCount,
          })
        }}
      </q-btn>
    </div>
  </div>
</template>
