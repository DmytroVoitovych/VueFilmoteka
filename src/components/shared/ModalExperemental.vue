<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div id="pagination-popover" popover class="modal-pagination" ref="el">
    <button
      class="close closeV'"
      modal-pagination-close
      type="button"
      popovertarget="pagination-popover"
      popovertargetaction="hide"
    >
      <svg width="20" height="20" aria-hidden="true">
        <use href="../../assets/sprite.svg#icon-close"></use>
      </svg>
    </button>
    <form class="pagination-form">
      <div class="form__div">
        <h3 class="form__name t-js">{{ modalContentPag()[0] }}</h3>
        <ul class="form__list">
          <li class="form__item">
            <label
              for="page"
              class="form__label t-js"
              :class="props.max < +num && 'wrong-page'"
            >
              {{
                props.max < +num
                  ? modalContentPag()[1].replace(' ', ` ${props.max} `)
                  : modalContentPag()[2]
              }}</label
            >
            <span class="form__span">
              <InputComponent
                v-model:find="num"
                type="number"
                name="page"
                id="pagination-input"
                class="form__input"
                min="1"
                required
                autofocus
            /></span>
          </li>
        </ul>
      </div>
      <button
        type="submit"
        @click.prevent="forcePage"
        class="button-pagination button_ok"
        :disabled="props.max < +num"
      >
        {{ modalContentPag()[3] }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { featuresStore } from '@/store/storeForFeatures';
import InputComponent from '../header/InputComponent.vue';
import { getModalContentPag } from './contentLang';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const num = ref(1);
const el = ref<HTMLDivElement | null>(null);
const lang = computed<string>(() => featuresStore.getters.getLanguage).value;

const props = withDefaults(defineProps<{ max: number }>(), {
  max: () => 0,
});
const emit = defineEmits<{ forcePage: [num: number] }>();

const togglePointer = (value: 'none' | '') =>
  window.document.documentElement.style.setProperty('--pointer', value);

const stateOfModalPag = (e: Event) => {
  // функція перевірку стану попавера
  if ('newState' in e && e.newState === 'closed') {
    // якщо закрита
    togglePointer(''); // відновлюю перехоплювач івентів
    return;
  }
  if ('newState' in e && e.newState === 'open') {
    togglePointer('none'); // відключаю перехоплювач
    return;
  }
};

const forcePage = (e: Event) => emit('forcePage', +num.value); // передай номер для пагінації

const modalContentPag = () => getModalContentPag(lang); // отримання користувацького контену відповідно до мови

onMounted(() => el.value?.addEventListener('beforetoggle', stateOfModalPag)); // reg event
onUnmounted(() =>
  el.value?.removeEventListener('beforetoggle', stateOfModalPag)
); //clean event
</script>

<style lang="scss" scoped>
button[disabled] {
  background: var(--disabled);
  pointer-events: none;
  outline-color: var(--disabled);
  color: var(--text-color-light);
}
.modal-pagination {
  background-color: var(--base-modal-background);
  border-radius: 4px;
  border: 2px solid var(--bg-color-modal-orange);
  max-width: 400px;
  width: 100%;
  padding: 15px 15px;
  pointer-events: all;
  @media screen and (max-width: 479.5px) {
    max-width: calc(100vw - 64px);
  }
}

.close {
  position: absolute;
  top: 8px;
  right: 8px;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  stroke: var(--text-color-black);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  cursor: pointer;
  -webkit-transition: border 250ms cubic-bezier(0.4, 0, 0.2, 1);
  transition: border 250ms cubic-bezier(0.4, 0, 0.2, 1);
  @media screen and (max-width: 479.5px) {
    top: auto;
    bottom: 8px;
    min-width: 20px;
    min-height: 20px;
  }
}
.close:hover,
.close:focus {
  border: 1px solid var(--bg-color-modal-orange);
}
.close:hover svg,
.close:focus svg {
  stroke: var(--bg-color-modal-orange);
}

.form__name {
  text-transform: uppercase;
  margin-bottom: 20px;
  font-size: 20px;
  line-height: 1.15;
  letter-spacing: 0.03em;
  text-align: center;
  color: var(--text-color-black);

  @media screen and (max-width: 479.5px) {
    font-size: calc(100vw / 26.5);
  }
}

.form__item {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}

.form__item:not(:last-child) {
  margin-bottom: 10px;
}

.form__span {
  position: relative;
}
.form__label {
  padding-left: 10px;
  text-align: left;
  font-size: 14px;
  line-height: 1.17;
  letter-spacing: 0.01em;
  color: var(--footer-text);
  margin-top: 15px;
  margin-bottom: 4px;
  @media screen and (max-width: 420px) {
    font-size: calc(100vw / 32);
  }
}

.form__input {
  border: 1px solid rgba(33, 33, 33, 0.2);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 4px;
  padding-left: 42px;
  -webkit-transition: border 250ms cubic-bezier(0.4, 0, 0.2, 1);
  transition: border 250ms cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 20px;

  width: 100%;
  height: 40px;
}

@media screen and (min-width: 1200px) {
  .form__input {
    width: 350px;
    height: 40px;
  }
}

.form__input:hover,
.form__input:focus {
  fill: var(--bg-color-modal-orange);
  -webkit-transition: fill 250ms cubic-bezier(0.4, 0, 0.2, 1);
  transition: fill 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.form__input:hover,
.form__input:focus {
  border: 1px solid var(--bg-color-modal-orange);
  -webkit-transition: border 250ms cubic-bezier(0.4, 0, 0.2, 1);
  transition: border 250ms cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}
.button-pagination {
  padding: 4px 10px 4px;
  background: var(--bg-color-modal-orange);
  color: var(--bg-color-light-grey);
  -webkit-box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-weight: bold;
  font-size: 16px;
  line-height: 30px;
  letter-spacing: 0.06em;
  border: none;
  cursor: pointer;
  -webkit-transition: border 250ms cubic-bezier(0.4, 0, 0.2, 1);
  transition: border 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.button_ok {
  margin-right: 20px;
  @media screen and (max-width: 479.5px) {
    font-size: calc(100vw / 26.5);
  }
}
.button-pagination:hover,
.button-pagination:focus {
  transform: translateY(-1px);
  box-shadow: 0 5px 10px var(--bg-color-modal-orange);
  transform: scaleX(1.1) scaleY(1.2);
}

#pagination-popover::backdrop {
  background-color: rgba(0, 0, 0, 0.25);
}

.wrong-page {
  color: var(--error-color);
  text-decoration: underline;
}

html.dark .wrong-page {
  filter: drop-shadow(2px 0px 6px var(--dark-background-theme));
}
</style>
