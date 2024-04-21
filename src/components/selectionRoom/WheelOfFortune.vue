<template>
  <div class="pie-container">
    <div class="pie-wrap gallery__info">
      <svg class="arrow-fortun" viewBox="0 0 100 100">
        <use href="../../assets/sprite.svg#icon-fortun"></use>
      </svg>
      <div class="dot" ref="arrowFortun">.</div>
      <ul class="pie-chart" :class="rotateClass && 'wheel-animation'" ref="pie">
        <li
          @mouseenter="() => funcHover(index)"
          @mouseleave="funcHoverOut"
          v-for="(obj,index) of (wheelFilms as FilmForWheel[])"
          :key="obj.id"
          class="pie-slice"
          :class="[
            wheelFilms.length > 2 ? 'clipPath-wheel' : '',
            removeAnimation && selectedIndex === index ? 'pie-sliceRemove' : '',
          ]"
          :style="{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${obj.backdrop_path})`,
            transform: `rotate(${numberOfDeg[index]}deg)`,
            height: wheelFilms.length === 1 ? '100%' : '50%',
          }"
        >
          <YouIframe
            v-if="showYt && videoExist && index === selectedIndex"
            :video="obj.video.results"
            class="iframe__main"
            :player-vars="{ autoplay: 1, listType: 'user_uploads', controls: 0, loop: 1 }"
          />

          <p v-else class="pie-chartTitle">{{ obj.title }}</p>
        </li>
      </ul>
      <YouIframe
        v-if="showYt && videoExist"
        :video="(wheelFilms as FilmForWheel[])[selectedIndex].video.results "
        class="iframe__backgrounnd"
        :player-vars="{ autoplay: 1, listType: 'user_uploads', controls: 0, loop: 1 }"
        ref="yt"
        data-bg="true"
      />

      <div v-else-if="showYt" class="wheelPosterFilm" :style="showPoster"></div>
      <DialogRadix
        v-else-if="!rotateClass && numCubic !== '360deg' && dialogOpen"
        :backgroundImg="popupPoster"
        @getModalState="getModalState"
      />
    </div>
    <button
      class="btnRun-wheel"
      :disabled="rotateClass || wheelFilms.length < 2"
      @click="startRotateWheel"
    >
      Запустити
    </button>
  </div>
</template>

<script lang="ts" setup>
import DialogRadix from "../shared/radix/DialogRadix.vue";
import MovieAPiServer from "@/helpers/req";
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
import YouIframe from "../iframe/YouIframe.vue";
import { getSegmentWidth } from "./helper";

type FilmForWheel = {
  title: string;
  backdrop_path: string;
  id: number;
  poster_path: string;
  video: { id: number; results: { [key: string]: string }[] };
};

const http = new MovieAPiServer();

//props
const props = defineProps<{
  moode: "standard" | "takeoff" | "battle";
  duration: string;
}>();
console.log(props.moode);

//стейт
const wheelFilms = reactive<FilmForWheel[] | object[]>([]); // дефолтні або ж додані з різних точок
const showYt = ref(false);
const selectedIndex = ref(0);
const yt = ref<typeof YouIframe | null>(null);
const rotateClass = ref(false);
const pie = ref<HTMLUListElement>();
const arrowFortun = ref<HTMLDivElement>();
const numCubic = ref<string>("360deg");
const numCubicPrev = ref<string>("0deg");
const dynamicWidth = ref<string>("58%");
const removeAnimation = ref<boolean>(false);
const popupPoster = ref<string>('');
const dialogOpen = ref<boolean>(true);

const xCoordinate = computed<number>(
  () => arrowFortun.value?.getBoundingClientRect().x as number
);
const yCoordinate = computed<number>(
  () => arrowFortun.value?.getBoundingClientRect().y as number
);

const videoExist = computed<boolean>(
  () => !!(wheelFilms[selectedIndex.value] as FilmForWheel).video.results.length
);
const showPoster = computed(() => ({
  display: showYt.value ? "block" : "none",
  backgroundImage: `url(${getPoster(
    (wheelFilms[selectedIndex.value] as FilmForWheel)?.poster_path
  )})`,
}));

const circle = computed<number>(() => 2 * Math.PI * (pie.value!.offsetWidth / 2));

const numberOfDeg = reactive<number[]>([0, 60, 120, 180, 240, 300]);

const getModalState = (modalState: boolean): void => {
  console.log(modalState,'modalState');
  dialogOpen.value = modalState;
};

const calculateAngle = (): void => {
  numberOfDeg.length = 0;
  for (let index = 0; index < wheelFilms.length; index++) {
    numberOfDeg.push((360 / wheelFilms.length) * index);
  }
};

