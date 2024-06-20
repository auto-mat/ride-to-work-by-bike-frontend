import { Image } from './Image';
import { FormCompanyAddressFields } from './Form';

export interface OrganizationBranch {
  id: string;
  title: string;
}

export interface OrganizationMember {
  id: string;
  name: string;
  team: string;
  payment: {
    amount: number;
  };
}

export interface Organization {
  address?: FormCompanyAddressFields;
  branches: OrganizationBranch[];
  description?: string;
  id: string;
  identificationNumber: string;
  identificationNumberVat?: string;
  image?: Image;
  members: OrganizationMember[];
  title: string;
}
