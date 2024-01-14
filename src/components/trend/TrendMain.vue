<template>
  <div>
    <ContainerMain>
      <section class="container gallery section">
        <div v-if="templateArr.trend?.length && max > 1" class="pagination-wrap">
          <PaginationHardVue
            @numPage="setPage"
            :proppages="max"
            ref="upBtn"
            :path="path"
            :key="render"
          />
        </div>
        <ul v-show="status === 'ready'" class="gallery__list">
          <li
            v-for="{
              id,
              title,
              release_date,
              poster_path,
              genre_ids,
              vote_average,
              genres,
            } in templateArr.trend"
            ref="observer"
            :key="id"
            :id="id"
            class="gallery__item"
            @click="getIdForModal(id)"
          >
            <img
              class="gallery__img"
              loading="lazy"
              :src="poster_path ? getPoster(poster_path) : img"
              :alt="title"
            />
            <div class="gallery__info">
              <p class="gallery__title them">{{ title }}</p>
              <p class="gallery__text them">
                <span
                  :class="{
                    space:
                      getGenre(genre_ids ?? genres?.map((e:obj) => e.id))?.length > 27,
                  }"
                  >{{
                    getGenre(genre_ids ?? genres?.map((e: obj) => e.id))







































                  }}&ensp;|&ensp;</span
                >
                {{ year(release_date)
                }}<span class="gallery__rating them">{{ vote_average?.toFixed(1) }}</span>
              </p>
            </div>
          </li>
          <li
            class="librys__empty--li"
            v-if="
              status === 'ready' &&
              !templateArr?.trend?.length &&
              props.path.includes('Biblioteka')
            "
          >
            Ваш список пустий, нічого не додано
          </li>
        </ul>
        <SkeletonTrend v-if="status === 'load'" class="gallery__list" />

        <div v-if="templateArr?.trend?.length && max > 1" class="pagination-wrap">
          <PaginationHardVue
            @numPage="setPage"
            :proppages="max"
            ref="downBtn"
            :path="path"
            :key="render"
          />
        </div>
      </section>
    </ContainerMain>
  </div>
</template>

