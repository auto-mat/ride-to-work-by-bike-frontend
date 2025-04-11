// enums
import { TransportType } from './Route';

export enum TripDirection {
  to = 'trip_to',
  from = 'trip_from',
}

export interface Trip {
  id: number;
  trip_date: string;
  direction: TripDirection;
  commuteMode: TransportType;
  sourceApplication: string;
  distanceMeters: number | null;
  durationSeconds: number | null;
  sourceId: string | null;
  file: string | null;
  description: string;
  track: string | null;
}

export interface TripPostPayload {
  trip_date: string;
  direction: string;
  commuteMode: string;
  distanceMeters: number;
  sourceApplication: string;
  file_encoded_string?: string | ArrayBuffer | null;
  track?: string | null;
  durationSeconds?: number | null;
  sourceId?: string;
  description?: string;
}

export interface GetTripsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Trip[];
}
