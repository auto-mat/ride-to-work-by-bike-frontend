import type { TransportType } from 'src/components/types/Route';

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

  return {
    getRouteIcon,
  };
};
