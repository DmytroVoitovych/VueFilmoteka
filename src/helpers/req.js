import http from './axios';

export default class MovieAPiServer {
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
    return window.localStorage.getItem('currLang')?.slice(0, 2)?.toLowerCase() ?? 'en';
  }
  //зміни запит популярні фільми за тиждень
  async fetchTopMovies(p, toBack) {
    const URL = `/3/trending/movie/week?api_key=${
      this.API_KEY
    }&page=${p}&language=${this.getlang()}`;

    try {
      const response = await http.get(URL);
      //добавив
      console.log('res',response.data);
      this.maxPages = response.data.total_pages;
      // ---
      return response.data.results;
    } catch (error) {
      toBack();
      return console.log(error);
    }
  }

  //добавив запит на жанри, можна один раз його зробити
  async getGenresList() {
    const URL = `/3/genre/movie/list?api_key=${this.API_KEY}&language=${this.getlang()}`;
    try {
      const response = await http.get(URL);
      window.localStorage.setItem('genres', JSON.stringify(response.data.genres)); // важно для синхронизации
      return response.data.genres;
    } catch (error) {
      return error;
    }
  }
  // ----
  async fetchMovieById(id) {
    const URL = `/3/movie/${id}?api_key=${this.API_KEY}&language=${this.getlang()}`;

    try {
      const response = await http.get(URL);

      return response.data;
    } catch (error) {
      return error;
    }
  }

  async fetchMovieByQuery(n, q, toBack) {
    console.log('test');
    const URL = `/3/search/movie?api_key=${this.API_KEY}&page=${n}&query=${q.replaceAll(
      '"',
      ''
    )}&language=${this.getlang()}`;

    try {
      const response = await http.get(URL);
      this.maxPages = response.data.total_pages;

      return response.data.results;
    } catch (error) {
      toBack();
      return error;
    }
  }

  get id() {
    return this.movieId;
  }

  //   set id(newMovieId) {
  //     return (this.movieId = newMovieId);
  //   }

  get page() {
    return this.pageCounter;
  }
  set page(newPage) {
    this.pageCounter = newPage;
  }

  get query() {
    return this.searchQuery;
  }

  //   set query(newQuery) {
  //     return (this.searchQuery = newQuery);
  //   }
}
