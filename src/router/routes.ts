// libraries
import { Screen } from 'quasar';

// config
import { routesConf } from './routes_conf';

// types
import type { RouteRecordRaw } from 'vue-router';

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
  // challenge inactive
  {
    path: routesConf['challenge_inactive']['path'],
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['challenge_inactive']['children']['name'],
        component: () => import('pages/ChallengeInactivePage.vue'),
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
  // verify email
  {
    path: routesConf['verify_email']['path'],
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['verify_email']['children']['name'],
        component: () => import('pages/VerifyEmailPage.vue'),
      },
    ],
  },
  // confirm email
  {
    path: routesConf['confirm_email']['path'],
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['confirm_email']['children']['name'],
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
  // reset password
  {
    path: routesConf['reset_password']['path'],
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['reset_password']['children']['name'],
        component: () => import('pages/ResetPasswordPage.vue'),
      },
    ],
  },
  // company coordinator
  {
    path: routesConf['become_coordinator']['path'],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: routesConf['become_coordinator']['children']['name'],
        component: () => import('pages/BecomeCoordinatorPage.vue'),
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
    redirect: () => {
      const isLargeScreen = Screen.gt.sm;
      if (isLargeScreen) {
        return { name: routesConf['routes_calendar']['children']['name'] };
      }
      return { name: routesConf['routes_list']['children']['name'] };
    },
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
      {
        path: routesConf['routes_connect_apps']['path'],
        name: routesConf['routes_connect_apps']['children']['name'],
        component: () => import('pages/RoutesConnectAppsPage.vue'),
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
  // profile
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
  // coordinator
  {
    path: routesConf['coordinator']['path'],
    component: () => import('layouts/MainLayout.vue'),
    name: routesConf['coordinator']['children']['name'],
    redirect: { name: routesConf['coordinator_tasks']['children']['name'] },
    children: [
      {
        path: routesConf['coordinator_tasks']['path'],
        name: routesConf['coordinator_tasks']['children']['name'],
        component: () => import('pages/CompanyCoordinatorPage.vue'),
      },
      {
        path: routesConf['coordinator_fees']['path'],
        name: routesConf['coordinator_fees']['children']['name'],
        component: () => import('pages/CompanyCoordinatorPage.vue'),
      },
      {
        path: routesConf['coordinator_invoices']['path'],
        name: routesConf['coordinator_invoices']['children']['name'],
        component: () => import('pages/CompanyCoordinatorPage.vue'),
      },
      {
        path: routesConf['coordinator_packages']['path'],
        name: routesConf['coordinator_packages']['children']['name'],
        component: () => import('pages/CompanyCoordinatorPage.vue'),
      },
      {
        path: routesConf['coordinator_attendance']['path'],
        name: routesConf['coordinator_attendance']['children']['name'],
        component: () => import('pages/CompanyCoordinatorPage.vue'),
      },
      {
        path: routesConf['coordinator_challenges']['path'],
        name: routesConf['coordinator_challenges']['children']['name'],
        component: () => import('pages/CompanyCoordinatorPage.vue'),
      },
      {
        path: routesConf['coordinator_results']['path'],
        name: routesConf['coordinator_results']['children']['name'],
        component: () => import('pages/CompanyCoordinatorPage.vue'),
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
