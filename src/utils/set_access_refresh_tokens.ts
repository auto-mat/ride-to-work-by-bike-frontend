// composables
import { useLoginStore } from '../stores/login';
import { useJwt } from '../composables/useJwt';
import { timestampToDatetimeString } from '../utils';

// types
import type { Logger } from '../components/types/Logger';

interface SetAccessRefreshTokensParams {
  access: string;
  refresh: string;
  loginStore: ReturnType<typeof useLoginStore>;
  $log: Logger;
}

export const setAccessRefreshTokens = ({
  access,
  refresh,
  loginStore,
  $log,
}: SetAccessRefreshTokensParams) => {
  $log?.info('Save access and refresh token into store.');
  loginStore.setAccessToken(access);
  loginStore.setRefreshToken(refresh);
  $log?.debug(`Login store saved access token <${loginStore.getAccessToken}>.`);
  $log?.debug(
    `Login store saved refresh token <${loginStore.getRefreshToken}>.`,
  );

  // set JWT expiration
  const { readJwtExpiration } = useJwt();
  const expiration = readJwtExpiration(access);
  $log?.debug(
    `Current time <${timestampToDatetimeString(Date.now() / 1000)}>.`,
  );
  $log?.debug(
    `Access token expiration time <${expiration ? timestampToDatetimeString(expiration) : null}>.`,
  );
  if (expiration) {
    loginStore.setJwtExpiration(expiration);
    $log?.debug(
      `Login store saved access token expiration time <${loginStore.getJwtExpiration ? timestampToDatetimeString(loginStore.getJwtExpiration) : null}>.`,
    );
  }

  // token refresh (if no page reload before expiration)
  loginStore.scheduleTokenRefresh();
};
