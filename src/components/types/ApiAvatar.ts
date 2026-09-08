export type ApiAvatarResult = {
  id: number;
  avatar_url: string;
  avatar: string;
  primary: boolean;
};

export type ApiAvatarDefaultResponse = {
  message: string;
  default_avatar: {
    src: string;
    width: string;
    height: string;
    alt: string;
  };
};

export type ApiAvatarListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiAvatarResult[];
};

// different structure for default vs. custom avatar
export type ApiAvatarGetResponse =
  ApiAvatarDefaultResponse | ApiAvatarListResponse;

export type ApiAvatarRenderResponse = {
  image_url: string;
};

export type ApiAvatarMutationResponse = {
  message: string;
  data: ApiAvatarResult;
};
