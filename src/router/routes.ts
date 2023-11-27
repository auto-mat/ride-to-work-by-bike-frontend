import type { RouteRecordRaw } from 'vue-router';
import { routesConf } from './routes_conf';

const routes: RouteRecordRaw[] = [
  {
    path: routesConf['home']['path'],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['home']['children']['name'],
        component: () => import('pages/IndexPage.vue'),
      },
    ],
  },
  {
    path: routesConf['login']['path'],
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['login']['children']['name'],
        component: () => import('pages/LoginPage.vue'),
      },
    ],
  },
  {
    path: routesConf['register']['path'],
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['register']['children']['name'],
        component: () => import('pages/RegisterPage.vue'),
      },
    ],
  },
  {
    path: routesConf['register-coordinator']['path'],
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['register-coordinator']['children']['name'],
        component: () => import('pages/RegisterCoordinatorPage.vue'),
      },
    ],
  },
  {
    path: routesConf['register-challenge']['path'],
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['register-challenge']['children']['name'],
        component: () => import('pages/RegisterChallengePage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
