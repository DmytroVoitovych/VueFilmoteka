import { nodeHttp } from '@/helpers/axios';
// import { set } from 'idb-keyval';
import { createStore } from 'vuex';
import localForage from 'localforage';
// import serialize from 'serialize-javascript';

// Создаем базу данных с именем 'myDatabase'
export const myDatabase = localForage.createInstance({
  name: 'myDatabase',
});

export const store = createStore({
  state() {
    return {
      infoWatched: [], // переглянуті
      infoQueue: [], // черга
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
  },
  getters: {
    doneWatcheds: state => id => {
      return state.infoWatched.some(todo => todo.id === id);
    },
    doneQueues: state => id => {
      return state.infoQueue.some(todo => todo.id === id);
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
  },
});
