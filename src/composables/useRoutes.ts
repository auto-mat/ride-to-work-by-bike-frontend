// libraries
import { date } from 'quasar';

// composables
import { i18n } from 'src/boot/i18n';

// enums
import { TransportDirection, TransportType } from 'src/components/types/Route';

// types
import type { RouteItem, RouteListDay } from 'src/components/types/Route';

export const useRoutes = () => {
  const customSVGIconsFilePath = 'icons/routes_calendar/icons.svg';

  /**
   * Returns the icon name corresponding to the given route.
   *
   * @param {TransportType} transport - The transport type.
   * @return {string} The icon name.
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
      case TransportType.none:
        return `svguse:${customSVGIconsFilePath}#lucide-ban`;
      default:
        return `svguse:${customSVGIconsFilePath}#question-mark`;
    }
  };

  /**
   * Get a transport label based on given transport key.
   *
   * @param {TransportType} transport - The transport type.
   * @return {string} The transport label.
   */
  const getTransportLabel = (transport: TransportType): string => {
    if (transport) {
      return i18n.global.t(`routes.transport.${transport}`);
    } else {
      return i18n.global.t('routes.transport.unknown');
    }
  };

  /**
   * Get distance label for given route.
   *
   * @param {RouteItem} route - The route item.
   * @return {string} The distance label.
   */
  const getRouteDistance = (route: RouteItem | null): string => {
    if (!route?.distance) return '';
    return `${route.distance} ${i18n.global.t('global.routeLengthUnit')}`;
  };

  /**
   * Creates an array of RouteListDay objects for each day between specified
   * dates. Including end date and excluding start date.
   * Fills in data from routes array based on date and direction.
   * If data is empty for given day/route, it will create an empty route.
   * @param {Date} startDate - The start date of the date range.
   * @param {Date} endDate - The end date of the date range.
   * @param {RouteItem[]} routes - The array logged routes.
   * @return {RouteListDay[]} The array representing days with routes.
   */
  const createDaysArrayWithRoutes = (
    startDate: Date,
    endDate: Date,
    routes: RouteItem[],
  ): RouteListDay[] => {
    const numberOfDays = date.getDateDiff(endDate, startDate, 'days');
    const days = [] as RouteListDay[];
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
          id: date.formatDate(currentDate, 'YYYY-MM-DD'),
          date: date.formatDate(currentDate, 'YYYY-MM-DD'),
          fromWork: fromWork
            ? fromWork
            : ({
                id: `${date.formatDate(currentDate, 'YYYY-MM-DD')}-${TransportDirection.fromWork}`,
                date: date.formatDate(currentDate, 'YYYY-MM-DD'),
                transport: TransportType.none,
                distance: 0,
                direction: TransportDirection.fromWork,
                dirty: false,
                inputType: 'input-number',
              } as RouteItem),
          toWork: toWork
            ? toWork
            : ({
                id: `${date.formatDate(currentDate, 'YYYY-MM-DD')}-${TransportDirection.toWork}`,
                date: date.formatDate(currentDate, 'YYYY-MM-DD'),
                transport: TransportType.none,
                distance: 0,
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
   * @return {RouteItem | null} Matching route, or null if no match is found.
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
    createDaysArrayWithRoutes,
    formatDate,
    formatDateName,
    getRouteByDateAndDirection,
    getRouteDistance,
    getRouteIcon,
    getTransportLabel,
  };
};
