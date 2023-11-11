import http from './axios';
import 'ts-replace-all';

export default class MovieAPiServer {
  searchQuery: string;
  pageCounter: number | string;

  API_KEY: string;
  movieId: number | string | null;

  maxPages: null | number | string;
  isLoadGenres: boolean;

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
      this.maxPages = response.data.total_pages;

      return response.data.results;
    } catch (error) {
      toBack && toBack();
      return error;
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
