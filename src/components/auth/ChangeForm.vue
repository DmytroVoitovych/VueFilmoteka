<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div>
    <span class="login-form-title"> Change password </span>
    <form
      v-on:submit.prevent="funcChangeUserPass"
      class="login-form"
      data-registr
    >
      <div class="wrap-input" data-validate="Enter email">
        <CustomInput
          v-model:find.trim="mailChange"
          class="input"
          type="mail"
          name="email"
          placeholder="User email"
        />
        <span class="focus-input" data-placeholder="&#xe82a;"></span>
      </div>
      <div class="wrap-input" data-validate="Enter code">
        <CustomInput
          v-model:find.trim="nameChange"
          class="input"
          type="text"
          name="code"
          placeholder="Old password or access code"
        />
        <span class="focus-input" data-placeholder="&#xe82a;"></span>
      </div>
      <div class="wrap-input" data-validate="Enter password">
        <CustomInput
          v-model:find.trim="passChange"
          class="input"
          type="text"
          name="passChange"
          placeholder="New Password"
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
          Change
        </button>
      </div>
      <router-link
        :to="{ name: 'AuthLogin' }"
        class="form-btn-center"
        type="button"
      >
        <svg width="46px" height="46px" class="formArrow">
          <use href="../../assets/sprite.svg#icon-backbutton"></use>
        </svg>
      </router-link>
    </form>
  </div>
</template>

<script>
import { Loading, Notify, Report } from 'notiflix';
import CustomInput from '../header/InputComponent.vue';
export default {
  components: {
    CustomInput,
  },
  data() {
    return {
      nameChange: '',
      mailChange: '',
      passChange: '',
    };
  },

  methods: {
    async funcChangeUserPass() {
      if ((this.nameReg, this.mailReg, this.passReg)) {
        Loading.dots();
        try {
          await this.$store.dispatch('signUp', {
            name: this.nameReg,
            email: this.mailReg,
            password: this.passReg,
          });
          this.$router.push({ path: '/auth/login' });
          Notify.success(`User ${this.nameReg} created`);
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
  },
  computed: {
    noEmpty() {
      // контроль кнопки
      return this.mailChange && this.passChange && this.passChange.length >= 6
        ? false
        : true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/auth';

@media screen and (max-width: 400px) {
  [data-validate='Enter code'] {
    .input::placeholder {
      font-size: 18px;
    }
  }
}

@media screen and (max-width: 354px) {
  [data-validate='Enter code'] {
    .input::placeholder {
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 329px) {
  [data-validate='Enter code'] {
    .input::placeholder {
      font-size: 12px;
    }
  }
}

.disabled {
  background: var(--disabled);
  pointer-events: none;
}

.form-btn-center {
  display: block;
  margin-top: 12px;
  text-align: center;
}

.formArrow {
  fill: #d41889;
  animation: pulse 2s infinite;
  border-radius: 22px;
}

.formArrow:hover {
  fill: #555555;
}

@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(204, 44, 161, 0.4);
    box-shadow: 0 0 0 0 rgba(204, 44, 60, 0.4);
  }

  70% {
    -moz-box-shadow: 0 0 0 10px rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 10px rgba(204, 44, 153, 0);
  }

  100% {
    -moz-box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 0 rgba(204, 44, 167, 0);
  }
}
</style>
