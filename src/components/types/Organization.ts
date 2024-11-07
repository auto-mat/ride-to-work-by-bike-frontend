import { Image } from './Image';
import { FormCompanyAddressFields } from './Form';

export enum OrganizationType {
  company = 'company',
  school = 'school',
  family = 'family',
}

export interface Organization {
  subsidiaries: OrganizationSubsidiary[];
  description?: string;
  id: number;
  identificationNumber: string;
  identificationNumberVat?: string;
  image?: Image;
  organizationType: OrganizationType;
  title: string;
}

export interface OrganizationSubsidiary {
  id: number;
  title: string;
  address?: FormCompanyAddressFields;
  teams: OrganizationTeam[];
}

export interface OrganizationTeam {
  id: number;
  title: string;
  members: OrganizationMember[];
}

export interface OrganizationMember {
  id: number;
  name: string;
  team: number;
  payment: {
    amount: number;
  };
}

// API

export interface OrganizationOption {
  id: number;
  name: string;
}

export interface GetOrganizationsResponse {
  results: OrganizationOption[];
}

export interface PostOrganizationPayload {
  name: string;
  vatId: string;
}

export interface PostOrganizationsResponse {
  id: string;
  name: string;
}
