<template>
  <div>
    <div>
      Release {{ release }} statistics
    </div>
    <div class="text-subtitle-2">
      {{ date }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';


export default Vue.extend({
  props: {
    release: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  }
})
</script>

<style scoped>
</style>
