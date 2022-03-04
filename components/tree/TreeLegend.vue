<template>
  <div class="treeLegend rounded-lg" style="font-size: 12px;">
    <v-row class="rounded" no-gutters>
      <b>Legend</b>
    </v-row>
    <v-row class="mt-1" no-gutters>
      <v-col cols="1">
        <div class="genomeTypeSpeciesOfGenus rounded" style="width: 100%; height: 100%"></div>
      </v-col>
      <v-col class="ml-2">Type species of genus</v-col>
    </v-row>
    <v-row class="mt-1" no-gutters>
      <v-col cols="1">
        <div class="genomeTypeStrainOfSpecies rounded" style="width: 100%; height: 100%"></div>
      </v-col>
      <v-col class="ml-2">Type strain of species</v-col>
    </v-row>
    <v-row class="mt-1" no-gutters>
      <v-col cols="1">
        <div class="genomeTypeStrainOfSubSpecies rounded" style="width: 100%; height: 100%"></div>
      </v-col>
      <v-col class="ml-2">Type strain of subspecies</v-col>
    </v-row>
    <v-row class="mt-1" no-gutters>
      <v-col class="text-center" cols="1">*</v-col>
      <v-col class="ml-2">GTDB species representative</v-col>
    </v-row>
    <v-row class="mt-1" no-gutters>
      <v-col class="text-center" cols="1">#</v-col>
      <v-col class="ml-2">GTDB proposed name</v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style scoped>
.genomeTypeSpeciesOfGenus {
  background-color: #e8c0bb;
}

.genomeTypeStrainOfSpecies {
  background-color: #e7dbc5;
}

.genomeTypeStrainOfSubSpecies {
  background-color: #d0e0e5;
}

.treeLegend {
  background-color: #f5f5f5;
  border-color: #e1e1e1;
  border-style: solid;
  border-width: 1px;
}
</style>
