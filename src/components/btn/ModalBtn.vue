<template>
  <router-link
    :to="{ path: props.name }"
    :textcontent="props.name"
    class="library__header--btn"
    @click="toggle"
  >
    {{ props.content }}
  </router-link>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  name: string;
  content: string;
}>();

const router = useRouter();

const toggle = () => router.push({ path: props.name.toLowerCase() });
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
