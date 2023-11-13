import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'home',
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/LoginPage.vue'),
        name: 'login',
      },
    ],
  },
  {
    path: '/register',
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/RegisterPage.vue'),
        name: 'register',
      },
    ],
  },
  {
    path: '/register-coordinator',
    component: () => import('layouts/LoginRegisterLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/RegisterPage.vue'),
        name: 'register-coordinator',
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
