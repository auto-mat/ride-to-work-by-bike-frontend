import type { ValidatedCoupon } from './Coupon';
import type { RegisterChallengePersonalDetailsForm } from './RegisterChallenge';
import type { PaymentSubject } from '../enums/Payment';

// subset of personal details that can be sent in POST requests
export type CorePersonalDetails = {
  first_name: string;
  last_name: string;
  nickname: string;
  sex: string;
  telephone: string;
  telephone_opt_in: boolean;
  language: string;
  occupation: string;
  age_group: number | null;
  newsletter: string;
  personal_data_opt_in: boolean;
  discount_coupon: string;
  payment_subject: string;
  payment_amount: number | null;
};

// all personal details including server-side fields
export type PersonalDetails = CorePersonalDetails & {
  payment_type: string;
  payment_status: string;
};

export type RegisterChallengeResult = {
  personal_details: PersonalDetails;
  team_id: number | null;
  organization_id: number | null;
  subsidiary_id: number | null;
  t_shirt_size_id: number | null;
  organization_type: string;
};

export type RegisterChallengeResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RegisterChallengeResult[];
};

export type RegisterChallengePostPayload = {
  first_name?: string;
  last_name?: string;
  nickname?: string;
  sex?: string;
  telephone?: string;
  telephone_opt_in?: boolean;
  language?: string;
  occupation?: string;
  age_group?: number | null;
  newsletter?: string;
  personal_data_opt_in?: boolean;
  discount_coupon?: string;
  payment_subject?: string;
  payment_amount?: number | null;
  team_id?: number | null;
  t_shirt_size_id?: number | null;
};

export type RegisterChallengePostResponse = {
  personal_details?: Partial<CorePersonalDetails>;
  team_id?: number | null;
  organization_id?: number | null;
  subsidiary_id?: number | null;
  t_shirt_size_id?: number | null;
};

export interface ToApiPayloadStoreState {
  personalDetails?: Partial<RegisterChallengePersonalDetailsForm>;
  paymentSubject?: PaymentSubject;
  paymentAmount?: number | null;
  teamId?: number | null;
  merchId?: number | null;
  voucher?: ValidatedCoupon | null;
}