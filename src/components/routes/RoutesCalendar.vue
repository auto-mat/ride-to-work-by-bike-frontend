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
    const selectedDate = ref(today());

    // Get data
    const routes = routesListCalendarFixture;
    const routesMap = computed(() => {
      const routesObject = {};
      if (routes.length > 0) {
        routes.forEach((route) => {
          routesObject[route.date] = { ...route, active: false };
        });
      }
      return routesObject;
    });

    // TODO: remove example functions
    function onMoved(data) {
      console.log('onMoved', data);
    }
    function onChange(data) {
      console.log('onChange', data);
    }
    function onClickDate(data) {
      console.log('onClickDate', data);
    }
    function onClickTime(data) {
      console.log('onClickTime', data);
    }
    function onClickInterval(data) {
      console.log('onClickInterval', data);
    }
    function onClickHeadIntervals(data) {
      console.log('onClickHeadIntervals', data);
    }
    function onClickDay(data) {
      console.log('onClickDay', data);
    }
    function onClickWorkweek(data) {
      console.log('onClickWorkweek', data);
    }
    function onClickHeadDay(data) {
      console.log('onClickHeadDay', data);
    }
    function onClickHeadWorkweek(data) {
      console.log('onClickHeadWorkweek', data);
    }

    // TODO: Currently, the calendar registers new date but does not re-render.
    function onToday() {
      calendar.value?.moveToToday();
    }
    function onPrev() {
      calendar.value?.prev();
    }
    function onNext() {
      calendar.value?.next();
    }

    const activeItem = ref<Timestamp>(parsed(today()));
    const activeDirection = ref<'toWork' | 'fromWork'>('toWork');
    const isActive = ({
      timestamp,
      direction,
    }: {
      timestamp: Timestamp;
      direction: 'toWork' | 'fromWork';
    }): boolean => {
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
    };
    function onClickItem(payload) {
      activeItem.value = payload.timestamp;
      activeDirection.value = payload.direction;
    }

    return {
      activeItem,
      calendar,
      selectedDate,
      routesMap,
      isActive,
      onChange,
      onClickDate,
      onClickDay,
      onClickTime,
      onClickInterval,
      onClickItem,
      onClickHeadIntervals,
      onClickHeadDay,
      onClickHeadWorkweek,
      onClickWorkweek,
      onMoved,
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
        locale="cs"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        weekday-align="center"
        date-align="right"
        date-type="rounded"
        :day-min-height="100"
        @change="onChange"
        @moved="onMoved"
        @click-date="onClickDate"
        @click-day="onClickDay"
        @click-workweek="onClickWorkweek"
        @click-head-workweek="onClickHeadWorkweek"
        @click-head-day="onClickHeadDay"
      >
        <template #day="{ scope: { timestamp } }">
          <div class="q-my-sm">
            <!-- Route to work -->
            <calendar-item-display
              :active="isActive({ timestamp, direction: 'toWork' })"
              direction="toWork"
              :day="routesMap[timestamp.date]"
              :timestamp="timestamp"
              @item-click="onClickItem"
            />
            <!-- Route from work -->
            <calendar-item-display
              :active="isActive({ timestamp, direction: 'fromWork' })"
              direction="fromWork"
              :day="routesMap[timestamp.date]"
              :timestamp="timestamp"
              @item-click="onClickItem"
            />
          </div>
        </template>
      </q-calendar-month>
    </div>
  </div>
</template>
