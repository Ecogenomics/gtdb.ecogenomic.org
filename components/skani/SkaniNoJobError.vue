<template>
  <v-card
    class="mx-auto mt-5"
    max-width="900px"
    outlined
  >
    <v-card-title>
      Job not found
    </v-card-title>
    <v-card-text>
      Either no job with this ID exists, or you did not provide a job ID. Please go back to the
      <nuxt-link to="/tools/skani">query page</nuxt-link>
      and submit a new job.
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style scoped>
</style>
