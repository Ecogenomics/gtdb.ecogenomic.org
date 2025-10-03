<template>
  <v-dialog
    v-model="modalVisible"
    width="700"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="isDisabled"
        class="white--text"
        color="#76ab63"
        depressed
        small
        v-bind="attrs"
        @click="onAddGenomesFromTaxonClick"
        v-on="on"
      >
        <v-icon left>
          {{ addGenomesSvg }}
        </v-icon>
        NCBI accessions
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 white--text" style="background-color: #5a6855">
        <v-icon dark left>
          {{ addGenomesSvg }}
        </v-icon>
        Add genomes from NCBI accessions
      </v-card-title>

      <v-card-text class="pt-3">
        <v-row no-gutters>
          <p>
            Genome accessions will automatically be extracted from the text entered below, regardless of format.
          </p>
          <v-textarea
            v-model="userInput"
            :disabled="isDisabled"
            class="ml-2"
            clearable
            dense
            hide-details
            label="Enter multiple genome IDs e.g. GCA_123456789.1 GCF_123456789.1"
            outlined
            rows="5"
          >
          </v-textarea>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-chip>
          {{ nGenomeAccessions.toLocaleString() }} genomes to add
        </v-chip>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="isDisabled"
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
import {mdiTextBoxPlus} from "@mdi/js";
import {AniGenomeValidationRequest, AniQueryRow} from "~/assets/api/ani";

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
    addGenomesSvg: mdiTextBoxPlus,

    // Modal data
    modalVisible: false,

    // Form data
    selectedTaxon: '',
    userInput: '',

    // Api
    isApiRunning: false,

  }),

  computed: {

    isDisabled(): boolean {
      return this.disabled || this.isApiRunning;
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


    // Emit the chosen genome ids to the parent
    emitGenomeIds() {
      const request: AniGenomeValidationRequest = {
        genomes: this.genomeAccessions
      }
      this.isApiRunning = true;
      this.$api.ani.validateGenomes(request).then(res => {
        const rows: AniQueryRow[] = [];
        for (const row of res.data) {
          rows.push({
            name: row.accession,
            isUser: false,
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
        this.$emit('update', rows);
        this.modalVisible = false;
      })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
        })
        .finally(() => {
          this.isApiRunning = false;
        });
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
