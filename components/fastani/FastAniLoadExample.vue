<template>
  <v-btn
    :disabled="disabled"
    class="white--text"
    color="#5a6855"
    depressed
    small
    @click="loadExample"
  >
    <v-icon left>
      {{ loadExampleSvg }}
    </v-icon>
    load example
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";

import {mdiHandshake} from "@mdi/js";
import {FastAniAddGenomesFromUserInput, FastAniInputGroup, FastAniQueryRow} from "~/assets/models/fastani";
import {TaxonGenomesDetailRow} from "~/assets/api/taxon";

export default Vue.extend({

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
  },

  // Load the initial content to be baked into the page
  async asyncData({$api}) {
    const rows: FastAniQueryRow[] = [];
    $api.taxon.getTaxonGenomesDetail('g__Escherichia', true).then(resp => {
      for (let i = 0; i < resp.data.rows.length; i++) {
        const curItem: TaxonGenomesDetailRow = resp.data.rows[i];
        rows.push({
          name: curItem.gid,
          isRep: curItem.gtdbIsRep,
          domain: curItem.gtdbDomain,
          phylum: curItem.gtdbPhylum,
          class: curItem.gtdbClass,
          order: curItem.gtdbOrder,
          family: curItem.gtdbFamily,
          genus: curItem.gtdbGenus,
          species: curItem.gtdbSpecies
        })
      }
    })

    const out: FastAniAddGenomesFromUserInput = {
      genomes: rows,
      group: FastAniInputGroup.both
    }

    // Merge with data
    return {
      out
    }
  },

  data: () => ({
    // Icons
    loadExampleSvg: mdiHandshake,

    // Payload
    rows: null as null | FastAniAddGenomesFromUserInput,
  }),

  methods: {
    // Return the example data
    loadExample() {
      this.$emit('input', this.rows)
    }
  }
})
</script>

<style scoped>

</style>
