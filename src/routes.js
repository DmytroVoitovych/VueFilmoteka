const BibliotekaPage = () =>
  import("./page/BibliotekaPage.vue");
const AuthPage = () => import("./page/AuthPage.vue");
const HomePage = () => import("./page/Home.vue");
const LoginForm = () =>
  import("./components/auth/LoginForm.vue");
const RegisterForm = () =>
  import("./components/auth/RegisterForm.vue");
import NotFound from "./components/notfound/NotFound.vue";
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
    children: [
      {
        path: "watched",
        name: "BibliotekaWatched",
        component: LoginForm,
      },
      {
        path: "queue",
        name: "BibliotekaQueue",
        component: RegisterForm,
      },
    ],
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
  {
    path: "/:pathMatch(.*)*",
    name: "NotPage",
    component: NotFound,
  },
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

export default router;
