<template>
  <ContainerMain>
    <!-- <div ref="observe">Test</div> -->
    <section class="fortum-formSection">
      <FormMoodSelection @moode="moode" @duration="wheel" />
      <FormAddFilmInRandom ref="dataForUlList" />
    </section>
    <section class="fortum-wheelSection">
      <WheelOfFortune
        :moode="moodeForWheel"
        :duration="wheelDuration"
        :userFilms="userFilms"
      />
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
import type { UllistProp } from "./localType";
import { computed } from "vue";

const observe = ref<HTMLDivElement[] | null>(null);
type ExposeFromAddType = { transformDataForUlList: UllistProp[] };

const moodeForWheel = ref<"standard" | "takeoff" | "battle">("standard");
const wheelDuration = ref<string>("10");
const dataForUlList = ref<ExposeFromAddType | []>([]);

const userFilms = computed<UllistProp[] | []>(
  () => (dataForUlList.value as ExposeFromAddType)?.transformDataForUlList ?? []
);

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
