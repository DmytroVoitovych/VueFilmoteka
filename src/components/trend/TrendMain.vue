<template>
  <div>
    <div class="gallery__item" style="display: none"></div>
    <ContainerMain>
      <section class="container gallery section">
        <div v-if="trend?.length && max > 1" class="pagination-wrap">
          <PaginationHardVue @numPage="setPage" :proppages="max" ref="upBtn" :path="path" />
        </div>
        <ul class="gallery-js gallery__list">
          <li
            v-for="{
              id,
              title,
              release_date,
              poster_path,
              genre_ids,
              vote_average,
              genres,
            } in trend"
            ref="observer"
            :key="id"
            class="gallery__item"
            @click="getIdForModal(id)"
          >
            <img
              class="gallery__img"
              loading="lazy"
              :src="poster_path ? getPoster(poster_path) : require('./../../assets/images/ded.jpg')"
              :alt="title"
            />
            <div class="gallery__info">
              <p class="gallery__title them">{{ title }}</p>
              <p class="gallery__text them">
                <span :class="{ space: getGenre(genre_ids ?? genres.map(e => e.id))?.length > 27 }"
                  >{{ getGenre(genre_ids ?? genres.map(e => e.id)) }}&ensp;|&ensp;</span
                >
                {{ year(release_date)
                }}<span class="gallery__rating them">{{ vote_average?.toFixed(1) }}</span>
              </p>
            </div>
          </li>
        </ul>
        <SkeletonTrend v-if="status === 'load' && !this.trend.length" class="gallery__list" />

        <div v-if="trend?.length && max > 1" class="pagination-wrap">
          <PaginationHardVue @numPage="setPage" :proppages="max" ref="downBtn" :path="path" />
        </div>
      </section>
    </ContainerMain>
  </div>
</template>

<script>
import ContainerMain from '../shared/ContainerMain.vue';
import MovieAPiServer from '@/helpers/req';
import PaginationHardVue from '../shared/PaginationHard.vue';
import SkeletonTrend from './SkeletonTrend.vue';
import { axio, nodeHttp } from '../../helpers/axios';
import { Report, Block } from 'notiflix';
import { store } from '@/store/filmsStore';
import intersectionWith from 'lodash.intersectionwith';
import { featuresStore } from '@/store/storeForFeatures';
import { myDatabase } from '@/store/filmsStore';
import { ready } from 'localforage';

const http = new MovieAPiServer();
let checkParam = false;

