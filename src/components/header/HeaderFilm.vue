<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <header class="header header__home">
    <template v-if="show">
      <router-link
        v-if="!path.includes('Biblioteka') && checkExpired"
        :to="{ path: 'auth/login' }"
        class="custom-btn btn-A"
        ><span>Authorization</span></router-link
      >
      <button
        class="btn__logout"
        :data-name="getName()"
        v-if="!path.includes('Biblioteka') && !checkExpired"
        v-on:click.prevent="funcLogOut"
      >
        <svg
          class="subscribe-form__icon rotate-vert-center"
          width="32"
          height="32"
        >
          <use href="../../assets/sprite.svg#icon-exit"></use>
        </svg>
      </button>
    </template>
    <ContainerMain>
      <nav class="navigation">
        <router-link
          :to="{ name: 'Home' }"
          v-on:click="toMainPage"
          class="logo-link"
        >
          <svg
            class="subscribe-form__icon rotate-vert-center"
            width="24"
            height="24"
          >
            <use href="../../assets/sprite.svg#icon-logo"></use>
          </svg>
          <span class="logo-text tracking-in-expand"
            ><abbr title="Go to page main" role="contentinfo"
              >Filmoteka</abbr
            ></span
          >
        </router-link>
        <ul class="nav-list">
          <li class="nav-item">
            <router-link
              :to="{ name: 'Home' }"
              rel="noopener noreferrer"
              data-lang="home"
              class="nav-btn home__btn"
            >
              home
            </router-link>
          </li>

          <li class="nav-item" data-auth="false">
            <router-link
              :class="{ active__page: path.includes('Biblioteka') }"
              :to="{ name: 'BibliotekaWatched' }"
              rel="noopener noreferrer"
              data-lang="library"
              class="nav-btn library__btn js-auth"
            >
              my library
            </router-link>
            <div class="auth-chek">
              <svg width="32px" height="32px">
                <use href="../../assets/sprite.svg#icon-yes"></use>
              </svg>
            </div>
          </li>
        </ul>
      </nav>
      <form
        v-if="!path.includes('Biblioteka')"
        action=""
        class="search-form js-form"
      >
        <CustomInput
          v-model:find.trim="nameFilms"
          data-lang="placeholder"
          name="searchQuery"
          placeholder="Movie search"
          type="text"
          class="input-form"
        />

        <button
          class="submit-btn"
          type="submit"
          aria-label="search button"
          v-on:click.prevent="searchFilms"
        >
          <svg class="menu__icon" width="12" height="12">
            <use href="../../assets/sprite.svg#icon-search"></use>
          </svg>
        </button>
      </form>
      <ul class="library__btn--wrapper" v-else>
        <li><ModalBtn :name="'WATCHED'" /></li>
        <li><ModalBtn :name="'QUEUE'" /></li>
      </ul>
    </ContainerMain>
  </header>
</template>;

<script>
import ContainerMain from '../shared/ContainerMain.vue';
import CustomInput from './InputComponent.vue';
import ModalBtn from '../btn/ModalBtn.vue';
import { Report, Notify } from 'notiflix';

export default {
  name: 'HeaderMain',

  components: {
    ContainerMain,
    CustomInput,
    ModalBtn,
  },
  props: {
    path: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    onChekfind: v => typeof v === 'boolean', //передача тригера
  },
  data() {
    return {
      switcher: false, //тригер пошуку
      nameFilms: '',
      // show: false,
    };
  },

  created() {
    // this.checkTokenStoreOrUpdate();
  },
  methods: {
    // spec store function
    //  checkTokenStoreOrUpdate() {

    //   this.show = true;
    // },
    searchFilms() {
      const specifick =
        this.nameFilms ===
        JSON.parse(window.localStorage.getItem('findedFilms'));

      if (this.nameFilms && !specifick) {
        this.changeStorage();
        this.switcher = !this.switcher; //або або // логіка тогл
        this.$emit('onChekfind', this.switcher);
      } else if (specifick) {
        return Notify.failure(
          `You already have movies on request: ${this.nameFilms}`
        );
      } else {
        return Notify.failure('Search string must have at least one character');
      }
    },
    toMainPage() {
      window.localStorage.removeItem('numberPage');
      window.localStorage.removeItem('findedFilms');
      this.$route.fullPath !== '/'
        ? this.$router.push({ path: '/' })
        : this.$router.go(0);
    },
    changeStorage() {
      window.localStorage.removeItem('numberPage'); //обнуляю сторінку
      window.localStorage.removeItem('filmsPage'); // обнуляю старі дані
      window.localStorage.setItem(
        'findedFilms',
        JSON.stringify(this.nameFilms)
      ); //передаю в основу
      this.nameFilms = '';
    },

    async funcLogOut() {
      try {
        await this.$store.dispatch('LogOut', this.$store.state.token);
        this.$cookies.remove('token');
      } catch (err) {
        console.log(err);
        if (err.response) {
          return Report.failure(
            `Error ${err.response.data.code}`,
            err.response.data.message
          );
        }
        return Report.failure(`Error ${err.code}`, err.message);
      }
    },
    getName() {
      return window.localStorage.getItem('name');
    },
  },

  computed: {
    checkExpired() {
      const token = this.$store.state.token;

      if (!token) {
        return true;
      }

      const { exp } = JSON.parse(window?.atob(token?.split('.')[1]));
      return Math.floor(new Date() / 1000) > exp;
    },
  },
};
</script>

