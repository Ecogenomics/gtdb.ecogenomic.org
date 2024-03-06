<template>
  <v-dialog
    v-model="modalVisible"
    width="700"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="white--text"
        color="#5a6855"
        depressed
        small
        :disabled="isDisabled"
        v-bind="attrs"
        @click="onAddGenomesFromTaxonClick"
        v-on="on"
      >
        <v-icon left>
          {{ addGenomesSvg }}
        </v-icon>
        Add genomes from text
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 white--text" style="background-color: #5a6855">
        <v-icon dark left>
          {{ addGenomesSvg }}
        </v-icon>
        Add genomes from text
      </v-card-title>

      <v-card-text>
        <v-row no-gutters>
          <v-textarea
            v-model="userInput"
            :disabled="disabled"
            class="ml-2 mt-3"
            clearable
            dense
            hide-details
            label="Enter multiple genome IDs e.g. GCA_123456789.1 GCF_123456789.1"
            outlined
            rows="5"
          >
          </v-textarea>
        </v-row>
        <v-row class="mt-2" no-gutters>
          <v-select
            v-model="selectedGroup"
            :items="groupOptions"
            class="ml-2 mt-3"
            clearable
            dense
            hide-details
            label="Add genomes to"
            outlined
          >
          </v-select>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-chip>
          {{ nGenomeAccessions.toLocaleString() }} genomes to add
        </v-chip>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="disabled"
          color="primary"
          text
          @click="emitGenomeIds"
        >
          Save
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="modalVisible = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

import TaxonSearchAutocomplete from "~/components/shared/TaxonSearchAutocomplete.vue";
import {mdiPlusThick} from "@mdi/js";
import {FastAniAddGenomesFromUserInput, FastAniInputGroup, FastAniQueryRow} from "~/assets/models/fastani";
import {FastAniGenomeValidationRequest} from "~/assets/api/fastani";

export default Vue.extend({
  components: {TaxonSearchAutocomplete},

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
  },


  data: () => ({
    // Icons
    addGenomesSvg: mdiPlusThick,

    // Modal data
    modalVisible: false,

    // Form data
    groupOptions: ['Query genomes', 'Reference genomes', 'Query & Reference genomes'],
    selectedTaxon: '',
    selectedGroup: 'Query genomes',
    spReps: true,
    userInput: '',

    // Api
    isApiRunning: false,

  }),

  computed: {

    isDisabled(): boolean {
      return this.disabled || this.isApiRunning;
    },

    selectedGroupAsEnum(): FastAniInputGroup {
      if (this.selectedGroup === 'Query genomes') {
        return FastAniInputGroup.query;
      } else if (this.selectedGroup === 'Reference genomes') {
        return FastAniInputGroup.reference;
      } else {
        return FastAniInputGroup.both;
      }
    },

    genomeAccessions(): string[] {
      const out: string[] = [];
      const matches = this.userInput.matchAll(/(GCA_\d{9}\.\d)|(GCF_\d{9}\.\d)/g);
      for (const match of matches) {
        out.push(match[0]);
      }
      return out;
    },

    nGenomeAccessions(): number {
      return this.genomeAccessions.length;
    }

  },


  methods: {

    // Query the database to check what is possible
    validateGenomes(): FastAniAddGenomesFromUserInput {
      const rows: FastAniQueryRow[] = [];

      const request: FastAniGenomeValidationRequest = {
        genomes: this.genomeAccessions
      }

      this.isApiRunning = true;
      this.$api.fastani.validateGenomes(request).then(res => {
        for (const row of res.data) {
          rows.push({
            name: row.accession,
            isRep: row.isSpRep,
            domain: row.gtdbDomain,
            phylum: row.gtdbPhylum,
            class: row.gtdbClass,
            order: row.gtdbOrder,
            family: row.gtdbFamily,
            genus: row.gtdbGenus,
            species: row.gtdbSpecies,
          });
        }
      })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
        })
        .finally(() => {
          this.isApiRunning = false;
        });

      return {
        genomes: rows,
        group: this.selectedGroupAsEnum,
      }

    },

    // Emit the chosen genome ids to the parent
    emitGenomeIds() {
      const output: FastAniAddGenomesFromUserInput = this.validateGenomes();
      this.$emit('input', output);
      this.modalVisible = false;
    },


    // Toggle the modal open
    onAddGenomesFromTaxonClick() {
      this.modalVisible = !this.modalVisible;
    },

  },

})
</script>

<style scoped>

</style>
