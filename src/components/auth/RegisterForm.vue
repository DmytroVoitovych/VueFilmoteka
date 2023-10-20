<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div>
    <span class="login-form-title"> {{ funcFormContent()[0] }} </span>
    <form v-on:submit.prevent="funcSignUpUser" class="login-form" data-registr>
      <div class="wrap-input" data-validate="Enter username">
        <CustomInput
          v-model:find.trim="nameReg"
          class="input"
          type="text"
          name="username"
          :placeholder="funcFormContent()[1]"
        />
        <span class="focus-input" data-placeholder="&#xe82a;"></span>
      </div>

      <div class="wrap-input" data-validate="Enter email">
        <CustomInput
          v-model:find.trim="mailReg"
          class="input"
          type="email"
          name="email"
          :placeholder="funcFormContent()[2]"
        />
        <span class="focus-input" data-placeholder="&#xe82a;"></span>
      </div>

      <div class="wrap-input" data-validate="Enter password">
        <CustomInput
          v-model:find.trim="passReg"
          class="input"
          :type="hide ? 'password' : 'text'"
          name="passReg"
          :placeholder="funcFormContent()[3]"
        />
        <span class="focus-input" data-placeholder="&#xe80f;"></span>
        <span
          v-show="passReg"
          class="pass-eye"
          @click.prevent="funcHide"
          @mousedown="e => e.preventDefault()"
          >{{ hide ? '🙈' : '🙉' }}</span
        >
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

<script setup lang="ts">
import { Loading, Notify, Report } from 'notiflix';
import CustomInput from '../header/InputComponent.vue';
import { getAuthRegistrationContent } from './contentAuth';
import { featuresStore } from '@/store/storeForFeatures';
import { computed, ref } from 'vue';
import { store as auth } from '@/store';
import { useRouter } from 'vue-router';

const nameReg =ref('');
const mailReg =ref('');
const passReg =ref('');
const hide = ref(true);

const router = useRouter();
const lang = computed<string>(() => featuresStore.getters.getLanguage).value;

const funcSignUpUser = async () => {
  if ((nameReg.value, mailReg.value, passReg.value)) {
    Loading.dots();
    try {
      await auth.dispatch('signUp', {
        name: nameReg.value,
        email: mailReg.value,
        password: passReg.value,
      });
      router.push({ path: '/auth/login' });
      Notify.success(`User ${nameReg.value} created`);
    } catch (err: any) {
      if ('response' in err && err?.response) {
        return Report.failure(
          `Error ${err.response.data.code}`,
          err.response.data.message,
          'ok'
        );
      }
      return Report.failure(`Error ${err.code}`, err.message, 'ok');
    } finally {
      Loading.remove();
    }
  }
};

const funcHide = () => {
  hide.value = !hide.value;
};

const funcFormContent = () => getAuthRegistrationContent(lang);
  
const noEmpty = computed(() =>
  // контроль кнопки
  nameReg.value &&
    mailReg.value &&
    passReg.value &&
    passReg.value.length >= 6
    ? false
    : true);

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

.form-btn-center {
  display: inline-block;
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
