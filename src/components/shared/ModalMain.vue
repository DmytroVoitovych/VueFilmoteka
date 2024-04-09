<template>
  <div
    class="backdropV"
    :class="{ visibleV: openModal }"
    :filmsid="filmsid"
    tabindex="-1"
    v-if="info.infos.title"
    @click.stop="funcClickBackdrop"
  >
    <div class="modalV container">
      <button class="closeV" type="button" @click.stop="onClose">
        <svg width="30" height="30" class="icoV">
          <use :href="sprite + '#icon-close'"></use>
        </svg>
      </button>
      <img
        :alt="info.infos.title"
        :src="
          info.infos.poster_path
            ? `https://image.tmdb.org/t/p/w500/${info.infos.poster_path}`
            : img
        "
      />
      <button
        v-if="info.infos?.videos?.results?.length"
        type="button"
        class="btnyou"
        :style="play ? { stroke: 'var(--yt-modal-btn)' } : undefined"
        @click="() => (play = !play)"
      >
        <svg width="50" height="50">
          <use :href="sprite + switcher"></use>
        </svg>
      </button>
      <YouIframeVue
        v-if="info.infos?.videos?.results?.length"
        v-show="play"
        :video="info.infos.videos.results"
        :class="play && 'iframe__main'"
        :player-vars="{ autoplay: 0, listType: 'user_uploads' }"
        ref="yt"
      />
      <div>
        <h3 class="modal__titleV t-js">{{ info.infos.title ?? "No date" }}</h3>
        <div class="flexboxV">
          <ul class="modal__listV">
            <li class="modal__descV">
              <p class="modal__pV">{{ getContent()[0] }}</p>
              <p class="modal__rV">
                <span class="reitV">{{ info.infos.vote_average?.toFixed(1) }}</span>
                /
                <span class="countV">{{ info.infos.vote_count }}</span>
              </p>
            </li>
            <li class="modal__descV">
              <p class="modal__pV">{{ getContent()[1] }}</p>
              <p class="modal__valV t-js">
                {{ "popularity" in info.infos && info.infos.popularity?.toFixed(1) }}
              </p>
            </li>
            <li class="modal__descV">
              <p class="modal__pV">{{ getContent()[2] }}</p>
              <p class="modal__valV uperV t-js">
                {{ "original_title" in info.infos && info.infos.original_title }}
              </p>
            </li>
            <li class="modal__descV">
              <p class="modal__pV">{{ getContent()[3] }}</p>
              <p class="modal__valV t-js">
                {{ genres }}
              </p>
            </li>
          </ul>
          <div>
            <p class="modal__aboutV t-js">{{ getContent()[4] }}</p>
            <p class="overview t-js">
              {{
                ("overview" in info.infos && info.infos.overview) ||
                "No description will be added soon. Sorry for the inconvenience"
              }}
            </p>
          </div>
          <ul class="modal__button--listV">
            <li>
              <button
                @click.prevent="
                  () => (!doneWatched ? addFilmToWatch() : dellFilmFromDb('watched'))
                "
                data-btn="${id}"
                type="button"
                class="modal__watchV"
                :class="doneWatched && 'remove'"
                :disabled="!getAuth || (checkParam && loading)"
              >
                {{ !doneWatched ? getContent()[5] : getContent()[6] }}
              </button>
            </li>
            <li>
              <button
                @click.prevent="
                  () => (!doneQueue ? addFilmToQueue() : dellFilmFromDb('queue'))
                "
                :data-btn="'id' in info.infos && info.infos.id"
                type="button"
                class="modal__queV"
                :class="doneQueue && 'remove'"
                :disabled="!getAuth || (!checkParam && loading)"
              >
                {{ !doneQueue ? getContent()[7] : getContent()[8] }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MovieAPiServer from '../../helpers/req';
import { myDatabase, store } from '@/store/filmsStore';
import { store as auth } from '@/store/index';
import { nodeHttp } from '@/helpers/axios';
import { featuresStore } from '@/store/storeForFeatures';
import { getModalContent, getNotifyContent } from './contentLang';
import YouIframeVue from '../iframe/YouIframe.vue';
import { Notify, type INotifyOptions } from 'notiflix';
import imageUrl from '@/assets/images/ded.jpg';
import sprite from '../../assets/sprite.svg';
import { computed, reactive, ref, watch } from 'vue';

const http = new MovieAPiServer();

type category = 'watched' | 'queue';

const props = withDefaults(defineProps<{ filmsid: number }>(), {
  filmsid: () => -1,
});

const yt = ref<typeof YouIframeVue | null>(null);
const play = ref(false);
const openModal = ref(false); //стан модалки
const info = reactive<{ infos: { [key: string]: any } }>({ infos: {} });
const checkParam = ref(false);
const loading = ref(false);
const img = ref(imageUrl);

const lang = computed<string>(() => featuresStore.getters.getLanguage);

const doneWatched = computed<boolean>(() =>
  // звірка з наявністю в базі і зміна класів від результату
  store.getters.doneWatcheds('id' in info.infos && info.infos.id)
);

const doneQueue = computed<boolean>(() =>
  // звірка з наявністю в базі і зміна класів від результату
  store.getters.doneQueues('id' in info.infos && info.infos.id)
);

const getAuth = computed(() => auth.state.token);

const switcher = computed(() => (!play.value ? '#icon-btnyou' : '#icon-close'));

const genres = computed<string>(() =>
  info.infos.genres?.length > 0
    ? info.infos.genres
        .map((g: { [key: string]: any }) => g.name + ', ')
        .join('')
        .slice(0, -2)
    : 'No date'
);

const emit = defineEmits<{
  //передача стана наверх
  modalstate: [openModal: boolean];
}>();

const syncIndexDBandStore = () =>
  myDatabase.keys().then(keys => {
    if (keys.includes('watched')) {
      // перевірка ключа
      myDatabase.getItem('watched').then(e => {
        store.commit('setWatched', JSON.parse(e as string)); // якщо гуд коміт в стор
      });
    }
    if (keys.includes('queue')) {
      myDatabase
        .getItem('queue')
        .then(e => store.commit('setQueue', JSON.parse(e as string))); // якщо гуд коміт в стор
    }
    return;
  });

syncIndexDBandStore(); // синхрон стора і бази

const getInfoOfFilms = async () => {
  //отримання деталей по фільму
  const data: {} = await http.fetchMovieById(props.filmsid.toString());
  info.infos = data;
};

const onClose = () => {
  //закриття модалки
  openModal.value = false;
  info.infos = {};
  emit('modalstate', false);
};

const funcKeyDown = (e: Event) => {
  // закриття по ескейпу
  if (openModal.value && 'code' in e && e.code === 'Escape') {
    onClose();
  }
  return;
};

const funcClickBackdrop = (e: Event) => {
  //закриття по бекдропу
  if (e.target === e.currentTarget) {
    onClose();
  }
  return;
};

const loaderBasic = () => {
  // функція відповідальна за основний лоадер на сайті
  nodeHttp.interceptors.request.use(config => {
    //перехоплюєм запит
    loading.value = true; //включаю блок кнопки
    checkParam.value = // поточна кнопка
      (config?.url?.includes('add') &&
        config?.data?.type.includes('watched')) ||
      config?.url?.includes('watched');

    return config;
  });

  nodeHttp.interceptors.response.use(res => {
    loading.value = false; // вимикаю лоудер
    return res;
  });
};

const getModalNotifyContent = () => getNotifyContent(lang.value);

const funcNotify = (type: boolean, num: number) => {
  const option = {
    position: 'right-bottom',
    timeout: 1000,
  };

  type
    ? Notify.success(getModalNotifyContent()[num], option as INotifyOptions)
    : Notify.failure(getModalNotifyContent()[num], option as INotifyOptions);
};

const addFilmToWatch = async () => {
  // додавання в переглянуті
  loaderBasic();
  try {
    await store.dispatch('addFilmToWatched', {
      type: 'watched', // тип для беку
      idFilm: 'id' in info.infos && info.infos.id, // id для резервування на беку
      token: auth.state.token, // токен для пропуску
    });
    store.commit('setWatched', info.infos);
    await myDatabase.setItem(
      'watched',
      JSON.stringify(store.state.infoWatched)
    );
    funcNotify(true, 0);
    // додаю в локальну базу
  } catch (err) {
    console.log(err);
  }
};

const addFilmToQueue = async () => {
  // додавання в переглянуті
  loaderBasic();
  try {
    await store.dispatch('addFilmToQueue', {
      type: 'queue', // тип для беку
      idFilm: 'id' in info.infos && info.infos.id, // id для резервування на беку
      token: auth.state.token, // токен для пропуску
    });

    store.commit('setQueue', info.infos);
    await myDatabase.setItem('queue', JSON.stringify(store.state.infoQueue)); // додаю в локальну базу
    funcNotify(true, 1);
  } catch (err) {
    console.log(err);
  }
};

const dellFilmFromDb = async (type: category) => {
  // видалення
  loaderBasic();
  try {
    await store.dispatch('dellFilmFromDb', {
      type, // тип для беку
      idFilm: 'id' in info.infos && info.infos.id, // id для резервування на беку
      token: auth.state.token, // токен для пропуску
    });
    funcNotify(true, type.includes('w') ? 2 : 3);
  } catch (err) {
    console.log(err);
  }
};

const getContent = () => getModalContent(lang.value);

watch(
  () => props.filmsid,
  () => {
    if (props.filmsid >= 0) {
      getInfoOfFilms();
      openModal.value = true;
      emit('modalstate', openModal.value);
    }
  }
);

watch(openModal, () => {
  window.addEventListener('keydown', funcKeyDown);
  !openModal.value && //вимикаєм слухач
    window.removeEventListener('keydown', funcKeyDown);
  !openModal.value && (play.value = false);
});

watch(play, () => (!play.value ? yt.value?.exitFrame() : yt.value?.runFrame()));
</script>

<style lang="scss" scoped>
button[disabled] {
  background: var(--disabled);
  pointer-events: none;
  outline-color: var(--disabled);
  color: var(--text-color-light);
}

.modalV {
  position: absolute;
  left: calc(50% - var(--left-modal));
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: flex-start;
  padding: 40px 12px;
  gap: 16px;
  background-color: var(--base-modal-background);
  max-width: 806px;
  height: auto;

  @media screen and (min-width: 768px) and (max-width: 1279.5px) {
    max-width: 704px;
    width: 100%;
    padding: 40px 72px 40px 36px;
  }

  @media screen and (min-width: 480px) and (max-width: 767.5px) {
    flex-direction: column;
    width: 440px;
    //  min-width: 280px;
    height: 90vh;
    overflow-y: scroll;
    padding: 40px 20px;
  }

  @media screen and (max-width: 479.5px) and (orientation: portrait) {
    flex-direction: column;
    width: calc(100% - 40px);
    //  min-width: 280px;
    height: 90vh;
    overflow-y: scroll;
    padding: 40px 20px;
  }

  @media screen and (max-height: 560.5px) and (max-width: 915.5px) and (orientation: landscape) {
    flex-direction: column;
    width: 100.01vw !important;
    max-width: inherit;
    height: 100.01vh !important;
    overflow-y: scroll;
    padding: 40px 20px;
    flex-direction: row-reverse !important;
  }

  img {
    max-width: 375px;
    border-radius: 5px;
    max-height: 478px;
    width: auto;

    @media screen and (max-width: 479.5px) and (orientation: portrait) {
      width: 100%;
      height: auto;
    }

    @media screen and (orientation: landscape) {
      height: auto;
    }

    @media screen and (max-width: 769.5px) {
      width: 100%;
    }

    @media screen and (min-width: 768px) and (max-width: 1279.5px) {
      max-width: 264px;
      width: auto;
      max-height: 373px;
    }
  }
}

.closeV {
  position: absolute;
  right: 8px;
  top: 8px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.modal__titleV {
  font-weight: 500;
  font-size: 30px;
  line-height: 1.16;
  text-transform: uppercase;
  margin-bottom: 20px;

  @include mq(mobile-only) {
    font-size: 18px;
  }
}

.modal__listV {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .modal__descV {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: baseline;
  }

  .modal__pV {
    color: var(--modal-grey);
    font-weight: 500;
    font-size: 12px;
    line-height: 1.33;
  }
}

.reitV {
  font-weight: 500;
  font-size: 12px;
  line-height: 1.17;
  color: var(--text-color-light);

  background-color: var(--bg-color-modal-orange);
  border-radius: 5px;

  padding: 1px 10px;
}

.countV {
  font-weight: 500;
  font-size: 12px;
  line-height: 1.17;
  background-color: #f7f7f7;
  border-radius: 5px;
  padding: 1px 4px;
  color: var(--text-color-black);
}

.modal__rV {
  color: var(--text-color-light-grey);
  font-weight: 500;
  font-size: 12px;
  line-height: 1.33;
}

.modal__valV {
  font-weight: 500;
  font-size: 12px;
  line-height: 1.17;
  color: var(--text-color-black);
}

.uperV {
  text-transform: uppercase;
}

.flexboxV {
  gap: 20px;
  display: flex;
  flex-direction: column;

  @media screen and (orientation: portrait) {
    gap: 20px !important;
  }

  @media screen and (max-width: 754.5px) and (orientation: landscape) {
    gap: 10px !important;
    padding-bottom: 10px;
  }
}

.modal__aboutV {
  font-weight: 500;
  font-size: 12px;
  line-height: 1.33;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.about__descV {
  font-weight: 500;
  font-size: 12px;
  line-height: 1.7;
}

.modal__button--listV {
  display: flex;
  gap: 15px;

  li {
    width: 100%;
  }

  @media screen and (max-width: 767.5px) {
    gap: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }

  @media screen and (max-width: 371.5px) {
    grid: none;
    text-align: center;
  }
}

.modal__watchV {
  padding: 14px 10px 12px;
  color: var(--text-color-light);
  text-transform: uppercase;
  background: var(--bg-color-modal-orange);
  border-radius: 5px;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.33;
  cursor: pointer;
  width: 100%;
  transition: background 250ms cubic-bezier(0.075, 0.82, 0.165, 1);
  @media screen and (max-width: 769.5px) {
    padding: 6px 27px;
    max-width: 161px;
  }
  &:hover {
    color: var(--bg-color-modal-orange);
    text-transform: uppercase;
    background: repeating-linear-gradient(45deg, black, transparent 100px);
    transition: background 250ms cubic-bezier(0.075, 0.82, 0.165, 1);
    outline: 2px solid #ff6b01;
    border-radius: 5px;
  }
}

.modal__queV {
  padding: 14px 10px 12px;
  color: var(--text-color-black);
  text-transform: uppercase;
  background: var(--text-color-light);
  border: none;
  border-radius: 5px;
  outline: 1px solid var(--text-color-black);
  cursor: pointer;
  border-radius: 5px;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.33;
  width: inherit;
  transition: background 250ms cubic-bezier(0.075, 0.82, 0.165, 1);
  @media screen and (max-width: 769.5px) {
    //    padding: 13px 11px 13px 13px;
    max-width: 161px;
    width: 100%;
    padding: 13px 7px 13px 7px;
  }
  &:hover {
    color: var(--text-color-light);
    text-transform: uppercase;
    background: repeating-linear-gradient(45deg, black, transparent 100px);
    transition: background 250ms cubic-bezier(0.075, 0.82, 0.165, 1);
    outline: 2px solid var(--extra-light-grey);
    border-radius: 5px;
  }
}

.backdropV {
  background-color: rgba(0, 0, 0, 0.25);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 1;
  visibility: hidden;
  transition: all 250ms;
}

.visibleV {
  overflow: hidden;
  opacity: 1;
  visibility: visible;
  transition: all 250ms;
  z-index: 2;
}

.icoV {
  stroke: var(--text-color-black);
}

.closeV:hover .icoV {
  stroke: var(--bg-color-modal-orange);
  transition: all 250ms;
}
.overview {
  max-height: 200px;
  overflow-y: auto;
}

.remove {
  background-color: #ff001b;
  color: var(--text-color-light);
  outline: none;
}

.t-js {
  color: var(--base-text-theme);
}

.iframe__main {
  position: absolute;
  inset: 0;
}

.btnyou {
  @extend %reset-style;
  position: absolute;
  z-index: 1;
  cursor: pointer;
  filter: drop-shadow(0px 0px 3px var(--yt-modal-btn));

  svg:hover {
    stroke: var(--bg-color-modal-orange);
    scale: 1.1;
  }

  svg:active {
    scale: 1;
    stroke: var(--extra-light-grey);
  }
}
</style>
