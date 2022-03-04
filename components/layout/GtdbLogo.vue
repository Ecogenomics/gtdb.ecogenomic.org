<template>
  <NuxtLink to="/">
    <div class="gtdb-logo"></div>
  </NuxtLink>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({})
</script>

<style scoped>
.gtdb-logo {
  background-image: url("~/assets/images/gtdb-logo/gtdb-logo-thin.svg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  min-width: 75px;
  min-height: 40px;
}

.gtdb-logo:hover {
  background-image: url("~/assets/images/gtdb-logo/gtdb-logo-bold.svg");
}
</style>
