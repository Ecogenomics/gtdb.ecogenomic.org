<template>
  <a href="https://www.en.aau.dk/" target="_blank">
    <div class="logo"></div>
  </a>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: "AAULogo"
})
</script>

<style scoped>
.logo {
  background: url("~/assets/images/aau-logo-left-white-denmark.svg") no-repeat top center;
  width: 100%;
  height: 100%;
  background-size: contain;
  transition: all 0.1s ease-in;
}

.logo:hover {
  opacity: 0.3;
}
</style>
