import NotFound from './components/notfound/NotFound.vue';
import { createWebHistory, createRouter } from 'vue-router';
import BibliotekaPage from './page/BibliotekaPage.vue';
import AuthPage from './page/AuthPage.vue';
import LoginForm from './components/auth/LoginForm.vue';
import RegisterForm from './components/auth/RegisterForm.vue';
import Home from './page/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/biblioteka',
    name: 'Biblioteka',
    component: BibliotekaPage,
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
    component: AuthPage,
    children: [
      {
        path: 'login',
        name: 'AuthLogin',
        component: LoginForm,
      },
      {
        path: 'signup',
        name: 'AuthSignup',
        component: RegisterForm,
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
