<template>
  <div class="select__container">
    <select
      class="select__leng"
      :class="show && '--border__change'"
      v-model="selected"
      @mousedown.prevent="funcShowOption"
    >
      <option
        :data-lang="option.text"
        v-for="option in options"
        :value="option.value"
        :key="option.text"
      >
        {{ option.text }}
      </option>
    </select>
    <TransitionGroup>
      <div
        v-show="show"
        @click="chooseOption(option.value)"
        class="option__hover"
        :class="option.value === selected && 'none__selected'"
        :data-lang="option.text"
        v-for="option in options"
        :value="option.value"
        :key="option.text"
      ></div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { featuresStore } from '../../store/storeForFeatures';


const selected = ref(window.localStorage.getItem('currLang') ?? 'English');
const show = ref(false);
const options = reactive([
  { text: 'en', value: 'English' },
  { text: 'ua', value: 'Ukrainian' },
  { text: 'fi', value: 'Finish' },
]);
 
const chooseOption = (opt:string) => {
  selected.value = opt;
  show.value = !show.value;
};

const funcShowOption = (e: string | Event) => { // управління йде з батьківського компоненту через реф
  e !== 'out' ? (show.value = !show.value) : (show.value = false);
};

defineExpose({ funcShowOption }); // передаю в керування

watch(selected,(vanha, uusi) => {
      if (vanha !== uusi) { // при змінні мови перепис стору
        window.localStorage.setItem('currLang', vanha);
        featuresStore.commit('setLanguage', vanha);
      }
    });
</script>

<style lang="scss" scoped>
.select__leng {
  background-color: transparent;
  border-radius: 5px;
  color: var(--text-color-light);
  border-color: var(--text-color-light-orange);
  font-family: Roboto;
  font-size: 20px;
  line-height: 1;
  transition: border-radius 0.5s ease;
  cursor: pointer;
}

.--border__change {
  border-radius: 5px 5px 0px 0px;
  transition: border-radius 0.5s ease;
}

.select__container {
  display: inline-grid;
  float: right;

  position: relative;
  top: -23px;

  @include mq(mobile-only) {
    top: 3px;
    float: none;
  }

  div::after {
    display: inherit;
    content: attr(data-lang);
    background-color: transparent;
    font-family: Roboto;
    font-size: 20px;
    line-height: 1;
    color: var(--text-color-light);
    padding-left: 3px;
    text-decoration: underline;
    border: 1px solid var(--text-color-light-orange);
    border-bottom: none;
    border-top: none;
    cursor: pointer;
  }

  :last-child {
    border-bottom: 1px solid var(--text-color-light-orange);
  }

  .option__hover:hover {
    background-color: var(--text-color-light-orange);
  }
  .none__selected:hover {
    background-color: var(--text-color-red);
    /* pointer-events: none; */
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease, border 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    transform: translateY(-3px);
    opacity: 0;
  }
}
</style>
<!-- var(--text-color-light-orange) -->
