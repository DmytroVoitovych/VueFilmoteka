import NotFound from './components/notfound/NotFound.vue';
import { createWebHistory, createRouter } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./page/Home.vue'),
  },
  {
    path: '/biblioteka',
    name: 'Biblioteka',
    component: () => import('./page/BibliotekaPage.vue'),
    children: [
      {
        path: 'watched',
        name: 'BibliotekaWatched',
        component: NotFound,
      },
      {
        path: 'queue',
        name: 'BibliotekaQueue',
        component: NotFound,
      },
    ],
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('./page/AuthPage.vue'),
    children: [
      {
        path: 'login',
        name: 'AuthLogin',
        component: () => import('./components/auth/LoginForm.vue'),
      },
      {
        path: 'signup',
        name: 'AuthSignup',
        component: () => import('./components/auth/RegisterForm.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotPage',
    component: NotFound,
  },
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

export default router;
