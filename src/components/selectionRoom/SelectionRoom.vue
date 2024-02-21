<template>
  <ContainerMain>
    <!-- <div ref="observe">Test</div> -->
    <WheelOfFortune />
  </ContainerMain>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { featuresStore } from "../../store/storeForFeatures";
import ContainerMain from "../shared/ContainerMain.vue";
import WheelOfFortune from "./WheelOfFortune.vue";
const observe = ref<HTMLDivElement[] | null>(null);

onMounted(() => featuresStore.commit("setRefItem", observe));
</script>
