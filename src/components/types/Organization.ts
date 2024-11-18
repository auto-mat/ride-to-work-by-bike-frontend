import { Image } from './Image';
import { FormCompanyAddressFields } from './Form';

export enum OrganizationType {
  company = 'company',
  school = 'school',
  family = 'family',
}

export enum OrganizationLevel {
  organization = 'organization',
  subsidiary = 'subsidiary',
  team = 'team',
}

export interface Organization {
  subsidiaries: OrganizationSubsidiary[];
  address?: FormCompanyAddressFields;
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
  count: number;
  next: string;
  previous: string;
  results: OrganizationOption[];
}

export interface PostOrganizationPayload {
  name: string;
  vatId: string;
  organization_type: OrganizationType;
}

export interface PostOrganizationsResponse {
  id: number;
  name: string;
}