export default {
  name: 'TrendMain',
  components: {
    ContainerMain,
    // Home,
    PaginationHardVue,
    SkeletonTrend,
  },
  props: {
    proppages: {
      type: Number,
      default: 0,
    },
    switcher: {
      type: Boolean,
      default: false,
    },
    modalstate: {
      type: Boolean,
      default: false,
    },
    path: {
      type: String,
      default: '',
    },
  },
  emits: {
    'get-find-id': v => typeof v === 'number',
  },
  data() {
    //стейт
    return {
      status: 'load',
      trend: [],
      genrs: [],
      page: 1,
      max: 0,
      locate: 0,
      check: false,
    };
  },
  beforeCreate() {
    !JSON.parse(window.localStorage.getItem('genres')) && http.getGenresList();
  },
  async created() {
    window.localStorage.getItem(this.path)
      ? (this.status = 'ready')
      : window.localStorage.removeItem(this.path);
    this.path === 'Home' ? this.startRenderPage() : this.funcUpdateBibliotekaPage();
    this.loaderBasic(); // важливо дочекатись змонтування дерева
  },
  methods: {
    // функції
    async startRenderPage() {
      const data = this.checkFind()
        ? await http.fetchMovieByQuery(
            window.localStorage.getItem('numberPage') ?? 1,
            window.localStorage.getItem('findedFilms'),
            this.toMainPage
          )
        : await http.fetchTopMovies(this.page, this.toMainPage);

      data?.length === 0 && this.toMainPage();
      this.trend = this.controlStorage() || data;
      this.max = http.maxPages > 500 ? 500 : http.maxPages;

      this.getStaticGenres();
    },
    year(num) {
      // рік
      return num ? num.slice(0, 4) : 'no date';
    },
    getPoster(poster) {
      //постери
      return `https://image.tmdb.org/t/p/w500/${poster}`;
    },
    getGenre(idg) {
      //розбір жанрів
      return idg
        ?.map(e => this.criticalGenres.filter(({ id, name }) => id === e && name))
        .flat(3)
        .map(({ name }) => name)
        .slice(0, 2)
        .join(', ');
    },
    async setPage(num) {
      this.page = num;
      if (this.path === 'Home') {
        window.localStorage.setItem('numberPage', num); // добавляю сторінку

        const data = this.checkFind()
          ? await http.fetchMovieByQuery(this.page, window.localStorage.getItem('findedFilms'))
          : await http.fetchTopMovies(num);

        this.trend = data;
        this.max = http.maxPages > 500 ? 500 : http.maxPages;
        window.localStorage.setItem('filmsPage', JSON.stringify(data));
        this.getStaticGenres();
      } else if (this.path.includes('Biblioteka')) {
        await this.setPageBiblioteka(num); // контроль пагинації в бібліотеці
        this.controlScroll();
      }
      this.controlScroll();
    },
    async setPageBiblioteka(num) {
      try {
        const res = await nodeHttp.get('/films/', {
          headers: { Authorization: 'Bearer ' + this.$store.state.token },
          params: { page: num ?? this.page, limit: 20 }, // пока на тесті
        }); // забираю з беку списки юзера

        const watchedFilter = intersectionWith(
          //звіряю з локальною базою і беру тіки ті які приніс бекенд
          store.state.infoWatched, // локальна база
          res.data.watchedFilms.map(e => e.idFilm), // бекенд
          (a, b) => a.id === b // фідвільтровую по id фільмів
        );
        const queueFilter = intersectionWith(
          store.state.infoQueue,
          res.data.queueFilms.map(e => e.idFilm),
          (a, b) => a.id === b
        );
        this.funcUpdateIfChangePath(watchedFilter, queueFilter); // передаю аргументи в функію зміни стану
      } catch (error) {
        console.log(error);
      }
    },
    controlStorage() {
      //перевіка локльного стора
      if (
        JSON.parse(window.localStorage.getItem('numberPage')) &&
        JSON.parse(window.localStorage.getItem('filmsPage'))
      ) {
        return JSON.parse(window.localStorage.getItem('filmsPage'));
      }

      return false;
    },
    controlScroll() {
      this.locate = window.scrollY; //запис положення
      this.$nextTick().then(() => {
        //прибиваю скролл
        this.locate > window.document.documentElement.clientHeight / 2 &&
          window.scrollBy(0, this.locate * 20);
      });
    },
    checkFind() {
      //перевірка наявності пошуку
      const check = JSON.parse(window.localStorage.getItem('findedFilms')) ? true : false;
      this.check = check;
      return check;
    },
    toMainPage() {
      // добавити вспливаючу підказку (що нічого нема)
      Report.info(
        'Sorry',
        'On your request we found nothing , we return you to the main.',
        'Okay',
        () => {
          this.$router.go(0);
          window.localStorage.removeItem('numberPage');
          window.localStorage.removeItem('findedFilms');
        }
      );
    },
    checkForStupid() {
      return this.trend.length > 0;
    },
    loaderBasic() {
      // функція відповідальна за основний лоадер на сайті

      axio.loader.interceptors.request.use(config => {
        //перехоплюєм запит

        checkParam = config.url.includes('/3/movie/');
        if (!checkParam) {
          //якщо потрібний запит
          this.checkForStupid() && //перевірка на дурня
            Block?.dots('.gallery__item', {
              //сам лофдер з конфігураціями
              svgColor: 'var(--text-color-red)',
              svgSize: '100px',
              backgroundColor: 'var(--bg-loader-basic)',
            });
        }

        return config;
      });

      axio.loader.interceptors.response.use(res => {
        // коли дані нам надійшли  вимикаєм лоадер
        if (!checkParam) {
          //якщо потрібний запит
          this.checkForStupid() && Block?.remove('.gallery__item');
        }

        return res;
      });
    },
    getIdForModal(id) {
      // отримання данних для модалки
      this.$emit('get-find-id', id);
    },
    async getStaticGenres() {
      const genr =
        JSON.parse(window.localStorage.getItem('genres')) ?? (await http.getGenresList());
      this.genrs = genr;
    },
    funcUpdateIfChangePath(watched, queue) {
      if (!store.state.infoWatched.length && !store.state.infoQueue.length) {
        this.syncIndexDBandStore();
      }

      switch (
        this.path // звіряю по положеню
      ) {
        case 'BibliotekaWatched':
          this.trend = watched ?? store.state.infoWatched.slice(0, 20); // якщо параметр є  пишу його якшо ні першу 20
          !this.trend && window.localStorage.setItem('BibliotekaWatched', 'empty');
          this.max = store.state.max.numWatch; // всі сторінки
          break;
        case 'BibliotekaQueue':
          this.trend = queue ?? store.state.infoQueue.slice(0, 20);
          this.max = store.state.max.numQue;
          !this.trend && window.localStorage.setItem('BibliotekaQueue', 'empty');
          break;
        default:
          this.max = http.maxPages > 500 ? 500 : http.maxPages; // всі сторінки
          break;
      }
    },
    funcUpdateBibliotekaPage() {
      store.state.max['numWatch' || 'numQue'] && this.funcUpdateIfChangePath(); // оптимізація швидкості
      store
        .dispatch('getFromServerFilmId', this.$cookies.get('token') ?? this.$store.state.token)
        .then(() => {
          this.funcUpdateIfChangePath();
        });
    },
    funcSubscribeForDelAction() {
      this.modalstate && // якщо модалка відкрита підписуюсь на зміни
        store.subscribe(mutation => {
          // слідкую за мутаціями стору
          const folowIdDel = mutation.payload[0]?.id ?? false; // отримує id видаленого фільму

          folowIdDel && // якщо є
            // і модалка виключена
            !this.modalstate &&
            this.trend.splice(
              //  видаляю з масиву
              this.trend.findIndex(e => e === folowIdDel),
              0
            );
          !this.trend.length && (this.status = 'ready');
        });
    },
    funcSubscribeChangeLanguage() {
      featuresStore.subscribe(mutation => {
        if (mutation.type.includes('setLanguage')) {
          window.localStorage.removeItem('genres');
          this.path === 'Home' ? this.setPage(this.page) : this.funcUpdateBibliotekaPage();
        }
      });
    },
    syncIndexDBandStore() {
      myDatabase.keys().then(keys => {
        if (keys.includes('watched') && this.path === 'BibliotekaWatched') {
          // перевірка ключа
          myDatabase.getItem('watched').then(e => {
            this.trend = JSON.parse(e).slice(0, 20); // якщо гуд коміт в стор
            this.max = Math.ceil(JSON.parse(e).length / 20);
            !JSON.parse(e).length && window.localStorage.setItem('BibliotekaWatched', 'empty');
          });
        }
        if (keys.includes('queue') && this.path === 'BibliotekaQueue') {
          myDatabase.getItem('queue').then(e => {
            this.trend = JSON.parse(e).slice(0, 20);
            this.max = Math.ceil(JSON.parse(e).length / 20);
            !JSON.parse(e).length && window.localStorage.setItem('BibliotekaQueue', 'empty');
          }); // якщо гуд коміт в стор
        }
        return;
      });
    },
    sendRef() {
      //передаю реф
      const time = setTimeout(() => {
        featuresStore.commit(
          'setRefItem',
          this.trend.length > 8 ? this.$refs.observer[8] : this.$refs.observer.reverse()[2]
        );
        this.status = 'ready';
        clearTimeout(time);
      }, 200);
    },
  },

  watch: {
    page() {
      this.$refs?.upBtn?.forcePage(this.page); //форс зверху
      this.page = this.$refs?.upBtn?.page; //зміна
      this.$refs?.downBtn?.forcePage(this.page); //форс знизу
      this.page = this.$refs?.downBtn?.page; //зміна
    },

    switcher() {
      // тригер пошуку // завязано за імпут в хедері
      this.max = 0;
      this.startRenderPage();
    },
    path() {
      window.localStorage.getItem(this.path)
        ? (this.status = 'ready')
        : window.localStorage.removeItem(this.path) && (this.status = ready);
      this.page = 1;
      this.funcUpdateBibliotekaPage();
    },
    modalstate() {
      this.funcSubscribeForDelAction();
    },
    trend() {
      !this.trend.length
        ? window.localStorage.setItem(this.path, 'empty') && (this.status = ready)
        : window.localStorage.getItem(this.path) && window.localStorage.removeItem(this.path);

      this.trend.length > 2 ? this.sendRef() : featuresStore.commit('setRefItem', null);
    },
  },

  mounted() {
    this.funcSubscribeChangeLanguage();
    this.loaderBasic(); // важливо дочекатись змонтування дерева
  },

  updated() {
    (!this.path || this.path === 'Home') && this.startRenderPage();
    this.page === 1 && !this.modalstate // контроль пагінації
      ? this.funcUpdateBibliotekaPage()
      : this.setPageBiblioteka();
  },
  computed: {
    criticalGenres() {
      return this.genrs.length ? this.genrs : JSON.parse(window.localStorage.getItem('genres'));
    },

    getLanguage() {
      return featuresStore.getters.getLanguage;
    },
  },
};
</script>

