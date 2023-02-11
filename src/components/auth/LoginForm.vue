<template>
  <div class="wrap-box">
    <span class="login-form-title"> Account Login </span>
    <form class="login-form" data-form>
      <div class="wrap-input" data-validate="Enter username">
        <input
          class="input"
          type="email"
          name="username"
          placeholder="User email"
        />
        <span class="focus-input" data-placeholder="&#xe82a;"></span>
      </div>

      <div class="wrap-input" data-validate="Enter password">
        <input
          class="input"
          type="password"
          name="pass"
          placeholder="Password"
        />
        <span class="focus-input" data-placeholder="&#xe80f;"></span>
      </div>

      <div class="container-login-form-btn">
        <button class="login-form-btn" type="submit">Login</button>
        <router-link
          :to="{ name: 'AuthSignup' }"
          class="login-form-btn reg"
          type="button"
          >Create account</router-link
        >
        <router-link :to="{ name: 'Home' }" class="homeBtnLink">
          <svg width="46px" height="46px">
            <use href="../../assets/sprite.svg#icon-home"></use>
          </svg>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/auth";
</style>