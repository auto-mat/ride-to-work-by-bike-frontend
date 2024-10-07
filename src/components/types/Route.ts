// types
import type { TimestampOrNull } from '@quasar/quasar-ui-qcalendar';
import type { Feature } from 'ol';

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
  distance: string;
  transport: TransportType;
  inputType?: RouteInputType;
  routeFeature: RouteFeature | null;
};

export type RouteInputType = 'input-number' | 'input-map';

export type RouteDay = {
  id: string;
  date: string;
  fromWork: RouteItem;
  toWork: RouteItem;
};

export type RouteCalendarActive = {
  timestamp: TimestampOrNull;
  direction: TransportDirection;
};

export type RouteLogData = {
  action: RouteInputType;
  distance: string;
  transportType: TransportType;
};

export interface RouteFeature {
  endName: string;
  length: number;
  feature: Feature | null;
  startName: string;
}
