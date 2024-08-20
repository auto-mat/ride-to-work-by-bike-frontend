// types
import type { TimestampOrNull } from '@quasar/quasar-ui-qcalendar';

export enum TransportDirection {
  toWork = 'toWork',
  fromWork = 'fromWork',
}

export enum TransportType {
  bike = 'bike',
  car = 'car',
  walk = 'walk',
  bus = 'bus',
  none = 'none',
}

export enum RouteTab {
  calendar = 'calendar',
  list = 'list',
  map = 'map',
  app = 'app',
}

export type RouteItem = {
  id: string;
  date: string;
  direction: TransportDirection;
  dirty?: boolean;
  distance: number;
  transport: TransportType;
  inputType: RouteInputType;
};

export type RouteInputType = 'input-number' | 'input-map';

export type RouteListDay = {
  id: string;
  date: string;
  fromWork: RouteItem;
  toWork: RouteItem;
};

export type RouteCalendarDay = {
  id: string;
  date: string;
  toWork: RouteItem;
  fromWork: RouteItem;
};

export type RouteCalendarActive = {
  timestamp: TimestampOrNull;
  direction: TransportDirection;
};

export type RouteLogData = {
  action: RouteInputType;
  distance: number;
  transportType: TransportType;
};
