<template>
  <div id="app">
    <HeaderFilm>
      <slot></slot>
    </HeaderFilm>
    <main>
      <router-view></router-view>
      <TrendMain></TrendMain>
    </main>
    <FooterMain></FooterMain>
    <!-- <ModalBtnVue type="button" >Add Watched</ModalBtnVue>
    <ModalBtnVue type="button" see>Add Que</ModalBtnVue> -->
  </div>
</template>

<script>
import HeaderFilm from "./components/header/HeaderFilm.vue";
import FooterMain from "./components/footer/FooterMain.vue";
import TrendMain from "./components/trend/TrendMain.vue";
// import ModalBtnVue from './components/btn/ModalBtn.vue';

export default {
  name: "App",
  components: {
    HeaderFilm,
    FooterMain,
    TrendMain,
    // ModalBtnVue
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
  /* Кольори шрифтів */
  --text-color-light: #ffffff;
  --text-color-light-orange: #ff6b08;
  --text-color-black: #000000;
  --text-color-red: #ff001b;
  --text-color-grey: #545454;
  --text-color-light-grey: #8c8c8c;
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
</style>
