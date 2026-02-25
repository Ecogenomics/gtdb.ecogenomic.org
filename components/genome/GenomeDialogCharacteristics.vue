<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      max-width="700"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="#2d8a2d"
          icon
          v-bind="attrs"
          x-small
          v-on="on"
        >
          <v-icon>
            {{ mdiHelpCircleSvg }}
          </v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          CheckM Information
        </v-card-title>

        <v-card-text>
          <div class="pt-3">
            CheckM provides a set of tools for assessing the quality of genomes recovered from isolates, single cells,
            or metagenomes. It provides robust estimates of genome completeness and contamination by using collocated
            sets of genes that are ubiquitous and single-copy within a phylogenetic lineage. <br>
            <br>Assessment of genome
            quality can also be examined using plots depicting key genomic characteristics (e.g., GC, coding density)
            which highlight sequences outside the expected distributions of a typical genome. <br>
            <br>
            CheckM also provides tools
            for identifying genome bins that are likely candidates for merging based on marker set compatibility,
            similarity in genomic characteristics, and proximity within a reference genome tree.
            <br>
            <br>
            Genome Size is not corrected for completeness estimates and is simply the sum of the contig sizes.
            <br>
            <br>
            For more information, please check the <a href="https://github.com/Ecogenomics/CheckM/wiki" target="_blank">CheckM
            Wiki</a> page.
          </div>
        </v-card-text>

      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mdiHelpCircle} from "@mdi/js";

export default Vue.extend({
  data: () => ({
    mdiHelpCircleSvg: mdiHelpCircle,
    dialog: false
  }),
})
</script>

<style scoped>
</style>
