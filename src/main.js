import { createApp } from 'vue';
import App from './App.vue';
import VueCookies from 'vue-cookies';
import './assets/scss/index.scss';
import router from './routes';
import { store } from './store';
import VueYtframe from 'vue3-ytframe';
// import { featuresStore } from './store/storeForFeatures';

const app = createApp(App);
app.use(router);
app.use(store);
// app.use(featuresStore);
app.use(VueCookies);
app.use(VueYtframe);
app.mount('#app');
