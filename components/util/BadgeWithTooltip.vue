<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-chip
        :color="colour"
        text-color="white"
        style="margin-left: 2px; margin-right: 2px; padding-left: 6px; padding-right: 6px;"
        v-bind="attrs"
        v-on="on"
      >
        {{ text }}
      </v-chip>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>

</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    text: {
      type: String,
      required: true
    },
    tooltip: {
      type: String,
      required: true
    },
    colour: {
      type: String,
      required: true
    },
  },
})
</script>

<style scoped>

</style>
