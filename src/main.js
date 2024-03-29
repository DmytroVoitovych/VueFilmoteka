import { createApp } from 'vue';
import App from './App.vue';
import VueCookies from 'vue-cookies';
import './assets/scss/index.scss';
import router from './routes';
import { store } from './store';
import VueYtframe from 'vue3-ytframe';

export const app = createApp(App);
app.use(router);
app.use(VueCookies);
app.use(store);
app.use(VueYtframe);
app.mount('#app');
