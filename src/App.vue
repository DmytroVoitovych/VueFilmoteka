<template>
  <!-- <div> -->
  <div v-if="path.includes('Auth')" id="auth">
    <router-view></router-view>
  </div>
  <div
    class="flex"
    v-else
    :class="{ modal: stateModal }"
    :style="{
      top: stateModal ? `${-locate}px` : '',
      right: scrollWidth + 'px',
    }"
  >
    <HeaderFilm
      @onChekfind="onChekfind"
      :class="{ spec: stateModal }"
      :style="{ paddingRight: scrollWidth + 'px' }"
      :path="path"
      :show="show"
    />
    <BtnTopandDownVue v-if="getRef" :path="path" />
    <main :class="polyHas && 'has--poly'">
      <div class="gallery__item dummy" style="display: none"></div>
      <router-view
        :modalstate="path !== 'Home' && stateModal"
        :path="path"
        :switcher="check"
        @get-find-id="getFindId"
      >
      </router-view>
    </main>
    <FooterMain
      :class="{ spec: stateModal, 'show-footer': show }"
      :style="{ paddingRight: scrollWidth + 'px' }"
    ></FooterMain>
    <teleport to="#modalMain">
      <ModalMain :filmsid="filmsid" ref="open" @modalstate="modalstate" />
    </teleport>
  </div>
  <!-- </div> -->
</template>

<script lang="ts" setup>
import HeaderFilm from "./components/header/HeaderFilm.vue";
import FooterMain from "./components/footer/FooterMain.vue";
// import TrendMain from './components/trend/TrendMain.vue';
import ModalMain from "./components/shared/ModalMain.vue";
import BtnTopandDownVue from "./components/shared/BtnTopandDown.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { store } from "./store/filmsStore";
import { store as auth } from "./store/index";
import { featuresStore } from "./store/storeForFeatures";
import Bowser from "bowser";
import { nodeHttp } from "./helpers/axios";
import { computed, inject, nextTick, onBeforeUnmount, onUpdated, ref, watch } from "vue";
import type { VueCookies } from "vue-cookies";
import { useRoute, useRouter } from "vue-router";
const $cookies = inject<VueCookies>("$cookies");

const route = useRoute();
const router = useRouter();

const check = ref(false); //слідкуваня за пошуком
const filmsid = ref(-1); // id фільму
const locate = ref(0); //положеня скролу
const stateModal = ref(false); //стан модалки
const scrollWidth = ref(0); //ширина скролу
const path = ref(""); //поточний роут
const show = ref(false); // ?? під питанням чи потрібно мені це(обдумать)
const counterSign = ref(0); // для контроля кількості фокусів при гості
const browser = ref(
  Bowser.getParser(window.navigator.userAgent).getBrowserName().toLowerCase()
);

const refreshToken = async () => {
  // вертає нову пару ключів
  try {
    await auth.dispatch("refreshToken", auth.state.refresh); // записую токен в незалежності від його наявності
    currentUser(auth.state.token || $cookies?.get("token") || undefined); // звичайний контроль  користувача
    show.value = true;
  } catch (err) {
    // !!можлива детальна обробка
    const authFire = getAuth();
    if (!authFire.currentUser) {
      auth.commit("setLogin", ""); //  обнулюю
      window.localStorage.removeItem("name"); // чищу сторедж
      $cookies?.remove("token"); // при приході помилки вбиваю токен
      auth.dispatch("googleAuthInfo"); // перевіряю google вхід
    }

    console.log(err);
  } finally {
    // костиль для появу потрібної кнопки // малюю по готовності
    show.value = true;
  }
};

const controlLogin = async () => {
  const authFire = getAuth();

  onAuthStateChanged(authFire, (user) => {
    // контроль змін
    if (user) {
      user
        .getIdToken(true) // дає новий токен
        .then((newToken) => {
          auth.dispatch("googleAuthInfo", newToken);
        })
        .then(() => currentUser(auth.state.token || $cookies?.get("token") || undefined)) //записую в стейт
        .catch((err) => console.log(err));
    } else {
      currentUser(auth.state.token || $cookies?.get("token") || undefined); // звичайний контроль  користувача
      !$cookies?.get("token") && refreshToken(); // рефрещ пр  звичайному вході
    }
  });
};

const currentUser = async (t: string | undefined) => {
  try {
    await auth.dispatch("currentUser", t); // сигналізую про можливий вхід іншим браузером
    store.dispatch("getFromServerFilmId", auth.state.token); // достаю всі id для синхрона
    $cookies?.set("token", auth.state.token, "60MIN"); // на годину зберігаю
    const { exp } = JSON.parse(
      window?.atob(auth.state.token?.split(".")[1]) // парсю час смерті
    );

    const expired = exp - (Math.floor(+new Date() / 1000) + 10 * 60); // роблю 10 хвилин запаса для рефреш токена
    show.value = true;
    const refresh = setTimeout(
      async () => {
        window?.atob($cookies?.get("token")?.split(".")[1]).includes("firebase")
          ? await controlLogin()
          : await refreshToken(); //??
        clearTimeout(refresh); // чищу після виконання
      },
      expired > 0 ? expired * 1000 : 0 // слідкую за часом в разі перезавантаження сторінки {in/now}
    );
  } catch (err) {
    $cookies?.remove("token"); // при приході помилки вбиваю токен
    auth.commit("setLogin", ""); //  обнулюю
    console.log(err);
  } finally {
    show.value = true;
  }
};

