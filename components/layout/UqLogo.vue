<template>
  <a href="https://www.uq.edu.au/" target="_blank">
    <div class="logo"></div>
  </a>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: "UqLogo"
})
</script>

<style scoped>
.logo {
  background: url("~/assets/images/uq-logo-white.svg") no-repeat top right;
  width: 100%;
  height: 100%;
  background-size: contain;
  transition: all 0.1s ease-in;
}

.logo:hover {
  opacity: 0.3;
}
</style>
