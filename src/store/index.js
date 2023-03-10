import { provider } from '@/helpers/firebase/config';
import { signInWithPopup, getAuth, signOut } from 'firebase/auth';
import { nodeHttp } from '@/helpers/axios';
import { createStore } from 'vuex';

const auth = getAuth();

export const store = createStore({
  state() {
    //глобальний стейт //доступний в любому місці
    return {
      token: '', // місце для токена
      user: null, // під питанням ??
      refresh: '',
      infoWatched: [], // переглянуті
      infoQueue: [], // черга
    };
  },
  mutations: {
    // методи для оновлення стейту
    setLogin(state, payload) {
      //закидую токен
      state.token = payload;
    },
    setUser(state, payload) {
      // юзер
      state.user = payload;
    },
    setRefresh(state, payload) {
      // рефреш
      state.refresh = payload;
    },
  },
  actions: {
    async googleAuthInfo(state) {
      try {
        const res = await nodeHttp.get('user/auth/googleIP'); // пошук по базі

        window.localStorage.setItem('name', res.data.data.name);
        console.log('пішов вхід');
        state.commit('setLogin', res.data.data.token);
      } catch (err) {
        const auth = getAuth();
        if (!state.token) {
          console.log('чи є вхід звичайним сбособом', !!state.token);
          await signOut(auth);
          console.log('бекенд не знайшов такого користувача');
          state.commit('setLogin', '');
        }
        console.log(err);
      }
    },
    async googleLogin(context) {
      // через гугл
      const res = await signInWithPopup(auth, provider);

      const token = res.user.accessToken;
      if (token) {
        const { name, email } = JSON.parse(window.atob(token.split('.')[1]));
        window.localStorage.setItem('name', name);
        context.commit('setLogin', token);

        await nodeHttp.post('user/auth/googleauth', {
          // відправляю у власну базу
          name,
          email,
          token,
          tokenRefresh: token + name[0],
        });
      }
    },
    async signUp(context, payload) {
      // реєстрація
      const res = await nodeHttp.post('user/auth/signup', payload);
      if (res) {
        context.commit('setUser', res.data.data.user);
        // ??? подумать про необхідність зберігання на клієнті
      }
    },
    async signIn(context, payload) {
      // логін ноде
      const res = await nodeHttp.post('user/auth/login', payload);
      if (res) {
        const { name } = JSON.parse(
          window.atob(res.data.data.access_token.split('.')[1])
        );
        window.localStorage.setItem('name', name);
        context.commit('setLogin', res.data.data.access_token);
      }
    },
    async LogOut(context, payload) {
      if (auth.currentUser) {
        await nodeHttp.get('user/auth/logout', {
          headers: { Authorization: 'Bearer ' + payload },
        });

        context.commit('setLogin', '');
        await signOut(auth);

        return;
      } else {
        await nodeHttp.get('user/auth/logout', {
          headers: { Authorization: 'Bearer ' + payload },
        });
        context.commit('setLogin', '');
      }
    },
    async currentUser(context, payload) {
      const res = await nodeHttp.get('user/auth/current', {
        headers: { Authorization: 'Bearer ' + payload },
      });

      if (res) {
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
