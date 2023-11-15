import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/register',
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        name: 'register',
        component: () => import('pages/RegisterPage.vue'),
      },
    ],
  },
  {
    path: '/register-coordinator',
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        name: 'register-coordinator',
        component: () => import('pages/RegisterPage.vue'),
      },
    ],
  },
  {
    path: '/register-challenge',
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      { path: '', component: () => import('pages/RegisterChallengePage.vue') },
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
