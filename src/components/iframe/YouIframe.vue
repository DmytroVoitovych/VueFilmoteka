<template>
  <div>
    <VueYtframe
      :player-vars="playerVars"
      :videoId="getOfficialTreiler ?? video[0].key"
      ref="yt"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';


interface Props { video: [] | string[], playerVars: { autoplay: number, listType: string }  };
const props = withDefaults(defineProps<Props>(), { video:()=> [], playerVars: () => ({ autoplay: 0, listType: 'user_uploads' }) });
const yt = ref<any>(null);

// console.log(yt?._value ,'yt');
const exitFrame = ()=>yt?.value?.stopVideo();
const runFrame =  ()=>yt?.value?.playVideo();

defineExpose({
  runFrame,
  exitFrame
});
  // computed: {
  //   getOfficialTreiler() {
  //     return this.video.toReversed().find(e => e.official)?.key;
  //   },
  // },

</script>

<style lang="scss" scoped></style>