const created = () => {
  // запит першого входу
  http
    .fetchMovieWatchedNow()
    .then((data) => {
      if (data) {
        const typedData: FilmForWheel[] = data.filter((item): item is FilmForWheel => {
          return (
            typeof item.title === "string" &&
            typeof item.backdrop_path === "string" &&
            typeof item.id === "number" &&
            typeof item.poster_path === "string"
          );
        });

        wheelFilms.push(...typedData);
        calculateAngle();
        //  width: calc((100% + var(--deleted-width)) / (var(--num-slices) - 1));
        dynamicWidth.value = getSegmentWidth(circle.value, 0, wheelFilms.length);
        console.log(circle.value, "circle");
      }
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
    });
};

created();

const funcHover = (index: number) => {
  if (!rotateClass.value) {
    showYt.value = true;
    console.log(index, "index");
    selectedIndex.value = index;
  }
};

const funcHoverOut = () => {
  if (!rotateClass.value) {
    console.log("testOut");
    showYt.value = false;
    selectedIndex.value = 0;
  }
};

const getPoster = (poster: string) =>
  //постери
  `https://image.tmdb.org/t/p/original/${poster}`;

const getRandomNum = (): void => {
  const randomNum: number = Math.floor(Math.random() * (3600 + 1 - 360) + 360);
  numCubic.value = (+(props.duration[0] + ".5") * randomNum).toString() + "deg";
};

const removeFilmFromWheel = (title: string): void => {
  const indexOfTitle: number = wheelFilms.findIndex(
    (e) => (e as FilmForWheel).title === title
  );

  dialogOpen.value = true;
  selectedIndex.value = indexOfTitle;
  popupPoster.value = `url(${getPoster((wheelFilms[selectedIndex.value] as FilmForWheel)?.poster_path)})`;
  removeAnimation.value = true;
  setTimeout(() => (removeAnimation.value = false), 350);
  //for css calc(100% * 5 / 6);
};

watch(removeAnimation, (n) => {
  //анімація видалення
  if (!n) {
    wheelFilms.splice(selectedIndex.value, 1);
    calculateAngle();

    dynamicWidth.value = getSegmentWidth(
      circle.value,
      +(pie.value?.children[selectedIndex.value] as HTMLLIElement)?.offsetWidth,
      wheelFilms.length
    );

    numCubicPrev.value = "0deg";
    rotateClass.value = false;
  }
});

const startRotateWheel = () => {
  document.documentElement.style.setProperty("--wheel-duration", `${+props.duration}s`); // час роботи анімації
  rotateClass.value = true; // добавлення класу при першому старті
  getRandomNum();

  pie.value && (pie.value.style.animationPlayState = "running");

  let stopAnimation = setTimeout(() => {
    pie.value && (pie.value.style.animationPlayState = "paused");

    const liTitleFromPoint: string = String(
      document
        .elementsFromPoint(xCoordinate.value, yCoordinate.value)
        .find((e) => e.classList.contains("pie-slice"))?.textContent
    );

    removeFilmFromWheel(liTitleFromPoint);

    clearTimeout(stopAnimation);
  }, +(props.duration + "000"));
};
</script>

<style lang="scss" scoped>
button[disabled] {
  background: var(--disabled);
  pointer-events: none;
  outline-color: var(--disabled);
  color: var(--text-color-light);
}

.dot {
  color: red;
  position: absolute;
  rotate: 180deg;
  top: 10px;
  height: 1px;
  width: 1.1px;
  left: 49.99%;
  transform: translateX(50%);
}

.arrow-fortun {
  display: inline-block;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  z-index: 1;
  position: absolute;
  rotate: 180deg;
  top: -20%;
  width: 50%;
  left: 50%;
  transform: translateX(50%);
}

.pie-container {
  padding: 60px 0;
  text-align: center;
}
.pie-wrap {
  position: relative;
  background-color: azure;
  overflow: hidden;
  transition: 0.2s;
  margin: auto;
  width: 600px;
  height: 600px;
  border: 12px solid var(--text-color-light-orange);
  border-radius: 50%;

  @include mq(mobile-only) {
    width: 100%;
    height: 417px;
  }

  @media screen and (max-width: 488px) {
    width: 240px;
    height: 240px;
  }
}

.pie-chart {
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
}

.wheel-animation {
  animation: rotate var(--wheel-duration) cubic-bezier(0.42, 0, 0.58, 1);
  /* pointer-events: none; */
}

.pie-chartTitle {
  align-self: flex-start;
  margin-top: 65px;
  background-color: var(--base-background-theme);
  border-radius: 5px;
  filter: opacity(0.5);
}

