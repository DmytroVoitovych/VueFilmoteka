<template>
  <div class="btn-container">
    <div class="switch btn-color-mode-switch">
      <input
        type="checkbox"
        name="color_mode"
        id="color_mode"
        value="1"
        v-on:change="changeThemeMode"
        :checked="dark"
      />
      <label
        for="color_mode"
        data-on="&#127770;"
        data-off="&#127774;"
        class="btn-color-mode-switch-inner"
      ></label>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref } from 'vue';

const dark = ref(false);

const changeThemeMode = () => {
  const html = document.documentElement.classList;
  html.toggle('dark'); // міняєм клас в залежності від стану
  html.contains('dark')
    ? window.sessionStorage.setItem('theme', 'dark')
    : window.sessionStorage.setItem('theme', 'light');
};
const getUserTheme = () => {
  dark.value = window.matchMedia('(prefers-color-scheme:dark)').matches; // перевіряю тему юзера
  window.sessionStorage.getItem('theme') === 'dark'
    ? document.documentElement.classList.add('dark')
    : dark.value &&
    window.sessionStorage.getItem('theme') !== 'light' &&
    document.documentElement.classList.add('dark'); // дефолтний стан чекбокса

  dark.value =
    (window.sessionStorage.getItem('theme') !== 'light' &&
      window.matchMedia('(prefers-color-scheme:dark)').matches) ||
      window.sessionStorage.getItem('theme') === 'dark'
      ? true
      : false;
};

getUserTheme();
</script>

<style lang="scss">
div.btn-container {
  display: grid;
  vertical-align: middle;
  text-align: center;
  position: absolute;

  @include mq(mobile-only) {
    right: 0;
    bottom: -30px;
  }
}

div.btn-container i {
  display: inline-block;
  position: relative;
  top: -9px;
}

label {
  font-size: 13px;
  color: var(--extra-grey);
  font-weight: 500;
  cursor: pointer;
}

.btn-color-mode-switch {
  display: inline-block;
  margin: 0px;
  position: relative;
}

.btn-color-mode-switch > label.btn-color-mode-switch-inner {
  margin: 0px;
  width: 140px;
  height: 30px;
  background: var(--extra-white);
  border-radius: 26px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  display: block;
  border: 1px solid var(--text-color-light-orange);
}

.btn-color-mode-switch > label.btn-color-mode-switch-inner:before {
  content: attr(data-on);
  position: absolute;
  font-size: 12px;
  font-weight: 500;
  top: 7px;
  right: 20px;
}

.btn-color-mode-switch > label.btn-color-mode-switch-inner:after {
  content: attr(data-off);
  width: 70px;
  background: var(--text-color-light);
  border-radius: 26px;
  position: absolute;
  left: 2px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0px 0px 6px -2px #111;
  padding: 5px 0px;
  cursor: pointer;
}

.btn-color-mode-switch input[type='checkbox'] {
  cursor: pointer;
  width: 50px;
  height: 25px;
  opacity: 0;
  position: absolute;
  top: 0;
  z-index: 1;
  margin: 0px;
}

.btn-color-mode-switch
  input[type='checkbox']:checked
  + label.btn-color-mode-switch-inner {
  background: #151515;
  color: var(--text-color-light);
}

.btn-color-mode-switch
  input[type='checkbox']:checked
  + label.btn-color-mode-switch-inner:after {
  content: attr(data-on);
  left: 68px;
  background: #3c3c3c;
}

.btn-color-mode-switch
  input[type='checkbox']:checked
  + label.btn-color-mode-switch-inner:before {
  content: attr(data-off);
  right: auto;
  left: 20px;
}

.btn-color-mode-switch input[type='checkbox']:checked ~ .alert {
  display: block;
}

/*mode preview*/
.dark-preview {
  background: #0d0d0d;
}

.dark-preview div.btn-container i.fa-sun-o {
  color: #777;
}

.dark-preview div.btn-container i.fa-moon-o {
  color: var(--text-color-light);
  text-shadow: 0px 0px 11px var(--text-color-light);
}

.white-preview {
  background: var(--text-color-light);
}

.white-preview div.btn-container i.fa-sun-o {
  color: #ffa500;
  text-shadow: 0px 0px 16px #ffa500;
}

.white-preview div.btn-container i.fa-moon-o {
  color: var(--extra-light-grey);
}

p.by a {
  text-decoration: none;
  color: var(--text-color-black);
}

.dark-preview p.by a {
  color: var(--extra-light-grey);
}

.white-preview p.by a {
  color: var(--text-color-black);
}
</style>
