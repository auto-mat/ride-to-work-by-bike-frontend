// enums
import { NewsletterType } from '../types/Newsletter';

// types
import type { Image } from './Image';
import { Gender } from './Profile';
export enum TestPaymentVoucher {
  full = 'FULL',
  half = 'HALF',
}

export type FormPersonalDetailsFields = {
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  gender: Gender | null;
  newsletter: NewsletterType[];
  terms: boolean;
};

export type FormOption = {
  label: string;
  value: number | string | string[] | FormCompanyAddressFields;
  icon?: string;
  description?: string;
};

export interface FormSelectTableOption extends FormOption {
  members?: number;
  maxMembers?: number;
}

export type FormSelectOption = {
  label: string;
  value: string;
};

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

export type FormPaymentVoucher = {
  code: string;
  name: string;
  amount: number;
};
