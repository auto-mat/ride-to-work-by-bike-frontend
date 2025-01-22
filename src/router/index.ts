import { inject } from 'vue';
import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { useChallengeStore } from 'src/stores/challenge';
import { useLoginStore } from 'src/stores/login';
import { useRegisterStore } from 'src/stores/register';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';
import routes from './routes';
import { routesConf } from './routes_conf';
import { PhaseType } from '../components/types/Challenge';

import type { Logger } from '../components/types/Logger';
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const logger = inject('vuejs3-logger') as Logger | null;
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // turn off auth check if in Cypress tests (except for register tests)
  if (
    !window.Cypress ||
    window.Cypress.spec.name === 'register.spec.cy.js' ||
    window.Cypress.spec.name === 'router_rules.cy.js'
  ) {
    Router.beforeEach(async (to, from, next) => {
      const logger = inject('vuejs3-logger') as Logger | null;
      // const challengeStore = useChallengeStore();
      const loginStore = useLoginStore();
      const registerStore = useRegisterStore();
      const registerChallengeStore = useRegisterChallengeStore();
      const isAuthenticated: boolean = await loginStore.validateAccessToken();
      const isEmailVerified: boolean = registerStore.getIsEmailVerified;
      const isChallengeActive: boolean =
        useChallengeStore().getIsChallengeInPhase(PhaseType.competition);
      const isRegistrationComplete: boolean =
        registerChallengeStore.getIsRegistrationComplete;

      logger?.debug(`Router path <${to.path}>.`);
      logger?.debug(`Router from path <${from.path}>.`);
      logger?.debug(`Router is authenticated <${isAuthenticated}>.`);
      logger?.debug(`Router is email verified <${isEmailVerified}>.`);
      logger?.debug(`Router is challenge active <${isChallengeActive}>.`);
      logger?.debug(
        `Router is registration complete <${isRegistrationComplete}>.`,
      );

      if (
        isAuthenticated &&
        !isEmailVerified &&
        // only these pages are accessible when authenticated and not verified email
        !to.matched.some(
          (record) =>
            record.path === routesConf['verify_email']['path'] ||
            record.path === routesConf['confirm_email']['path'],
        )
      ) {
        logger?.debug(`Router user is authenticated <${isAuthenticated}>.`);
        logger?.debug(
          `Router user email is not verified <${!isEmailVerified}>.`,
        );
        logger?.debug(
          `Router path <${routesConf['verify_email']['path']}>,` +
            ` <${routesConf['confirm_email']['path']}>` +
            ` is not matched <${!to.matched.some(
              (record) =>
                record.path === routesConf['verify_email']['path'] ||
                record.path === routesConf['confirm_email']['path'],
            )}>.`,
        );
        logger?.debug(
          `Router path redirect to page URL <${routesConf['verify_email']['path']}>.`,
        );
        // redirect to verify email page
        next({ path: routesConf['verify_email']['path'] });
      } else if (
        isAuthenticated &&
        isEmailVerified &&
        isChallengeActive &&
        isRegistrationComplete &&
        /**
         * These pages are not accessible when authenticated and verified,
         * challenge is active and registration is complete.
         */
        to.matched.some(
          (record) =>
            record.path === routesConf['login']['path'] ||
            record.path === routesConf['register']['path'] ||
            record.path === routesConf['verify_email']['path'] ||
            record.path === routesConf['reset_password']['path'] ||
            record.path === routesConf['challenge_inactive']['path'] ||
            record.path === routesConf['register_challenge']['path'],
        )
      ) {
        logger?.debug(`Router user is authenticated <${isAuthenticated}>.`);
        logger?.debug(`Router user email is verified <${isEmailVerified}>.`);
        logger?.debug(
          `Router path <${routesConf['login']['path']}>,` +
            ` <${routesConf['register']['path']}>` +
            ` <${routesConf['verify_email']['path']}>` +
            ` <${routesConf['reset_password']['path']}>` +
            ` <${routesConf['challenge_inactive']['path']}>` +
            ` is matched <${!to.matched.some(
              (record) =>
                record.path === routesConf['login']['path'] ||
                record.path === routesConf['register']['path'] ||
                record.path === routesConf['verify_email']['path'] ||
                record.path === routesConf['reset_password']['path'] ||
                record.path === routesConf['challenge_inactive']['path'] ||
                record.path === routesConf['register_challenge']['path'],
            )}>.`,
        );
        logger?.debug(`Router challenge is active <${isChallengeActive}>`);
        logger?.debug(
          `Router path redirect to page URL <${routesConf['home']['path']}>.`,
        );
        // redirect to home page
        next({ path: routesConf['home']['path'] });
      } else if (
        isAuthenticated &&
        isEmailVerified &&
        !isChallengeActive &&
        !to.matched.some(
          /**
           * Only these pages are accessible when authenticated, verified email
           * and challenge is not active.
           */
          (record) => record.path === routesConf['challenge_inactive']['path'],
        )
      ) {
        logger?.debug(`Router user is authenticated <${isAuthenticated}>.`);
        logger?.debug(`Router user email is verified <${isEmailVerified}>.`);
        logger?.debug(`Router challenge is not active <${!isChallengeActive}>`);
        logger?.debug(
          `Router path <${routesConf['challenge_inactive']['path']}>` +
            ` is not matched <${!to.matched.some(
              (record) =>
                record.path === routesConf['challenge_inactive']['path'],
            )}>.`,
        );
        logger?.debug(
          `Router path redirect to page URL <${routesConf['challenge_inactive']['path']}>.`,
        );
        // redirect to challenge inactive page
        next({ path: routesConf['challenge_inactive']['path'] });
      } else if (
        isAuthenticated &&
        isEmailVerified &&
        isChallengeActive &&
        !isRegistrationComplete &&
        /**
         * Only these pages are accessible when authenticated, verified email
         * challenge is active and registration is not complete.
         */
        !to.matched.some(
          (record) => record.path === routesConf['register_challenge']['path'],
        )
      ) {
        logger?.debug(`Router user is authenticated <${isAuthenticated}>.`);
        logger?.debug(`Router user email is verified <${isEmailVerified}>.`);
        logger?.debug(`Router challenge is active <${isChallengeActive}>.`);
        logger?.debug(
          `Router registration is not complete <${!isRegistrationComplete}>.`,
        );
        logger?.debug(
          `Router path <${routesConf['register_challenge']['path']}>` +
            ` is not matched <${!to.matched.some(
              (record) =>
                record.path === routesConf['register_challenge']['path'],
            )}>.`,
        );
        logger?.debug(
          `Router path redirect to page URL <${routesConf['register_challenge']['path']}>.`,
        );
        // redirect to register challenge page
        next({ path: routesConf['register_challenge']['path'] });
      } else if (
        /**
         * If not authenticated and not on pages: login, register,
         * confirm_email, reset_password, redirect to login page.
         */
        !isAuthenticated &&
        !to.matched.some(
          (record) =>
            record.path === routesConf['login']['path'] ||
            record.path === routesConf['register']['path'] ||
            record.path === routesConf['confirm_email']['path'] ||
            record.path === routesConf['reset_password']['path'],
        )
      ) {
        logger?.debug(
          `Router user is not authenticated <${!isAuthenticated}>.`,
        );
        logger?.debug(
          `Router path <${routesConf['login']['path']}>,` +
            ` <${routesConf['register']['path']}>,` +
            ` <${routesConf['confirm_email']['path']}>,` +
            ` <${routesConf['reset_password']['path']}>` +
            ` is not matched <${!to.matched.some(
              (record) =>
                record.path === routesConf['login']['path'] ||
                record.path === routesConf['register']['path'] ||
                record.path === routesConf['confirm_email']['path'] ||
                record.path === routesConf['reset_password']['path'],
            )}>.`,
        );
        logger?.debug(
          `Router path redirect to page URL <${routesConf['login']['path']}>.`,
        );
        // redirect to login page
        next({ path: routesConf['login']['path'] });
      }
      // pass
      else {
        logger?.info('Router call <next()> function.');
        next();
      }
    });
  } else {
    logger?.info('Authentification was disabled for Cypress e2e tests.');
  }

  return Router;
});
