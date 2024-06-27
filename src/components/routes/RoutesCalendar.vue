<script lang="ts">
/**
 * RoutesCalendar Component
 *
 * @description * Use this component to render a calendar for logging routes.
 * This component is used on `RoutesPage` in `RouteTabs` component.
 *
 * @components
 * - `CalendarNavigation`: Component to render navigation buttons.
 *
 * @example
 * <routes-calendar />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104006&t=kwUDasKoJ1urpPut-1)
 */

// libraries
import { QCalendarMonth, today } from '@quasar/quasar-ui-qcalendar';
import { defineComponent, computed, ref } from 'vue';

// components
import CalendarNavigation from './CalendarNavigation.vue';

// fixtures
import routesListCalendarFixture from '../../../test/cypress/fixtures/routeListCalendar.json';

export default defineComponent({
  name: 'RoutesCalendar',
  components: {
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
          routesObject[route.date] = route;
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

    return {
      calendar,
      selectedDate,
      routesMap,

      onChange,
      onClickDate,
      onClickDay,
      onClickTime,
      onClickInterval,
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
            <div class="q-my-sm">
              <!-- Route is already logged: Display and allow editing (within bounds) -->
              <q-item
                v-if="!!routesMap[timestamp.date]?.toWork.id"
                dense
                clickable
                v-ripple
                class="relative-position flex justify-center items-center text-center gap-8"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="full-width full-height absolute-full"
                  fill="none"
                  viewBox="0 0 114 38"
                >
                  <path
                    fill="#E6EBF5"
                    fill-rule="evenodd"
                    d="M91.2 0H0v38h91.2L114 19 91.2 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <q-icon color="primary" name="pedal_bike" size="18px" />
                <span class="relative-position text-caption text-grey-10">
                  {{ routesMap[timestamp.date]?.toWork.distance }} km
                </span>
              </q-item>
              <!-- Route is not logged -->
              <q-item
                v-else
                dense
                clickable
                v-ripple
                class="relative-position flex justify-center items-center text-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="full-width full-height absolute-full"
                  fill="none"
                  viewBox="0 0 114 38"
                >
                  <path
                    fill="#E6EBF5"
                    fill-rule="evenodd"
                    d="M91.2 0H0v38h91.2L114 19 91.2 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <q-icon color="grey-6" name="mdi-plus" size="18px" />
              </q-item>
            </div>
            <!-- Route from work -->
            <div class="q-my-sm">
              <!-- Route is already logged: Display and allow editing (within bounds) -->
              <q-item
                v-if="!!routesMap[timestamp.date]?.fromWork.id"
                dense
                clickable
                v-ripple
                class="relative-position flex justify-center items-center text-center gap-8"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="full-width full-height absolute-full"
                  fill="none"
                  viewBox="0 0 114 38"
                >
                  <path
                    fill="#E6EBF5"
                    fill-rule="evenodd"
                    d="M22.8 0H114v38H22.8L0 19 22.8 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <q-icon color="primary" name="pedal_bike" size="18px" />
                <span class="relative-position text-caption text-grey-10"
                  >{{ routesMap[timestamp.date]?.fromWork.distance }} km</span
                >
              </q-item>
              <q-item
                v-else
                dense
                clickable
                v-ripple
                class="relative-position flex justify-center items-center text-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="full-width full-height absolute-full"
                  fill="none"
                  viewBox="0 0 114 38"
                >
                  <path
                    fill="#E6EBF5"
                    fill-rule="evenodd"
                    d="M22.8 0H114v38H22.8L0 19 22.8 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <q-icon color="grey-6" name="mdi-plus" size="18px" />
              </q-item>
            </div>
          </div>
        </template>
      </q-calendar-month>
    </div>
  </div>
</template>
