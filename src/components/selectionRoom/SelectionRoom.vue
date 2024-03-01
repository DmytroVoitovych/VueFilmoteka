<template>
  <ContainerMain>
    <!-- <div ref="observe">Test</div> -->
    <section class="fortum-formSection">
    <FormMoodSelection/>
    <FormAddFilmInRandom/>
    </section>
    <WheelOfFortune />
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

onMounted(() => featuresStore.commit("setRefItem", observe));
</script>

<style lang="scss" scoped>
.fortum-formSection{
  display: flex;
  justify-content: space-between;
  padding-top: 60px;

}

</style>