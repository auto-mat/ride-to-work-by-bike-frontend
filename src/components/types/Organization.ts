import { Ref } from 'vue';
import { Image } from './Image';
import { FormCompanyAddressFields, FormSelectTableOption } from './Form';

export enum OrganizationType {
  company = 'company',
  school = 'school',
  family = 'family',
  none = '',
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
  title?: string;
  address?: FormCompanyAddressFields;
  teams: OrganizationTeam[];
}

export interface OrganizationTeam {
  id: number;
  name: string;
  subsidiary: number;
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

export interface GetTeamsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: OrganizationTeam[];
}

export type useApiGetTeamsReturn = {
  teams: Ref<OrganizationTeam[]>;
  options: Ref<FormSelectTableOption[]>;
  isLoading: Ref<boolean>;
  loadTeams: (subsidiaryId: number) => Promise<void>;
  mapTeamsToOptions: (teams: OrganizationTeam[]) => FormSelectTableOption[];
};
