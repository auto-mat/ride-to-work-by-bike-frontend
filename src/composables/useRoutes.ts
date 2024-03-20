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
   * Returns the icon predefined for given transport type
   * @param route (TransportType)
   * @returns icon name (string)
   */
  const getRouteIcon = (route: TransportType): string => {
    switch (route) {
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
    formatDate,
    formatDateName,
    getDays,
    getRouteIcon,
  };
};