<style lang="scss" scoped>
.section-night {
  background-color: #2d2a2a;
}

.active {
  width: 40px;
  height: 40px;

  pointer-events: none;
  background-color: var(--text-color-light-orange);
  color: var(--text-color-light);
  @media screen and (max-width: 390px) {
    width: 30px;
  }
}

.gallery {
  position: relative;
  padding-top: 60px;
  padding-bottom: 60px;
  display: grid;

  gap: 60px;
}

.overlay {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  height: 600px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 30%;
  background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.56), rgba(0, 0, 0, 0.56)),
    url('../../assets/images/library.jpeg');
}

.gallery__list {
  /* margin-bottom: 60px; */
  display: grid;

  @media screen and (min-width: 1280px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px 16px;
  }
  @media screen and (min-width: 768px) and(max-width: 1279.5px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
  @media screen and (max-width: 767.5px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
.gallery__item {
  width: 100%;
  padding-bottom: 3px;
  cursor: pointer;
}
.gallery__item:hover {
  box-shadow: 1px 2px 2px 3px rgba(150, 64, 3, 0.608), 2px 2px 2px rgba(135, 102, 78, 0.456),
    2px 3px 2px rgba(244, 157, 94, 0.409);
  border-radius: 2px 2px 5px 5px;
  cursor: pointer;
  transition: box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.gallery__item:hover .gallery__info {
  color: #ff7f00;
  transition: font-weight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery__img {
  position: relative;
  border: none;
  width: 100%;
  height: 574px;
  // display: block;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 12px;

  background: var(--bg-loader-basic);
  background-size: 130px;
  animation: load 3s infinite cubic-bezier(0.4, 0, 0.2, 1);

  @media screen and (min-width: 768px) and(max-width: 1279.5px) {
    height: 455px;
  }
  @media screen and (max-width: 767.5px) {
    height: calc((100vw - 40px) * 1.5);
    min-height: 402px;
    max-height: 660px;
  }
}
.gallery__info {
  font-family: Roboto;
  letter-spacing: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.2;
  color: inherit;
  padding-left: 3px;
  // text-shadow: 0px 4px 4px 0px #00000040, 0px 4px 4px 0px #00000040;

  @media screen and (min-width: 768px) and (max-width: 1279.5) {
    font-size: 12px;
    line-height: 1.33;
  }
  @media screen and (min-width: 480px) and (max-width: 767.5px) {
    line-height: 1.17;
  }
  @media screen and (max-width: 479.5px) {
    font-size: 4vw;
  }
}
.gallery__title {
  text-transform: uppercase;
}
.gallery__text {
  color: var(--text-color-light-orange);
  display: flex;
  @media screen and (max-width: 767.5px) {
    line-height: 1.33;
  }
}
.gallery__rating {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
  width: 40px;
  border-radius: 5px;
  height: 20px;
  background-color: var(--bg-color-modal-orange);
  color: var(--text-color-light);
  font-size: 12px;
  line-height: 1.17;
  align-self: center;
  margin-left: auto;
  margin-right: 2px;
  @media screen and (max-width: 1279.5px) {
    width: 36px;
    height: 16px;
  }
}

.home .gallery__rating {
  display: none;
}

.page-top-js {
  border: none;
  border-radius: 5px;
  background-color: var(--bg-color-light-grey);
  cursor: pointer;
  position: fixed;
  bottom: 10px;
  right: 20px;
  transform: rotate(-90deg);
  transition: color 0.5s;
  font-size: 60px;
}
.page-top-js:hover {
  color: #9e0117;
}
.is-hidden {
  display: none;
}
.is-open {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  overflow-y: hidden;
}

//******* spec */
.space {
  font-size: smaller;
}

@keyframes load {
  50% {
    background: linear-gradient(to right, transparent 0%, #e8e8e8 50%, transparent 100%) top right;
  }
}
//****

.noFilms {
  text-align: center;
  background-image: url('@/assets/images/biblioteka/nofilms.jpg'),
    linear-gradient(90deg, rgba(0, 0, 0, 0.56), rgba(0, 0, 0, 0.56));
  background-size: 100% 100%;
  background-position: center;
  height: 100vh;
  width: 100vw;
  z-index: 0;
  position: fixed;
  top: 0;

  &::after {
    content: var(--no-content);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 44px;
    -webkit-text-stroke: 2px #f0a900;
    color: transparent;

    @include mq(mobile-only) {
      font-size: 34px;
    }
  }

  @include mq(mobile-only) {
    background-size: cover;
  }
}
</style>
