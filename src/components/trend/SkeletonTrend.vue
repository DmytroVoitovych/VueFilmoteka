<template>
  <ul>
    <li v-for="e of fakeArrs.template" :key="e" class="gallery__item">
      <img class="gallery__img" />
      <div class="gallery__info">
        <p class="gallery__title them"></p>
        <p class="gallery__text them"></p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts"  setup>
import { axio } from '@/helpers/axios';
import { Block } from 'notiflix';
import { reactive } from 'vue';

const fakeArrs = reactive({ template: [...Array(20).keys()] });
let checkParam = false;
const loaderBasic = () => {
  // функція відповідальна за основний лоадер на сайті

  axio.loader.interceptors.request.use(config => {
    //перехоплюєм запит
    
    checkParam = !!config?.url?.includes('/3/movie/');
    if (!checkParam) {
      //якщо потрібний запит
       //перевірка на дурня
          Block?.dots('.gallery__item', {
          //сам лофдер з конфігураціями
          svgColor: 'var(--text-color-red)',
          svgSize: '100px',
          backgroundColor: 'var(--bg-loader-basic)',
        });
    }
    
    
    return config;
  });

  axio.loader.interceptors.response.use(res => {
    // коли дані нам надійшли  вимикаєм лоадер
    if (!checkParam) {
      //якщо потрібний запит
    console.log(res,'res');
      res?.data?.results && res?.data?.results.length > 0 && Block?.remove('.gallery__item');
      res?.data?.genres && res.data.genres.length > 0 && Block?.remove('.gallery__item');
    }

    return res;
  });
};
loaderBasic();
</script>

<style lang="scss" scoped>
.gallery__item {
  width: 100%;
  padding-bottom: 3px;
  cursor: pointer;
}
.gallery__item:hover {
  box-shadow: 1px 2px 2px 3px rgba(150, 64, 3, 0.608),
    2px 2px 2px rgba(135, 102, 78, 0.456), 2px 3px 2px rgba(244, 157, 94, 0.409);
  border-radius: 2px 2px 5px 5px;
  cursor: pointer;
  transition: box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.gallery__item:hover .gallery__info {
  color: #ff7f00;
  transition: font-weight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery__img {
  position: relative;
  border: none;
  width: 100%;
  height: 574px;
  // display: block;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 12px;

  background: var(--bg-loader-basic);
  background-size: 130px;
  animation: load 3s infinite cubic-bezier(0.4, 0, 0.2, 1);

  @media screen and (min-width: 768px) and (max-width: 1279.5px) {
    height: 455px;
  }
  @media screen and (max-width: 767.5px) {
    height: calc((100vw - 40px) * 1.5);
    min-height: 402px;
    max-height: 660px;
  }
}
.gallery__info {
  font-family: Roboto;
  letter-spacing: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.2;
  color: inherit;
  padding-left: 3px;
  // text-shadow: 0px 4px 4px 0px #00000040, 0px 4px 4px 0px #00000040;

  @media screen and (min-width: 768px) and (max-width: 1279.5) {
    font-size: 12px;
    line-height: 1.33;
  }
  @media screen and (min-width: 480px) and (max-width: 767.5px) {
    line-height: 1.17;
  }
  @media screen and (max-width: 479.5px) {
    font-size: 4vw;
  }
}
.gallery__title {
  text-transform: uppercase;
}
.gallery__text {
  color: var(--text-color-light-orange);
  display: flex;
  @media screen and (max-width: 767.5px) {
    line-height: 1.33;
  }
}

@keyframes load {
  50% {
    background: linear-gradient(
        to right,
        transparent 0%,
        #e8e8e8 50%,
        transparent 100%
      )
      top right;
  }
}
</style>
