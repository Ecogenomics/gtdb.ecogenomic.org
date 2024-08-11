<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    class="gtdb-table"
    dense
    item-key="taxon"
  >
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue';


export default Vue.extend({
  props: {
    rows: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      headers: [
        {text: 'Phylum', value: 'taxon'},
        {text: 'Scaled (%)', value: 'scaled'},
        {text: 'Unscaled (%)', value: 'unscaled'},
        {text: 'Abs. difference', value: 'abs'}
      ]
    }
  }
})
</script>

<style scoped>
</style>
