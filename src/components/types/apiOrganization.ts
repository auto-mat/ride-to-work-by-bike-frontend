// libraries
import type { Ref } from 'vue';

export interface PostOrganizationPayload {
  name: string;
  ico: string;
  organization_type: string;
  address?: PostOrganizationAddress;
}

export interface PostOrganizationAddress {
  street: string;
  street_number: string;
  city: string;
  psc: string;
  recipient: string;
}

export interface PostOrganizationResponse {
  id: number;
  name: string;
}

export interface UseApiGetHasOrganizationAdminReturn {
  isLoading: Ref<boolean>;
  hasOrganizationAdmin: Ref<boolean | null>;
  checkOrganizationAdmin: () => Promise<void>;
}

export interface HasOrganizationAdminResponse {
  has_organization_admin: boolean;
}

export interface OrganizationAdmin {
  admin_name: string;
  admin_email: string;
}

export interface OrganizationAdminResponse {
  organization_admin: OrganizationAdmin[];
}

export interface UseApiGetMyOrganizationAdminReturn {
  isLoading: Ref<boolean>;
  getMyOrganizationAdmin: () => Promise<OrganizationAdmin[]>;
}
