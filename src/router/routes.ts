import type { RouteRecordRaw } from 'vue-router';
import { routesConf } from './routes_conf';

const routes: RouteRecordRaw[] = [
  // home
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
  // community
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
  // confirm email
  {
    path: routesConf['verify_email']['path'],
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['verify_email']['children']['name'],
        component: () => import('pages/ConfirmEmailPage.vue'),
      },
    ],
  },
  // login
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
  // company coordinator
  {
    path: routesConf['company_coordinator']['path'],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['company_coordinator']['children']['name'],
        component: () => import('pages/CompanyCoordinatorPage.vue'),
      },
    ],
  },
  // prizes
  {
    path: routesConf['prizes']['path'],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['prizes']['children']['name'],
        component: () => import('pages/PrizesPage.vue'),
      },
    ],
  },
  // routes
  {
    path: routesConf['routes']['path'],
    component: () => import('layouts/MainLayout.vue'),
    name: routesConf['routes']['children']['name'],
    redirect: { name: routesConf['routes_calendar']['children']['name'] },
    children: [
      {
        path: routesConf['routes_calendar']['path'],
        name: routesConf['routes_calendar']['children']['name'],
        component: () => import('pages/RoutesPage.vue'),
      },
      {
        path: routesConf['routes_list']['path'],
        name: routesConf['routes_list']['children']['name'],
        component: () => import('pages/RoutesPage.vue'),
      },
      {
        path: routesConf['routes_map']['path'],
        name: routesConf['routes_map']['children']['name'],
        component: () => import('pages/RoutesPage.vue'),
      },
      {
        path: routesConf['routes_app']['path'],
        name: routesConf['routes_app']['children']['name'],
        component: () => import('pages/RoutesPage.vue'),
      },
    ],
  },
  // register
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
  // register coordinator
  {
    path: routesConf['register_coordinator']['path'],
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['register_coordinator']['children']['name'],
        component: () => import('pages/RegisterCoordinatorPage.vue'),
      },
    ],
  },
  // register challenge
  {
    path: routesConf['register_challenge']['path'],
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['register_challenge']['children']['name'],
        component: () => import('pages/RegisterChallengePage.vue'),
      },
    ],
  },
  // results
  {
    path: routesConf['results']['path'],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['results']['children']['name'],
        component: () => import('pages/ResultsPage.vue'),
      },
      {
        path: routesConf['results_detail']['path'],
        name: routesConf['results_detail']['children']['name'],
        component: () => import('pages/ResultsDetailPage.vue'),
        redirect: {
          name: routesConf['results_report']['children']['name'],
        },
        children: [
          {
            path: routesConf['results_report']['path'],
            name: routesConf['results_report']['children']['name'],
            component: () => import('pages/ResultsDetailPage.vue'),
            meta: {
              breadcrumb: [
                {
                  path: routesConf['results']['path'],
                  name: routesConf['results']['children']['name'],
                },
              ],
            },
          },
          {
            path: routesConf['results_regularity']['path'],
            name: routesConf['results_regularity']['children']['name'],
            component: () => import('pages/ResultsDetailPage.vue'),
            meta: {
              breadcrumb: [
                {
                  path: routesConf['results']['path'],
                  name: routesConf['results']['children']['name'],
                },
              ],
            },
          },
          {
            path: routesConf['results_performance']['path'],
            name: routesConf['results_performance']['children']['name'],
            component: () => import('pages/ResultsDetailPage.vue'),
            meta: {
              breadcrumb: [
                {
                  path: routesConf['results']['path'],
                  name: routesConf['results']['children']['name'],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    path: routesConf['profile']['path'],
    component: () => import('layouts/MainLayout.vue'),
    name: routesConf['profile']['children']['name'],
    redirect: { name: routesConf['profile_details']['children']['name'] },
    children: [
      {
        path: routesConf['profile_details']['path'],
        name: routesConf['profile_details']['children']['name'],
        component: () => import('pages/ProfilePage.vue'),
      },
      {
        path: routesConf['profile_forms']['path'],
        name: routesConf['profile_forms']['children']['name'],
        component: () => import('pages/ProfilePage.vue'),
      },
      {
        path: routesConf['profile_newsletter']['path'],
        name: routesConf['profile_newsletter']['children']['name'],
        component: () => import('pages/ProfilePage.vue'),
      },
      {
        path: routesConf['profile_notifications']['path'],
        name: routesConf['profile_notifications']['children']['name'],
        component: () => import('pages/ProfilePage.vue'),
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
