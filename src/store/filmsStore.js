import { nodeHttp } from '@/helpers/axios';

import { createStore } from 'vuex';

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
      state.infoWatched.push(payload);
    },
    setQueue(state, payload) {
      // плюс в чергу
      state.infoQueue.push(payload);
    },
  },
  actions: {
    async addFilmToWatched(context, payload) {
      console.log(payload);
      console.log('act', payload.idFilm);
      await nodeHttp.post(
        '/films/add',
        { type: payload.type, idFilm: payload.idFilm },
        {
          headers: { Authorization: 'Bearer ' + payload.token },
        }
      );
      //   console.log(context.state.infoWatched);
    },
    async addFilmToQueue(context, payload) {
      console.log(payload);
      console.log('act', payload.idFilm);
      await nodeHttp.post(
        '/films/add',
        { type: payload.type, idFilm: payload.idFilm },
        {
          headers: { Authorization: 'Bearer ' + payload.token },
        }
      );
      console.log(context.state.infoQueue);
    },
  },
});
