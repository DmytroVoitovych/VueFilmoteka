<template>
  <DialogRoot :defaultOpen="true"  v-model:open="open">
    <DialogPortal>
     <DialogOverlay
        class="DialogOverlay"
        :style="{ backgroundImage: props.backgroundImg }"
        
      />
     <DialogContent class="DialogContent">
      <DialogDescription>
      <DialogTitle><u><slot name="dialogDescription"></slot></u></DialogTitle> выбивает из колеса! Для продолжения нажмите в любом месте.
      </DialogDescription>
     </DialogContent>
     </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle
  
} from "radix-vue";
import {ref, watch } from "vue";
const open = ref<boolean>(true);
const props = defineProps<{
  backgroundImg: string,
  }>();

const getModalState = () => { open.value = false;setTimeout(()=> emit('getModalState', open.value),450);};
const emit = defineEmits<{getModalState:[open: boolean] }>();

watch(open, () => getModalState());

</script>

<style lang="scss" scoped>

@keyframes fadeIn {
  from {
    inset: 1000px;
    opacity: 1;
  }
  to {
    inset: 0;
    opacity: 0;
  }
}

@keyframes fadeOut {
  from {
    inset: 0;
    opacity: 0;
  }
  to {
    inset: 1000px;
    opacity: 1;
  }
}

.DialogOverlay[data-state="open"],
.DialogContent[data-state="open"] {
  animation: fadeIn 450ms ease-out;
}

.DialogOverlay[data-state="closed"],
.DialogContent[data-state="closed"] {
  animation: fadeOut 450ms ease-in;
}

.DialogOverlay {
  background-position: center;
  background-size: cover;
  z-index: 1;
  position: fixed;
  inset: 0;

  }

  .DialogContent{
    background-color: transparent;
    border-radius: 6px;
    box-shadow: hsla(206, 22%, 7%, 0.35) 0px 10px 38px -10px, hsla(206, 22%, 7%, 0.2) 0px 10px 20px -15px;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    width: 100vw;
    z-index: 1;
    text-align: center;
    font-size: 24px;
    backdrop-filter: brightness(0.5);
    padding: 0 15;


    u{
     text-decoration-skip-ink: none;
     color: var(--text-color-light-orange);
     filter: drop-shadow(2px 4px 6px black);
    }
  }


</style>
