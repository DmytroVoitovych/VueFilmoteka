import { Block } from 'notiflix';
import http from './axios';
import 'ts-replace-all';
import sampleSize from 'lodash.samplesize';
import pick from 'lodash.pick';

export default class MovieAPiServer {
  searchQuery: string;
  pageCounter: number | string;

  API_KEY: string;
  movieId: number | string | null;

  maxPages: null | number | string;
  isLoadGenres: boolean;

  readonly numberOfRandomFilms: number = 6;
  keysOfRandomFilms: string[] = [
    'title',
    'backdrop_path',
    'id',
    'poster_path',
    'video',
  ];

  constructor() {
    this.searchQuery = '';
    this.pageCounter = 1;

    this.API_KEY = 'a1157fee69973f579feaed0c038c358a';
    this.movieId = null;

    // добавив
    // this.pageSearch = 1;
    this.maxPages = null;
    this.isLoadGenres = true;
  }

  getVideoById(lang: string, transformData?: any[], arrId?: number[]) {
    if (!arrId && transformData) {
      return Promise.all(
        transformData.map(e =>
          http.get(
            `/3/movie/${e.id.toString()}/videos?api_key=${
              this.API_KEY
            }&language=${lang}`
          )
        )
      );
    } else {
      return Promise.all(
        arrId!.map(e =>
          http.get(
            `/3/movie/${e.toString()}/videos?api_key=${
              this.API_KEY
            }&language=en`
          )
        )
      );
    }
  }

  getlang() {
    // метод вертаючий поточну мову
    return (
      window.localStorage.getItem('currLang')?.slice(0, 2)?.toLowerCase() ??
      'en'
    );
  }
  //зміни запит популярні фільми за тиждень
  async fetchTopMovies(p: string, toBack?: Function) {
    const URL = `/3/trending/movie/week?api_key=${
      this.API_KEY
    }&page=${p}&language=${this.getlang()}`;

    try {
      const response = await http.get(URL);
      //добавив

      this.maxPages = response.data.total_pages;
      // ---
      return response.data.results;
    } catch (error) {
      toBack && toBack();
      return console.log(error);
    }
  }

  //добавив запит на жанри, можна один раз його зробити
  async getGenresList() {
    const URL = `/3/genre/movie/list?api_key=${
      this.API_KEY
    }&language=${this.getlang()}`;
    try {
      const response = await http.get(URL);
      window.localStorage.setItem(
        'genres',
        JSON.stringify(response.data.genres)
      ); // важно для синхронизации
      return response.data.genres;
    } catch (error) {
      return error;
    }
  }
  // ----
  async fetchMovieById(id: string) {
    const URL = `/3/movie/${id}?api_key=${
      this.API_KEY
    }&language=${this.getlang()}&append_to_response=videos`;

    try {
      const response = await http.get(URL);

      return response.data;
    } catch (error) {
      return error;
    }
  }

  async fetchMovieByQuery(n: string, q: string, toBack?: Function) {
    this.maxPages = null;
    const URL = `/3/search/movie?api_key=${
      this.API_KEY
    }&page=${n}&query=${q.replaceAll('"', '')}&language=${this.getlang()}`;

    try {
      const response = await http.get(URL);

      if (!response.data.results.length) {
        throw new Error("We didn't find anything");
      }

      this.maxPages = response.data.total_pages;

      return response.data.results;
    } catch (error) {
      toBack && toBack();
      console.log(error);
    }
  }

  async transformTheObjectOfMovies(transformData: any[]) {
    const video = await this.getVideoById(this.getlang(), transformData); //base data
    const idVideo = video
      .filter(e => !e.data.results.length)
      .map(e => e.data.id);
    const videoEN = await this.getVideoById('en', undefined, idVideo); //base data

    const combineVideo = [
      ...video.filter(e => e.data.results.length),
      ...videoEN,
    ];

    if (!video) {
      throw new Error('We coud not get videos by this request');
    }
    console.log('combineVideo', combineVideo);
    transformData.map(
      e => (e.video = combineVideo.map(e => e.data).find(v => v.id === e.id))
    );
    // не забути проконтролювати поведінку якщо відео не буде
    const particularKeys = transformData.map(obj =>
      pick(obj, this.keysOfRandomFilms)
    );

    console.log(particularKeys, 'response');

    return particularKeys;
  }

  async fetchMovieWatchedNow(toBack?: Function) {
    const URL = `/3/movie/now_playing?api_key=${
      this.API_KEY
    }&page=1&language=${this.getlang()}`;

    try {
      const response = await http.get(URL);
      if (!response.data.results.length) {
        throw new Error('Something happened wrong');
      }
      const transformData = sampleSize(
        response.data.results,
        this.numberOfRandomFilms
      );

      const res = await this.transformTheObjectOfMovies(transformData);

      return res;
    } catch (error) {
      toBack && toBack();
      console.log(error);
    }
  }

  get id() {
    return this.movieId;
  }

  get page() {
    return this.pageCounter;
  }
  set page(newPage) {
    this.pageCounter = newPage;
  }

  get query() {
    return this.searchQuery;
  }
}
