<template>
  <div ref="container" class="fill-height w-100">
    <template v-if="isLoaded">
      <a
        class="twitter-timeline"
        data-tweet-limit="10"
        href="https://twitter.com/ace_gtdb?ref_src=twsrc%5Etfw"
      >
      </a>
    </template>
    <template v-else>
      <v-skeleton-loader
        class="mx-auto"
        type="card"
      ></v-skeleton-loader>
    </template>
    <script src="https://platform.twitter.com/widgets.js" async></script>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    isLoaded: false,
  }),
  mounted() {
    // const script = document.createElement('script')
    // script.onload = () => {
    //   this.isLoaded = true
    // }
    // script.async = true
    // script.src = 'https://platform.twitter.com/widgets.js'
    // document.head.appendChild(script)
    this.isLoaded = true;
  },
})
</script>

<style scoped>
</style>
