<template>
  <a href="https://www.arc.gov.au/" target="_blank">
    <div class="logo">
    </div>
  </a>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
})
</script>

<style scoped>
.logo {
  background: url("~/assets/images/logos/arc.svg") no-repeat top left;
  width: 100%;
  height: 100%;
  background-size: contain;
  transition: all 0.1s ease-in;
}

.logo:hover {
  opacity: 0.3;
}
</style>
