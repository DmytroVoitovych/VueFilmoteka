<template>
  <!-- <div> -->
  <div v-if="path.includes('Auth')" id="auth">
    <router-view></router-view>
  </div>
  <div
    class="flex"
    v-else
    :class="{ modal: stateModal }"
    :style="{ top: stateModal && `${-locate}px`, right: scrollWidth + 'px' }"
  >
    <HeaderFilm
      @onChekfind="onChekfind"
      :class="{ spec: stateModal }"
      :style="{ paddingRight: scrollWidth + 'px' }"
      :path="path"
      :show="show"
    />
    <BtnTopandDownVue v-if="getRef" />
    <main :class="polyHas && 'has--poly'">
      <router-view
        :modalstate="stateModal"
        :path="path"
        :switcher="check"
        @get-find-id="getFindId"
      ></router-view>
      <TrendMain
        v-if="path === 'Home'"
        :path="path"
        :switcher="check"
        @get-find-id="getFindId"
      ></TrendMain>
    </main>

    <FooterMain
      :class="{ spec: stateModal, 'show-footer': show }"
      :style="{ paddingRight: scrollWidth + 'px' }"
    ></FooterMain>
    <teleport to="#modalMain">
      <ModalMain :filmsid="filmsid" ref="open" @modalstate="modalstate" />
    </teleport>
  </div>
  <!-- </div> -->
</template>

<script>
import HeaderFilm from './components/header/HeaderFilm.vue';
import FooterMain from './components/footer/FooterMain.vue';
import TrendMain from './components/trend/TrendMain.vue';
import ModalMain from './components/shared/ModalMain.vue';
import BtnTopandDownVue from './components/shared/BtnTopandDown.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { store } from './store/filmsStore';
import { featuresStore } from './store/storeForFeatures';
import Bowser from 'bowser';

