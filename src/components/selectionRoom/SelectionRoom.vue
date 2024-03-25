<template>
  <ContainerMain>
    <!-- <div ref="observe">Test</div> -->
    <section class="fortum-formSection">
      <FormMoodSelection @moode="moode" @duration="wheel" />
      <FormAddFilmInRandom />
    </section>
    <section class="fortum-wheelSection">
      <WheelOfFortune :moode="moodeForWheel" :duration="wheelDuration" />
    </section>
  </ContainerMain>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { featuresStore } from "../../store/storeForFeatures";
import ContainerMain from "../shared/ContainerMain.vue";
import WheelOfFortune from "./WheelOfFortune.vue";
import FormMoodSelection from "./FormMoodSelection.vue";
import FormAddFilmInRandom from "./FormAddFilmInRandom.vue";
const observe = ref<HTMLDivElement[] | null>(null);

const moodeForWheel = ref<"standard" | "takeoff" | "battle">("standard");
const wheelDuration = ref<string>("10");

const moode = (e: "standard" | "takeoff" | "battle"): void => {
  //emit
  moodeForWheel.value = e;
};

const wheel = (e: string): void => {
  //emit
  wheelDuration.value = e;
};

onMounted(() => featuresStore.commit("setRefItem", observe));
</script>

<style lang="scss" scoped>
.fortum-formSection {
  display: flex;
  justify-content: space-between;
  padding-top: 60px;
}
</style>
