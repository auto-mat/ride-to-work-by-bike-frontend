// libraries
import { Notify } from 'quasar';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getActivePinia } from 'pinia';

// composables
import { i18n } from '../boot/i18n';
import { useJwt } from './useJwt';

// stores
import { useLoginStore, emptyUser } from '../stores/login';

// utils
import { deepObjectWithSimplePropsCopy } from '../utils';

/**
 * Composable for handling impersonation token
 * Process impersonation tokens from URL parameters
 * and manage impersonation mode.
 */
export const useImpersonation = () => {
  const route = useRoute();
  const router = useRouter();
  const loginStore = useLoginStore();
  const { readJwtExpiration, readJwtUser } = useJwt();
  const isLoading = ref(false);

  /**
   * Process impersonation tokens from URL
   * Called on mount in layouts
   */
  const processImpersonation = async (): Promise<void> => {
    // prevent duplicate process
    if (isLoading.value) {
      return;
    }

    const refreshToken = route.query.refreshToken as string | undefined;
    const accessToken = route.query.accessToken as string | undefined;
    if (!refreshToken || !accessToken) {
      return;
    }
    isLoading.value = true;
    try {
      // check if already impersonating
      if (loginStore.impersonation.isActive) {
        Notify.create({
          message: i18n.global.t('impersonation.errorAlreadyImpersonating'),
          color: 'negative',
        });
        removeTokensFromUrl();
        isLoading.value = false;
        return;
      }
      // extract JWT expiration
      const jwtExpiration = readJwtExpiration(accessToken);
      if (!jwtExpiration) {
        throw new Error('Failed to decode JWT expiration from access token');
      }
      // get user data embedded in JWT
      const jwtUser = readJwtUser(accessToken) || readJwtUser(refreshToken);
      if (!jwtUser) {
        throw new Error('Failed to decode user data from access token');
      }

      loginStore.$log?.info(`Impersonating user: ${jwtUser.email}`);
      // store original admin session data
      const originalAdmin = {
        user: deepObjectWithSimplePropsCopy(loginStore.user),
        accessToken: loginStore.accessToken,
        refreshToken: loginStore.refreshToken,
        jwtExpiration: loginStore.jwtExpiration,
      };
      // reset all Pinia stores (except login)
      const pinia = getActivePinia();
      if (pinia) {
        pinia._s.forEach((store) => {
          if (store.$id !== 'login') {
            store.$reset();
          }
        });
      }
      // set impersonated user's tokens to login store
      loginStore.setAccessToken(accessToken);
      loginStore.setRefreshToken(refreshToken);
      loginStore.setJwtExpiration(jwtExpiration);
      // merge deafults with user info from token
      const impersonatedUser = {
        ...deepObjectWithSimplePropsCopy(emptyUser),
        ...jwtUser,
      };
      loginStore.setUser(impersonatedUser);
      // set impersonation state
      loginStore.setImpersonation({
        isActive: true,
        originalAdmin,
        impersonatedUser: {
          user: impersonatedUser,
        },
      });
      loginStore.$log?.info('Impersonation state set successfully.');
      // remove tokens from URL
      removeTokensFromUrl();
      loginStore.$log?.info('Loading impersonated user data from API.');
      // load fresh user data via API
      await loginStore.redirectHomeAfterLogin();
    } catch (error) {
      loginStore.$log?.error(
        `Failed to process impersonation tokens: ${error}`,
      );
      Notify.create({
        message: i18n.global.t('impersonation.errorInvalidLink'),
        color: 'negative',
      });
      // clear impersonation state and tokens from URL
      loginStore.clearImpersonation();
      removeTokensFromUrl();
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Remove impersonation tokens from URL
   */
  const removeTokensFromUrl = (): void => {
    const query = { ...route.query };
    delete query.refreshToken;
    delete query.accessToken;
    router.replace({ query });
  };

  return {
    processImpersonation,
    isLoading,
  };
};
