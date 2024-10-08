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

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
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

  // turn off auth check if in Cypress tests
  if (!window.Cypress || window.Cypress.spec.name === 'register.spec.cy.js') {
    Router.beforeEach(async (to, from, next) => {
      const loginStore = useLoginStore();
      const registerStore = useRegisterStore();
      const isAuthenticated: boolean = await loginStore.validateAccessToken();
      const isEmailVerified: boolean = registerStore.getIsEmailVerified;

      // if authenticated but awaiting confirmation, redirect to confirm email page
      if (
        isAuthenticated &&
        !isEmailVerified &&
        // only these pages are accessible when authenticated and awaiting confirmation
        !to.matched.some(
          (record) => record.path === routesConf['confirm_email']['path'],
        )
      ) {
        next({ path: routesConf['confirm_email']['path'] });
      }
      // if authenticated and on login page or register page or confirm email page, redirect to home page
      else if (
        isAuthenticated &&
        isEmailVerified &&
        // these pages are not accessible when authenticated and confirmed
        to.matched.some(
          (record) =>
            record.path === routesConf['login']['path'] ||
            record.path === routesConf['register']['path'] ||
            record.path === routesConf['confirm_email']['path'],
        )
      ) {
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
            record.path === routesConf['confirm_email']['path'],
        )
      ) {
        next({ path: routesConf['login']['path'] });
      }
      // pass
      else {
        next();
      }
    });
  }

  return Router;
});
