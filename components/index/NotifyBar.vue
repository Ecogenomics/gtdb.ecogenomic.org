<template>
  <div class="notifyBar body-2 text-center py-1">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({})
</script>

<style scoped>
.notifyBar {
  background-color: #2d522d;
  color: #FFFFFF;
  font-weight: 400;
  border-bottom: #4E794E 1px solid
}

.notifyBar:hover {
  background-color: #386438;
  transition: 0.3s;
}

a {
  color: #9adc9a;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
