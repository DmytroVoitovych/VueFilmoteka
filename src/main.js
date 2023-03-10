import { createApp } from 'vue';
import App from './App.vue';
import VueCookies from 'vue-cookies';
import './assets/scss/index.scss';
import router from './routes';
import { store } from './store';

const app = createApp(App);
app.use(router);
app.use(store);
app.use(VueCookies);
app.mount('#app');
