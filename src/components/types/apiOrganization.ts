export interface PostOrganizationPayload {
  name: string;
  vatId: string;
  organization_type: string;
}

export interface PostOrganizationResponse {
  id: number;
  name: string;
}
