<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div class="wrap-box">
    <span class="login-form-title"> {{ funcFormContent()[0] }} </span>
    <form class="login-form" data-form v-on:submit.prevent="funcSignInUser">
      <div class="wrap-input" data-validate="Enter username">
        <CustomInput
          v-model:find.trim="mailLog"
          class="input"
          type="email"
          name="email"
          :placeholder="funcFormContent()[1]"
        />
        <span class="focus-input" data-placeholder="&#xe82a;"></span>
      </div>

      <div class="wrap-input" data-validate="Enter password">
        <CustomInput
          v-model:find.trim="passLog"
          class="input"
          :type="hide ? 'password' : 'text'"
          name="passReg"
          :placeholder="funcFormContent()[2]"
        />
        <span class="focus-input" data-placeholder="&#xe80f;"></span>
        <span
          v-show="passLog"
          class="pass-eye"
          @click.prevent="funcHide"
          @mousedown="e => e.preventDefault()"
          >{{ hide ? '🙈' : '🙉' }}</span
        >
      </div>
      <div class="pass__req">
        <button type="button" @click.prevent="funcSendEmail">
          {{ funcFormContent()[3] }}
        </button>
      </div>
      <div class="container-login-form-btn">
        <button
          class="login-form-btn"
          :class="{ disabled: noEmpty }"
          :disabled="noEmpty"
          type="submit"
        >
          {{ funcFormContent()[4] }}
        </button>
        <router-link
          :to="{ name: 'AuthSignup' }"
          class="login-form-btn reg"
          type="button"
          >{{ funcFormContent()[5] }}</router-link
        >
        <router-link
          :to="{ name: 'AuthChange' }"
          class="login-form-btn reg"
          type="button"
          >{{ funcFormContent()[6] }}</router-link
        >
        <router-link :to="{ name: 'Home' }" class="homeBtnLink">
          <svg width="46px" height="46px">
            <use href="../../assets/sprite.svg#icon-home"></use>
          </svg>
        </router-link>
      </div>
    </form>
    <button class="login__google" @click.prevent="googleLogin">
      <svg class="login__google--svg" width="46px" height="46px">
        <use href="../../assets/sprite.svg#icon-google"></use>
      </svg>
    </button>
  </div>
</template>

<script>
import { store } from '@/store/filmsStore';
import { Confirm, Loading, Notify, Report } from 'notiflix';
import CustomInput from '../header/InputComponent.vue';
import { featuresStore } from '@/store/storeForFeatures';
import { getAuthLoginContent, getAuthLoginConfirmContent } from './contentAuth';

export default {
  data() {
    return {
      mailLog: '',
      passLog: '',
      hide: true,
    };
  },
  components: {
    CustomInput,
  },

  methods: {
    redirectFromHideRoute() {
      window.history.state.current.toLowerCase().includes('bibl') &&
        !this.$cookies.get('token') &&
        this.$router.push({ name: 'AuthLogin' });

      window.history.state.current.toLowerCase().includes('auth') &&
        this.$cookies.get('token') &&
        this.$router.push({ path: '/' });
    },
    async funcSignInUser() {
      this.redirectFromHideRoute();

      if ((this.mailLog, this.passLog, !this.$cookies.get('token'))) {
        Loading.dots();
        try {
          await this.$store.dispatch('signIn', {
            email: this.mailLog,
            password: this.passLog,
          });
          this.funcRedirectAfterLogin();
          Notify.success(`User ${window.localStorage.getItem('name')} signIn`, {
            timeout: 1000,
          });
        } catch (err) {
          if (err.response) {
            return Report.failure(
              `Error ${err.response.data.code}`,
              err.response.data.message
            );
          }
          return Report.failure(`Error ${err.code}`, err.message);
        } finally {
          Loading.remove();
        }
      }
    },
    async googleLogin() {
      this.redirectFromHideRoute();
      if (!this.$cookies.get('token')) {
        Loading.dots();
        try {
          await this.$store.dispatch('googleLogin');
          await this.funcRedirectAfterLogin();
          Notify.success(
            `User ${window?.localStorage?.getItem('name')} signIn`,
            { timeout: 1000 }
          );
        } catch (err) {
          this.$router.push({ path: '/auth/login' });
          Notify.info('User stop auth');
        } finally {
          Loading.remove();
        }
      }
    },
    funcRedirectAfterLogin() {
      this.$cookies.set('token', this.$store.state.token, '60MIN'); // d кукіс
      this.$router.push({ path: '/', replace: true });
      store.dispatch('getFromServerFilmId', this.$store.state.token);
    },
    funcSendEmail() {
      Confirm.prompt(
        this.funcConfirmContent()[0],
        this.funcConfirmContent()[1],
        `${this.mailLog ?? ''}`,
        this.funcConfirmContent()[2],
        this.funcConfirmContent()[3],
        this.funcSendEmailForReset,
        () => {
          console.log('cancel');
        },
        { messageMaxLength: 2700 }
      );
    },
    async funcSendEmailForReset(mail) {
      try {
        const res = await this.$store.dispatch('resetPassword', {
          email: mail,
        });
        if (res) {
          Notify.success('Success');
          this.$router.push({ path: '/auth/newpassword' });
        }
      } catch (error) {
        console.log(error);
        Notify.failure(error?.response?.data?.message ?? error);
      }
    },
    funcHide() {
      this.hide = !this.hide;
    },
    funcFormContent() {
      return getAuthLoginContent(this.getLanguage);
    },
    funcConfirmContent() {
      return getAuthLoginConfirmContent(this.getLanguage);
    },
  },

  computed: {
    noEmpty() {
      // контроль кнопки
      return this.mailLog && this.passLog && this.passLog.length >= 6
        ? false
        : true;
    },
    authTest() {
      return this.$store.state.token;
    },
    getLanguage() {
      return featuresStore.getters.getLanguage;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/auth';
.pass-eye {
  position: absolute;
  cursor: pointer;
}
.disabled {
  background: var(--disabled);
  pointer-events: none;
}
.login__google {
  position: absolute;
  bottom: 56px;
  left: 6px;
  padding: 0;
  margin: 0;
  border: none;
  background: -webkit-linear-gradient(left, #a445b2, #d41872, #fa4299);
  background: -o-linear-gradient(left, #a445b2, #d41872, #fa4299);
  background: -moz-linear-gradient(left, #a445b2, #d41872, #fa4299);
  background: linear-gradient(left, #a445b2, #d41872, #fa4299);
  border-radius: 50%;
  display: flex;
  cursor: pointer;

  &:hover {
    background: #555555;
  }
}

.login__google--svg {
  fill: transparent;
  position: relative;
  stroke: azure;
}

.pass__req {
  opacity: 0.7;
  text-align: center;
  margin-top: 4px;
  button {
    @extend %reset-style;
    font-family: Ubuntu-Regular, sans-serif;
    font-size: 16px;
    color: #555555;
    line-height: 1.2;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      text-decoration-color: #fa4299;
    }
  }
}
</style>