<style lang="scss" scoped>
[v-cloak] {
  display: none;
}

.header {
  padding-top: 40px;
  padding-bottom: 92px;
  height: 230px;
  z-index: 1;
  @include mq(tablet) {
    height: 216px;
  }
}

.header__home {
  background-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.56),
      rgba(0, 0, 0, 0.56)
    ),
    url(../../assets/images/desc/header-desc@1x.jpg);
  background-size: cover;
  background-repeat: no-repeat;

  @media (min-device-pixel-ratio: 2),
    (-webkit-min-device-pixel-ratio: 2),
    (min-resolution: 192dpi),
    (min-resolution: 2dppx) {
    background-image: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.56),
        rgba(0, 0, 0, 0.56)
      ),
      url(../../assets/images/mob/header-mob@2x.jpg);
  }

  @include mq(tablet) {
    padding-bottom: 81px;
    background-image: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.56),
        rgba(0, 0, 0, 0.56)
      ),
      url(../../assets/images/tab/header-tab@1x.jpg);

    @media (min-device-pixel-ratio: 2),
      (-webkit-min-device-pixel-ratio: 2),
      (min-resolution: 192dpi),
      (min-resolution: 2dppx) {
      background-image: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0.56),
          rgba(0, 0, 0, 0.56)
        ),
        url(../../assets/images/tab/header-tab@2x.jpg);
    }
  }

  @include mq(desktop) {
    background-image: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.56),
        rgba(0, 0, 0, 0.56)
      ),
      url(../../assets/images/desc/header-desc@1x.jpg);

    @media (min-device-pixel-ratio: 2),
      (-webkit-min-device-pixel-ratio: 2),
      (min-resolution: 192dpi),
      (min-resolution: 2dppx) {
      background-image: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0.56),
          rgba(0, 0, 0, 0.56)
        ),
        url(../../assets/images/desc/header-desc@2x.jpg);
    }
  }
}

