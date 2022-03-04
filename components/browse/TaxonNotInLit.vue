<template>
  <v-tooltip right>
    <template v-slot:activator="{ on, attrs }">
      <v-chip
        color="#efefef"
        text-color="black"
        style="padding-left: 4px; padding-right: 5px;"
        v-bind="attrs"
        x-small
        v-on="on"
      >
        #
      </v-chip>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>

</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    tooltip: {
      type: String,
      required: true
    },
  },
})
</script>

<style scoped>

</style>
