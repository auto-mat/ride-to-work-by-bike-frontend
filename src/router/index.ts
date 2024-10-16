import { inject } from 'vue';
import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { useLoginStore } from 'src/stores/login';
import { useRegisterStore } from 'src/stores/register';
import routes from './routes';
import { routesConf } from './routes_conf';

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
  if (!window.Cypress || window.Cypress.spec.name === 'register.spec.cy.js') {
    Router.beforeEach(async (to, from, next) => {
      const logger = inject('vuejs3-logger') as Logger | null;
      const loginStore = useLoginStore();
      const registerStore = useRegisterStore();
      const isAuthenticated: boolean = await loginStore.validateAccessToken();
      const isEmailVerified: boolean = registerStore.getIsEmailVerified;

      // if authenticated and not verified email, redirect to confirm email page
      if (
        isAuthenticated &&
        !isEmailVerified &&
        // only these pages are accessible when authenticated and not verified email
        !to.matched.some(
          (record) => record.path === routesConf['verify_email']['path'],
        )
      ) {
        logger?.debug(`Router user is authenticated <${isAuthenticated}>.`);
        logger?.debug(
          `Router user email is not verified <${!isEmailVerified}>.`,
        );
        logger?.debug(
          `Router path <${routesConf['verify_email']['path']}>` +
            ` is not matched <${!to.matched.some(
              (record) => record.path === routesConf['verify_email']['path'],
            )}>.`,
        );
        logger?.debug(
          `Router path redirect to page URL <${routesConf['verify_email']['path']}>.`,
        );
        next({ path: routesConf['verify_email']['path'] });
      }
      // if authenticated and on login page or register page or confirm email page, redirect to home page
      else if (
        isAuthenticated &&
        isEmailVerified &&
        // these pages are not accessible when authenticated and verified
        to.matched.some(
          (record) =>
            record.path === routesConf['login']['path'] ||
            record.path === routesConf['register']['path'] ||
            record.path === routesConf['verify_email']['path'],
        )
      ) {
        logger?.debug(`Router user is authenticated <${isAuthenticated}>.`);
        logger?.debug(`Router user email is verified <${isEmailVerified}>.`);
        logger?.debug(
          `Router path <${routesConf['login']['path']}>,` +
            ` <${routesConf['register']['path']}>` +
            ` <${routesConf['verify_email']['path']}>` +
            ` is matched <${!to.matched.some(
              (record) =>
                record.path === routesConf['login']['path'] ||
                record.path === routesConf['register']['path'] ||
                record.path === routesConf['verify_email']['path'],
            )}>.`,
        );
        logger?.debug(
          `Router path redirect to page URL <${routesConf['verify_email']['path']}>.`,
        );
        next({ path: routesConf['home']['path'] });
      }
      // if not authenticated and not on login or register or confirm email page, redirect to login page
      else if (
        !isAuthenticated &&
        isEmailVerified &&
        // only these pages are accessible when not authenticated
        !to.matched.some(
          (record) =>
            record.path === routesConf['login']['path'] ||
            record.path === routesConf['register']['path'],
        )
      ) {
        logger?.debug(
          `Router user is not authenticated <${!isAuthenticated}>.`,
        );
        logger?.debug(`Router user email is verified <${isEmailVerified}>.`);
        logger?.debug(
          `Router path <${routesConf['login']['path']}>,` +
            ` <${routesConf['register']['path']}>` +
            ` is not  matched <${!to.matched.some(
              (record) =>
                record.path === routesConf['login']['path'] ||
                record.path === routesConf['register']['path'],
            )}>`,
        );
        logger?.debug(
          `Router path redirect to page URL <${routesConf['verify_email']['path']}>.`,
        );
        next({ path: routesConf['login']['path'] });
      }
      // if is not awaiting confirmation, and user navigates to confirm email page, redirect based on login status
      else if (
        !isAuthenticated &&
        !isEmailVerified &&
        // only these pages are accessible when not authenticated and awaiting confirmation
        !to.matched.some(
          (record) =>
            record.path === routesConf['login']['path'] ||
            record.path === routesConf['register']['path'] ||
            record.path === routesConf['verify_email']['path'],
        )
      ) {
        logger?.debug(
          `Router user is not authenticated <${!isAuthenticated}>.`,
        );
        logger?.debug(
          `Router user email is not verified <${!isEmailVerified}>.xs`,
        );
        logger?.debug(
          `Router path <${routesConf['login']['path']}>,` +
            ` <${routesConf['register']['path']}>` +
            ` <${routesConf['verify_email']['path']}>` +
            ` is not matched <${!to.matched.some(
              (record) =>
                record.path === routesConf['login']['path'] ||
                record.path === routesConf['register']['path'] ||
                record.path === routesConf['verify_email']['path'],
            )}>.`,
        );
        logger?.debug(
          `Router path redirect to page URL <${routesConf['login']['path']}>.`,
        );
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
