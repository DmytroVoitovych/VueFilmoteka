import { nodeHttp } from '@/helpers/axios';
import { createStore } from 'vuex';
import localForage from 'localforage';
import { getAndCompare } from './helpers/getId';
import { syncDb } from './helpers/syncDbServerAndClient';
import { getTotalPageB } from './helpers/getTotalPageB';

// Создаем базу данных с именем 'myDatabase'
export const myDatabase = localForage.createInstance({
  name: 'myDatabase',
});

export const store = createStore({
  state() {
    return {
      infoWatched: [], // переглянуті
      infoQueue: [], // черга
      max: { numWatch: 0, numQue: 0 }, // кількість сторінок
    };
  },
  mutations: {
    setWatched(state, payload) {
      // плюс в переглянуті
      if (Array.isArray(payload)) {
        // перевірка на массив
        state.infoWatched = payload;
        return;
      }
      // якщо ні значить приходить обьєкт пуш в массив
      state.infoWatched.push(payload);
    },
    setQueue(state, payload) {
      // плюс в чергу
      if (Array.isArray(payload)) {
        state.infoQueue = payload;
        return;
      }
      state.infoQueue.push(payload);
    },
    delWatched(state, payload) {
      state.infoWatched = payload;
    },
    delQueue(state, payload) {
      state.infoQueue = payload;
    },
    setMaxPageForBiblioteka(state, { type, num }) {
      if (type && type === 'watched') {
        state.max.numWatch = num ?? 1;
        return;
      }
      state.max.numQue = num ?? 1;
    },
  },

  getters: {
    doneWatcheds: state => id => {
      return state.infoWatched.some(todo => (todo.id || todo.idFilm) === id);
    },
    doneQueues: state => id => {
      return state.infoQueue.some(todo => (todo.id || todo.idFilm) === id);
    },
  },
  actions: {
    async addFilmToWatched(_, payload) {
      await nodeHttp.post(
        '/films/add',
        { type: payload.type, idFilm: payload.idFilm },
        {
          headers: { Authorization: 'Bearer ' + payload.token },
        }
      );
    },
    async addFilmToQueue(_, payload) {
      await nodeHttp.post(
        '/films/add',
        { type: payload.type, idFilm: payload.idFilm },
        {
          headers: { Authorization: 'Bearer ' + payload.token },
        }
      );
    },
    async dellFilmFromDb(context, { type, idFilm, token }) {
      await nodeHttp.delete(`/films/remove/${type}/${idFilm}`, {
        headers: { Authorization: 'Bearer ' + token },
      });

      if (type === 'watched') {
        const removeItemFromArr = context.state.infoWatched.filter(e => e.id !== idFilm);
        context.commit('delWatched', removeItemFromArr);
        myDatabase.setItem('watched', JSON.stringify(removeItemFromArr));
      } else {
        const removeItemFromArr = context.state.infoQueue.filter(e => e.id !== idFilm);
        context.commit('delQueue', removeItemFromArr);
        myDatabase.setItem('queue', JSON.stringify(removeItemFromArr)); // додаю в локальну базу
      }
    },
    async getFromServerFilmId({ state }, token) {
      try {
        const res = await nodeHttp.get('/films/', {
          headers: { Authorization: 'Bearer ' + token },
          params: { page: 1, limit: 20 }, // пока на тесті
        });

        if (res) {
          getTotalPageB(res);

          const watched = getAndCompare(state.infoWatched, res.data.data.watchedFilms); // порівнюю переглянуті
          const queue = getAndCompare(state.infoQueue, res.data.data.queueFilms); // порівнюю чергу

          !watched && syncDb(res.data.data.watchedFilms, 'watched');
          !queue && syncDb(res.data.data.queueFilms, 'queue');
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
