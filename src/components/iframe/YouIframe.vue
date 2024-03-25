<template>
  <div>
    <VueYtframe
      :player-vars="
        Object.assign(playerVars, { playlist: getOfficialTreiler ?? video[0]?.key })
      "
      :videoId="getOfficialTreiler ?? video[0]?.key"
      ref="yt"
      @playing="backgroundMute"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

interface Props {
  video: [] | { [key: string]: string }[];
  playerVars: { autoplay: number; listType: string; controls?: number; loop?: number };
}
const props = withDefaults(defineProps<Props>(), {
  video: () => [],
  playerVars: () => ({ autoplay: 0, listType: "user_uploads", controls: 1, loop: 0 }),
});

const yt = ref<HTMLDivElement | any>(null); // звернути увагу на вимушену міру так як не можу зробити експоз
console.log(props.playerVars);
const exitFrame = () => yt?.value?.stopVideo();
const runFrame = () => yt?.value?.playVideo();
const muteVideo = () => yt?.value?.mute();

defineExpose({
  // даю доступ батьківському компоненту
  muteVideo,
  runFrame,
  exitFrame,
});

const treiler: string | undefined = props.video
  .slice()
  .reverse()
  .find((e) => e.official)?.key;
const getOfficialTreiler = computed<string | undefined>(() => treiler);

const backgroundMute = (e: any) => {
  e.g.parentNode.className === "iframe__backgrounnd" && muteVideo();
};
</script>

<style lang="scss" scoped></style>
