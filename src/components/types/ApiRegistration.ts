// enums
import { TeamMemberStatus } from '../enums/TeamMember';

// types
import type { ValidatedCoupon } from './Coupon';
import type { RegisterChallengePersonalDetailsForm } from './RegisterChallenge';
import type { PaymentSubject } from '../enums/Payment';
import type { PaymentCategory, PayuProduct } from './ApiPayu';

// subset of personal details that can be sent in POST requests
export type CorePersonalDetails = {
  first_name: string;
  last_name: string;
  email: string;
  id: number;
  is_staff: boolean;
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
  payment_category: PaymentCategory;
  approved_for_team: TeamMemberStatus;
};

export type RegisterChallengeResult = {
  personal_details: PersonalDetails;
  team_id: number | null;
  organization_id: number | null;
  subsidiary_id: number | null;
  t_shirt_size_id: number | null;
  organization_type: string;
  city_slug: string | null;
  city_wp_slug: string | null;
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
  email?: string;
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
  payment_category?: PaymentCategory;
  products?: PayuProduct[];
  team_id?: number | null;
  t_shirt_size_id?: number | null;
  approved_for_team?: TeamMemberStatus;
};

export type RegisterChallengePostResponse = {
  personal_details?: Partial<PersonalDetails>;
  team_id?: number | null;
  organization_id?: number | null;
  subsidiary_id?: number | null;
  t_shirt_size_id?: number | null;
};

export interface ToApiPayloadStoreState {
  personalDetails?: Partial<RegisterChallengePersonalDetailsForm>;
  paymentSubject?: PaymentSubject;
  paymentAmount?: number | null;
  paymentCategory?: PaymentCategory;
  products?: PayuProduct[];
  teamId?: number | null;
  merchId?: number | null;
  voucher?: ValidatedCoupon | null;
  telephone?: string;
  telephoneOptIn?: boolean;
  language?: string;
}
