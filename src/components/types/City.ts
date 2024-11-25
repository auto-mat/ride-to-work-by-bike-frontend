export interface City {
  id: number;
  name: string;
}

export interface GetCitiesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: City[];
}
