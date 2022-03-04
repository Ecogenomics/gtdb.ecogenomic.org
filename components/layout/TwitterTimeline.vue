<template>
  <div class="fill-height w-100">
    <v-skeleton-loader
      v-if="!isLoaded"
      class="mx-auto"
      type="card"
    ></v-skeleton-loader>
    <a
      class="twitter-timeline"
      data-height="100%"
      data-width="100%"
      href="https://twitter.com/ace_gtdb?ref_src=twsrc%5Etfw"
    >
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    isLoaded: false,
  }),
  mounted() {
    const script = document.createElement('script')
    script.onload = () => {
      this.isLoaded = true
    }
    script.async = true
    script.src = 'https://platform.twitter.com/widgets.js'
    document.head.appendChild(script)
  }
})
</script>

<style scoped>
</style>
