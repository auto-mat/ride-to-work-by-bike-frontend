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
  value: string;
  icon?: string;
  description?: string;
};

export type FormAddCompanyFields = {
  name: string;
  vatId: string;
  street?: string;
  streetNumber?: string;
  city?: string;
  zip?: string;
  referenceCity?: string;
  department?: string;
};
