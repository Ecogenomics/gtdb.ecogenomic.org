<template>
  <v-card class="mx-1" dense outlined
  >
    <v-card-title class="cardTitle pt-1 pb-4">
      <v-row  no-gutters class="justify-center w-100">
        {{ title }}
      </v-row>

      <v-row no-gutters class="mt-1">
        <v-col class="justify-center d-flex">
          <FastAniQueryAddFromTaxon @update="addGenomesFromUserInput"/>
        </v-col>
        <v-col  class="justify-center d-flex">
          <FastAniQueryAddFromText @update="addGenomesFromUserInput"/>
        </v-col>
        <v-col  class="justify-center d-flex">
          <v-btn
            class="white--text"
            color="#b36c6c"
            depressed
            small
            @click="deleteSelected"
            :disabled="deleteSelectedDisabled"
          >
            <v-icon>
              {{ mdiDeleteSvg }}
            </v-icon>
            Delete selected
          </v-btn>
        </v-col>
      </v-row>

    </v-card-title>

    <v-card-text>

      <!-- Actions for modifying the table -->


      <!-- The table itself -->
        <v-data-table
          v-model="selected"
          class="mt-2"
          :headers="headers"
          :items="value"
          dense
          item-key="name"
          show-select
        >
          <template v-slot:item.name="{ item }">
            <template v-if="item.domain === null">
              <a :href="`https://www.ncbi.nlm.nih.gov/datasets/genome/${item.name}/`" target="_blank">{{ item.name }}</a>
            </template>
            <template v-else>
              <a :href="`/genome?gid=${item.name}`" target="_blank">{{ item.name }}</a>
            </template>
          </template>
          <template v-slot:item.taxonomy="{ item }">
            {{ formatTaxonomyForRow(item) }}
          </template>
          <template v-slot:item.isRep="{ item }">
            <template v-if="item.isRep === true">
              True
            </template>
            <template v-else-if="item.isRep === false">
              False
            </template>
            <template v-else>
              N/A
            </template>
          </template>
        </v-data-table>

    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";

import TaxonSearchAutocomplete from "~/components/shared/TaxonSearchAutocomplete.vue";
import FastAniQueryParameters from "~/components/fastani/FastAniQueryParameters.vue";
import FastAniPriorityQueue from "~/components/fastani/FastAniPriorityQueue.vue";
import {FastAniQueryRow} from "~/assets/models/fastani";
import {isDefined} from "~/assets/ts/common";
import FastAniQueryAddFromTaxon from "~/components/fastani/query/FastAniQueryAddFromTaxon.vue";
import FastAniQueryAddFromText from "~/components/fastani/query/FastAniQueryAddFromText.vue";
import {mdiDelete} from "@mdi/js";

export default Vue.extend({
  components: {
    FastAniQueryAddFromText,
    FastAniQueryAddFromTaxon, FastAniPriorityQueue, FastAniQueryParameters, TaxonSearchAutocomplete
  },

  props: {
    title: {
      type: String
    },
    value: {
      type: [] as PropType<FastAniQueryRow[]>,
      default: []
    },
  },

  watch: {
    value: {
      handler: function (newVal: FastAniQueryRow[]) {
        this.computeCommonRank(newVal);
      },
      immediate: true
    }
  },

  computed: {
    deleteSelectedDisabled(): boolean {
      return this.selected.length === 0;
    }
  },


  data: () => ({

    // Icons
    mdiDeleteSvg: mdiDelete,

    // Data
    commonRank: 'k',

    // Table
    selected: [] as FastAniQueryRow[],
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
    addGenomesFromUserInput(input: FastAniQueryRow[]) {
      // Merge the new genomes with the existing ones
      const seenGids = new Set();
      const out: FastAniQueryRow[] = [];
      for (const genome of input) {
        if (!seenGids.has(genome.name)) {
          out.push(genome);
          seenGids.add(genome.name);
        }
      }
      for (const genome of this.value) {
        if (!seenGids.has(genome.name)) {
          out.push(genome);
          seenGids.add(genome.name);
        }
      }
      this.computeCommonRank(out);
      this.$emit('input', out)
    },

    // Remove the selected genomes from the model
    deleteSelected() {
      const newGenomes: FastAniQueryRow[] = [];
      const selectedSet = new Set();
      for (const selected of this.selected) {
        selectedSet.add(selected.name);
      }
      for (const genome of this.value) {
        if (!selectedSet.has(genome.name)) {
          newGenomes.push(genome);
        }
      }
      this.$emit('input', newGenomes)
    },

    // Format the taxonomy for a row to be displayed in the table
    formatTaxonomyForRow(row: FastAniQueryRow): string {
      // If there are no data, then we don't have this in the current release
      if (!isDefined(row.domain)) {
        return "N/A";
      }

      // Otherwise, shorten the taxonomy to the most common higher rank
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
    computeCommonRank(input: FastAniQueryRow[]) {

      console.log('computing common rank')

      const seenD = new Set<string>();
      const seenP = new Set<string>();
      const seenC = new Set<string>();
      const seenO = new Set<string>();
      const seenF = new Set<string>();
      const seenG = new Set<string>();
      const seenS = new Set<string>();

      for (const row of input) {
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
.cardTitle {
  font-size: 18px;
  background-color: #e0e0e0;
}
</style>
