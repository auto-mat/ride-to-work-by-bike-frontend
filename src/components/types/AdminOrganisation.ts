// enums
import { Gender } from './Profile';
import { PaymentState } from '../enums/Payment';
import { TeamMemberStatus } from '../enums/TeamMember';
import { PaymentCategory } from './ApiPayu';

/**
 * Admin Team Member interface
 * Represents a team member as seen in the admin organization view
 */
export interface AdminTeamMember {
  id: number;
  name: string;
  nickname: string | null;
  date_of_challenge_registration: string;
  email: string;
  telephone: string;
  sex: Gender;
  avatar_url: string;
  approved_for_team: TeamMemberStatus;
  payment_status: PaymentState;
  payment_type: string;
  payment_category: PaymentCategory;
  payment_amount: string;
  user_profile_id: number;
}

/**
 * Admin Team interface
 * Represents a team with separated paid/unpaid members
 */
export interface AdminTeam {
  id: number;
  name: string;
  icon_url: string | null;
  members_without_paid_entry_fee: AdminTeamMember[];
  members_with_paid_entry_fee: AdminTeamMember[];
}

/**
 * Admin Subsidiary interface
 * Represents a subsidiary with its teams
 */
export interface AdminSubsidiary {
  id: number;
  street: string;
  street_number: number;
  city: string;
  icon_url: string | null;
  teams: AdminTeam[];
}

/**
 * Admin Organisation interface
 * Represents an organization with all its subsidiaries and nested data
 */
export interface AdminOrganisation {
  name: string;
  psc: number;
  street: string;
  street_number: string;
  recipient: string;
  city: string;
  ico: number;
  dic: string;
  active: boolean;
  subsidiaries: AdminSubsidiary[];
}

/**
 * Admin Organisation API Response interface
 * Standard paginated response wrapper for admin organization data
 */
export interface GetAdminOrganisationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminOrganisation[];
}
