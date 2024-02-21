import { createStore } from 'vuex';

export interface State {
  language: string;
  refItem: null | HTMLElement;
}

export const featuresStore = createStore<State>({
  state: {
    language:
      window.localStorage.getItem('currLang')?.slice(0, 2)?.toLowerCase() ??
      'en',
    refItem: null,
  },
  mutations: {
    setLanguage(state, payload: string) {
      state.language = payload.slice(0, 2).toLowerCase();
    },
    setRefItem(state, payload: null | HTMLElement) {
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
  }
});
