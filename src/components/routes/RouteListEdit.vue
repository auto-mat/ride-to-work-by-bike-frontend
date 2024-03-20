<script lang="ts">
/**
 * RouteListEdit Component
 *
 * @description * Use this component to render routes in a list view.
 *
 * @props
 * - `routes` (object, required): The object representing a list of routes.
 *   It should be of type `object`.
 *
 * @components
 * - `RouteItemEdit`: Component to render a single route.
 *
 * @example
 * <route-list :routes="routes" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104042&mode=dev)
 */

// libraries
import { date } from 'quasar';
import { computed, defineComponent } from 'vue';

// types
import type { RouteItem, RouteListDay } from '../types/Route';

// component
import RouteItemEdit from './RouteItemEdit.vue';

// composables
import { i18n } from 'src/boot/i18n';

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
    const days = computed(() => {
      const dayArray: RouteListDay[] = [];

      props.routes?.forEach((route) => {
        const routeDate = route.date;
        let day: RouteListDay | undefined = dayArray.find((day) => {
          return day.date === routeDate;
        });

        if (!day) {
          day = { date: routeDate, routes: [] };
          dayArray.push(day);
        }

        day.routes.push(route);
      });

      return dayArray;
    });

    const formatDate = (dateString: string) => {
      const timeStamp = new Date(dateString);
      // using quasar date object
      return date.formatDate(timeStamp, 'D. MMM');
    };
    const formatDateName = (dateString: string) => {
      const timeStamp = new Date(dateString);
      const nowStamp = new Date();
      const yesterdayStamp = new Date();
      yesterdayStamp.setDate(nowStamp.getDate() - 1);

      // using quasar date object
      if (date.isSameDate(timeStamp, nowStamp, 'day')) {
        return i18n.global.t('time.today');
      }

      if (date.isSameDate(timeStamp, yesterdayStamp, 'day')) {
        return i18n.global.t('time.yesterday');
      }

      return date.formatDate(timeStamp, 'dddd');
    };

    return {
      days,
      formatDate,
      formatDateName,
    };
  },
});
</script>

<template>
  <div data-cy="route-list">
    <div
      v-for="day in days"
      :key="day.date"
      class="q-my-xl"
      data-cy="route-list-day"
    >
      <h3 class="text-h6 text-grey-10" data-cy="route-list-day-date">
        {{ formatDateName(day.date) }} ({{ formatDate(day.date) }})
      </h3>
      <route-item-edit
        v-for="route in day.routes"
        :route="route"
        :key="route.id"
        class="q-my-md"
        data-cy="route-list-item"
      />
    </div>
  </div>
</template>
