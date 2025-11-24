// enums
import { CompetitorType, CompetitionType } from '../enums/Challenge';
import { TransportType } from './Route';

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
