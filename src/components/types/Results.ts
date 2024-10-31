export interface Emissions {
  co2: number;
  co: number;
  nox: number;
  n2o: number;
  voc: number;
  ch4: number;
  so2: number;
  solid: number;
  pb: number;
}

export interface MemberResults {
  distance: number;
  emissions: Emissions;
  working_rides_base_count: number;
  id: number;
  name: string;
  frequency: number;
  avatar_url: string;
  eco_trip_count: number;
  rest_url?: string;
  is_me?: boolean;
  remaining_rides_count: number;
  sesame_token: string;
  is_coordinator: boolean;
  registration_complete: boolean;
  gallery: string;
  unread_notification_count: number;
  points: number;
  points_display: string;
  team: string;
}

export interface TeamResults {
  distance: number;
  frequency: number;
  emissions: Emissions;
  eco_trip_count: number;
  working_rides_base_count: number;
  name: string | null;
  id: number;
  icon_url: string | null;
  members: MemberResults[];
  icon: string | null;
  subsidiary: string;
  campaign: string;
  gallery: string;
  gallery_slug: string;
}

export interface MemberResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MemberResults[];
}

export interface TeamResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TeamResults[];
}

export interface SubsidiaryResults {
  frequency: number;
  distance: number;
  eco_trip_count: number;
  working_rides_base_count: number;
  emissions: Emissions;
  id: number;
  address_street: string;
  city: string;
  icon_url: string | null;
  rest_url: string;
}

export interface OrganizationResults {
  subsidiaries: SubsidiaryResults[];
  eco_trip_count: number;
  frequency: number;
  emissions: Emissions;
  distance: number;
  working_rides_base_count: number;
  id: number;
  name: string;
  icon: string | null;
  icon_url: string | null;
  gallery: string;
  gallery_slug: string;
}

export interface OrganizationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: OrganizationResults[];
}

export interface TripStats {
  distance__sum: number;
  user_count: number;
  count__sum: number;
  count_bicycle: number;
  distance_bicycle: number;
  count_foot: number;
  distance_foot: number;
}

export interface Location {
  coordinates: number[];
  type: string;
}

export interface CityResults {
  competitor_count: number;
  trip_stats: TripStats;
  emissions: Emissions;
  distance: number;
  eco_trip_count: number;
  description: string;
  organizer: string;
  organizer_url: string;
  subsidiaries: string[];
  competitions: string[];
  wp_url: string;
  id: number;
  name: string;
  location: Location;
}

export interface CityResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CityResults[];
}

export type ResultsUnion =
  | MemberResults
  | TeamResults
  | OrganizationResults
  | CityResults;
