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
import { get } from 'idb-keyval';
import { localDB, remoteDB } from './helpers/syncStorage/globalStorage';

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
    };
  },
  created() {
    console.log(localDB);
    this.watchPath();
    this.currentUser();
    this.getData();
    localDB.info().then(function (info) {
      console.log(info);
    });
    localDB
      .sync(remoteDB, { live: true, retry: true })
      .on('change', function (info) {
        this.getData();
        console.log('Изменения в базе данных: ', info);
      })
      .on('error', function (err) {
        console.error('Ошибка синхронизации баз данных: ', err);
      });
  },

  methods: {
    async saveData(data) {
      try {
        const result = await localDB.post(data);
        console.log('Данные успешно сохранены в базе данных: ', result);
      } catch (err) {
        console.error('Ошибка сохранения данных в базе данных: ', err);
      }
    },
    async getData() {
      try {
        const result = await remoteDB.allDocs({ include_docs: true });
        console.log('Данные успешно получены из базы данных: ', result.rows);
        return result.rows.map(row => {
          console.log('row', row);
          return row.doc;
        });
      } catch (err) {
        console.error('Ошибка получения данных из базы данных: ', err);
        return [];
      }
    },
    async currentUser() {
      const token = await get('tokenfilm');
      if (token) {
        try {
          this.$store.dispatch('currentUser', token);
        } catch (err) {
          console.log(err);
        }
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
  mounted() {},

  computed: {
    authTest() {
      let b = this.$store.state.user;

      function test() {
        return b;
      }

      return test;
    },
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
