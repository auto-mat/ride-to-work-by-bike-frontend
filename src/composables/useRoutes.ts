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
   * Generate an array of RouteListDay objects grouped by date from the given routes.
   *
   * @param routes - The array of RouteItem objects to process.
   * @return The array of RouteListDay objects grouped by date.
   */
  const getDays = (routes: RouteItem[] | null | undefined): RouteListDay[] => {
    const dayArray: RouteListDay[] = [];
    if (!routes) return dayArray;

    routes?.forEach((route) => {
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
    formatDate,
    formatDateName,
    getDays,
    getRouteByDateAndDirection,
    getRouteDistance,
    getRouteIcon,
    getTransportLabel,
  };
};
