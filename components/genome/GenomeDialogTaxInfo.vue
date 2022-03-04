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
          Taxonomic Information
        </v-card-title>

        <v-card-text>
          <div class="pt-3">

            d__ = Domain<br>
            p__ = Phylum<br>
            c__ = Class<br>
            o__ = Order<br>
            f__ = Family<br>
            g__ = Genus<br>
            s__ = Species<br>
            st__ = Strain<br>
            x__ = No rank<br>
            <br>
            The NCBI taxonomy is as described in the current RefSeq release used by GTDB, which may not be the latest
            RefSeq release available at the NCBI website.
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
