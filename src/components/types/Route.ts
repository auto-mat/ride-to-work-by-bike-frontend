export type RouteItem = {
  id: string;
  date: string;
  direction: string;
  distance: number;
};

export type RouteListDay = {
  date: string;
  routes: RouteItem[];
};
