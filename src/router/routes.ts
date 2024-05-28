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
    path: routesConf['routes']['path'],
    redirect: routesConf['routes_calendar']['path'],
  },
  {
    path: routesConf['routes_calendar']['path'],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['routes_calendar']['children']['name'],
        component: () => import('pages/RoutesPage.vue'),
      },
    ],
  },
  {
    path: routesConf['routes_list']['path'],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['routes_list']['children']['name'],
        component: () => import('pages/RoutesPage.vue'),
      },
    ],
  },
  {
    path: routesConf['routes_map']['path'],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['routes_map']['children']['name'],
        component: () => import('pages/RoutesPage.vue'),
      },
    ],
  },
  {
    path: routesConf['routes_app']['path'],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['routes_app']['children']['name'],
        component: () => import('pages/RoutesPage.vue'),
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
  {
    path: routesConf['results']['path'],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['results']['children']['name'],
        component: () => import('pages/ResultsPage.vue'),
      },
    ],
  },
  {
    path: routesConf['results_detail']['path'],
    redirect: routesConf['results_report']['path'],
  },
  {
    path: routesConf['results_report']['path'],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['results_report']['children']['name'],
        component: () => import('pages/ResultsDetailPage.vue'),
      },
    ],
  },
  {
    path: routesConf['results_regularity']['path'],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['results_regularity']['children']['name'],
        component: () => import('pages/ResultsDetailPage.vue'),
      },
    ],
  },
  {
    path: routesConf['results_performance']['path'],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['results_performance']['children']['name'],
        component: () => import('pages/ResultsDetailPage.vue'),
      },
    ],
  },
  {
    path: routesConf['community']['path'],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['community']['children']['name'],
        component: () => import('pages/CommunityPage.vue'),
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
