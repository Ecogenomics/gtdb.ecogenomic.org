<template>
  <div ref="container" class="w-100 fill-height">
    <a
      class="twitter-timeline"
      data-tweet-limit="10"
      href="https://twitter.com/ace_gtdb?ref_src=twsrc%5Etfw"
    >
    </a>
    <!--    <template v-if="isLoaded">-->
    <!--      <a-->
    <!--        class="twitter-timeline"-->
    <!--        data-tweet-limit="10"-->
    <!--        href="https://twitter.com/ace_gtdb?ref_src=twsrc%5Etfw"-->
    <!--      >-->
    <!--      </a>-->
    <!--    </template>-->
    <template v-if="!isLoaded">
      <div class="w-100 fill-height">
        <div class="twitterHeader">Tweets from @ace_gtdb</div>
        <div>
          <v-skeleton-loader
            class="mx-auto"
            type="article"
          ></v-skeleton-loader>
          <v-skeleton-loader
            class="mx-auto"
            type="article"
          ></v-skeleton-loader>
          <v-skeleton-loader
            class="mx-auto"
            type="article"
          ></v-skeleton-loader>
          <v-skeleton-loader
            class="mx-auto"
            type="article"
          ></v-skeleton-loader>
          <v-skeleton-loader
            class="mx-auto"
            type="article"
          ></v-skeleton-loader>
          <v-skeleton-loader
            class="mx-auto"
            type="article"
          ></v-skeleton-loader>
          <v-skeleton-loader
            class="mx-auto"
            type="article"
          ></v-skeleton-loader>
        </div>
      </div>
    </template>
    <script async src="https://platform.twitter.com/widgets.js"></script>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {sleep} from "~/assets/ts/common";

export default Vue.extend({
  data: () => ({
    isLoaded: false,
  }),
  mounted() {
    sleep(3000).then(() => {
      this.isLoaded = true;
    })
  },
})
</script>

<style scoped>
.twitterHeader {
  font-family: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  padding: 12px;
  border-bottom-color: rgb(207, 217, 222);
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
</style>
