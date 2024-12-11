/**
 * API types for subsidiary-related operations
 */

export interface SubsidiaryPostApiAddress {
  street: string;
  street_number: string;
  recipient: string;
  city: string;
  psc: string | number;
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