const checkFocus = async () => {
  if (auth.state.token) {
    // тест на сторонній бекенд
    const checkOwnerOfToken = window
      .atob(auth.state.token.split(".")[1])
      .includes("firebase");
    if (checkOwnerOfToken) {
      // чи є юзер
      console.log("тест");
      auth.dispatch("googleAuthInfo"); // якщо є перевірити в наявній базі
    } else {
      // рефрещ пр  звичайному вході
      currentUser(auth.state.token); // звичайний контроль  користувача
    }
  } else {
    if (counterSign.value <= 1) {
      counterSign.value++;
      await refreshToken(); // обовязкова перевірка логіна
    }
  }
};

const watchPath = () => {
  // слідкую за змінами сторінки (роут)
  watch(
    () => route.name,
    (fullPath) => {
      path.value = fullPath ? fullPath.toString().replace("/", "") : "";
      route?.redirectedFrom?.fullPath?.includes("auth") && checkFocus();
    }
  );
};

const redirectFromHideRoute = () => {
  path.value.toLowerCase().includes("bibl") &&
    !$cookies?.get("token") &&
    router.push({ name: "AuthLogin" });

  path.value.toLowerCase().includes("auth") &&
    $cookies?.get("token") &&
    router.push({ path: "/" });
};

const axiosRedirect = () =>
  nodeHttp.interceptors.response.use(
    (response) => {
      redirectFromHideRoute();
      return response;
    },
    (error) => {
      redirectFromHideRoute();
      return Promise.reject(error);
    }
  );

const created = () => {
  !$cookies?.get("token") && (show.value = true);
  window.addEventListener("focus", checkFocus); //рефреш логіна
  watchPath(); //контроль поточного шляху
  !window.history.state.current.includes("auth") && controlLogin();
  // постій контроль авторизації
  axiosRedirect();
};

created();

const onChekfind = (triger: boolean) => {
  //тригер пошуку
  console.log(route.name, "paath");
  // route.name === "SelectionRoom" && triger && router.back();
  check.value = triger;
};

const scrollCount = () => {
  //прорахунок ширини
  scrollWidth.value = window?.innerWidth - window?.document?.documentElement?.clientWidth;

  window.document.documentElement.style.setProperty(
    // динамічно міняю положеня модалки
    "--left-modal",
    scrollWidth.value / 2 + "px"
  );
};

const getFindId = (id: number) => {
  if (!stateModal.value) {
    // перевірка на довбойоба
    filmsid.value = id; // отримання і запис id
    locate.value = window.scrollY; // запис положення скролу
    scrollCount(); //прорахунок ширини
  }
};

const modalstate = (e: boolean) => {
  //запис стану модалки
  stateModal.value = e;
};

onUpdated(() => {
  // при оновлені встановлення дефолту
  console.log(path.value, "path");
  filmsid.value = -1;
});

watch(stateModal, () => {
  //слідкування за станом модалки
  if (!stateModal.value) {
    //якщо закрита
    window.document.documentElement.style.setProperty(
      // динамічно міняю положеня модалки
      "--left-modal",
      0 + "px"
    );
    scrollWidth.value = 0; //скрол по дефолту
    nextTick().then(() => {
      //чекаеєм виконня всього а вже потім
      //прибиваю скролл
      window.scrollBy(0, locate.value);
    });
  }
});

onBeforeUnmount(() => window.removeEventListener("focus", checkFocus)); // видалення

const getRef = computed<HTMLElement | null>(() => featuresStore?.getters?.getRefItem);

const polyHas = computed(() => {
  // полифил для firefox
  return browser.value.includes("firefox") && window?.localStorage?.getItem(path.value);
});
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}

.modal {
  position: fixed;
  left: 0;
}

.spec {
  width: 100vw;
}

main:has(.gallery__info) footer {
  opacity: 0;
}

.show-footer {
  opacity: 1;
}
.has--poly {
  flex: 1;
  background-image: url(./assets/images/biblioteka/nofilms.jpg);
  background-size: 100% 100%;

  @include mq(desktop) {
    background-size: cover;
    background-position: center;
  }
}

main:not(:has(.gallery__info)) {
  flex: 1;
  background-image: url(./assets/images/biblioteka/nofilms.jpg);
  background-size: 100% 100%;

  @include mq(desktop) {
    background-size: cover;
    background-position: center;
  }
}
</style>
