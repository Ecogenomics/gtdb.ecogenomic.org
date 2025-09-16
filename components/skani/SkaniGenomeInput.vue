<template>
  <v-card outlined>
    <v-card-title class="cardTitle pt-1 pb-4">

      <v-row class="justify-center w-100" no-gutters>
        {{ title }}
      </v-row>

      <v-row class="mt-1" no-gutters>
        <v-col class="justify-center d-flex">
          <SkaniAddGenomesFromTaxon
              :disabled="disabled"
              @update="addGenomesFromUserInput"
          />
        </v-col>
        <v-col class="justify-center d-flex">
          <SkaniAddGenomesFromText
              :disabled="disabled"
              @update="addGenomesFromUserInput"
          />
        </v-col>
        <v-col class="justify-center d-flex">
          <SkaniAddGenomesFromUpload
              v-if="allowUpload"
              :disabled="disabled"
              :server-config="serverConfig"
              @update="addGenomesFromFileUpload"
          />
        </v-col>
        <v-col class="justify-center d-flex">
          <v-btn
              :disabled="deleteSelectedDisabled || disabled"
              class="white--text"
              color="#b36c6c"
              depressed
              small
              @click="deleteSelected"
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

      <!-- The table itself -->
      <v-data-table
          v-model="selected"
          :headers="headers"
          :items="value"
          class="mt-2"
          dense
          item-key="name"
          show-select
      >
        <template v-slot:item.name="{ item }">
          <template v-if="item.isUser === true">
            {{ item.name }}
          </template>
          <template v-else-if="item.domain === null">
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
import Vue, {PropType} from 'vue'
import {mdiChartScatterPlotHexbin, mdiDelete, mdiMagnify, mdiTable} from "@mdi/js";
import {SkaniServerConfig} from "~/assets/api/skani";
import {SkaniTableRow} from "~/assets/ts/skani";
import {SkaniAddGenomesFromUploadOutput} from "~/components/skani/SkaniAddGenomesFromUpload.vue";


export default Vue.extend({

  components: {},

  props: {
    title: {
      type: String
    },
    value: {
      type: [] as PropType<SkaniTableRow[]>,
      default: []
    },
    allowUpload: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
    serverConfig: Object as PropType<SkaniServerConfig | null>
  },

  watch: {
    value: {
      handler: function (newVal: SkaniTableRow[]) {
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
    mdiMagnifySvg: mdiMagnify,
    mdiTableSvg: mdiTable,
    mdiChartScatterPlotHexbinSvg: mdiChartScatterPlotHexbin,
    mdiDeleteSvg: mdiDelete,

    // Data
    commonRank: 'k',

    // Table
    selected: [] as SkaniTableRow[],
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
    ],

  }),

  methods: {

    addGenomesFromFileUpload(input: SkaniAddGenomesFromUploadOutput) {

      // Merge the new genomes with the existing ones
      const seenGids = new Set();
      for (const genome of this.selected) {
        seenGids.add(genome.name);
      }

      // Keep the existing genomes
      const out: SkaniTableRow[] = [];
      for (const genome of this.value) {
        if (!seenGids.has(genome.name)) {
          out.push(genome);
          seenGids.add(genome.name);
        }
      }

      // Add the uploaded genomes
      for (const genome of input.files) {
        if (!seenGids.has(genome.name)) {
          out.push({
            name: genome.name,
            isUser: true,
            isRep: null,
            domain: null,
            phylum: null,
            class: null,
            order: null,
            family: null,
            genus: null,
            species: null
          });
          seenGids.add(genome.name);
        }
      }

      // Output the payload for the sequence data and settings
      // Important: This must come before the initial input update, as the parent will
      // use that information to determine what sequences should be kept (as per the table).
      // This is only a problem if a user deletes a genome from the table.
      this.$emit('newFiles', input);

      // Output the genome accessions for viewing in the table
      this.$emit('input', out)
    },

    addGenomesFromUserInput(input: SkaniTableRow[]) {
      // Merge the new genomes with the existing ones
      const seenGids = new Set();
      const out: SkaniTableRow[] = [];

      // Keep the existing order from input
      for (const genome of this.value) {
        if (!seenGids.has(genome.name)) {
          out.push(genome);
          seenGids.add(genome.name);
        }
      }

      // Add the updated genomes
      for (const genome of input) {
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
      const newGenomes: SkaniTableRow[] = [];
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
    formatTaxonomyForRow(row: SkaniTableRow): string {
      // If there are no data, then we don't have this in the current release
      if (!(row.domain != null)) {
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
    computeCommonRank(input: SkaniTableRow[]) {
      const seenD = new Set<string>();
      const seenP = new Set<string>();
      const seenC = new Set<string>();
      const seenO = new Set<string>();
      const seenF = new Set<string>();
      const seenG = new Set<string>();
      const seenS = new Set<string>();

      for (const row of input) {
        if (row.domain != null && seenD.size < 2) {
          seenD.add(row.domain);
        }
        if (row.phylum != null && seenP.size < 2) {
          seenP.add(row.phylum);
        }
        if (row.class != null && seenC.size < 2) {
          seenC.add(row.class);
        }
        if (row.order != null && seenO.size < 2) {
          seenO.add(row.order);
        }
        if (row.family != null && seenF.size < 2) {
          seenF.add(row.family);
        }
        if (row.genus != null && seenG.size < 2) {
          seenG.add(row.genus);
        }
        if (row.species != null && seenS.size < 2) {
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
