<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ContainerMain',
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 1280px;
  padding: 0 32px;
  margin: 0 auto;

  @media screen and (min-width: 768px) and (max-width: 1279.5px) {
    max-width: 768px;
  }

  @media screen and (max-width: 767.5px) {
    max-width: 480px;
  }
}
</style>
