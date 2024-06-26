<script lang="ts">
/**
 * RoutesCalendar Component
 *
 * @description * Use this component to ... .
 * You can adjust its appearance by ... .
 *
 * @props
 * - `NAME` (TYPE, required): The object representing ... .
 *   It should be of type `TYPE`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @slots
 * - `content`: For ... .
 *   exposed props and methods:
 *     - `state`
 *
 * @components
 * - `CHILD`: Component to ... .
 *
 * @example
 * <routes-calendar />
 *
 * @see [Figma Design](...)
 */

// libraries
import {
  addToDate,
  parseDate,
  parseTimestamp,
  today,
} from '@quasar/quasar-ui-qcalendar';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'RoutesCalendar',
  setup() {
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

    // The function below is used to set up our demo data
    const CURRENT_DAY = new Date();
    function getCurrentDay(day: number) {
      const newDay = new Date(CURRENT_DAY);
      newDay.setDate(day);
      const tm = parseDate(newDay);
      return tm ? tm.date : '';
    }
    const events = [
      {
        id: 1,
        title: '1st of the Month',
        details:
          'Everything is funny as long as it is happening to someone else',
        date: getCurrentDay(1),
        bgcolor: 'orange',
      },
      {
        id: 2,
        title: 'Sisters Birthday',
        details: 'Buy a nice present',
        date: getCurrentDay(4),
        bgcolor: 'green',
        icon: 'fas fa-birthday-cake',
      },
      {
        id: 3,
        title: 'Meeting',
        details: 'Time to pitch my idea to the company',
        date: getCurrentDay(10),
        time: '10:00',
        duration: 120,
        bgcolor: 'red',
        icon: 'fas fa-handshake',
      },
      {
        id: 4,
        title: 'Lunch',
        details: 'Company is paying!',
        date: getCurrentDay(10),
        time: '11:30',
        duration: 90,
        bgcolor: 'teal',
        icon: 'fas fa-hamburger',
      },
      {
        id: 5,
        title: 'Visit mom',
        details: 'Always a nice chat with mom',
        date: getCurrentDay(20),
        time: '17:00',
        duration: 90,
        bgcolor: 'grey',
        icon: 'fas fa-car',
      },
      {
        id: 6,
        title: 'Conference',
        details: 'Teaching Javascript 101',
        date: getCurrentDay(22),
        time: '08:00',
        duration: 540,
        bgcolor: 'blue',
        icon: 'fas fa-chalkboard-teacher',
      },
      {
        id: 7,
        title: 'Girlfriend',
        details: 'Meet GF for dinner at Swanky Restaurant',
        date: getCurrentDay(22),
        time: '19:00',
        duration: 180,
        bgcolor: 'teal',
        icon: 'fas fa-utensils',
      },
      {
        id: 8,
        title: 'Rowing',
        details: 'Stay in shape!',
        date: getCurrentDay(27),
        bgcolor: 'purple',
        icon: 'rowing',
        days: 2,
      },
      {
        id: 9,
        title: 'Fishing',
        details: 'Time for some weekend R&R',
        date: getCurrentDay(27),
        bgcolor: 'purple',
        icon: 'fas fa-fish',
        days: 2,
      },
      {
        id: 10,
        title: 'Vacation',
        details:
          "Trails and hikes, going camping! Don't forget to bring bear spray!",
        date: getCurrentDay(29),
        bgcolor: 'purple',
        icon: 'fas fa-plane',
        days: 5,
      },
    ];
    const eventsMap = computed(() => {
      const map = {};
      if (events.length > 0) {
        events.forEach((event) => {
          (map[event.date] = map[event.date] || []).push(event);
          if (event.days !== undefined) {
            let timestamp = parseTimestamp(event.date);
            let days = event.days;
            // add a new event for each day
            // skip 1st one which would have been done above
            do {
              timestamp = addToDate(timestamp, { day: 1 });
              if (!map[timestamp.date]) {
                map[timestamp.date] = [];
              }
              map[timestamp.date].push(event);
              // already accounted for 1st day
            } while (--days > 1);
          }
        });
      }
      console.log(map);
      return map;
    });

    function badgeClasses(event) {
      return {
        [`text-white bg-${event.bgcolor}`]: true,
        'rounded-border': true,
      };
    }

    function badgeStyles() {
      const s = {};
      // s.left = day.weekday === 0 ? 0 : (day.weekday * this.parsedCellWidth) + '%'
      // s.top = 0
      // s.bottom = 0
      // s.width = (event.days * this.parsedCellWidth) + '%'
      return s;
    }

    return {
      selectedDate: today(),
      dateAlign: 'center',
      weekdayAlign: 'center',
      dateHeader: 'stacked',
      leftColumnOptions: [
        {
          id: 'overdue',
          label: 'Overdue',
        },
      ],
      rightColumnOptions: [
        {
          id: 'summary',
          label: 'Summary',
        },
      ],
      eventsMap,

      badgeClasses,
      badgeStyles,

      onMoved,
      onChange,
      onClickDate,
      onClickDay,
      onClickTime,
      onClickInterval,
      onClickHeadIntervals,
      onClickHeadDay,
      onClickHeadWorkweek,
      onClickWorkweek,
    };
  },
});
</script>

<template>
  <div data-cy="routes-calendar">
    <div class="row justify-center q-mt-lg">
      <div style="display: flex; width: 100%; height: 690px">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          animated
          bordered
          focusable
          hoverable
          no-active-date
          :day-min-height="100"
          :day-height="0"
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
                  v-if="!!eventsMap[timestamp.date]"
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
                  <span class="relative-position text-caption text-grey-10"
                    >20 km</span
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
                  v-if="!!eventsMap[timestamp.date]"
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
                    >20 km</span
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

            <!-- <template
              v-for="event in eventsMap[timestamp.date]"
              :key="event.id"
            >
              <div
                :class="badgeClasses(event, 'day')"
                :style="badgeStyles(event, 'day')"
                class="my-event"
              >
                <div class="title q-calendar__ellipsis">
                  {{ event.title + (event.time ? ' - ' + event.time : '') }}
                  <q-tooltip>{{ event.details }}</q-tooltip>
                </div>
              </div>
            </template> -->
          </template>
        </q-calendar-month>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.my-event
  position: relative
  font-size: 12px
  width: 100%
  margin: 1px 0 0 0
  justify-content: center
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%

.text-white
  color: white

.bg-blue
  background: blue

.bg-green
  background: green

.bg-orange
  background: orange

.bg-red
  background: red

.bg-teal
  background: teal

.bg-grey
  background: grey

.bg-purple
  background: purple

.rounded-border
  border-radius: 2px
</style>
