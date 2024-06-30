<script lang="ts">
/**
 * RoutesCalendar Component
 *
 * @description * Use this component to render a calendar for logging routes.
 * This component is used on `RoutesPage` in `RouteTabs` component.
 *
 * @components
 * - `CalendarNavigation`: Component to render navigation buttons.
 * - `CalendarItemDisplay`: Component to render calendar items.
 *
 * @example
 * <routes-calendar />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104006&t=kwUDasKoJ1urpPut-1)
 */

// libraries
import { parsed, QCalendarMonth, today } from '@quasar/quasar-ui-qcalendar';
import { defineComponent, computed, ref } from 'vue';

// components
import CalendarItemDisplay from './CalendarItemDisplay.vue';
import CalendarNavigation from './CalendarNavigation.vue';

// types
import type { Timestamp } from '@quasar/quasar-ui-qcalendar';
import type { RouteCalendarDay, TransportDirection } from '../types/Route';

// fixtures
import routesListCalendarFixture from '../../../test/cypress/fixtures/routeListCalendar.json';

export default defineComponent({
  name: 'RoutesCalendar',
  components: {
    CalendarItemDisplay,
    CalendarNavigation,
  },
  setup() {
    const calendar = ref<typeof QCalendarMonth | null>(null);
    const selectedDate = ref<string>(today());

    // Calendar naviation functions
    function onToday() {
      calendar.value?.moveToToday();
    }
    function onPrev() {
      calendar.value?.prev();
    }
    function onNext() {
      calendar.value?.next();
    }

    // Get data
    const routes: RouteCalendarDay[] =
      routesListCalendarFixture as RouteCalendarDay[];

    /**
     * Computed property of the routes map.
     * Contains an array of days - each with two routes:
     * - to work
     * - from work
     */
    const routesMap = computed((): Record<string, RouteCalendarDay> => {
      const routesObject = {} as Record<string, RouteCalendarDay>;
      if (routes.length > 0) {
        routes.forEach((route) => {
          routesObject[route.date] = route;
        });
      }
      return routesObject;
    });

    // Active state
    const activeItem = ref<Timestamp | null>(parsed(today()));
    const activeDirection = ref<TransportDirection>('toWork');

    /**
     * Determines if route item is active.
     * It checks if the timestamp and direction against a stored state.
     * @param param0 { timestamp: Timestamp; direction: TransportDirection }
     */
    function isActive({
      timestamp,
      direction,
    }: {
      timestamp: Timestamp;
      direction: TransportDirection;
    }): boolean {
      if (
        !timestamp ||
        !direction ||
        !activeItem.value ||
        !activeDirection.value
      ) {
        return false;
      }
      return (
        activeItem.value.date === timestamp.date &&
        activeDirection.value === direction
      );
    }

    /**
     * Handles click on route item within a day frame.
     * It triggers active state on that day.
     * It controls content of the route-logging dialog panel.
     * @param param0 { timestamp: Timestamp; direction: TransportDirection }
     * @returns void
     */
    function onClickItem({
      timestamp,
      direction,
    }: {
      timestamp: Timestamp;
      direction: TransportDirection;
    }): void {
      activeItem.value = timestamp;
      activeDirection.value = direction;
    }

    return {
      activeItem,
      calendar,
      selectedDate,
      routesMap,
      isActive,
      onClickItem,
      onNext,
      onPrev,
      onToday,
    };
  },
});
</script>

<template>
  <div data-cy="routes-calendar">
    <!-- Navigation bar -->
    <calendar-navigation
      @next="onNext"
      @prev="onPrev"
      @today="onToday"
      class="q-mt-md"
    />
    <!-- Calendar -->
    <div class="row justify-center q-mt-lg">
      <q-calendar-month
        ref="calendar"
        v-model="selectedDate"
        animated
        bordered
        hoverable
        no-active-date
        use-navigation
        short-weekday-label
        locale="cs"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        weekday-align="center"
        date-align="right"
        date-type="rounded"
        :day-min-height="100"
      >
        <template #day="{ scope: { timestamp } }">
          <div class="q-my-sm" data-cy="calendar-day">
            <!-- Route to work -->
            <calendar-item-display
              :active="isActive({ timestamp, direction: 'toWork' })"
              direction="toWork"
              :day="routesMap[timestamp.date]"
              :timestamp="timestamp"
              @item-click="onClickItem"
              data-cy="calendar-item-display-to-work"
            />
            <!-- Route from work -->
            <calendar-item-display
              :active="isActive({ timestamp, direction: 'fromWork' })"
              direction="fromWork"
              :day="routesMap[timestamp.date]"
              :timestamp="timestamp"
              @item-click="onClickItem"
              data-cy="calendar-item-display-from-work"
            />
          </div>
        </template>
      </q-calendar-month>
    </div>
  </div>
</template>