.pie-slice {
  position: absolute;
  transform: translateX(-50%);
  transform-origin: bottom;

  width: v-bind(dynamicWidth);
  height: 50%;
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pie-sliceRemove {
  z-index: 1;
  translate: 0 -100vh;
  border: 3px solid var(--text-color-light-orange);
  transition: all 350ms;
}

.clipPath-wheel {
  clip-path: polygon(100% 0, 50% 100%, 0 0);
}

.pie-slice:nth-of-type(1) {
  /* transform: rotate(0deg); */
  left: auto;
  background-color: aquamarine;
}

.pie-slice:nth-of-type(2) {
  transform: rotate(60deg);
  background-color: black;
}

.pie-slice:nth-of-type(3) {
  transform: rotate(120deg);
  background-color: blue;
}

.pie-slice:nth-of-type(4) {
  transform: rotate(180deg);
  background-color: brown;
}

.pie-slice:nth-of-type(5) {
  transform: rotate(240deg);
  background-color: gold;
}

.pie-slice:nth-of-type(6) {
  transform: rotate(300deg);
  background-color: chartreuse;
}
.fortuneWraper {
  padding: 60px 0;
  text-align: center;
}

#fortune {
  width: 100%;
  border: 5px solid var(--bg-loader-basic);
}
//base
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* .pie-wrap {
  border: 2px solid lightgrey;
  width: 400px;
  height: 400px;
  margin: 10% 50px;
  position: relative;
  border-radius: 50%;
  color: black;
  overflow: hidden;
} */

// формування квадратів
.pie-wrap .entry {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* *the individual entries* */

.sky-blue {
  background-color: lightskyblue;
  height: 50%;
  width: 50%;
  display: block;
}

.light-yellow {
  background-color: lightyellow;
  height: 50%;
  width: 50%;
}

// розміри

.pink {
  background-color: pink;
  height: 50%;
  position: absolute;
  top: 0px;
  right: 0;
  width: 50%;
  clip-path: polygon(0 0, 100% 0%, 0% 100%);
}

.purple {
  background-color: purple;
  height: 50%;
  width: 50%;
  right: 0;
  top: 0;
  position: absolute;
  clip-path: polygon(0% 100%, 100% 0%, 100% 100%);
}

.green {
  background-color: limegreen;
  height: 50%;
  width: 50%;
  right: 0;
  top: 50%;
  position: absolute;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%);
}

.wheat {
  background-color: wheat;
  height: 50%;
  width: 50%;
  right: 0;
  top: 50%;
  position: absolute;
  clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
}

// правки
.pie-wrap .purple p {
  position: absolute;
  top: 140px;
  color: white;
}
.pie-wrap .purple p:first-child {
  top: 120px;
}

.pie-wrap .green p {
  position: absolute;
  top: 20px;
}

.pie-wrap .green p:first-child {
  top: 0px;
}

.pie-wrap .pink p,
.pie-wrap .wheat p {
  position: absolute;
  left: 20px;
  top: 80px;
}

.pie-wrap .pink,
.pie-wrap .wheat {
  justify-content: flex-start;
}

.pie-wrap .pink p:first-child,
.pie-wrap .wheat p:first-child {
  top: 100px;
}

// інтерактивність
.entry .entry-value {
  display: none;
  transition: all 500ms linear;
}
.entry:hover .entry-value {
  display: block;
}

.entry {
  transition: all 500ms linear;
}

// animation wheel
@keyframes rotate {
  0% {
    transform: rotate(v-bind(numCubicPrev));
  }
  100% {
    transform: rotate(v-bind(numCubic));
  }
}

/* .fortune {
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: var(--bg-loader-basic);
  border: 1px solid black;
  border-radius: 50%;

  .fortuneSlice {
    width: 0;

    height: 0;

    border-left: 50px solid transparent;

    border-right: 50px solid transparent;

    border-bottom: 100px solid red;
    padding: 60px;
  }
} */

/* iframe video */

.iframe__main {
  width: 100%;
  height: auto;
  align-self: stretch;
  pointer-events: none;
  scale: 2;
}

.iframe__backgrounnd {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: contain;
  border: none;
  scale: 1.2;
  filter: opacity(0.5);
}

.wheelPosterFilm {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: contain;
  border: none;
  scale: 1.2;
  filter: opacity(0.5);
}

.btnRun-wheel {
  margin: 24px;
  padding: 16px 56px;
  border-radius: 5px;
  background: linear-gradient(0deg, rgb(255, 151, 0) 0%, rgb(251, 75, 2) 100%);
  color: var(--text-color-light);
  border: none;
}
</style>
