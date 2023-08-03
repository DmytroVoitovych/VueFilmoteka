<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div class="modal-feedback" @keydown.esc="toggle">
    <button class="close closeV'" type="button" @click="toggle">
      <svg width="20" height="20" aria-hidden="true">
        <use href="../../assets/sprite.svg#icon-close"></use>
      </svg>
    </button>
    <form class="feedback-form" @submit.prevent="sendMessage">
      <div class="form__div">
        <h3 class="form__name t-js">{{ modalContentFeed()[0] }}</h3>
        <ul class="form__list">
          <li class="form__item">
            <b>{{ modalContentFeed()[1] }}:({{ feedback.length }}/255)</b>
            <label for="feed" class="form__label t-js"
              >&#128221;{{ modalContentFeed()[2] }}
            </label>
            <span class="form__span">
              <textarea
                v-model.trim="feedback"
                type="text"
                name="feed"
                id="feed"
                class="form__input"
                minlength="10"
                maxlength="255"
                rows="5"
                cols="33"
                :placeholder="'&#128221;'"
                autofocus
                required
              ></textarea>
            </span>
          </li>
        </ul>
      </div>
      <button
        :disabled="feedback.length < 10"
        type="submit"
        class="button-feedback button_ok"
      >
        {{ modalContentFeed()[3] }}
      </button>
    </form>
  </div>
</template>

<script>
import { featuresStore } from '@/store/storeForFeatures';
import { getModalContentFeed, getModalContentNotify } from './feedContentLang';
import { botSend } from '@/helpers/axios';
import { Block, Report } from 'notiflix';

export default {
  name: 'FeedbackForm',
  props: {
    toggle: {
      type: Function,
      require: true,
    },
  },
  data() {
    return {
      feedback: '',
    };
  },
  mounted() {
    this.mangeDirectForm();
  },
  updated() {
    this.mangeDirectForm();
  },
  methods: {
    async sendMessage() {
      //відправка в теге
      try {
        Block.dots('.modal-feedback', {
          //сам лофдер з конфігураціями
          svgColor: 'var(--text-color-red)',
          backgroundColor: 'var(--bg-loader-basic)',
        });
        await botSend.post('/feedback', { feedback: this.feedback });
        this.$cookies.set('feedlimit', 'min', '30MIN');
        Report.success('Feedback', this.modalContentNotify()[0], 'okay');
      } catch (error) {
        Report.warning('Feedback', error.response.data.message, 'okay');
      } finally {
        Block.remove('.modal-feedback');
        this.toggle();
      }
    },

    mangeDirectForm() {
      // закритя коли не в зоні видимості
      const intersectionObserver = new IntersectionObserver(
        entries => {
          if (!this.$el.classList.contains('visually-hidden')) {
            return !entries[0].isIntersecting && this.toggle();
          } else {
            intersectionObserver.unobserve(this.$el);
          }
        },
        { threshold: 0 }
      );
      // start observing

      intersectionObserver.observe(this.$el);
    },

    modalContentFeed() {
      return getModalContentFeed(this.getLanguage); // отримання користувацького контену відповідно до мови
    },
    modalContentNotify() {
      return getModalContentNotify(this.getLanguage);
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
button[disabled] {
  background: var(--disabled);
  pointer-events: none;
  outline-color: var(--disabled);
  color: var(--text-color-light);
}
.modal-feedback {
  position: absolute;
  background-color: var(--base-modal-background);
  border-radius: 4px;
  border: 2px solid var(--bg-color-modal-orange);
  max-width: 400px;
  width: 100%;
  padding: 15px 15px;
  pointer-events: all;
  text-align: center;
  bottom: 100%;

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
  text-align: center;
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
  padding-left: 12px;
  -webkit-transition: border 250ms cubic-bezier(0.4, 0, 0.2, 1);
  transition: border 250ms cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 20px;
  resize: none;
  font-size: 24px;
  width: 100%;
}

@media screen and (min-width: 1200px) {
  .form__input {
    width: 350px;
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
.button-feedback {
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
  width: 90%;
  @media screen and (max-width: 479.5px) {
    font-size: calc(100vw / 26.5);
  }
}
.button-feedback:hover,
.button-feedback:focus {
  transform: translateY(-1px);
  box-shadow: 0 5px 10px var(--bg-color-modal-orange);
  transform: scaleX(1.1) scaleY(1.2);
}
</style>