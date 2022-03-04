<template>
    <v-dialog
      v-model="dialog"
      width="1000px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="#5a6855"
          depressed
          dark
          small
          v-bind="attrs"
          v-on="on"
        >
          Help
         <v-icon
         right
         >
           {{ helpCircleSvg}}
         </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Using the Taxon History</span>
        </v-card-title>
        <v-card-text>
          <p>This is a brief guide on how to interpret the Sankey plot using the search results
            for <b>p__Euryarchaeota</b> (<b>From: Release 86.2</b>, <b>To: NCBI</b>) as an
            illustrative example.</p>
          <br>

          <h4>Node Highlighting</h4>
          <p>If a node (i.e. the rectangle signifying the genomes at a
            particular release)
            is hovered over, then the trajectories will be highlighted for all genomes which were in
            that taxon at that release.</p>

          <img src="~/assets/images/taxon-history/node-highlighting.svg" alt="Taxon history node highlighting">

          <br><br><br>
          <h4>Link Highlighting</h4>
          <p>Similar to node highlighting, if a link (i.e. connects two nodes)
            is hovered
            over, then the trajectories will be highlighted for all genomes which are represented by
            that path.</p>

          <img src="~/assets/images/taxon-history/link-highlighting.svg" alt="Taxon history link highlighting">

          <p></p>
          <h4>Filtering Ranks</h4>
          <p>
            After entering a query rank (e.g.<b>p__Euryarchaeota</b>) a filter can be placed on the resulting taxa.
            The filter can use the set of taxa from the resulting query and look at how they have changed at higher, or
            lower ranks.
            <br><br>
            For example, after searching p__Euryarchaeota and applying the domain filter, we can see that each
            of the individual phyla have been grouped according to their domain. Note that p__Euryarchaeota belongs
            to d__Archaea, given that d__Bacteria is not a rank that describes p__Euryarchaeota it has been enclosed
            in square brackets (<b>[d__Bacteria]</b>).
          </p>

          <img src="~/assets/images/taxon-history/rank-filtering.png" alt="Taxon history rank filtering" style='height: 100%; width: 100%; object-fit: contain'>

        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import {mdiHelpCircle} from "@mdi/js";

export default Vue.extend({
  data: () => ({
    dialog: false,

    // Icons
    helpCircleSvg: mdiHelpCircle

  }),
})
</script>

<style scoped>

</style>
