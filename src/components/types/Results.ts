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

export interface Results {
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

export interface Team {
  distance: number;
  frequency: number;
  emissions: Emissions;
  eco_trip_count: number;
  working_rides_base_count: number;
  name: string | null;
  id: number;
  icon_url: string | null;
  members: Results[];
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
  results: Results[];
}

export interface TeamResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Team[];
}
