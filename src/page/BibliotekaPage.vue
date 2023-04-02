<template>
  <TrendMain />
  <!-- <div ref="height" :class="checkItem && 'noFilms'"></div> -->
</template>

<script>
import TrendMain from '../components/trend/TrendMain.vue';
export default {
  name: 'BibliotekaPage',
  components: {
    TrendMain,
  },
  path: {
    type: String,
    default: '',
  },

  data() {
    return {
      height: 0,
      width: document.documentElement.clientWidth,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>