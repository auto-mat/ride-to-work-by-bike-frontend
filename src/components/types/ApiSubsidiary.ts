/**
 * API types for subsidiary-related operations
 */

import type { OrganizationTeam } from './Organization';

export interface GetSubsidiariesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SubsidiaryApi[];
}

export interface SubsidiaryApi {
  id: number;
  address: SubsidiaryPostApiAddress;
  teams: OrganizationTeam[];
}

export interface SubsidiaryPostApiAddress {
  street: string;
  street_number: string;
  recipient: string;
  city: string;
  psc: string | number;
}

/**
 * Subsidiary address structure from coordinator admin organization API
 * Used for editing subsidiary address via coordinator interface
 */
export interface SubsidiaryAddressPutApi {
  street: string;
  street_number: number;
  city: string;
  psc: number;
}

export interface SubsidiaryPostApiPayload {
  address: SubsidiaryPostApiAddress;
  city_id: number | null;
}

export interface SubsidiaryPostApiResponse {
  id: number;
  city_id: number | null;
  active: boolean;
  address: SubsidiaryPostApiAddress;
}
