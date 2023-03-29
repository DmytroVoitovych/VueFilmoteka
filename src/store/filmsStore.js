import { nodeHttp } from '@/helpers/axios';
import { createStore } from 'vuex';
import localForage from 'localforage';

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
    delWatched(state, payload) {
      console.log(payload);
      state.infoWatched = payload;
    },
    delQueue(state, payload) {
      state.infoQueue = payload;
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
      await nodeHttp.delete(
        `/films/remove/${type}/${idFilm}`,

        {
          headers: { Authorization: 'Bearer ' + token },
        }
      );

      if (type === 'watched') {
        const removeItemFromArr = context.state.infoWatched.filter(
          e => e.id !== idFilm
        );
        console.log('rem', removeItemFromArr);
        context.commit('delWatched', removeItemFromArr);
        myDatabase.setItem('watched', JSON.stringify(removeItemFromArr)); // додаю в локальну базу
      } else {
        const removeItemFromArr = context.state.infoQueue.filter(
          e => e.id !== idFilm
        );
        context.commit('delQueue', removeItemFromArr);
        myDatabase.setItem('queue', JSON.stringify(removeItemFromArr)); // додаю в локальну базу
      }
    },
  },
});
