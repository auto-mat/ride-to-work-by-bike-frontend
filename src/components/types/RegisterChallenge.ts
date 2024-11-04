// types
import type { NewsletterType } from './Newsletter';
import type { Gender } from './Profile';

interface CorePersonalDetails {
  ageGroup?: number;
  jobTitle?: string;
  language?: string;
  nickname?: string;
  phone?: string;
  phonePermit?: boolean;
  terms?: boolean;
}

/**
 * API endpoint declares the following properties as optional.
 */
export interface RegisterChallengePersonalDetailsApi
  extends CorePersonalDetails {
  firstName?: string;
  gender?: Gender | null;
  lastName?: string;
  newsletter?: NewsletterType[];
}

/**
 * For the use in form, we declare the following properties as required.
 */
export interface RegisterChallengePersonalDetailsForm
  extends CorePersonalDetails {
  firstName: string;
  gender: Gender | null;
  lastName: string;
  newsletter: NewsletterType[];
}
