<template>
  <Home :switcher="switcher">
    <ContainerMain>
      <section class="container gallery section">
        <div v-if="trend?.length && max > 1" class="pagination-wrap">
          <PaginationHardVue @numPage="setPage" :proppages="max" ref="upBtn" />
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
            } in trend"
            :key="id"
            class="gallery__item"
          >
            <img
              class="gallery__img"
              loading="lazy"
              :src="
                poster_path ? getPoster(poster_path) : '/img/ded.01be9432.jpg'
              "
              :alt="title"
            />
            <div class="gallery__info">
              <p class="gallery__title them">{{ title }}</p>
              <p class="gallery__text them">
                <span :class="{ space: getGenre(genre_ids).length > 27 }"
                  >{{ getGenre(genre_ids) }}&ensp;|&ensp;</span
                >
                {{ year(release_date)
                }}<span class="gallery__rating them">{{
                  vote_average.toFixed(1)
                }}</span>
              </p>
            </div>
          </li>
        </ul>
        <div v-if="trend?.length && max > 1" class="pagination-wrap">
          <PaginationHardVue
            @numPage="setPage"
            :proppages="max"
            ref="downBtn"
          />
        </div>
      </section>
    </ContainerMain>
  </Home>
</template>

<script>
import ContainerMain from "../shared/ContainerMain.vue";
import Home from "@/page/Home.vue";
import MovieAPiServer from "@/helpers/req";
import PaginationHardVue from "../shared/PaginationHard.vue";
import { axio } from "../../helpers/axios";
import { Report, Block } from "notiflix";

const http = new MovieAPiServer();
export default {
  name: "TrendMain",
  components: {
    ContainerMain,
    Home,
    PaginationHardVue,
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
  },

  data() {
    //стейт
    return {
      trend: [],
      genrs: [],
      page: 1,
      max: 0,
      locate: 0,
      check: false,
      test: false,
    };
  },
  async created() {
    // хук для запросов
    this.startRenderPage();
  },
  methods: {
    // функції
    async startRenderPage() {
      const data = this.checkFind()
        ? await http.fetchMovieByQuery(
            window.localStorage.getItem("numberPage") ?? 1,
            window.localStorage.getItem("findedFilms")
          )
        : await http.fetchTopMovies(this.page);

      data.length === 0 && this.toMainPage();
      this.trend = this.controlStorage() || data;
      this.max = http.maxPages;

      const genr = await http.getGenresList();
      this.genrs = genr;
    },
    year(num) {
      // рік
      return num ? num.slice(0, 4) : "no date";
    },
    getPoster(poster) {
      //постери
      return `https://image.tmdb.org/t/p/w500/${poster}`;
    },
    getGenre(idg) {
      //розбір жанрів
      return idg
        ?.map((e) => this.genrs.filter(({ id, name }) => id === e && name))
        .flat(3)
        .map(({ name }) => name)
        .slice(0, 2)
        .join(", ");
    },
    async setPage(num) {
      this.page = num;
      window.localStorage.setItem("numberPage", num); // добавляю сторінку

      const data = this.checkFind()
        ? await http.fetchMovieByQuery(
            this.page,
            window.localStorage.getItem("findedFilms")
          )
        : await http.fetchTopMovies(num);

      this.trend = data;
      this.max = http.maxPages;
      window.localStorage.setItem("filmsPage", JSON.stringify(data));

      this.locate = window.scrollY; //запис положення
      this.$nextTick().then(() => {
        //прибиваю скролл
        this.locate > 1000 && window.scrollBy(0, this.locate);
      });
    },

    controlStorage() {
      //перевіка локльного стора
      if (
        JSON.parse(window.localStorage.getItem("numberPage")) &&
        JSON.parse(window.localStorage.getItem("filmsPage"))
      ) {
        return JSON.parse(window.localStorage.getItem("filmsPage"));
      }

      return false;
    },
    checkFind() {
      //перевірка наявності пошуку
      const check = JSON.parse(window.localStorage.getItem("findedFilms"))
        ? true
        : false;
      this.check = check;
      return check;
    },
    toMainPage() {
      // добавити вспливаючу підказку (що нічого нема)
      Report.info(
        "Sorry",
        "On your request we found nothing , we return you to the main.",
        "Okay",
        () => {
          this.$router.go(0);
          window.localStorage.removeItem("numberPage");
          window.localStorage.removeItem("findedFilms");
        }
      );
    },
    checkForStupid() {
      return this.trend.length > 0;
    },
    loaderBasic() {
      // функція відповідальна за основний лоадер на сайті
      axio.loader.interceptors.request.use((config) => {
        //перехоплюєм запит
        this.checkForStupid() && //перевірка на дурня
          Block.dots(".gallery__item", {
            //сам лофдер з конфігураціями
            svgColor: "var(--text-color-red)",
            svgSize: "100px",
            backgroundColor: "var(--bg-loader-basic)",
          });

        return config;
      });

      axio.loader.interceptors.response.use((res) => {
        // коли дані нам надійшли  вимикаєм лоадер
        this.checkForStupid() && Block.remove(".gallery__item");
        return res;
      });
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
      this.startRenderPage();
      this.max = 0;
      this.test = false;
    },
  },
  mounted() {
    this.loaderBasic(); // важливо дочекатись змонтування дерева
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
  background-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.56),
      rgba(0, 0, 0, 0.56)
    ),
    url("../../assets/images/library.jpeg");
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
  box-shadow: 1px 2px 2px 3px rgba(150, 64, 3, 0.608),
    2px 2px 2px rgba(135, 102, 78, 0.456), 2px 3px 2px rgba(244, 157, 94, 0.409);
  border-radius: 2px 2px 5px 5px;
  cursor: pointer;
  transition: box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.gallery__item:hover .gallery__info {
  font-weight: 600;
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
    background: linear-gradient(
        to right,
        transparent 0%,
        #e8e8e8 50%,
        transparent 100%
      )
      top right;
  }
}
</style>