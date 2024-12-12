/**
 * API types for team-related operations
 */

export interface TeamPostApiPayload {
  name: string;
}

export interface TeamPostApiResponse {
  id: number;
  name: string;
}
