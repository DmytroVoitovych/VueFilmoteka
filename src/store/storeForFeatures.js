import { createStore } from 'vuex';

export const featuresStore = createStore({
  state: {
    language: window.localStorage.getItem('currLang')?.slice(0, 2)?.toLowerCase() ?? 'en',
    refItem: null,
  },
  mutations: {
    setLanguage(state, payload) {
      console.log(payload);
      state.language = payload.slice(0, 2).toLowerCase();
    },
    setRefItem(state, payload) {
      // реф середнього елмента в треді для відображення положеня кнопки вверх вниз
      state.refItem = payload ?? null;
    },
  },
  getters: {
    getLanguage(state) {
      return state.language;
    },
    getRefItem(state) {
      return state.refItem;
    },
  },
});
