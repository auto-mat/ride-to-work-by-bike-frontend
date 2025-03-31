// libraries
import { date } from 'quasar';
import { computed } from 'vue';

// composables
import { i18n } from 'src/boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useChallengeStore } from '../stores/challenge';

// enums
import { TransportDirection, TransportType } from 'src/components/types/Route';
import { PhaseType } from '../components/types/Challenge';

// types
import type { RouteItem, RouteDay } from 'src/components/types/Route';

export const useRoutes = () => {
  const customSVGIconsFilePath = 'icons/routes_calendar/icons.svg';
  const { defaultDistanceZero } = rideToWorkByBikeConfig;

  /**
   * Returns the icon name corresponding to the given route.
   *
   * @param {TransportType} transport - The transport type.
   * @return {string} - The icon name.
   */
  const getRouteIcon = (transport: TransportType): string => {
    switch (transport) {
      case TransportType.car:
        return `svguse:${customSVGIconsFilePath}#lucide-car-front`;
      case TransportType.bike:
        return `svguse:${customSVGIconsFilePath}#lucide-bike`;
      case TransportType.walk:
        return `svguse:${customSVGIconsFilePath}#lucide-walk`;
      case TransportType.bus:
        return `svguse:${customSVGIconsFilePath}#lucide-bus`;
      case TransportType.home:
        return `svguse:${customSVGIconsFilePath}#lucide-home`;
      case TransportType.none:
        return `svguse:${customSVGIconsFilePath}#lucide-ban`;
      default:
        return `svguse:${customSVGIconsFilePath}#question-mark`;
    }
  };

  /**
   * Get a transport label based on given transport key.
   * @param {TransportType} transport - The transport type.
   * @return {string} - The transport label.
   */
  const getTransportLabel = (transport: TransportType): string => {
    if (!transport) {
      return i18n.global.t('routes.transport.unknown');
    }
    switch (transport) {
      case TransportType.bike:
        return i18n.global.t('routes.transport.bike');
      case TransportType.car:
        return i18n.global.t('routes.transport.car');
      case TransportType.walk:
        return i18n.global.t('routes.transport.walk');
      case TransportType.bus:
        return i18n.global.t('routes.transport.bus');
      case TransportType.home:
        return i18n.global.t('routes.transport.home');
      case TransportType.none:
        return i18n.global.t('routes.transport.none');
      default:
        return i18n.global.t('routes.transport.unknown');
    }
  };

  /**
   * Returns the route distance including the unit.
   * @param {RouteItem} route - The route item.
   * @return {string} - The distance label.
   */
  const getRouteDistance = (route: RouteItem | null): string => {
    if (!route?.distance || route?.distance === defaultDistanceZero) return '';
    return (
      `${i18n.global.n(parseFloat(route.distance), 'routeDistanceDecimalNumber')}` +
      ` ${i18n.global.t('global.routeLengthUnit')}`
    );
  };

  const dateCompetitionPhaseFrom = computed((): Date | null => {
    const challengeStore = useChallengeStore();
    const dateString = challengeStore.getPhaseFromSet(
      PhaseType.competition,
    )?.date_from;
    return dateString ? new Date(dateString) : null;
  });

  const dateCompetitionPhaseTo = computed((): Date | null => {
    const challengeStore = useChallengeStore();
    const dateString = challengeStore.getPhaseFromSet(
      PhaseType.competition,
    )?.date_to;
    return dateString ? new Date(dateString) : null;
  });

  /**
   * Returns date for the first day when logging routes is allowed.
   * This is done based on two conditions:
   * 1. Window of logging days before today
   * 2. Day is outside the `competition` phase date range
   * @returns {Date | null} - Date or null if date is invalid
   */
  const dateLoggingStart = computed((): Date | null => {
    const challengeStore = useChallengeStore();
    // get today's date
    const dateToday = new Date();
    // get start of logging window
    const dateStartOfLoggingWindow = date.subtractFromDate(dateToday, {
      days: (challengeStore.getDaysActive || 0) - 1,
    });
    // check if competition phase date range is set
    if (!dateCompetitionPhaseFrom.value) {
      return dateStartOfLoggingWindow || null;
    }
    const isStartOfLoggingWindowAfterCompetitionPhaseDateFrom =
      date.getDateDiff(
        dateStartOfLoggingWindow,
        dateCompetitionPhaseFrom.value,
        'days',
      ) > 0;

    return isStartOfLoggingWindowAfterCompetitionPhaseDateFrom
      ? dateStartOfLoggingWindow
      : dateCompetitionPhaseFrom.value;
  });

  /**
   * Returns date for the last day when logging routes is allowed.
   * Calendar disables all dates after the returned date.
   * This is done based on two conditions:
   * 1. Future date (date is after today)
   * 2. Day is outside the `competition` phase date range
   * @returns {Date | null} - Date or null if date is invalid
   */
  const dateLoggingEnd = computed((): Date | null => {
    // get today's date
    const dateToday = new Date();
    // check if competition phase date range is set
    if (!dateCompetitionPhaseTo.value) {
      return dateToday || null;
    }
    const isTomorrowBeforeCompetitionDateTo =
      date.getDateDiff(dateToday, dateCompetitionPhaseTo.value, 'days') < 0;

    return isTomorrowBeforeCompetitionDateTo
      ? dateToday
      : dateCompetitionPhaseTo.value;
  });

  /**
   * Returns an array of RouteDay objects for each day of the logging window.
   * Start date is included by using prevDay() on the dateLoggingStart.
   * Fills in data from routes array based on date and direction.
   * If data is empty for given day/route, it will create an empty route.
   * @param {RouteItem[]} routes - Array of logged routes.
   * @return {RouteDay[]} - The array representing days with routes.
   */
  const getLoggableDaysWithRoutes = (routes: RouteItem[]): RouteDay[] => {
    // check if logging window date range is set
    if (!dateLoggingStart.value || !dateLoggingEnd.value) {
      return [];
    }
    return createDaysArrayWithRoutes(
      date.subtractFromDate(dateLoggingStart.value, { days: 1 }),
      dateLoggingEnd.value,
      routes,
    );
  };

  /**
   * Returns an array of RouteDay which represents days of competition phase,
   * which precede the logging window and can no longer be logged.
   * @param {RouteItem[]} routes - Array of logged routes.
   * @return {RouteDay[]} - The array representing days with routes.
   */
  const getUnloggableDaysWithRoutes = (routes: RouteItem[]): RouteDay[] => {
    // check if competition phase date range is set
    if (!dateCompetitionPhaseFrom.value || !dateLoggingStart.value) {
      return [];
    }
    // end date is the day before the logging window starts
    return createDaysArrayWithRoutes(
      date.subtractFromDate(dateCompetitionPhaseFrom.value, { days: 1 }),
      date.subtractFromDate(dateLoggingStart.value, { days: 1 }),
      routes,
    );
  };

  /**
   * Returns an array of RouteDay objects for each day of the competition phase.
   * @param {RouteItem[]} routes - Array of logged routes.
   * @return {RouteDay[]} - The array representing days with routes.
   */
  const getCompetitionDaysWithRoutes = (routes: RouteItem[]): RouteDay[] => {
    // check if competition phase date range is set
    if (!dateCompetitionPhaseFrom.value || !dateCompetitionPhaseTo.value) {
      return [];
    }
    // create days array with routes (include start date)
    return createDaysArrayWithRoutes(
      date.subtractFromDate(dateCompetitionPhaseFrom.value, { days: 1 }),
      dateCompetitionPhaseTo.value,
      routes,
    );
  };

  /**
   * Creates an array of RouteDay objects for each day between specified
   * dates. Including end date and excluding start date.
   * Fills in data from routes array based on date and direction.
   * If data is empty for given day/route, it will create an empty route.
   * @param {Date} startDate - The start date of the date range.
   * @param {Date} endDate - The end date of the date range.
   * @param {RouteItem[]} routes - The array logged routes.
   * @return {RouteDay[]} - The array representing days with routes.
   */
  const createDaysArrayWithRoutes = (
    startDate: Date,
    endDate: Date,
    routes: RouteItem[],
  ): RouteDay[] => {
    const numberOfDays = date.getDateDiff(endDate, startDate, 'days');
    const days = [] as RouteDay[];
    const routeDateFormat = 'YYYY-MM-DD';

    if (routes) {
      for (let i = 0; i < numberOfDays; i++) {
        const currentDate = date.subtractFromDate(endDate, { days: i });

        // For any given day, get data from routes or create an empty route.
        const fromWork = getRouteByDateAndDirection(
          routes,
          currentDate,
          TransportDirection.fromWork,
        );
        const toWork = getRouteByDateAndDirection(
          routes,
          currentDate,
          TransportDirection.toWork,
        );
        days.push({
          id: date.formatDate(currentDate, routeDateFormat),
          date: date.formatDate(currentDate, routeDateFormat),
          fromWork: fromWork
            ? fromWork
            : ({
                id: `${date.formatDate(currentDate, routeDateFormat)}-${TransportDirection.fromWork}`,
                date: date.formatDate(currentDate, routeDateFormat),
                transport: TransportType.none,
                distance: defaultDistanceZero,
                direction: TransportDirection.fromWork,
                dirty: false,
                inputType: 'input-number',
              } as RouteItem),
          toWork: toWork
            ? toWork
            : ({
                id: `${date.formatDate(currentDate, routeDateFormat)}-${TransportDirection.toWork}`,
                date: date.formatDate(currentDate, routeDateFormat),
                transport: TransportType.none,
                distance: defaultDistanceZero,
                direction: TransportDirection.toWork,
                dirty: false,
                inputType: 'input-number',
              } as RouteItem),
        });
      }
    }
    return days;
  };

  /**
   * Retrieves a route from a given list of routes based on date and direction.
   * @param {RouteItem[]} routes - The list of route items to search through.
   * @param {Date} dateQuery - Route date.
   * @param {TransportDirection} directionQuery - Route direction.
   * @return {RouteItem | null} - Matching route, or null if no match is found.
   */
  const getRouteByDateAndDirection = (
    routes: RouteItem[],
    dateQuery: Date,
    directionQuery: TransportDirection,
  ): RouteItem | null => {
    const route = routes.find((route) => {
      const matchesDate = date.isSameDate(
        new Date(route.date),
        dateQuery,
        'day',
      );
      const matchesDirection = route.direction === directionQuery;
      return matchesDate && matchesDirection;
    });
    return route || null;
  };

  /**
   * Formats a given date string into a specific format.
   *
   * @param dateString - The date string to be formatted.
   * @return The formatted date string in the format 'D. MMM'.
   */
  const formatDate = (dateString: string) => {
    const timeStamp = new Date(dateString);
    // using quasar date object
    return date.formatDate(timeStamp, 'D. MMM');
  };

  /**
   * Returns a text-based label for a day based on the given date.
   * Example: "Today", "Yesterday", "Monday"
   *
   * @param dateString - The date string to be formatted
   * @return The formatted date name
   */
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
    dateLoggingStart,
    dateLoggingEnd,
    dateCompetitionPhaseFrom,
    dateCompetitionPhaseTo,
    getLoggableDaysWithRoutes,
    getUnloggableDaysWithRoutes,
    getCompetitionDaysWithRoutes,
    createDaysArrayWithRoutes,
    formatDate,
    formatDateName,
    getRouteByDateAndDirection,
    getRouteDistance,
    getRouteIcon,
    getTransportLabel,
  };
};
