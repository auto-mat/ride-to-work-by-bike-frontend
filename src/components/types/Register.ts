export interface RegisterCoordinatorRequest {
  user_profile: {
    user: {
      firstName: string;
      lastName: string;
    };
    newsletter: string | null;
    phone: string;
  };
  user_attendance: {
    terms: boolean;
  };
  organizationId: number | null;
  jobTitle: string;
  responsibility: boolean;
}
