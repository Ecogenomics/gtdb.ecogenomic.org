<template>
  <div class="rounded d-inline-block pa-2">
    <div class="d-flex">
      <v-avatar
        class="profile mx-auto"
        size="80"
      >
        <slot name="image"></slot>
      </v-avatar>
    </div>
    <div class="d-flex">
      <div class="d-flex mx-auto">
        <slot name="name"></slot>
      </div>
    </div>
    <div class="d-flex">
      <div class="d-flex mx-auto">
        <slot name="affiliation"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
})
</script>

<style scoped>
</style>
