// enums
import { TeamMemberStatus } from '../enums/TeamMember';
import { StepVisitState } from '../enums/RegisterChallenge';

// types
import type { NewsletterType } from './Newsletter';
import type { Gender } from './Profile';

interface BasePersonalDetails {
  ageGroup?: number | null;
  occupation?: number | null;
  language?: string;
  nickname?: string;
  phone?: string;
  phonePermit?: boolean;
  terms?: boolean;
}

/**
 * API endpoint declares the following properties as optional.
 */
export interface RegisterChallengePersonalDetailsApi extends BasePersonalDetails {
  firstName?: string;
  gender?: Gender | null;
  id?: number;
  lastName?: string;
}

/**
 * For the use in form, we declare the following properties as required.
 * We also add the newsletter property.
 */
export interface RegisterChallengePersonalDetailsForm extends BasePersonalDetails {
  firstName: string;
  email: string;
  gender: Gender | null;
  id: number | null;
  isStaff: boolean;
  lastName: string;
  newsletter: NewsletterType[];
  approvedForTeam?: TeamMemberStatus;
}

export interface RegisterChallengeCoordinatorForm {
  jobTitle: string;
  phone: string;
  responsibility: boolean;
  terms: boolean;
}

export interface RegisterChallengePostRequest {
  personalDetails: RegisterChallengePersonalDetailsApi;
  newsletter: NewsletterType[];
  teamId?: number | null;
  telephone?: string;
  telephoneOptIn?: boolean;
}

/**
 * Tracks which registration steps have been visited in current session
 * Used to determine when invitation values should override existing values
 */
export interface VisitedSteps {
  step2: StepVisitState;
  step3: StepVisitState;
  step4: StepVisitState;
  step5: StepVisitState;
}
