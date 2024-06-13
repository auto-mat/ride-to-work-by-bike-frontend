import { Image } from './Image';

export interface OrganizationBranch {
  id: string;
  title: string;
}

export interface OrganizationMember {
  id: string;
  name: string;
}

export interface Organization {
  branches: OrganizationBranch[];
  description?: string;
  id: string;
  identificationNumber: string;
  image?: Image;
  members: OrganizationMember[];
  title: string;
}
