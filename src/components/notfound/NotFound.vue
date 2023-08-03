<template>
  <div class="notfound">
    <p class="notfound__desc">{{ notfoundContent()[0] }}</p>
    <router-link class="notfound__link" to="/">
      {{ notfoundContent()[1] }}
    </router-link>
  </div>
</template>

<script>
import { featuresStore } from '@/store/storeForFeatures';
import { getNotfoundContent } from './contentLang';
export default {
  methods: {
    notfoundContent() {
      return getNotfoundContent(this.getLanguage);
    },
  },

  computed: {
    getLanguage() {
      return featuresStore.getters.getLanguage; // вибрана мова
    },
  },
};
</script>

<style lang="scss" scoped>
.notfound {
  position: fixed;
  inset: 0;
  background: var(--text-color-black);
  background-image: url(../../assets/images/notfound/404.jpg);
  z-index: 1;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: grid;
  place-items: center;
}

.notfound__desc {
  display: inline-block;
  font-size: 10vw;
  line-height: 1;
  text-align: center;
  position: relative;
  -webkit-text-stroke: 2px #f0a900;
  color: transparent;
  text-shadow: 0 0 #01bb00;
  filter: brightness(0.5);
  transition: filter 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: text-shadow 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    text-shadow: 0 0 var(--text-color-light-orange);
    filter: none;
    transition: filter 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transition: text-shadow 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
}

.notfound__link {
  font-size: 5vw;
  line-height: 1;
  text-decoration: underline;
  color: var(--text-color-light-orange);
  transition: filter 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    filter: drop-shadow(-25px -11px 2px green);
    transition: filter 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
}
</style>