<script lang="ts" setup>
import ContainerMain from "../shared/ContainerMain.vue";
import MovieAPiServer from "@/helpers/req";
import PaginationHardVue from "../shared/PaginationHard.vue";
import SkeletonTrend from "./SkeletonTrend.vue";
import { axio, cacheOptions, nodeHttp } from "../../helpers/axios";
import { Report, Block } from "notiflix";
import { store } from "@/store/filmsStore";
import { intersectionWith } from "lodash";
import { featuresStore } from "@/store/storeForFeatures";
import { myDatabase } from "@/store/filmsStore";
import img from "@/assets/images/ded.jpg";
import {
  computed,
  inject,
  nextTick,
  onMounted,
  onUpdated,
  reactive,
  ref,
  watch,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { store as auth } from "@/store/index";
import type { VueCookies } from "vue-cookies";

const $cookies = inject<VueCookies>("$cookies");

const http = new MovieAPiServer();
const router = useRouter();
const route = useRoute();

type obj = {
  id: any;
  title: any;
  release_date: any;
  poster_path: any;
  genre_ids: any;
  vote_average: any;
  genres: any;
};
type anyArrT = {
  trend?: obj[];
  genrs?: object[];
};

const props = withDefaults(
  defineProps<{
    switcher: boolean; // false
    modalstate: boolean; // false,
    path: string; // '',
  }>(),
  {
    switcher: () => false,
    modalstate: () => false,
    path: () => "",
  }
);

const emit = defineEmits<{ "get-find-id": [id: number] }>();

const templateArr = reactive<anyArrT>({ trend: [], genrs: [] });
const status = ref<"load" | "ready">("load");
const page = ref(1);
const max = ref(0);
const locate = ref(0);
const check = ref(false);
const observer = ref<HTMLLIElement[] | null>(null);
const upBtn = ref<typeof PaginationHardVue | null>(null);
const downBtn = ref<typeof PaginationHardVue | null>(null);
const lang = computed<string>(() => featuresStore.getters.getLanguage);
const render = ref(0);

const criticalGenres = computed<object[]>(() =>
  templateArr?.genrs?.length
    ? templateArr.genrs
    : JSON.parse(window.localStorage.getItem("genres") as string)
);

const beforeCreate = () => !window.localStorage.getItem("genres") && http.getGenresList();
beforeCreate();

const checkFind = () => {
  //перевірка наявності пошуку
  const exist = window.localStorage.getItem("findedFilms") ? true : false;
  check.value = exist;
  return check;
};

const toMainPage = () =>
  // добавити вспливаючу підказку (що нічого нема)
  Report.info(
    "Sorry",
    "On your request we found nothing , we return you to the main.",
    "Okay",
    () => {
      router.push("/");
      window.localStorage.removeItem("numberPage");
      window.localStorage.removeItem("findedFilms");
    }
  );

const controlStorage = (): obj[] | false => {
  //перевіка локльного стора
  if (
    window.localStorage.getItem("numberPage") &&
    window.localStorage.getItem("filmsPage")
  ) {
    return JSON.parse(window.localStorage.getItem("filmsPage") as string);
  }

  return false;
};

const getStaticGenres = async () => {
  const genr =
    JSON.parse(window.localStorage.getItem("genres") as string) ??
    (await http.getGenresList());

  templateArr.genrs = genr;
};

const startRenderPage = async () => {
  const data: obj[] = checkFind().value
    ? await http.fetchMovieByQuery(
        page.value.toString(),
        (route.query?.film as string) ||
          (window.localStorage.getItem("findedFilms") as string),
        toMainPage
      )
    : await http.fetchTopMovies(page.value.toString(), toMainPage);

  templateArr.trend = controlStorage() || data;
  max.value = http.maxPages && +http.maxPages > 500 ? 500 : Number(http.maxPages);

  getStaticGenres();
};

const syncIndexDBandStore = () =>
  myDatabase.keys().then((keys) => {
    if (keys.includes("watched") && props.path === "BibliotekaWatched") {
      // перевірка ключа
      myDatabase.getItem("watched").then((e) => {
        templateArr.trend = JSON.parse(e as string).slice(0, 20); // якщо гуд коміт в стор
        max.value = Math.ceil(JSON.parse(e as string).length / 20);
        !JSON.parse(e as string).length &&
          window.localStorage.setItem("BibliotekaWatched", "empty");
      });
    }
    if (keys.includes("queue") && props.path === "BibliotekaQueue") {
      myDatabase.getItem("queue").then((e) => {
        templateArr.trend = JSON.parse(e as string).slice(0, 20);
        max.value = Math.ceil(JSON.parse(e as string).length / 20);
        !JSON.parse(e as string).length &&
          window.localStorage.setItem("BibliotekaQueue", "empty");
      }); // якщо гуд коміт в стор
    }
    return;
  });

const funcUpdateIfChangePath = (
  watched?: obj[] | undefined,
  queue?: obj[] | undefined
) => {
  if (!store.state.infoWatched.length && !store.state.infoQueue.length) {
    syncIndexDBandStore();
  }

  switch (
    props.path // звіряю по положеню
  ) {
    case "BibliotekaWatched":
      templateArr.trend = watched ?? store.state.infoWatched.slice(0, 20); // якщо параметр є  пишу його якшо ні першу 20
      templateArr.trend && templateArr.trend.length < 1;
      window.localStorage.setItem("BibliotekaWatched", "empty");
      max.value = store.state.max.numWatch; // всі сторінки
      break;
    case "BibliotekaQueue":
      templateArr.trend = queue ?? store.state.infoQueue.slice(0, 20);
      max.value = store.state.max.numQue;
      !templateArr.trend && window.localStorage.setItem("BibliotekaQueue", "empty");
      break;
    default:
      max.value = http.maxPages && +http.maxPages > 500 ? 500 : Number(http.maxPages); // всі сторінки
      break;
  }
};

const funcUpdateBibliotekaPage = () => {
  store.state.max["numWatch" || "numQue"] && funcUpdateIfChangePath(); // оптимізація швидкості
  store
    .dispatch("getFromServerFilmId", $cookies?.get("token") ?? auth.state.token)
    .then(() => {
      funcUpdateIfChangePath();
    });
};

const transformLang = (lang: string) => {
  switch (lang) {
    case "en":
      return "English";
    case "fi":
      return "Finish";
    case "uk":
      return "Ukrainian";

    default:
      return "English";
  }
};

const setStateFromUrl = (query: {
  page?: string | number;
  lang?: "en" | "uk" | "fi";
  max?: string | number;
  film?: string;
}) => {
  window.localStorage.removeItem("filmsPage");
  window.localStorage.removeItem("numberPage");
  window.localStorage.removeItem("findedFilms");
  window.localStorage.removeItem("currLang");

  page.value = Number(query["page"]);
  max.value = Number(query["max"]);

  window.localStorage.setItem(
    "currLang",
    transformLang(query["lang"]?.toString() ?? "English")
  );
  "film" in query && window.localStorage.setItem("findedFilms", query["film"] as string);
  !props.path.includes("Biblioteka") ? startRenderPage() : setPageBiblioteka(page.value);
  // на майбутнє на метод пагінації можу робити перехід згідно історії
  return;
};

const created = async () => {
  if ("page" in route.query) {
    setStateFromUrl(route.query);
    return;
  }
  window.localStorage.getItem(props.path)
    ? (status.value = "ready")
    : window.localStorage.removeItem(props.path);
  props.path === "Home" ? startRenderPage() : funcUpdateBibliotekaPage();
};
created();

watch(
  () => route.query,
  (query, previousParams) => {
    // react to route changes...
    if (
      !previousParams.max &&
      previousParams.film &&
      previousParams.page === "1" &&
      query.max &&
      query.lang === previousParams.lang
    ) {
      // для запобіганню лишнього рендеру
      return;
    } else {
      if ("page" in query) {
        setStateFromUrl(query);
        !window.document.documentElement.style["0"] && (render.value += 1); // for modal pattern
        return;
      } else if (props.path === "Home") {
        window.localStorage.removeItem("filmsPage");
        window.localStorage.removeItem("findedFilms");
        page.value = 1;
        max.value = 500;
        startRenderPage();
        render.value += 1;
        return;
      } else {
        props.path.includes("Biblioteka") && (page.value = 1);
        props.path.includes("Biblioteka") && setPageBiblioteka(1);
      }
    }
  },

  { deep: true }
);

const year = (
  num: string // рік
) => (num ? num.slice(0, 4) : "no date");

const getPoster = (poster: string) =>
  //постери
  `https://image.tmdb.org/t/p/w500/${poster}`;

const getGenre = (idg: object[]) => {
  //розбір жанрів

  return idg
    ?.map((e) =>
      criticalGenres?.value.filter(
        (cr) => "id" in cr && "name" in cr && cr.id === e && cr.name
      )
    )
    .flat(3)
    .map((n) => "name" in n && n.name)
    .slice(0, 2)
    .join(", ");
};

const setPageBiblioteka = async (num?: number) => {
  try {
    const res = await nodeHttp.get("/films/", {
      headers: { Authorization: "Bearer " + auth.state.token },
      params: { page: num ?? page.value, limit: 20 }, // пока на тесті
    }); // забираю з беку списки юзера

    const watchedFilter = intersectionWith(
      //звіряю з локальною базою і беру тіки ті які приніс бекенд
      store.state.infoWatched, // локальна база
      res.data.watchedFilms.map((e: {}) => "idFilm" in e && e.idFilm), // бекенд
      (a: obj, b) => "id" in a && a.id === b // фідвільтровую по id фільмів
    );
    const queueFilter = intersectionWith(
      store.state.infoQueue,
      res.data.queueFilms.map((e: {}) => "idFilm" in e && e.idFilm),
      (a: obj, b) => "id" in a && a.id === b
    );
    funcUpdateIfChangePath(watchedFilter, queueFilter); // передаю аргументи в функію зміни стану
  } catch (error) {
    console.log(error);
  }
};

const controlScroll = () => {
  locate.value = window.scrollY; //запис положення
  nextTick().then(() => {
    //прибиваю скролл
    locate.value > window.document.documentElement.clientHeight / 2 &&
      window.scrollBy(0, locate.value * 20);
  });
};

const setPage = async (num: number) => {
  page.value = num;

  const standartQuery = { page: num, max: max.value, lang: lang.value }; // url control
  !route.query.film && router.push({ query: standartQuery });

  window.localStorage.getItem("findedFilms") &&
    router.push({
      query: {
        ...standartQuery,
        film: window.localStorage.getItem("findedFilms"),
      },
    });

  if (props.path === "Home") {
    window.localStorage.setItem("numberPage", num.toString()); // добавляю сторінку
  } else if (props.path.includes("Biblioteka")) {
    await setPageBiblioteka(num); // контроль пагинації в бібліотеці
    controlScroll();
  }
  controlScroll();
};

const getIdForModal = (id: number) =>
  // отримання данних для модалки
  emit("get-find-id", id);

const funcSubscribeForDelAction = () =>
  props.modalstate && // якщо модалка відкрита підписуюсь на зміни
  store.subscribe((mutation: { type: any; payload: any }) => {
    // слідкую за мутаціями стору
    const folowIdDel = mutation.payload[0]?.id ?? false; // отримує id видаленого фільму

    folowIdDel && // якщо є
      // і модалка виключена
      !props.modalstate &&
      templateArr?.trend?.splice(
        //  видаляю з масиву
        templateArr.trend.findIndex((e) => e === folowIdDel),
        0
      );
    !templateArr?.trend?.length && (status.value = "ready");
  });

const funcSubscribeChangeLanguage = () =>
  featuresStore.subscribe((mutation: { type: any; payload: any }) => {
    if (mutation.type.includes("setLanguage")) {
      window.localStorage.removeItem("genres");
      props.path === "Home" ? setPage(page.value) : funcUpdateBibliotekaPage();
    }
  });

const sendRef = () => {
  //передаю реф
  const time = setTimeout(() => {
    featuresStore.commit(
      "setRefItem",
      templateArr?.trend && templateArr?.trend?.length > 8
        ? observer.value?.length && observer.value[8]
        : observer.value?.length && observer.value.reverse()[2]
    );

    status.value = "ready";
    clearTimeout(time);
  }, 200);
};

watch(page, () => {
  upBtn?.value && upBtn?.value.forcePage(page.value); //форс зверху
  downBtn?.value && downBtn?.value.forcePage(page.value); //форс знизу
});

watch(
  () => props.switcher,
  () => {
    const standartQuery = {
      page: 1,
      lang: lang.value,
    }; // url control

    props.switcher &&
      router.push({
        query: {
          ...standartQuery,
          film: window.localStorage.getItem("findedFilms"),
        },
      });
    render.value += 1;
  },
  {}
);

watch(
  () => props.path,
  () => {
    window.localStorage.getItem(props.path)
      ? (status.value = "ready")
      : () => {
          window.localStorage.removeItem(props.path);
          status.value = "ready";
        };
    page.value = 1;
    funcUpdateBibliotekaPage();
  }
);

watch(() => props.modalstate, funcSubscribeForDelAction);

watch(
  () => templateArr.trend,
  () => {
    !templateArr?.trend?.length
      ? () => {
          window.localStorage.setItem(props.path, "empty");
          status.value = "ready";
        }
      : window.localStorage.getItem(props.path) &&
        window.localStorage.removeItem(props.path);

    templateArr?.trend && templateArr?.trend?.length > 2
      ? sendRef()
      : featuresStore.commit("setRefItem", null);
  }
);

onMounted(() => {
  funcSubscribeChangeLanguage();

  route.fullPath.includes("watched") &&
    window.localStorage.getItem("BibliotekaWatched") &&
    (status.value = "ready");
  route.fullPath.includes("queue") &&
    window.localStorage.getItem("BibliotekaQueue") &&
    (status.value = "ready");
});

onUpdated(() => {
  page.value === 1 && !props.modalstate // контроль пагінації
    ? funcUpdateBibliotekaPage()
    : setPageBiblioteka();
});
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
    url("../../assets/images/library.jpeg");
}

.gallery__list {
  /* margin-bottom: 60px; */
  display: grid;

  @media screen and (min-width: 1280px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px 16px;
  }
  @media screen and (min-width: 768px) and (max-width: 1279.5px) {
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

  @media screen and (min-width: 768px) and (max-width: 1279.5px) {
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
    background: linear-gradient(to right, transparent 0%, #e8e8e8 50%, transparent 100%)
      top right;
  }
}
//****

.noFilms {
  text-align: center;
  background-image: url("@/assets/images/biblioteka/nofilms.jpg"),
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
.librys__empty--li {
  font-size: 5vw;
  position: absolute;
  text-align: center;
  filter: drop-shadow(2px 4px 6px var(--text-color-light-orange));
  -webkit-text-fill-color: darkred;
}
</style>
