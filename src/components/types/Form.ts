import type { Image } from './Image';

export type FormPersonalDetailsFields = {
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  gender: string;
  newsletter: string[];
  terms: boolean;
};

export type FormOption = {
  label: string;
  value: string | FormCompanyAddressFields;
  icon?: string;
  description?: string;
};

export interface FormSelectTableOption extends FormOption {
  members: number;
  maxMembers: number;
}

export type FormCompanyFields = {
  name: string;
  vatId: string;
  address: FormCompanyAddressFields[];
};

export type FormCompanyAddressFields = {
  street: string;
  houseNumber: string;
  city: string;
  zip: string;
  cityChallenge: string;
  department: string;
};

export type FormTeamFields = {
  name: string;
  members?: number;
  maxMembers?: number;
};

export type FormCardMerchType = {
  author: string;
  dialogDescription: string;
  dialogImages: Image[];
  dialogTitle: string;
  gender: FormOption[];
  value: string;
  image: string;
  material: string;
  label: string;
  sizes: FormOption[];
};
