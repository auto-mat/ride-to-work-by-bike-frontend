<script lang="ts">
/**
 * RoutesCalendar Component
 *
 * @description * Use this component to render a calendar for logging routes.
 * This component is used on `RoutesPage` in `RouteTabs` component.
 *
 * Note: Calendar is NOT made responsive. We use list view to log routes on mobile.
 *
 * @components
 * - `CalendarNavigation`: Component to render navigation buttons.
 * - `CalendarItemDisplay`: Component to render calendar items.
 * - `RouteCalendarPanel`: Component to render dialog panel.
 *
 * @props
 * - `routes`: Array of routes to display in the calendar.
 *
 * @example
 * <routes-calendar />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104006&t=kwUDasKoJ1urpPut-1)
 */

// libraries
import { colors, date } from 'quasar';
import { QCalendarMonth, today } from '@quasar/quasar-ui-qcalendar';
import { defineComponent, computed, ref, watch } from 'vue';
import { i18n } from '../../boot/i18n';

// components
import CalendarItemDisplay from './CalendarItemDisplay.vue';
import CalendarNavigation from './CalendarNavigation.vue';
import RouteCalendarPanel from './RouteCalendarPanel.vue';

// composables
import { useCalendarRoutes } from '../../composables/useCalendarRoutes';
import { useRoutes } from '../../composables/useRoutes';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// enums
import { TransportDirection } from '../types/Route';

// stores
import { useTripsStore } from '../../stores/trips';

// types
import type { Timestamp } from '@quasar/quasar-ui-qcalendar';
import type { RouteDay } from '../types/Route';

export default defineComponent({
  name: 'RoutesCalendar',
  components: {
    CalendarItemDisplay,
    CalendarNavigation,
    RouteCalendarPanel,
  },
  setup() {
    const calendar = ref<typeof QCalendarMonth | null>(null);
    const selectedDate = ref<string>(today());
    const locale = computed((): string => {
      return i18n.global.locale;
    });

    const { apiDateFormat } = rideToWorkByBikeConfig;
    const {
      dateCompetitionPhaseFrom,
      dateCompetitionPhaseTo,
      dateLoggingStart,
      dateLoggingEnd,
    } = useRoutes();

    const disabledBefore = computed((): string | null => {
      const dateMinusOneDay = dateLoggingStart.value
        ? date.subtractFromDate(dateLoggingStart.value, {
            days: 1,
          })
        : null;
      return dateMinusOneDay
        ? date.formatDate(dateMinusOneDay, apiDateFormat)
        : null;
    });
    const disabledAfter = computed((): string | null => {
      const datePlusOneDay = dateLoggingEnd.value
        ? date.addToDate(dateLoggingEnd.value, { days: 1 })
        : null;
      return datePlusOneDay
        ? date.formatDate(datePlusOneDay, apiDateFormat)
        : null;
    });

    // Define calendar CSS vars for calendar theme
    const { getPaletteColor } = colors;
    const theme = {
      '--calendar-active-date-color': getPaletteColor('primary'),
      '--calendar-current-color': getPaletteColor('primary'),
      '--calendar-border-current': `${getPaletteColor('primary')} 2px solid`,
    };

    // Compute month name and year for title
    const monthNameAndYear = computed((): string => {
      if (!selectedDate.value) {
        return '';
      }
      const date = new Date(selectedDate.value);
      const month = date.toLocaleString(locale.value, { month: 'long' });
      const year = date.toLocaleString(locale.value, { year: 'numeric' });
      return `${month} ${year}`;
    });

    // Calendar naviation functions
    function onToday(): void {
      calendar.value?.moveToToday();
    }
    function onPrev(): void {
      calendar.value?.prev();
    }
    function onNext(): void {
      calendar.value?.next();
    }

    // Get data for calendar
    const tripsStore = useTripsStore();
    const { getCompetitionDaysWithRoutes } = useRoutes();
    const days = computed<RouteDay[]>(() =>
      getCompetitionDaysWithRoutes(tripsStore.getRouteItems),
    );
    const isLoadingRoutes = computed((): boolean => {
      return tripsStore.getIsLoading;
    });

    const {
      activeRoutes,
      activeRouteItems,
      isActiveRouteLogged,
      routesMap,
      getActiveIndex,
      isActive,
      isCalendarRouteLogged,
    } = useCalendarRoutes(days);

    /**
     * Handles click on route item within a day frame.
     * It triggers active state on that day.
     * It controls content of the route-logging dialog panel.
     * @param {Object} { timestamp: Timestamp; direction: TransportDirection }
     * @return {void}
     */
    function onClickItem({
      timestamp,
      direction,
    }: {
      timestamp: Timestamp;
      direction: TransportDirection;
    }): void {
      if (isActive({ timestamp, direction })) {
        activeRoutes.value.splice(getActiveIndex({ timestamp, direction }), 1);
      } else {
        if (
          isActiveRouteLogged.value ||
          isCalendarRouteLogged({ timestamp, direction })
        ) {
          // do not allow selecting multiple logged routes
          activeRoutes.value = [];
        }
        activeRoutes.value.push({ timestamp, direction });
      }
    }

    /**
     * Triggered when user saves active routes.
     * Clears active selection
     */
    function onSave(): void {
      activeRoutes.value = [];
    }

    /**
     * Control dialog open state based on selected routes count.
     */
    const isPanelOpen = ref<boolean>(false);
    watch(
      (): number => activeRoutes.value.length,
      (length): void => {
        if (length === 0) {
          isPanelOpen.value = false;
        } else {
          isPanelOpen.value = true;
        }
      },
    );

    /**
     * Checks if timestamp is in competition phase.
     * @param {Timestamp} timestamp - Timestamp to check.
     * @return {boolean} - True if timestamp is in competition phase, false otherwise.
     */
    const isTimestampInCompetitionPhase = (timestamp: Timestamp): boolean => {
      if (!dateCompetitionPhaseFrom.value || !dateCompetitionPhaseTo.value) {
        return false;
      }
      const dateOneDayBeforeFrom = date.subtractFromDate(
        dateCompetitionPhaseFrom.value,
        { days: 1 },
      );
      const dateOneDayAfterTo = date.addToDate(dateCompetitionPhaseTo.value, {
        days: 1,
      });
      return date.isBetweenDates(
        timestamp.date,
        dateOneDayBeforeFrom,
        dateOneDayAfterTo,
      );
    };

    return {
      activeRouteItems,
      calendar,
      disabledAfter,
      disabledBefore,
      isPanelOpen,
      isActiveRouteLogged,
      isLoadingRoutes,
      locale,
      monthNameAndYear,
      routesMap,
      selectedDate,
      theme,
      TransportDirection,
      isActive,
      isTimestampInCompetitionPhase,
      onClickItem,
      onNext,
      onPrev,
      onSave,
      onToday,
    };
  },
});
</script>

