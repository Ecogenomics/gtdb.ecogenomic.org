<template>
  <v-tooltip open-delay="150" top transition="slide-x-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        color="white"
        style="cursor: pointer; max-width: 18px; max-height: 18px;"
        v-bind="attrs"
        v-on="on"
      >
        {{ mdiHelpCircleOutlineSvg }}
      </v-icon>
    </template>
    <span>{{ text }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue';
import {mdiHelpCircleOutline} from "@mdi/js";


export default Vue.extend({
  props: {
    text: String
  },
  data: () => ({
    mdiHelpCircleOutlineSvg: mdiHelpCircleOutline,
  }),
})
</script>

<style scoped>
</style>