.header__container {
  display: flex;
  align-items: center;
  margin-bottom: 54px;
  position: relative;

  @include mq(mobile) {
    overflow: hidden;
  }
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo-text {
  @media screen and (max-width: 767px) {
    display: none;
  }

  font-weight: 500;
  font-size: 30px;
  line-height: 1.17;
  display: flex;

  margin-left: 8px;

  color: #ffffff;

  &:hover {
    color: #ff001b;
    transition: 1s ease;
  }

  color: var(--text-color-light);
  cursor: pointer;
}

.search-form {
  display: flex;
  margin: 0 auto;
  max-width: 280px;
  height: 20px;
  padding-bottom: 4px;
  border-bottom: 0.5px solid #ffffff;

  @include mq(tablet) {
    max-width: 336px;
  }

  @include mq(desctop) {
    max-width: 394px;
  }

  &:hover {
    transform: scale(1.05);
    transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.input-form {
  display: block;
  background-color: inherit;
  border: 0.5px;
  outline: none;
  width: 100%;
  height: 20px;
  color: var(--text-color-light);

  font-size: 14px;
  font-weight: 400;
  line-height: 1.14;
  color: #ffffff;

  .input-form::placeholder {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.17;
    color: var(--text-color-light);
  }
}

.submit-btn {
  background-color: inherit;
  border: none;
  outline: none;
  margin-left: auto;
  padding: 0px;
  cursor: pointer;
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 46px;
}

.nav-list {
  display: flex;
  gap: 39px;
  // width: 180px;
  // justify-content: space-between;
}

.nav-btn {
  text-transform: uppercase;
  padding: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.17;
  text-transform: uppercase;

  color: var(--text-color-light);
  background-color: inherit;
  border: none;
  outline: none;

  cursor: pointer;
}

.nav-item {
  position: relative;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.17;

  &.is-hidden {
    display: none;
  }

  & a.router-link-exact-active {
    display: block;
    border-bottom: 2.86px solid #ff001b;
  }
}

.nav-btn {
  position: relative;
}

.nav-btn:hover,
.nav-btn:focus {
  color: var(--text-color-red);
  transition: 1s ease;
}

.nav-btn::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  background: transparent;
  height: 50%;
  width: 100%;
  transform: perspective(1em) rotateX(40deg) scale(1, 0.35);
  filter: blur(8px);
  transition: 1s ease;
}
.active__page {
  border-bottom: 2.86px solid #ff001b;
}
/* biblioteka */
.library__btn--wrapper {
  display: flex;
  justify-content: center;
  z-index: 99;
  gap: 16px;

  position: absolute;
  top: 124px;
  left: 50%;
  transform: translateX(-50%);

  @include mq(tablet) {
    gap: 32px;
  }

  @include mq(desktop) {
    gap: 16px;
  }
}

//**animation logo */
.rotate-vert-center {
  -webkit-animation: rotate-vert-center 3s
    cubic-bezier(0.455, 0.03, 0.515, 0.955) 2s infinite both;
  animation: rotate-vert-center 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) 2s
    infinite both;
  path {
    color: currentColor;
  }
}

@-webkit-keyframes rotate-vert-center {
  0% {
    -webkit-transform: rotateY(0);
    transform: rotateY(0);
  }

  100% {
    -webkit-transform: rotateY(360deg);
    transform: rotateY(360deg);
  }
}

@keyframes rotate-vert-center {
  0% {
    -webkit-transform: rotateY(0);
    transform: rotateY(0);
  }

  100% {
    -webkit-transform: rotateY(360deg);
    transform: rotateY(360deg);
  }
}

.custom-btn {
  width: 130px;
  height: 40px;
  color: #fff;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
    7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
  outline: none;
  text-align: center;
  right: 50%;
  translate: 50%;
  top: 160px;
  font-size: 14px;
}

.btn-A {
  background: linear-gradient(
    0deg,
    rgba(255, 151, 0, 1) 0%,
    rgba(251, 75, 2, 1) 100%
  );
  line-height: 42px;
  padding: 0;
  border: none;
}

.btn-A span {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}

.btn-A:before,
.btn-A:after {
  position: absolute;
  content: '';
  right: 0;
  bottom: 0;
  background: rgba(251, 75, 2, 1);
  box-shadow: -7px -7px 20px 0px rgba(255, 255, 255, 0.9),
    -4px -4px 5px 0px rgba(255, 255, 255, 0.9),
    7px 7px 20px 0px rgba(0, 0, 0, 0.2), 4px 4px 5px 0px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.btn-A:before {
  height: 0%;
  width: 2px;
}

.btn-A:after {
  width: 0%;
  height: 2px;
}

.btn-A:hover {
  color: rgba(251, 75, 2, 1);
  background: transparent;
}

.btn-A:hover:before {
  height: 100%;
}

.btn-A:hover:after {
  width: 100%;
}

.btn-A span:before,
.btn-A span:after {
  position: absolute;
  content: '';
  left: 0;
  top: 0;
  background: rgba(251, 75, 2, 1);
  box-shadow: -7px -7px 20px 0px rgba(255, 255, 255, 0.9) A -4px -4px 5px 0px rgba(255, 255, 255, 0.9),
    7px 7px 20px 0px rgba(0, 0, 0, 0.2), 4px 4px 5px 0px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.btn-A span:before {
  width: 2px;
  height: 0%;
}

.btn-A span:after {
  height: 2px;
  width: 0%;
}

.btn-A span:hover:before {
  height: 100%;
}

.btn-A span:hover:after {
  width: 100%;
}

.btn__logout {
  position: absolute;
  right: 50%;
  translate: 50%;
  top: 160px;
  @extend %reset-style;
  cursor: pointer;

  svg {
    stroke: #ff001b;
    background: brown;
    border-radius: 2px;
  }

  &::before {
    content: attr(data-name);
    color: var(--text-color-light-grey);
    font-family: Roboto;
    font-size: 20px;
    line-height: 1;
    transition: color 0.25s;

    position: relative;
    top: -8px;
    right: 6px;
  }
}

//**special */
header abbr {
  text-decoration: none;
}
</style>