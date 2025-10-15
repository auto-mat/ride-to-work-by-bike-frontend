export enum PaymentSubject {
  individual = 'individual',
  voucher = 'voucher',
  company = 'company',
  school = 'school',
}

export enum PaymentAmount {
  custom = 'custom',
}

export enum PaymentState {
  done = 'done',
  none = 'none',
  noAdmission = 'no_admission',
  waiting = 'waiting',
  unknown = 'unknown',
}

export enum PaymentType {
  organization = 'organization',
  registration = 'registration',
}
