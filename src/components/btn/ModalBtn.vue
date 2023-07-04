<template>
  <router-link
    :to="{ path: name }"
    :textcontent="name"
    class="library__header--btn"
    @click="toggle"
  >
    {{ content }}
  </router-link>
</template>

<script>
export default {
  name: 'ModalBtn',
  props: {
    name: {
      type: String,
      requried: true,
    },
    content: {
      type: String,
      requried: true,
    },
  },
  methods: {
    toggle() {
      this.$router.push({ path: this.name.toLowerCase() });
    },
  },
};
</script>

<style lang="scss" scoped>
.library__header--btn {
  width: 130px;
  padding-top: 12px;
  padding-bottom: 12px;

  text-transform: uppercase;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.33;

  color: #ffffff;
  background-color: transparent;
  border-radius: 5px;
  border: 1px solid #ffffff;

  text-align: center;
  display: block;

  &:hover {
    background-color: #ff00193b;
    box-shadow: 8px 8px 14px -8px rgba(255, 255, 255, 1);
  }

  @include mq(tablet) {
    width: 148px;
  }

  &.router-link-exact-active {
    background-color: #ff6b01;
    border-color: #ff6b01;
  }
}
</style>
