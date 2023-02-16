<template>
  <div ref="height" class="noFilms"></div>
</template>

<script>
export default {
  name: "BibliotekaPage",
  data() {
    return {
      height: 0,
      width: document.documentElement.clientWidth,
    };
  },
};
</script>

<style lang="scss" scoped>
.noFilms {
  text-align: center;
  background-image: url("@/assets/images/biblioteka/nofilms.jpg"),
    linear-gradient(90deg, rgba(0, 0, 0, 0.56), rgba(0, 0, 0, 0.56));
  background-size: 100% 100%;
  background-position: center;
  height: 100vh;
  width: 100vw;
  z-index: 0;
  position: fixed;
  top: 0;

  &::after {
    content: var(--no-content);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 44px;
    -webkit-text-stroke: 2px #f0a900;
    color: transparent;
  }

  @include mq(mobile-only) {
    background-size: cover;
  }
}
</style>