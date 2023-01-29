<template>
  <div
    id="app"
    :class="{ modal: modalt }"
    :style="{ top: modalt && `${-locate}px` }"
  >
    <HeaderFilm @onChekfind="onChekfind" :class="{ spec: modalt }" />
    <main>
      <router-view></router-view>
      <TrendMain :switcher="check" @get-find-id="getFindId"></TrendMain>
    </main>
    <FooterMain :class="{ spec: modalt }"></FooterMain>
    <teleport to="#modalMain">
      <ModalMain :filmsid="filmsid" ref="open" @modalstate="modalstate" />
    </teleport>
    <!-- <ModalBtnVue type="button" >Add Watched</ModalBtnVue>
    <ModalBtnVue type="button" see>Add Que</ModalBtnVue> -->
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
      filmsid: -1,
      locate: 0,
      modalt: false,
    };
  },
  methods: {
    onChekfind(triger) {
      this.check = triger;
    },
    getFindId(id) {
      console.log(id);
      this.filmsid = id;
      this.locate = window.scrollY;
    },
    modalstate(e) {
      this.modalt = e;
    },
  },
  updated() {
    this.filmsid = -1;
  },
  watch: {
    modalt() {
      if (!this.modalt) {
        this.$nextTick().then(() => {
          //прибиваю скролл
          window.scrollBy(0, this.locate);
        });
      }
    },
  },
};
</script>

<style>
:root {
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
}

.modal {
  position: fixed;
  right: 10px;
  left: 0;
}

.spec {
  width: 100vw;
}
</style>
