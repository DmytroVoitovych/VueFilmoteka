<template>
  <footer class="footer" :class="open && 'footer_index'">
    <ul class="footer-block">
      <li class="footer__items">
        <span>&#xA9;</span>
      </li>
      <li class="footer__items">
        <span>{{ year() }}</span>
      </li>
      <li class="footer__items"><p>All Rights Reserved</p></li>
      <li class="footer__items"><p>Developed with</p></li>
      <li class="footer__items">
        <svg class="footer__haert">
          <use href="../../assets/sprite.svg#icon-hearts"></use>
        </svg>
      </li>
      <li class="footer__items">
        <a class="footer__items--ref">by Voitovych</a>
      </li>
      <li v-if="!feedLimit">
        <abbr title="feedback">
          <button type="button" class="footer__feed" @click="toggle">
            <svg>
              <use href="../../assets/sprite.svg#icon-feed"></use>
            </svg>
          </button>
        </abbr>
      </li>
    </ul>
    <FeedbackFormVue
      v-if="open && !feedLimit"
      :class="!open && 'visually-hidden'"
      :toggle="toggle"
      v-bind="open ? { tabIndex: 1 } : {}"
    />
  </footer>
</template>

<script>
import FeedbackFormVue from './FeedbackForm.vue';

export default {
  name: 'FooterMain',
  components: {
    FeedbackFormVue,
  },
  data() {
    return {
      open: false,
      feedLimit: false,
    };
  },
  mounted() {
    this.checkLimit();
  },
  updated() {
    this.checkLimit();
  },
  methods: {
    checkLimit() {
      // обмеження відправлень
      this.$cookies.get('feedlimit')
        ? (this.feedLimit = true)
        : (this.feedLimit = false);
    },
    toggle() {
      this.open = !this.open;
    },
    year() {
      return new Date().getFullYear();
    },
  },
  watch: {
    open() {},
  },
};
</script>

<style lang="scss" scoped>
footer {
  position: relative;
  bottom: 0;
}

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  background-color: var(--footer-background, var(--bg-color-light-grey));
  z-index: 0;

  @media screen and (min-width: 1200px) {
    min-width: 1200px;
    height: 77px;
  }

  @media screen and (min-width: 768px) {
    min-width: 100%;
    height: 79px;
  }

  @media screen and (min-width: 260px) and (max-width: 340px) {
    //    min-width: 768px;
    height: auto;
    padding: 40px 0;
    min-width: 100%;
  }
}

.footer-block {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: var(--footer-text, --text-color-grey);
  min-width: 320px;

  @media screen and (min-width: 1200px) {
    min-width: 1200px;
  }

  @media screen and (min-width: 768px) {
    min-width: 100%;
  }

  @media screen and (min-width: 260px) and (max-width: 340px) {
    min-width: 100%;
  }
}

.footer__items {
  margin-left: 5px;
  margin-right: 5px;

  &:nth-child(3) {
    margin: 0;
    padding-left: 5px;
    padding-right: 5px;
    border-left: 1.5px solid #545454;
    border-right: 1.5px solid #545454;
  }
}

.footer__haert {
  fill: rgb(255, 107, 8);
  width: 14px;
  height: 13px;
}

.footer__items--ref {
  text-decoration: underline;
  cursor: pointer;

  -webkit-animation: mymove 3s infinite;
  /* Safari 4.0 - 8.0 */
  animation: mymove 3s infinite;

  /* Safari 4.0 - 8.0 */
  @-webkit-keyframes mymove {
    30% {
      box-shadow: 0px 15px 15px rgba(255, 170, 114, 1);
    }
  }

  @keyframes mymove {
    30% {
      box-shadow: 0px 15px 15px rgba(255, 170, 114, 1);
    }
  }
}

.footer__feed {
  display: block;
  @extend %reset-style;
  cursor: pointer;

  &:hover {
    filter: drop-shadow(-1px 1px 5px var(--scroll-btn));
  }

  &:active {
    scale: 90%;
  }

  svg {
    stroke: var(--text-color-light-orange);
    width: 32px;
    height: 32px;
  }
}
.footer_index {
  @include mq(mobile-only) {
    z-index: 1;
  }
}
</style>
