<template>
  <div class="test">
  <div class="pie-wrap gallery__info">
   <svg class="arrow-fortun" viewBox="0 0 100 100"><use href="../../assets/sprite.svg#icon-fortun"></use></svg>
    <div class="pie-chart">
      <div class="pie-slice"></div>
      <div class="pie-slice"></div>
      <div class="pie-slice"></div>
      <div class="pie-slice"></div>
      <div class="pie-slice"></div>
      <div class="pie-slice"></div>
    </div>//
  </div>
  </div>
</template>

<script lang="ts" setup></script>

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

.pie-slice {
  position: absolute;
  transform: translateX(-50%);
  transform-origin: bottom;
  clip-path: polygon(100% 0, 50% 100%, 0 0);
  width: 58%;
  height: 50%;
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
</style>
