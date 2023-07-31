<template>
  <div>
    <VueYtframe
      :player-vars="playerVars"
      :videoId="getOfficialTreiler ?? video[0].key"
      ref="yt"
    />
  </div>
</template>

<script>
export default {
  props: {
    video: {
      type: Array,
    },
    playerVars: {
      type: Object,
      require: true,
      default() {
        return { autoplay: 0, listType: 'user_uploads' };
      },
    },
  },
  methods: {
    exitFrame() {
      this.$refs.yt.stopVideo();
    },
    runFrame() {
      this.$refs.yt.playVideo();
    },
  },
  mounted() {
    console.log(this.video);
    console.log(this.$refs.yt);
  },
  computed: {
    getOfficialTreiler() {
      return this.video.toReversed().find(e => e.official)?.key;
    },
  },
};
</script>

<style lang="scss" scoped></style>
