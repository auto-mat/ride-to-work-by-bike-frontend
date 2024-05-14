export type RouteItem = {
  id: string;
  date: string;
  direction: string;
  dirty?: boolean;
  distance: number;
  transport: TransportType;
  inputType?: RouteInputType;
};

export type TransportType = 'bike' | 'car' | 'walk' | 'bus' | 'none';

export type RouteInputType = 'input-number' | 'input-map';

export type RouteListDay = {
  date: string;
  routes: RouteItem[];
};

export type RouteTab = 'calendar' | 'list' | 'map' | 'app';
