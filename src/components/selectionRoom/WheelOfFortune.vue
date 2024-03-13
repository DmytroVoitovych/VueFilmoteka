<template>
  <div class="test">

  <div class="pie-wrap gallery__info">
  <svg class="arrow-fortun" viewBox="0 0 100 100"><use href="../../assets/sprite.svg#icon-fortun"></use></svg>
      <ul class="pie-chart">
      <li 
      @mouseenter="()=>funcHover(index)"
      @mouseleave="funcHoverOut"
      v-for="(obj,index) of (wheelFilms as FilmForWheel[])"
       :key="obj.id" class="pie-slice"
       :style="{backgroundImage: `url(https://image.tmdb.org/t/p/original/${obj.backdrop_path})`}"
       >
       <YouIframe
        v-if="showYt && videoExist && index === selectedIndex"
        :video="obj.video.results"
        class="iframe__main"
        :player-vars="{ autoplay: 1, listType: 'user_uploads', controls:0, loop:1}"
         />
       
      <p v-else class="pie-chartTitle">{{ obj.title }}</p>
     
       </li>
       </ul>
       <YouIframe
        v-if="showYt && videoExist"
        :video="(wheelFilms as FilmForWheel[])[selectedIndex].video.results "
        class="iframe__backgrounnd"
        :player-vars="{ autoplay: 1, listType: 'user_uploads', controls:0, loop:1}"
        ref="yt"
        data-bg="true"
        />
       
        <div v-else-if="showYt" class="wheelPosterFilm" :style="showPoster">
        
        </div>
  </div>
   
  </div>
</template>

<script lang="ts" setup>
import MovieAPiServer from '@/helpers/req';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import YouIframe from '../iframe/YouIframe.vue';


type FilmForWheel ={
  title: string;
  backdrop_path: string;
  id: number;
  poster_path: string;
  video: { id: number; results: {[key: string]: string;}[]}
};

const http = new MovieAPiServer();

//стейт
const wheelFilms = reactive<FilmForWheel[] | object[]>([]); // дефолтні або ж додані з різних точок
const showYt = ref(false);
const selectedIndex = ref(0);
const yt = ref<typeof YouIframe | null>(null);
// const urlYoutube = ref('');

const videoExist = computed<boolean>(() => !!(wheelFilms[selectedIndex.value] as FilmForWheel).video.results.length);
const showPoster = computed(() => ({
  "display": showYt.value ? "block" : "none",
  backgroundImage:`url(${getPoster((wheelFilms[selectedIndex.value] as FilmForWheel).poster_path)})`
}));

const created =  () => {  // запит першого входу
  http.fetchMovieWatchedNow().then((data) => {
    if (data) {
      const typedData: FilmForWheel[] = data.filter((item): item is FilmForWheel => {
        return (
          typeof item.title === 'string' &&
          typeof item.backdrop_path === 'string' &&
          typeof item.id === 'number' &&
          typeof item.poster_path === 'string'
        );
      });

      wheelFilms.push(...typedData);
      console.log(wheelFilms,'wheelFilms');
    }
   }).catch((error) => {
      console.error('Error fetching movies:', error);
    });;
 
};

created();

const funcHover = (index:number) => {
  console.log('testEnter', index);
  showYt.value = true;
  console.log(index,'index');
  selectedIndex.value = index;
    
};

const funcHoverOut = () => {
  console.log('testOut');
  showYt.value = false;
  selectedIndex.value = 0;
  
};

const getPoster = (poster: string) =>
  //постери
  `https://image.tmdb.org/t/p/original/${poster}`;


onMounted(() => {

})

</script>

<style lang="scss" scoped>

.arrow-fortun{
  
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

.test{
  padding: 60px 0;
}
.pie-wrap {
  position: relative;
  background-color: azure;
  overflow: hidden;
  transition: .2s;
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
}

.pie-chartTitle{
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
  clip-path: polygon(100% 0, 50% 100%, 0 0);
  width: 58%;
  height: 50%;
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
 }

.pie-slice:nth-of-type(1) {
  /* transform: rotate(0deg); */
  left: 50%;
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

.iframe__main{ 
    
    width: 100%;
    height: auto;
    align-self: stretch;
    pointer-events: none;
    scale: 2;
    }


    .iframe__backgrounnd{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: contain;
  border: none;
  scale: 1.2;
  filter: opacity(.5);
    }

    .wheelPosterFilm{
    position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: contain;
  border: none;
  scale: 1.2;
  filter: opacity(.5);  
    }
</style>
