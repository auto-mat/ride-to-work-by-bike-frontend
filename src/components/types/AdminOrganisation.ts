// enums
import { Gender } from './Profile';
import { PaymentState } from '../enums/Payment';
import { TeamMemberStatus } from '../enums/TeamMember';
import { PaymentCategory } from './ApiPayu';

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
  diploma: string | null;
  discount_coupon: string;
  user_profile_id: number;
  is_payment_with_reward: boolean | null;
}

export interface AdminTeam {
  id: number;
  name: string;
  icon_url: string | null;
  diploma: string | null;
  members_without_paid_entry_fee_by_org_coord: AdminTeamMember[];
  members_with_paid_entry_fee_by_org_coord: AdminTeamMember[];
  other_members: AdminTeamMember[];
}

export interface PackageTransaction {
  t_shirt_size: string;
  name: string;
}

export interface TeamPackage {
  dispatched: boolean;
  package_transactions: PackageTransaction[];
}

export interface Box {
  dispatched: boolean;
  carrier_identification: string;
  tracking_link: string;
  modified: string;
  team_packages: TeamPackage[];
}

export interface AdminSubsidiary {
  id: number;
  name: string;
  psc: number;
  street: string;
  street_number: number;
  city: string;
  icon_url: string | null;
  teams: AdminTeam[];
  boxes?: Box[];
  box_addressee_name: string | null;
  box_addressee_telephone: string | null;
  box_addressee_email: string | null;
  challenge_city: string | null;
}

export interface AdminOrganisation {
  name: string;
  psc: number;
  street: string;
  street_number: number;
  recipient: string;
  city: string;
  ico: number;
  dic: string;
  active: boolean;
  subsidiaries: AdminSubsidiary[];
}

export interface GetAdminOrganisationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminOrganisation[];
}

export interface TableFeeApprovalRow {
  id: number;
  name: string;
  reward: boolean | null;
  email: string;
  nickname: string | null;
  amount: number;
  dateCreated: string;
  address: string;
  isFirst?: boolean;
}
