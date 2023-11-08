import MovieAPiServer from '@/helpers/req';
import { myDatabase, store } from '../filmsStore';

const http = new MovieAPiServer();

export const syncDb = (nodeArr: [], type: string) => {
  // функція для синхрона бекенда і indexDB
  const key = type.includes('watched') ? 'setWatched' : 'setQueue'; //перевірка на список

  Promise.all(
    nodeArr.map((e: { idFilm: string | number }) =>
      http.fetchMovieById(e.idFilm)
    )
  ).then(data => {
    store.commit(key, data);
    myDatabase.setItem(type, JSON.stringify(data));
  });
};
