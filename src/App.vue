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
      <!-- <ModalBtnVue type="button" >Add Watched</ModalBtnVue>
    <ModalBtnVue type="button" see>Add Que</ModalBtnVue> -->
    </div>
  </div>
</template>

<script>
import HeaderFilm from "./components/header/HeaderFilm.vue";
import FooterMain from "./components/footer/FooterMain.vue";
import TrendMain from "./components/trend/TrendMain.vue";
import ModalMain from "./components/shared/ModalMain.vue";

// import ModalBtnVue from './components/btn/ModalBtn.vue';

export default {
  name: "App",
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
      path: "",
    };
  },
  created() {
    this.watchPath();
    console.log(this.path);
  },

  methods: {
    onChekfind(triger) {
      //тригер пошуку
      this.check = triger;
    },
    getFindId(id) {
      this.filmsid = id; // отримання і запис id
      this.locate = window.scrollY; // запис положення скролу
      this.scrollCount(); //прорахунок ширини
    },
    scrollCount() {
      //прорахунок ширини
      this.scrollWidth =
        window?.innerWidth - window?.document?.documentElement?.clientWidth;

      window.document.documentElement.style.setProperty(
        // динамічно міняю положеня модалки
        "--left-modal",
        this.scrollWidth / 2 + "px"
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
        (fullPath) => {
          console.log(fullPath);
          this.path = fullPath.replace("/", "");
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
};
</script>

<style >
:root {
  /* spec style */
  --left-modal: 0;
  /* biblioteka without items */
  --no-content: "You haven't added anything yet.";
  /* Шрифти */
  --main-fonts: "Roboto", sans-serif;
  --secondary-fonts: "Titan One", sans-serif;
  /* Кольори фону */
  --bg-color-light-grey: #f7f7f7;
  --bg-color-modal-orange: #ff6b01;
  --bg-loader-basic: rgba(255, 106, 0, 0.4);
  /* Кольори шрифтів */
  --text-color-light: #ffffff;
  --text-color-light-orange: #ff6b08;
  --text-color-black: #000000;
  --text-color-red: #ff001b;
  --text-color-grey: #545454;
  --text-color-light-grey: #8c8c8c;
  --error-color: #ff0000;
  /* Інші кольори */
}
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
  background-color: #ffffff;
}

.modal {
  position: fixed;
  left: 0;
}

.spec {
  width: 100vw;
}
</style>
