// libraries
import type { Ref } from 'vue';

export interface PostOrganizationPayload {
  name: string;
  vatId: string;
  organization_type: string;
  address?: {
    street: string;
    street_number: string;
    city: string;
    zip: string;
    recipient: string;
  };
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
