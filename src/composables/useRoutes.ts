// libraries
import { date } from 'quasar';

// composables
import { i18n } from 'src/boot/i18n';

// types
import type {
  RouteItem,
  RouteListDay,
  TransportType,
} from 'src/components/types/Route';

export const useRoutes = () => {
  /**
   * Returns the icon name corresponding to the given route.
   *
   * @param {TransportType} transport - The transport type.
   * @return {string} The icon name.
   */
  const getRouteIcon = (transport: TransportType): string => {
    switch (transport) {
      case 'car':
        return 'directions_car';
      case 'bike':
        return 'pedal_bike';
      case 'walk':
        return 'directions_walk';
      case 'bus':
        return 'directions_bus';
      case 'none':
        return 'block';
      default:
        return 'block';
    }
  };

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
    getRouteDistance,
    getRouteIcon,
  };
};
