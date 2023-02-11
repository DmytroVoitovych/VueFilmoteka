<template>
  <div class="limiter">
    <div class="authBackground">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthPage",
};
</script>

<style lang="scss" scoped>
.limiter {
  width: 100%;
  margin: 0 auto;

  @include mq(mobile-only) {
    overflow: hidden;
  }
}

.authBackground {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-image: url("../assets/images/auth/bg-01.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: relative;
  z-index: 1;

  &:before {
    content: "";
    z-index: -1;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.65);
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>