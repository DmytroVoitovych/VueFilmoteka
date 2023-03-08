// import { auth, provider } from '@/helpers/firebase/config';
// import { signInWithPopup } from 'firebase/auth';
import { nodeHttp } from '@/helpers/axios';
import { createStore } from 'vuex';

export const store = createStore({
  state() {
    //глобальний стейт //доступний в любому місці
    return {
      token: '',
      user: null,
      refresh: '',
      infoWatched: [],
      infoQueue: [],
    };
  },
  mutations: {
    // методи для оновлення стейту
    setLogin(state, payload) {
      state.token = payload;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setRefresh(state, payload) {
      state.refresh = payload;
    },
  },
  actions: {
    // async googleLogin() {
    //   try {
    //     // console.log(auth, provider);
    //     const res = await signInWithPopup(auth, provider);
    //     const token = res.user.accessToken;
    //     console.log(token);
    //     console.log(JSON.parse(window.atob(token.split('.')[1])).email);
    //     // console.log( credential);
    //   } catch (error) {
    //     // console.log(error);
    //   }
    // },
    async signUp(context, payload) {
      // реєстрація
      const res = await nodeHttp.post('user/auth/signup', payload);
      if (res) {
        context.commit('setUser', res.data.data.user);
      }
    },
    async signIn(context, payload) {
      // логін ноде
      const res = await nodeHttp.post('user/auth/login', payload);
      if (res) {
        console.log(res.data.data.access_token);
        const { name } = JSON.parse(
          window.atob(res.data.data.access_token.split('.')[1])
        );
        window.localStorage.setItem('name', name);
        context.commit('setLogin', res.data.data.access_token);
      }
    },
    async LogOut(context, payload) {
      const res = await nodeHttp.get('user/auth/logout', {
        headers: { Authorization: 'Bearer ' + payload },
      });

      if (res) {
        context.commit('setLogin', '');
      }
    },
    async currentUser(context, payload) {
      const res = await nodeHttp.get('user/auth/current', {
        headers: { Authorization: 'Bearer ' + payload },
      });

      if (res) {
        console.log('tes', res);
        window.localStorage.setItem('name', res.data.data.name);
        context.commit('setLogin', res.data.data.token);
        context.commit('setRefresh', res.data.data.tokenRefresh);
      }
    },
    async refreshToken(context, payload) {
      // логін ноде
      const res = await nodeHttp.post('user/auth/refresh', '', {
        headers: { Authorization: 'Bearer ' + payload },
      });
      if (res) {
        console.log(res.data.data.access_token);
        const { name } = JSON.parse(
          window.atob(res.data.data.access_token.split('.')[1])
        );
        window.localStorage.setItem('name', name);
        context.commit('setLogin', res.data.data.access_token);
        context.commit('setRefresh', res.data.data.refresh_token);
      }
    },
  },
});
