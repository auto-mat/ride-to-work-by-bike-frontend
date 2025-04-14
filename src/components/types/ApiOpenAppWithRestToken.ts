import { Ref } from 'vue';

export interface OpenAppWithRestTokenResponse {
  app_url: string;
  token_expiration: string;
}

export interface useApiGetOpenAppWithRestTokenReturn {
  isLoading: Ref<boolean>;
  load: (appId: string) => Promise<OpenAppWithRestTokenResponse>;
}
