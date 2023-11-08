import { provider } from '@/helpers/firebase/config';
import { signInWithPopup, getAuth, signOut } from 'firebase/auth';
import { nodeHttp } from '@/helpers/axios';
import { createStore } from 'vuex';
import { store as filmStore } from './filmsStore';
import Cookies from 'js-cookie';

const auth = getAuth();

interface State {
  token: string; // переглянуті
  user: {} | null;
  refresh: string;
}

export const store = createStore<State>({
  state() {
    //глобальний стейт //доступний в любому місці
    return {
      token: '', // місце для токена
      user: null, // під питанням ??
      refresh: '',
    };
  },
  mutations: {
    // методи для оновлення стейту
    setLogin(state, payload: string) {
      //закидую токен
      state.token = payload;
    },
    setUser(state, payload: {} | null) {
      // юзер
      state.user = payload;
    },
    setRefresh(state, payload: string) {
      // рефреш
      state.refresh = payload;
    },
  },
  actions: {
    async googleAuthInfo(state, payload: string | undefined) {
      try {
        const res = await nodeHttp.get('user/auth/googleIP', {
          headers: { Authorization: 'Bearer ' + payload ?? '' },
        }); // пошук по базі

        window.localStorage.setItem('name', res?.data?.data?.name);
        console.log('пішов вхід');
        state.commit('setLogin', res.data.data.token);
        Cookies.set('token', res.data.data.token, { expires: 1 / 24 });
        filmStore.dispatch(
          'getFromServerFilmId',
          Cookies.get('token') ?? res.data.data.token
        ); // достаю всі id для синхрона
      } catch (err) {
        const auth = getAuth();
        if (!state.state.token) {
          console.log('чи є вхід звичайним сбособом', !!state.state.token);
          await signOut(auth);
          console.log('бекенд не знайшов такого користувача');
          state.commit('setLogin', '');
          Cookies.remove('token');
        }
        state.commit('setLogin', '');
        Cookies.remove('token');
        console.log(err);
      }
    },
    async googleLogin(context) {
      // через гугл
      const res = await signInWithPopup(auth, provider);
      const token = 'accessToken' in res.user && res.user.accessToken;

      if (typeof token === 'string' && token) {
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
    async signUp(
      context,
      payload: {
        name: string;
        email: string;
        password: string;
      }
    ) {
      // реєстрація
      const res = await nodeHttp.post('user/auth/signup', payload);
      if (res) {
        context.commit('setUser', res.data.data.user);
        // ??? подумать про необхідність зберігання на клієнті
      }
    },
    async signIn(
      context,
      payload: {
        email: string;
        password: string;
      }
    ) {
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
    async LogOut(context, payload: string) {
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
    async currentUser(context, payload: string | undefined) {
      const res = await nodeHttp.get('user/auth/current', {
        headers: { Authorization: 'Bearer ' + payload },
      });

      if (res) {
        window.localStorage.setItem('name', res.data.data.name);
        context.commit('setLogin', res.data.data.token);
        context.commit('setRefresh', res.data.data.tokenRefresh);
      }
    },
    async refreshToken(context, payload: string) {
      // логін ноде
      const res = await nodeHttp.post('user/auth/refresh', '', {
        headers: { Authorization: 'Bearer ' + payload },
      });
      if (res) {
        const { name } = JSON.parse(
          window.atob(res.data.data.access_token.split('.')[1])
        );
        window.localStorage.setItem('name', name);
        context.commit('setLogin', res.data.data.access_token);
        context.commit('setRefresh', res.data.data.refresh_token);
      }
    },
    async resetPassword(_, payload: { email: string }) {
      // відправка коду для зміни паролю на емейл
      const res = await nodeHttp.post('user/auth/resetcode', payload);
      return res;
    },
    async setNewPassword(
      _,
      payload: {
        email: string;
        password: string;
        newPassword: string;
      }
    ) {
      // зміна паролю
      const res = await nodeHttp.patch('user/auth/newpassword', payload);
      return res;
    },
  },
});
