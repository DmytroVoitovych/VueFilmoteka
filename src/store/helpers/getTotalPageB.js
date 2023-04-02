import { store } from '../filmsStore';

export const getTotalPageB = res => {
  store.commit('setMaxPageForBiblioteka', {
    num: res.data.queueFilms[0]?.totalPage,
    type: 'queue',
  });
  store.commit('setMaxPageForBiblioteka', {
    num: res.data.watchedFilms[0]?.totalPage,
    type: 'watched',
  });
};
