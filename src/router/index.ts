import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { useLoginStore } from 'src/stores/login';
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
  if (!window.Cypress) {
    Router.beforeEach(async (to, from, next) => {
      const loginStore = useLoginStore();
      const isAuthenticated = await loginStore.validateAccessToken();
      // if not authenticated and not on login or register page, redirect to login page
      if (
        !isAuthenticated &&
        !to.matched.some(
          (record) =>
            record.path === routesConf['login']['path'] ||
            record.path === routesConf['register']['path'],
        )
      ) {
        next({ path: routesConf['login']['path'] });
      } else {
        next();
      }
      // if authenticated and on login page, redirect to home page
      if (
        isAuthenticated &&
        to.matched.some((record) => record.path === routesConf['login']['path'])
      ) {
        next({ path: routesConf['home']['path'] });
      }
    });
  }

  return Router;
});
