<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div>
    <span class="login-form-title"> {{ funcFormContent()[0] }} </span>
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
          :placeholder="funcFormContent()[1]"
        />
        <span class="focus-input" data-placeholder="&#xe82a;"></span>
      </div>
      <div class="wrap-input" data-validate="Enter code">
        <CustomInput
          v-model:find.trim="oldPass"
          class="input"
          :type="hide ? 'password' : 'text'"
          name="code"
          :placeholder="funcFormContent()[2]"
        />
        <span class="focus-input" data-placeholder="&#xe80f;"></span>
        <span
          v-show="oldPass"
          class="pass-eye"
          @click.prevent="funcHide"
          @mousedown="e => e.preventDefault()"
          >{{ hide ? '🙈' : '🙉' }}</span
        >
      </div>
      <div class="wrap-input" data-validate="Enter password">
        <CustomInput
          v-model:find.trim="passChange"
          class="input"
          :type="hide ? 'password' : 'text'"
          name="passChange"
          :placeholder="funcFormContent()[3]"
        />
        <span class="focus-input" data-placeholder="&#xe80f;"></span>
        <span
          v-show="passChange"
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
import { featuresStore } from '@/store/storeForFeatures';
import { getAuthChangeContent } from './contentAuth';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { store as auth } from '@/store/index';

const lang = computed<string>(() => featuresStore.getters.getLanguage).value;
const router = useRouter();

const oldPass = ref(''); // чи код
const mailChange = ref('');
const passChange = ref('');
const hide = ref(true);

const funcChangeUserPass = async () => {
  if ((oldPass.value, mailChange.value, passChange.value)) {
    Loading.dots();
    try {
      await auth.dispatch('setNewPassword', {
        email: mailChange.value,
        password: oldPass.value,
        newPassword: passChange.value,
      });
      router.push({ path: '/auth/login' });
      Notify.success(`Success`);
    } catch (err: any) {
      if ('response' in err && err.response) {
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

const funcFormContent = () => getAuthChangeContent(lang);

const noEmpty = computed(() =>
  // контроль кнопки
  mailChange.value && passChange.value && passChange.value.length >= 6
    ? false
    : true
);
</script>

<style lang="scss" scoped>
@import '../../assets/scss/auth';

.pass-eye {
  position: absolute;
}

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
.pass-eye {
  cursor: pointer;
}
.disabled {
  background: var(--disabled);
  pointer-events: none;
}

.form-btn-center {
  display: inline-block;
  margin-top: 12px;
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
