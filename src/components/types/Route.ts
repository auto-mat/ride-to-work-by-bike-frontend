// types
import type { TimestampOrNull } from '@quasar/quasar-ui-qcalendar';

export type RouteItem = {
  id: string;
  date: string;
  direction: TransportDirection;
  dirty?: boolean;
  distance: number;
  transport: TransportType;
  inputType?: RouteInputType;
};

export type TransportType = 'bike' | 'car' | 'walk' | 'bus' | 'none';

export type RouteInputType = 'input-number' | 'input-map';

export enum TransportDirection {
  toWork = 'toWork',
  fromWork = 'fromWork',
}

export type RouteListDay = {
  id: string;
  date: string;
  routes: RouteItem[];
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

export type RouteTab = 'calendar' | 'list' | 'map' | 'app';

export type RouteLogData = {
  action: RouteInputType;
  distance: number;
  transportType: TransportType;
};
