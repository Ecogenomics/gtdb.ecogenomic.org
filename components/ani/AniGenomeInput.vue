<template>
  <v-card outlined>
    <v-card-title class="cardTitle pt-1 pb-4">

      <v-row  no-gutters class="justify-center w-100">
        {{ title }}
      </v-row>

      <v-row no-gutters class="mt-1">
        <v-col class="justify-center d-flex">
          <AniAddGenomesFromTaxon
            :disabled="disabled"
            @update="addGenomesFromUserInput"
          />
        </v-col>
        <v-col  class="justify-center d-flex">
          <AniAddGenomesFromText
            :disabled="disabled"
            @update="addGenomesFromUserInput"
          />
        </v-col>
        <v-col  class="justify-center d-flex">
          <AniAddGenomesFromUpload
            v-if="allowUpload"
            :server-config="serverConfig"
            :disabled="disabled"
            @update="addGenomesFromFileUpload"
          />
        </v-col>
        <v-col  class="justify-center d-flex">
          <v-btn
            class="white--text"
            color="#b36c6c"
            depressed
            small
            @click="deleteSelected"
            :disabled="deleteSelectedDisabled || disabled"
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
        class="mt-2"
        :headers="headers"
        :items="value"
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
import {isDefined} from "~/assets/ts/common";
import AniAddGenomesFromText from "~/components/ani/AniAddGenomesFromText.vue";
import AniAddGenomesFromUpload from "~/components/ani/AniAddGenomesFromUpload.vue";
import AniAddGenomesFromTaxon from "~/components/ani/AniAddGenomesFromTaxon.vue";
import {AniConfigResponse, AniQueryRow, AniUploadedGenomeRequest} from "~/assets/api/ani";

export default Vue.extend({

  components: {
    AniAddGenomesFromText,
    AniAddGenomesFromTaxon,
    AniAddGenomesFromUpload
  },

  props: {
    title: {
      type: String
    },
    value: {
      type: [] as PropType<AniQueryRow[]>,
      default: []
    },
    allowUpload: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
    serverConfig: Object as PropType<AniConfigResponse | null>
  },

  watch: {
    value: {
      handler: function (newVal: AniQueryRow[]) {
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
    selected: [] as AniQueryRow[],
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

    addGenomesFromFileUpload(input: AniUploadedGenomeRequest) {

      // Merge the new genomes with the existing ones
      const seenGids = new Set();
      for (const genome of this.selected) {
        seenGids.add(genome.name);
      }

      // Keep the existing genomes
      const out: AniQueryRow[] = [];
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
            class:null,
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

    addGenomesFromUserInput(input: AniQueryRow[]) {
      // Merge the new genomes with the existing ones
      const seenGids = new Set();
      const out: AniQueryRow[] = [];

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
      const newGenomes: AniQueryRow[] = [];
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
    formatTaxonomyForRow(row: AniQueryRow): string {
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
    computeCommonRank(input: AniQueryRow[]) {

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
