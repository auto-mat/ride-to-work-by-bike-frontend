import type { OrganizationMember } from './Organization';

export enum TestPaymentVoucher {
  full = 'FULL',
  half = 'HALF',
}

export type FormOption = {
  label: string;
  value: number | string | string[] | FormCompanyAddressFields;
  icon?: string;
  description?: string;
};

export interface FormSelectTableOption extends FormOption {
  members?: OrganizationMember[];
  maxMembers: number | null;
}

export type FormSelectOption = {
  label: string;
  value: string | number;
};

export type FormCompanyFields = {
  name: string;
  vatId: string;
  address: FormCompanyAddressFields;
};

export type FormCompanyAddressFields = {
  id?: number;
  street: string;
  houseNumber: string;
  city: string;
  zip: string;
  cityChallenge: number | null;
  department: string;
  boxAddresseeName?: string;
  boxAddresseeTelephone?: string;
  boxAddresseeEmail?: string;
};

export type FormTeamFields = {
  name: string;
  members?: number;
  maxMembers?: number;
};

export type FormPaymentVoucher = {
  code: string;
  name: string;
  amount: number;
};

export type FormSelectTableLabels = {
  label: string;
  buttonAddNew: string;
  buttonDialog: string;
  titleDialog: string;
};

export type FormMoveMemberFields = {
  subsidiaryId: number | null;
  teamId: number | null;
};
