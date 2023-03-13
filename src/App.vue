<template>
  <div>
    <div v-if="path.includes('Auth')" id="auth">
      <router-view></router-view>
    </div>
    <div
      v-else
      id="app"
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

      <main>
        <router-view></router-view>
        <TrendMain
          v-if="path === 'Home'"
          :path="path"
          :switcher="check"
          @get-find-id="getFindId"
        ></TrendMain>
      </main>

      <FooterMain
        :class="{ spec: stateModal }"
        :style="{ paddingRight: scrollWidth + 'px' }"
      ></FooterMain>
      <teleport to="#modalMain">
        <ModalMain :filmsid="filmsid" ref="open" @modalstate="modalstate" />
      </teleport>
    </div>
  </div>
</template>

<script>
import HeaderFilm from './components/header/HeaderFilm.vue';
import FooterMain from './components/footer/FooterMain.vue';
import TrendMain from './components/trend/TrendMain.vue';
import ModalMain from './components/shared/ModalMain.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'App',
  components: {
    HeaderFilm,
    FooterMain,
    TrendMain,
    ModalMain,
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
    };
  },
  created() {
    window.addEventListener('focus', this.checkFocus); //рефреш логіна
    this.watchPath(); //контроль поточного шляху
    this.controlLogin(); // постій контроль авторизації
  },

  methods: {
    checkFocus() {
      const auth = getAuth(); //обєкт входу firebase
      if (auth.currentUser) {
        // чи є юзер
        this.$store.dispatch('googleAuthInfo'); // якщо є перевірити в наявній базі
      } else {
        this.refreshToken(); // рефрещ пр  звичайному вході
        this.currentUser(); // звичайний контроль  користувача
      }
    },
    async controlLogin() {
      const auth = getAuth();

      onAuthStateChanged(auth, user => {
        // контроль змін
        if (user) {
          console.log('рефрешфаербейс');
          user
            .getIdToken(true) // дає новий токен
            .then(newToken => {
              this.$store.commit('setLogin', newToken);
            }) //записую в стейт
            .catch(err => console.log(err));
        } else {
          this.currentUser(); // звичайний контроль  користувача
          !this.$cookies.get('token') && this.refreshToken(); // рефрещ пр  звичайному вході
        }
      });
    },
    async refreshToken() {
      // вертає нову пару ключів
      try {
        await this.$store.dispatch('refreshToken', this.$store.state.refresh); // записую токен в незалежності від його наявності
      } catch (err) {
        // !!можлива детальна обробка
        const auth = getAuth();
        if (!auth.currentUser) {
          this.$store.commit('setLogin', ''); //  обнулюю
          window.localStorage.removeItem('name'); // чищу сторедж
          this.$store.dispatch('googleAuthInfo'); // перевіряю google вхід
        }
        console.log(err);
      } finally {
        // костиль для появу потрібної кнопки // малюю по готовності
        this.show = true;
      }
    },
    async currentUser() {
      try {
        await this.$store.dispatch('currentUser', undefined); // сигналізую про можливий вхід іншим браузером
        this.$cookies.set('token', this.$store.state.token, '60MIN'); // на годину зберігаю
        const { exp } = JSON.parse(
          window?.atob(this.$store.state.token?.split('.')[1]) // парсю час смерті
        );

        const expired = exp - (Math.floor(new Date() / 1000) + 10 * 60); // роблю 10 хвилин запаса для рефреш токена
        const refresh = setTimeout(
          async () => {
            await this.$store.dispatch(
              // відправляю рефреш токеном
              'refreshToken',
              this.$store.state.refresh
            );
            clearTimeout(refresh); // чищу після виконання
          },
          expired > 0 ? expired * 1000 : 0 // слідкую за часом в разі перезавантаження сторінки {in/now}
        );
      } catch (err) {
        this.$cookies.remove('token'); // при приході помилки вбиваю токен
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
      this.scrollWidth =
        window?.innerWidth - window?.document?.documentElement?.clientWidth;

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
          console.log(fullPath);
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
};
</script>

<style >
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffffff;
  min-height: 100vh;
}

.modal {
  position: fixed;
  left: 0;
}

.spec {
  width: 100vw;
}
</style>
