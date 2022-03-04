<template>
  <v-tooltip bottom max-width="400px">
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        small
        v-bind="attrs"
        v-on="on"
      >
        {{ mdiHelpCircleSvg }}
      </v-icon>
    </template>
    <span>likely source of genome sequence, may contain errors, please notify if error detected</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue';
import {mdiHelpCircle} from "@mdi/js";

export default Vue.extend({
  data: () => ({
    mdiHelpCircleSvg: mdiHelpCircle,
  }),
})
</script>

<style scoped>
</style>