<template>
  <div data-cy="routes-calendar" class="relative-position">
    <!-- Top bar -->
    <div class="row q-pb-sm q-my-lg items-center gap-8">
      <!-- Title -->
      <div
        class="col-12 col-sm-auto text-h5 text-capitalize text-weight-bold"
        data-cy="calendar-title"
      >
        {{ monthNameAndYear }}
      </div>
      <!-- Navigation buttons -->
      <calendar-navigation
        @next="onNext"
        @prev="onPrev"
        @today="onToday"
        class="col-12 col-sm"
      />
    </div>
    <!-- Calendar -->
    <div class="relative-position row justify-center q-mt-lg">
      <q-calendar-month
        ref="calendar"
        v-model="selectedDate"
        animated
        bordered
        hoverable
        enable-outside-days
        no-active-date
        use-navigation
        short-weekday-label
        :disabled-before="disabledBefore"
        :disabled-after="disabledAfter"
        :locale="locale"
        :show-month-label="false"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        weekday-align="center"
        :style="theme"
        date-align="right"
        date-type="rounded"
        :day-min-height="100"
      >
        <template #day="{ scope: { timestamp } }">
          <div
            v-if="isTimestampInCompetitionPhase(timestamp)"
            :data-date="timestamp.date"
            class="q-my-sm"
            data-cy="calendar-day"
          >
            <!-- Route to work -->
            <calendar-item-display
              :active="
                isActive({ timestamp, direction: TransportDirection.toWork })
              "
              :disabled="timestamp.disabled"
              :direction="TransportDirection.toWork"
              :day="routesMap[timestamp.date]"
              :timestamp="timestamp"
              @item-click="onClickItem"
              data-cy="calendar-item-display-to-work"
            />
            <!-- Route from work -->
            <calendar-item-display
              :active="
                isActive({ timestamp, direction: TransportDirection.fromWork })
              "
              :disabled="timestamp.disabled"
              :direction="TransportDirection.fromWork"
              :day="routesMap[timestamp.date]"
              :timestamp="timestamp"
              @item-click="onClickItem"
              data-cy="calendar-item-display-from-work"
            />
          </div>
        </template>
      </q-calendar-month>
      <!-- Loading spinner -->
      <q-inner-loading
        :showing="isLoadingRoutes"
        color="primary"
        data-cy="spinner-routes-calendar"
      />
    </div>
    <route-calendar-panel
      v-model="isPanelOpen"
      :routes="activeRouteItems"
      @save="onSave"
      data-cy="route-calendar-panel"
    />
  </div>
</template>
