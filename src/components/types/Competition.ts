// enums
import { CompetitorType, CompetitionType } from '../enums/Challenge';

export interface Competition {
  results: string;
  id: number;
  name: string;
  slug: string;
  competitor_type: CompetitorType;
  competition_type: CompetitionType;
  url: string | null;
  priority: number;
}

export interface CompetitionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Competition[];
}
