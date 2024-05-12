<template>
  <DialogRoot :defaultOpen="true" v-model:open="open">
    <DialogPortal>
     <DialogOverlay 
         v-for="film of props.battleFilm"
        class="DialogOverlayBattle"
        :style="{ backgroundImage: `url(${getPoster((film as FilmForWheel).poster_path)})` }"
     ><DialogTitle><u>{{(film as FilmForWheel).title}}</u></DialogTitle>
     <DialogClose as-child>
            <button
              class="dialogWheelBattleBtn"
              @click="()=>getModalFilm((film as FilmForWheel))"
            >
            select and continue with: {{ (film as FilmForWheel).title }}
            </button>
          </DialogClose>
      </DialogOverlay>
     </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import type { FilmForWheel } from "@/types/types";
import {

  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogClose
    
} from "radix-vue";
import { computed, onMounted, ref, watch } from "vue";

const open = ref<boolean>(true);
const props = defineProps<{
  battleFilm: FilmForWheel[] | object[],
  getPoster: Function 
}>();

const getModalFilm = (film:FilmForWheel) => {setTimeout(()=> emit('getModalFilm', film),450);};
const emit = defineEmits<{ getModalFilm: [film:FilmForWheel] }>();

watch(open, (n) => !n && props.battleFilm.length === 2 && (open.value = true) );

onMounted(() => {
  console.log(props.battleFilm, 'battle');
});
</script>

<style lang="scss" scoped>
.DialogOverlayBattle{
  background-position: center;
  background-size: cover;
  z-index: 1;
  position: fixed;
  inset: 0;
  width: 50vw;
  margin-right: 50%;
  text-align: center;


  & h2{
      text-decoration-skip-ink: none;
     color: var(--text-color-light-orange);
     filter: drop-shadow(2px 4px 6px black);
  }

  }

  .DialogOverlayBattle:last-child{
  
  margin-left: 50%;
  

  }

  .dialogWheelBattleBtn{
    
  padding: 16px 56px;
  border-radius: 5px;
  background: linear-gradient(0deg, rgb(255, 151, 0) 0%, rgb(251, 75, 2) 100%);
  color: var(--text-color-light);
  border: none;
  margin-top: 100%;
  }
  
</style>