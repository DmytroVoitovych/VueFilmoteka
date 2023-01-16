import BibliotekaPage from "./page/BibliotekaPage.vue";
import AuthPage from "./page/AuthPage.vue";
import HomePage from "./page/Home.vue";
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
  },
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

export default router;
