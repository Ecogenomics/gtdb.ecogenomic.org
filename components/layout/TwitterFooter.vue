<template>
  <div class="twitter-footer d-flex fill-height justify-center align-center">
    <a href="https://twitter.com/ace_gtdb" target="_blank" class="no-link">

      <v-icon color="#1D9BF0">
        {{ mdiTwitterSvg }}
      </v-icon>
    <span class="ml-1">
      @ace-gtdb
    </span>
    </a>
  </div>
</template>

<script lang="ts">
import {mdiTwitter} from '@mdi/js';
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    mdiTwitterSvg: mdiTwitter,
  }),
})
</script>

<style scoped>
.twitter-footer {
  background-color: #1E1E1E;
  color: #b7b7b7;
}

.no-link {
  color: #b7b7b7;
  text-decoration: none;
}
</style>
