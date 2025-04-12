// types
import type { TimestampOrNull } from '@quasar/quasar-ui-qcalendar';
import type { Feature } from 'ol';

export enum RouteInputType {
  inputNumber = 'input-number',
  copyYesterday = 'copy-yesterday',
  inputMap = 'input-map',
  uploadFile = 'upload-file',
}

export enum TransportDirection {
  toWork = 'toWork',
  fromWork = 'fromWork',
}

export enum TransportType {
  bike = 'bicycle',
  car = 'by_other_vehicle',
  walk = 'by_foot',
  bus = 'hromadna',
  home = 'telecommute',
  none = 'no_work',
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
  transport: TransportType | null;
  inputType?: RouteInputType;
  routeFeature: RouteFeature | null;
  file: File | null;
};

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

export interface CommuteMode {
  id: number;
  slug: TransportType;
  does_count: boolean;
  eco: boolean;
  distance_important: boolean;
  duration_important: boolean;
  minimum_distance: number;
  minimum_duration: number;
  description_en: string | null;
  description_cs: string | null;
  icon: string | null;
  name_en: string;
  name_cs: string;
  points: number;
}

export interface CommuteModeResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommuteMode[];
}
