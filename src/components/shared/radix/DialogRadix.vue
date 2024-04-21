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

const getModalState = () => { emit('getModalState', open.value);};
const emit = defineEmits<{getModalState:[open: boolean] }>();

const backgroundImg = ref<string>(props.backgroundImg);



watch(open, () => getModalState());
onMounted(() => {
  backgroundImg.value = props.backgroundImg;
  console.log(backgroundImg.value);
});
</script>

<style lang="scss" scoped>
.DialogOverlay {
  background-position: center;
  background-size: cover;
  z-index: 1;
  position: fixed;
  inset: 0;
  animation: overlayShow 3s cubic-bezier(0.16, 1, 0.3, 1),
    overlayScale 3s cubic-bezier(0.16, 1, 0.3, 1) 349ms;
}

@keyframes overlayShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes overlayScale {
  0% {
    scale: 1.5;
  }
  50% {
    scale: 2;
  }
  75% {
    scale: 2.5;
  }
  100% {
    scale: 1;
  }
}
</style>
