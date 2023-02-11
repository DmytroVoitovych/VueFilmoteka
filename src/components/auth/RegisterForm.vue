<template>
  <div>
    <span class="login-form-title"> Registration </span>
    <form class="login-form" data-registr>
      <div class="wrap-input" data-validate="Enter username">
        <input
          class="input"
          type="text"
          name="username"
          placeholder="User name"
        />
        <span class="focus-input" data-placeholder="&#xe82a;"></span>
      </div>

      <div class="wrap-input" data-validate="Enter email">
        <input
          class="input"
          type="email"
          name="email"
          placeholder="User email"
        />
        <span class="focus-input" data-placeholder="&#xe82a;"></span>
      </div>

      <div class="wrap-input" data-validate="Enter password">
        <input
          class="input"
          type="password"
          name="passReg"
          placeholder="Password"
        />
        <span class="focus-input" data-placeholder="&#xe80f;"></span>
      </div>

      <div class="container-login-form-btn">
        <button class="login-form-btn" type="submit">Registration</button>
      </div>
      <router-link
        :to="{ name: 'AuthLogin' }"
        class="form-btn-center"
        type="button"
      >
        <svg width="46px" height="46px" class="formArrow">
          <use href="../../assets/sprite.svg#icon-backbutton"></use>
        </svg>
      </router-link>
    </form>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
/* @import "../../assets/scss/fonts"; */
@import "../../assets/scss/auth";

.form-btn-center {
  display: block;
  margin-top: 12px;
  text-align: center;
}

.formArrow {
  fill: #d41889;
  animation: pulse 2s infinite;
  border-radius: 22px;
}

.formArrow:hover {
  fill: #555555;
}

@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(204, 44, 161, 0.4);
    box-shadow: 0 0 0 0 rgba(204, 44, 60, 0.4);
  }

  70% {
    -moz-box-shadow: 0 0 0 10px rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 10px rgba(204, 44, 153, 0);
  }

  100% {
    -moz-box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 0 rgba(204, 44, 167, 0);
  }
}
</style>