export default {
  name: 'App',
  components: {
    HeaderFilm,
    FooterMain,
    TrendMain,
    ModalMain,
    BtnTopandDownVue,
    // ModalBtnVue
  },
  props: {
    switcher: {
      // проп тригер
      type: Boolean,
      require: true,
      default: false,
    },
  },

  data() {
    return {
      check: false, //слідкуваня за пошуком
      filmsid: -1, // id фільму
      locate: 0, //положеня скролу
      stateModal: false, //стан модалки
      scrollWidth: 0, //ширина скролу
      path: '', //поточний роут
      show: false, // ?? під питанням чи потрібно мені це(обдумать)
      counterSign: 0, // для контроля кількості фокусів при гості
      browser: Bowser.getParser(window.navigator.userAgent).getBrowserName().toLowerCase(),
    };
  },
  created() {
    !this.$cookies.get('token') && (this.show = true);
    window.addEventListener('focus', this.checkFocus); //рефреш логіна
    this.watchPath(); //контроль поточного шляху
    !window.history.state.current.includes('auth') && this.controlLogin();

    // постій контроль авторизації
  },

  methods: {
    async checkFocus() {
      if (this.$store.state.token) {
        // тест на сторонній бекенд
        const checkOwnerOfToken = window
          .atob(this.$store.state.token.split('.')[1])
          .includes('firebase');
        if (checkOwnerOfToken) {
          // чи є юзер
          this.$store.dispatch('googleAuthInfo'); // якщо є перевірити в наявній базі
        } else {
          // рефрещ пр  звичайному вході
          this.currentUser(this.$store.state.token); // звичайний контроль  користувача
        }
      } else {
        if (this.counterSign <= 1) {
          this.counterSign++;
          await this.refreshToken(); // обовязкова перевірка логіна
        }
      }
    },
    async controlLogin() {
      const auth = getAuth();

      onAuthStateChanged(auth, user => {
        // контроль змін
        if (user) {
          user
            .getIdToken(true) // дає новий токен
            .then(newToken => {
              this.$store.dispatch('googleAuthInfo', newToken);
            })
            .then(() =>
              this.currentUser(this.$store.state.token || this.$cookies.get('token') || undefined)
            ) //записую в стейт
            .catch(err => console.log(err));
        } else {
          this.currentUser(this.$store.state.token || this.$cookies.get('token') || undefined); // звичайний контроль  користувача
          !this.$cookies.get('token') && this.refreshToken(); // рефрещ пр  звичайному вході
        }
      });
    },
    async refreshToken() {
      // вертає нову пару ключів
      try {
        await this.$store.dispatch('refreshToken', this.$store.state.refresh); // записую токен в незалежності від його наявності
        this.currentUser(this.$store.state.token || this.$cookies.get('token') || undefined); // звичайний контроль  користувача
        this.show = true;
      } catch (err) {
        // !!можлива детальна обробка
        const auth = getAuth();
        if (!auth.currentUser) {
          this.$store.commit('setLogin', ''); //  обнулюю
          window.localStorage.removeItem('name'); // чищу сторедж
          this.$cookies.remove('token'); // при приході помилки вбиваю токен
          this.$store.dispatch('googleAuthInfo'); // перевіряю google вхід
        }

        console.log(err);
      } finally {
        // костиль для появу потрібної кнопки // малюю по готовності
        this.show = true;
      }
    },
    async currentUser(t) {
      try {
        await this.$store.dispatch('currentUser', t); // сигналізую про можливий вхід іншим браузером
        store.dispatch('getFromServerFilmId', this.$store.state.token); // достаю всі id для синхрона
        this.$cookies.set('token', this.$store.state.token, '60MIN'); // на годину зберігаю
        const { exp } = JSON.parse(
          window?.atob(this.$store.state.token?.split('.')[1]) // парсю час смерті
        );

        const expired = exp - (Math.floor(new Date() / 1000) + 10 * 60); // роблю 10 хвилин запаса для рефреш токена
        this.show = true;
        const refresh = setTimeout(
          async () => {
            window.atob(this.$cookies.get('token').split('.')[1]).includes('firebase')
              ? await this.controlLogin()
              : await this.refreshToken(); //??
            clearTimeout(refresh); // чищу після виконання
          },
          expired > 0 ? expired * 1000 : 0 // слідкую за часом в разі перезавантаження сторінки {in/now}
        );
      } catch (err) {
        this.$cookies.remove('token'); // при приході помилки вбиваю токен
        this.$store.commit('setLogin', ''); //  обнулюю
        console.log(err);
      } finally {
        this.show = true;
      }
    },
    onChekfind(triger) {
      //тригер пошуку
      this.check = triger;
    },
    getFindId(id) {
      if (!this.stateModal) {
        // перевірка на довбойоба
        this.filmsid = id; // отримання і запис id
        this.locate = window.scrollY; // запис положення скролу
        this.scrollCount(); //прорахунок ширини
      }
    },
    scrollCount() {
      //прорахунок ширини
      this.scrollWidth = window?.innerWidth - window?.document?.documentElement?.clientWidth;

      window.document.documentElement.style.setProperty(
        // динамічно міняю положеня модалки
        '--left-modal',
        this.scrollWidth / 2 + 'px'
      );
    },
    modalstate(e) {
      //запис стану модалки
      this.stateModal = e;
    },
    watchPath() {
      // слідкую за змінами сторінки (роут)
      this.$watch(
        () => this.$route.name,
        fullPath => {
          this.path = fullPath.replace('/', '');
        }
      );
    },
  },
  updated() {
    // при оновлені встановлення дефолту
    this.filmsid = -1;
  },
  watch: {
    stateModal() {
      //слідкування за станом модалки
      if (!this.stateModal) {
        //якщо закрита
        window.document.documentElement.style.setProperty(
          // динамічно міняю положеня модалки
          '--left-modal',
          0 + 'px'
        );
        this.scrollWidth = 0; //скрол по дефолту
        this.$nextTick().then(() => {
          //чекаеєм виконня всього а вже потім
          //прибиваю скролл
          window.scrollBy(0, this.locate);
        });
      }
    },
  },

  beforeUnmount() {
    window.removeEventListener('focus', this.checkFocus); // видалення
  },
  computed: {
    getRef() {
      return featuresStore?.getters?.getRefItem;
    },
    polyHas() {
      // полифил для firefox
      return this.browser.includes('firefox') && window?.localStorage?.getItem(this.path);
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}

.modal {
  position: fixed;
  left: 0;
}

.spec {
  width: 100vw;
}

main:has(.gallery__info) footer {
  opacity: 0;
}

.show-footer {
  opacity: 1;
}
.has--poly {
  flex: 1;
  background-image: url(./assets/images/biblioteka/nofilms.jpg);
  background-size: 100% 100%;

  @include mq(desktop) {
    background-size: cover;
    background-position: center;
  }
}

main:not(:has(.gallery__info)) {
  flex: 1;
  background-image: url(./assets/images/biblioteka/nofilms.jpg);
  background-size: 100% 100%;

  @include mq(desktop) {
    background-size: cover;
    background-position: center;
  }
}
</style>
