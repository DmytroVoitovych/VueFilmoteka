<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div class="wrap-box">
    <span class="login-form-title"> Account Login </span>
    <form class="login-form" data-form v-on:submit.prevent="funcSignInUser">
      <div class="wrap-input" data-validate="Enter username">
        <CustomInput
          v-model:find.trim="mailLog"
          class="input"
          type="email"
          name="email"
          placeholder="User email"
        />
        <span class="focus-input" data-placeholder="&#xe82a;"></span>
      </div>

      <div class="wrap-input" data-validate="Enter password">
        <CustomInput
          v-model:find.trim="passLog"
          class="input"
          type="password"
          name="passReg"
          placeholder="Password"
        />
        <span class="focus-input" data-placeholder="&#xe80f;"></span>
      </div>

      <div class="container-login-form-btn">
        <button
          class="login-form-btn"
          :class="{ disabled: noEmpty }"
          :disabled="noEmpty"
          type="submit"
        >
          Login
        </button>
        <router-link
          :to="{ name: 'AuthSignup' }"
          class="login-form-btn reg"
          type="button"
          >Create account</router-link
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
import { Loading, Notify, Report } from 'notiflix';
import { set } from 'idb-keyval';
import CustomInput from '../header/InputComponent.vue';
import { localDB, remoteDB } from '@/helpers/syncStorage/globalStorage';

export default {
  data() {
    return {
      mailLog: '',
      passLog: '',
    };
  },
  components: {
    CustomInput,
  },
  created() {
    console.log(this.$store.state.user);
  },
  methods: {
    async funcSignInUser() {
      if ((this.mailLog, this.passLog)) {
        Loading.dots();
        try {
          await this.$store.dispatch('signIn', {
            email: this.mailLog,
            password: this.passLog,
          });
          await set('tokenfilm', this.$store.state.token);
          const result = await localDB.post({ token: this.$store.state.token });
          console.log('Данные успешно сохранены в базе данных: ', result);
          const doc = await remoteDB.put({
            _id: 'mytoken',
            token: this.$store.state.token,
          });
          console.log('Токен сохранен в базе данных:', doc);
          this.$router.push({ path: '/' });
          Notify.success(`User ${window.localStorage.getItem('name')} created`);
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
    googleLogin() {
      this.$store.dispatch('googleLogin');
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
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/auth';

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
</style>