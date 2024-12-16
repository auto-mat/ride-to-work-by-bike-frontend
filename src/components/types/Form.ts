// types
import type { Image } from './Image';

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
  members?: number;
  maxMembers?: number;
}

export type FormSelectOption = {
  label: string;
  value: string | number;
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
  cityChallenge: number | null;
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
  gender: string;
  genderOptions?: FormOption[];
  value: string;
  image: string;
  material: string;
  label: string;
  size: string;
  sizeId: string;
  sizeOptions?: FormOption[];
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
