export type RouteItem = {
  id: string;
  date: string;
  direction: string;
  distance: number;
  transport: 'bike' | 'car' | 'walk' | 'bus' | 'none';
};

export type RouteListDay = {
  date: string;
  routes: RouteItem[];
};
