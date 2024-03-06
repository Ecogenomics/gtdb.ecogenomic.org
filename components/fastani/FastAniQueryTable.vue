<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="rows"
    dense
    item-key="name"
    show-select
  >
    <template v-slot:top>
      <v-row no-gutters>
        <v-spacer></v-spacer>
        <v-btn
          small
          @click="deleteSelected"
        >
          Delete selected
        </v-btn>
      </v-row>
    </template>
    <template v-slot:item.taxonomy="{ item }">
      {{ formatTaxonomyForRow(item) }}
    </template>
    <template v-slot:item.isRep="{ item }">
      <template v-if="item.isRep">
        True
      </template>
      <template v-else>
        False
      </template>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";

import TaxonSearchAutocomplete from "~/components/shared/TaxonSearchAutocomplete.vue";
import FastAniQueryParameters from "~/components/fastani/FastAniQueryParameters.vue";
import FastAniPriorityQueue from "~/components/fastani/FastAniPriorityQueue.vue";
import {FastAniQueryRow} from "~/assets/models/fastani";
import {isDefined} from "~/assets/ts/common";

export default Vue.extend({
  components: {FastAniPriorityQueue, FastAniQueryParameters, TaxonSearchAutocomplete},

  props: {
    rows: {
      type: [] as PropType<FastAniQueryRow[]>,
      default: []
    },
  },


  watch: {
    rows(after, before) {
      console.log('rows changed', after, before)
      if (isDefined(after) && after.length > 0) {
        this.computeCommonRank()
      }
    }
  },

  computed: {},


  data: () => ({

    // Icons

    // Data
    commonRank: 'k',

    // Table
    selected: [],
    headers: [
      {
        'text': 'Accession',
        'value': 'name'
      },
      {
        'text': 'Taxonomy',
        'value': 'taxonomy'
      },
      {
        'text': 'sp. Rep',
        'value': 'isRep'
      }
    ]


  }),


  methods: {
    deleteSelected() {
      this.$emit('input', this.selected)
    },

    formatTaxonomyForRow(row: FastAniQueryRow): string {
      if (this.commonRank === "s") {
        return `${row.species}`;
      } else if (this.commonRank === "g") {
        return `${row.species}`
      } else if (this.commonRank == "f") {
        return `${row.genus}; ${row.species}`
      } else if (this.commonRank == "o") {
        return `${row.family}; ${row.genus}; ${row.species}`
      } else if (this.commonRank == "c") {
        return `${row.order}; ${row.family}; ${row.genus}; ${row.species}`
      } else if (this.commonRank == "p") {
        return `${row.class}; ${row.order}; ${row.family}; ${row.genus}; ${row.species}`
      } else if (this.commonRank == "d") {
        return `${row.phylum}; ${row.class}; ${row.order}; ${row.family}; ${row.genus}; ${row.species}`
      } else {
        return `${row.domain}; ${row.phylum}; ${row.class}; ${row.order}; ${row.family}; ${row.genus}; ${row.species}`
      }
    },


    // Identifies the highest rank common to all selected genomes
    computeCommonRank() {

      console.log('computing common rank')

      const seenD = new Set<string>();
      const seenP = new Set<string>();
      const seenC = new Set<string>();
      const seenO = new Set<string>();
      const seenF = new Set<string>();
      const seenG = new Set<string>();
      const seenS = new Set<string>();

      for (const row of this.rows) {
        if (isDefined(row.domain) && seenD.size < 2) {
          // @ts-ignore
          seenD.add(row.domain);
        }
        if (isDefined(row.phylum) && seenP.size < 2) {
          // @ts-ignore
          seenP.add(row.phylum);
        }
        if (isDefined(row.class) && seenC.size < 2) {
          // @ts-ignore
          seenC.add(row.class);
        }
        if (isDefined(row.order) && seenO.size < 2) {
          // @ts-ignore
          seenO.add(row.order);
        }
        if (isDefined(row.family) && seenF.size < 2) {
          // @ts-ignore
          seenF.add(row.family);
        }
        if (isDefined(row.genus) && seenG.size < 2) {
          // @ts-ignore
          seenG.add(row.genus);
        }
        if (isDefined(row.species) && seenS.size < 2) {
          // @ts-ignore
          seenS.add(row.species);
        }
      }

      if (seenS.size === 1) {
        this.commonRank = 's';
      } else if (seenG.size === 1) {
        this.commonRank = 'g';
      } else if (seenF.size === 1) {
        this.commonRank = 'f';
      } else if (seenO.size === 1) {
        this.commonRank = 'o';
      } else if (seenC.size === 1) {
        this.commonRank = 'c';
      } else if (seenP.size === 1) {
        this.commonRank = 'p';
      } else if (seenD.size === 1) {
        this.commonRank = 'd';
      } else {
        this.commonRank = 'k';
      }
    }

  },


})
</script>

<style scoped>

</style>
