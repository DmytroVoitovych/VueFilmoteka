import { createStore } from 'vuex';

export const featuresStore = createStore({
  state: {
    language: window.localStorage.getItem('currLang')?.slice(0, 2)?.toLowerCase() ?? 'en',
  },
  mutations: {
    setLanguage(state, payload) {
      console.log(payload);
      state.language = payload.slice(0, 2).toLowerCase();
    },
  },
  getters: {
    getLanguage(state) {
      return state.language;
    },
  },
});
