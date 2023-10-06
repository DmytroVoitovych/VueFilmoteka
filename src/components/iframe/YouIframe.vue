<template>
  <div>
    <VueYtframe
      :player-vars="playerVars"
      :videoId="getOfficialTreiler ?? video[0]?.key"
      ref="yt"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props { video: [] | {[key:string]:string}[], playerVars: { autoplay: number, listType: string }  };
const props = withDefaults(defineProps<Props>(), { video:()=> [], playerVars: () => ({ autoplay: 0, listType: 'user_uploads' }) });
const yt = ref<any>(null);

const exitFrame = ()=>yt?.value?.stopVideo();
const runFrame =  ()=>yt?.value?.playVideo();

defineExpose({  // даю доступ батьківському компоненту
  runFrame,
  exitFrame
});

const treiler: string | undefined = props.video.slice().reverse().find(e => e.official)?.key;
const getOfficialTreiler = computed<string | undefined>(() => treiler);

</script>

<style lang="scss" scoped></style>
