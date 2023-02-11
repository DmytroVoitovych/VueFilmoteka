import BibliotekaPage from "./page/BibliotekaPage.vue";
import AuthPage from "./page/AuthPage.vue";
import HomePage from "./page/Home.vue";
import LoginForm from "./components/auth/LoginForm.vue";
import RegisterForm from "./components/auth/RegisterForm.vue";
import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/biblioteka",
    name: "Biblioteka",
    component: BibliotekaPage,
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthPage,
    children: [
      {
        path: "login",
        name: "AuthLogin",
        component: LoginForm,
      },
      {
        path: "signup",
        name: "AuthSignup",
        component: RegisterForm,
      },
    ],
  },
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

export default router;
