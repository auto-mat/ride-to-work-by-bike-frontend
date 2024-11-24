// types
import type { NewsletterType } from './Newsletter';
import type { Gender } from './Profile';

interface BasePersonalDetails {
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
  extends BasePersonalDetails {
  firstName?: string;
  gender?: Gender | null;
  lastName?: string;
}

export interface RegisterChallengePostRequest {
  personalDetails: RegisterChallengePersonalDetailsApi;
  newsletter: NewsletterType[];
  teamId?: number;
}

export interface RegisterChallengeResponse {
  personalDetails: RegisterChallengePersonalDetailsApi;
  newsletter: NewsletterType[];
  organizationId?: number | null;
  subsidiaryId?: number | null;
  teamId?: number | null;
  merchId?: number | null;
}

/**
 * For the use in form, we declare the following properties as required.
 * We also add the newsletter property.
 */
export interface RegisterChallengePersonalDetailsForm
  extends BasePersonalDetails {
  firstName: string;
  gender: Gender | null;
  lastName: string;
  newsletter: NewsletterType[];
}
