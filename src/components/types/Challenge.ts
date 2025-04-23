// enums
import { PriceLevelCategory } from '../enums/Challenge';

// types
import type { TransportType } from './Route';

export interface ChallengeDescription {
  dateStart: string;
  dateEnd: string;
  link: {
    title: string;
    url: string;
  };
  description: string;
  transportTypes: TransportType[];
}

export enum PhaseType {
  registration = 'registration',
  competition = 'competition',
  entryEnabled = 'entry_enabled',
  payment = 'payment',
  invoices = 'invoices',
  results = 'results',
}

export interface Phase {
  phase_type: PhaseType;
  date_from: string;
  date_to: string;
}

export interface PriceLevel {
  name: string;
  price: number;
  category: PriceLevelCategory;
  takes_effect_on: string;
}

export interface Campaign {
  phase_set: Phase[];
  price_level: PriceLevel[];
  id: number;
  slug: string;
  days_active: number;
  year: string;
  campaign_type: string;
  max_team_members: number;
}

export interface ThisCampaignResponse {
  count: number;
  next: string;
  previous: string;
  results: Campaign[];
}
