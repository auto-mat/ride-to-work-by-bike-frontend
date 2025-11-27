// enums
import { CompetitorType, CompetitionType } from '../enums/Challenge';

export interface PostCompetitionPayload {
  name: string;
  url?: string;
  description?: string;
  competition_type: CompetitionType;
  competitor_type: CompetitorType;
  commute_modes: number[];
  date_from: string;
  date_to: string;
}

export interface PostCompetitionResponse {
  name: string;
  url?: string;
  description?: string;
  competition_type: CompetitionType;
  competitor_type: CompetitorType;
  commute_modes: number[];
  date_from: string;
  date_to: string;
}
