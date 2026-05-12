// enums
import { CompetitorType, CompetitionType } from '../enums/Challenge';
import { TransportType } from './Route';

// types
import type { Emissions } from './Results';

export interface CommuteMode {
  id: number;
  name_cs: string;
  name_en: string;
  slug: TransportType;
}

export interface Competition {
  results: string;
  id: number;
  name: string;
  slug: string;
  competitor_type: CompetitorType;
  competition_type: CompetitionType;
  url: string | null;
  description: string | null;
  priority: number;
  date_from: string;
  date_to: string;
  commute_modes: CommuteMode[];
}

export interface CompetitionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Competition[];
}

export interface CompetitionResult {
  place: number;
  name: string;
  result: number;
  frequency: number;
  distance: number;
  emissions: Emissions;
}

export interface CompetitionResultResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CompetitionResult[];
}

export interface CompanyChallengeFormState {
  challengeType: CompetitionType;
  challengeParticipants: CompetitorType;
  challengeTransportType: TransportType[];
  challengeTitle: string;
  challengeDescription: string;
  challengeInfoUrl: string;
  challengeStart: string;
  challengeStop: string;
}
