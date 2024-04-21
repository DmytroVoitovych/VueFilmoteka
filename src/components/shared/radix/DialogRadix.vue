<template>
  <DialogRoot :defaultOpen="true"  v-model:open="open">
    <DialogPortal>
    
      <DialogOverlay
        class="DialogOverlay"
        :style="{ backgroundImage: props.backgroundImg }"
        
      />
      
      <DialogContent>
        <DialogTitle />
        <DialogDescription />
        <DialogClose />
      </DialogContent>
     
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "radix-vue";
import { computed, onMounted, ref, watch } from "vue";
const open = ref<boolean>(true);
const props = defineProps<{ backgroundImg: string }>();

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


</style>
