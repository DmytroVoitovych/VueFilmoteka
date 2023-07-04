<template>
  <div
    class="backdropV"
    :class="{ visibleV: openModal }"
    :filmsid="filmsid"
    tabindex="-1"
    v-if="infos.title"
    @click.stop="funcClickBackdrop"
  >
    <div class="modalV container">
      <button class="closeV" type="button" @click.stop="onClose">
        <svg width="30" height="30" class="icoV">
          <use href="../../assets/sprite.svg#icon-close"></use>
        </svg>
      </button>
      <img
        :alt="infos.title"
        :src="
          infos.poster_path
            ? `https://image.tmdb.org/t/p/w500/${infos.poster_path}`
            : require('./../../assets/images/ded.jpg')
        "
      />
      <div>
        <h3 class="modal__titleV t-js">{{ infos.title ?? 'No date' }}</h3>
        <div class="flexboxV">
          <ul class="modal__listV">
            <li class="modal__descV">
              <p class="modal__pV">{{ getModalContent()[0] }}</p>
              <p class="modal__rV">
                <span class="reitV">{{ infos.vote_average?.toFixed(1) }}</span>
                /
                <span class="countV">{{ infos.vote_count }}</span>
              </p>
            </li>
            <li class="modal__descV">
              <p class="modal__pV">{{ getModalContent()[1] }}</p>
              <p class="modal__valV t-js">{{ infos.popularity?.toFixed(1) }}</p>
            </li>
            <li class="modal__descV">
              <p class="modal__pV">{{ getModalContent()[2] }}</p>
              <p class="modal__valV uperV t-js">{{ infos.original_title }}</p>
            </li>
            <li class="modal__descV">
              <p class="modal__pV">{{ getModalContent()[3] }}</p>
              <p class="modal__valV t-js">
                {{
                  infos.genres?.length > 0
                    ? infos.genres
                        .map(g => g.name + ', ')
                        .join('')
                        .slice(0, -2)
                    : 'No date'
                }}
              </p>
            </li>
          </ul>
          <div>
            <p class="modal__aboutV t-js">{{ getModalContent()[4] }}</p>
            <p class="overview t-js">
              {{
                infos.overview || 'No description will be added soon. Sorry for the inconvenience'
              }}
            </p>
          </div>
          <ul class="modal__button--listV">
            <li>
              <button
                @click.prevent="() => (!doneWatched ? addFilmToWatch() : dellFilmFromDb('watched'))"
                data-btn="${id}"
                type="button"
                class="modal__watchV"
                :class="doneWatched && 'remove'"
                :disabled="!getAuth || (checkParam && loading)"
              >
                {{ !doneWatched ? 'add to Watched' : 'remove from watched' }}
              </button>
            </li>
            <li>
              <button
                @click.prevent="() => (!doneQueue ? addFilmToQueue() : dellFilmFromDb('queue'))"
                :data-btn="infos.id"
                type="button"
                class="modal__queV"
                :class="doneQueue && 'remove'"
                :disabled="!getAuth || (!checkParam && loading)"
              >
                {{ !doneQueue ? 'add to queue' : 'remove from queue' }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MovieAPiServer from '../../helpers/req';
import { myDatabase, store } from '@/store/filmsStore';
import { nodeHttp } from '@/helpers/axios';
import { featuresStore } from '@/store/storeForFeatures';
import { getModalContent } from './contentLang';

const http = new MovieAPiServer();

export default {
  props: {
    filmsid: {
      //проп з id
      type: Number,
      require: true,
      default: -1,
    },
    scrollWidth: {
      //проп з id
      type: Number,
      require: true,
      default: -1,
    },
  },
  data() {
    return {
      openModal: false, //стан модалки
      infos: [],
      checkParam: false,
      loading: false,
    };
  },
  emits: {
    //передача стана наверх
    modalstate: e => typeof e === 'boolean',
  },
  created() {
    this.syncIndexDBandStore(); // синхрон стора і бази
  },
  methods: {
    async getInfoOfFilms() {
      //отримання деталей по фільму
      const data = await http.fetchMovieById(this.filmsid);
      this.infos = data;
    },
    onClose() {
      //закриття модалки
      this.openModal = false;
      this.infos = [];
      this.$emit('modalstate', false);
    },
    funcKeyDown(e) {
      // закриття по ескейпу
      if (this.openModal && e.code === 'Escape') {
        this.onClose();
      }
      return;
    },
    funcClickBackdrop(e) {
      //закриття по бекдропу
      if (e.target === e.currentTarget) {
        this.onClose();
      }
      return;
    },
    async addFilmToWatch() {
      // додавання в переглянуті
      this.loaderBasic();
      try {
        await store.dispatch('addFilmToWatched', {
          type: 'watched', // тип для беку
          idFilm: this.infos.id, // id для резервування на беку
          token: this.$store.state.token, // токен для пропуску
        });
        store.commit('setWatched', this.infos);
        myDatabase.setItem('watched', JSON.stringify(store.state.infoWatched));
        // додаю в локальну базу
      } catch (err) {
        console.log(err);
      }
    },
    async addFilmToQueue() {
      // додавання в переглянуті
      this.loaderBasic();
      try {
        await store.dispatch('addFilmToQueue', {
          type: 'queue', // тип для беку
          idFilm: this.infos.id, // id для резервування на беку
          token: this.$store.state.token, // токен для пропуску
        });

        store.commit('setQueue', this.infos);
        myDatabase.setItem('queue', JSON.stringify(store.state.infoQueue)); // додаю в локальну базу
      } catch (err) {
        console.log(err);
      }
    },

    async dellFilmFromDb(type) {
      // видалення
      this.loaderBasic();
      try {
        await store.dispatch('dellFilmFromDb', {
          type, // тип для беку
          idFilm: this.infos.id, // id для резервування на беку
          token: this.$store.state.token, // токен для пропуску
        });
      } catch (err) {
        console.log(err);
      }
    },
    syncIndexDBandStore() {
      myDatabase.keys().then(keys => {
        if (keys.includes('watched')) {
          // перевірка ключа
          myDatabase.getItem('watched').then(e => {
            store.commit('setWatched', JSON.parse(e)); // якщо гуд коміт в стор
          });
        }
        if (keys.includes('queue')) {
          myDatabase.getItem('queue').then(e => store.commit('setQueue', JSON.parse(e))); // якщо гуд коміт в стор
        }
        return;
      });
    },
    syncServerDBandStore() {
      myDatabase.keys().then(keys => {
        if (!keys.includes('watched')) {
          // перевірка ключа
          this.getFromServerFilmId().then(e => {
            const watched = e.data.allList.filter(e => e.type === 'watched');
            store.commit('setWatched', watched);
            myDatabase.setItem('watched', JSON.stringify(store.state.infoWatched));
          });
        }
        if (!keys.includes('queue')) {
          this.getFromServerFilmId().then(e => {
            const watched = e.data.allList.filter(e => e.type === 'queue');
            store.commit('setQueue', watched);
            myDatabase.setItem('queue', JSON.stringify(store.state.infoQueue));
          });
        }
        return;
      });
    },

    loaderBasic() {
      // функція відповідальна за основний лоадер на сайті
      nodeHttp.interceptors.request.use(config => {
        //перехоплюєм запит
        this.loading = true; //включаю блок кнопки
        this.checkParam = // поточна кнопка
          (config.url.includes('add') && config?.data?.type.includes('watched')) ||
          config.url.includes('watched');

        return config;
      });

      nodeHttp.interceptors.response.use(res => {
        this.loading = false; // вимикаю лоудер
        return res;
      });
    },

    getModalContent() {
      return getModalContent(this.getLanguage);
    },
  },
  watch: {
    filmsid() {
      if (this.filmsid >= 0) {
        this.getInfoOfFilms();
        this.openModal = true;
        this.$emit('modalstate', this.openModal);
      }
    },
    openModal() {
      window.addEventListener('keydown', this.funcKeyDown);
      !this.openModal && //вимикаєм слухач
        window.removeEventListener('keydown', this.funcKeyDown);
    },
  },
  computed: {
    doneWatched() {
      // звірка з наявністю в базі і зміна класів від результату
      return store.getters.doneWatcheds(this.infos.id);
    },
    doneQueue() {
      // звірка з наявністю в базі і зміна класів від результату
      return store.getters.doneQueues(this.infos.id);
    },
    getLanguage() {
      return featuresStore.getters.getLanguage;
    },
    getAuth() {
      return this.$store.state.token;
    },
  },
};
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
  background-color: var(--text-color-light);

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
  color: var(--text-color-black);
  font-weight: 500;
  font-size: 30px;
  line-height: 1.16;
  text-transform: uppercase;
  margin-bottom: 20px;
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
    color: var(--text-color-light-grey);
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
  color: var(--text-color-black);
  margin-bottom: 8px;
}

.about__descV {
  font-weight: 500;
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-color-black);
}

.modal__button--listV {
  display: flex;
  gap: 15px;

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

  @media screen and (max-width: 769.5px) {
    padding: 6px 27px;
    max-width: 161px;
  }
  &:hover {
    color: var(--bg-color-modal-orange);
    text-transform: uppercase;
    background: var(--text-color-light);
    border: 2px solid #ff6b01;
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

  @media screen and (max-width: 769.5px) {
    //    padding: 13px 11px 13px 13px;
    max-width: 161px;
    width: 100%;
    padding: 13px 7px 13px 7px;
  }
  &:hover {
    color: var(--text-color-light);
    text-transform: uppercase;
    background: var(--bg-color-modal-orange);
    outline: none;
    border: 2px solid #ff6b01;
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
</style>
