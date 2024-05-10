export type RouteItem = {
  id: string;
  date: string;
  direction: string;
  dirty?: boolean;
  distance: number;
  transport: TransportType;
};

export type TransportType = 'bike' | 'car' | 'walk' | 'bus' | 'none';

export type RouteListDay = {
  date: string;
  routes: RouteItem[];
};

export type RouteTab = 'calendar' | 'list' | 'map' | 'app';
