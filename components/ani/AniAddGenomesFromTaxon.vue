<template>
  <v-dialog
    v-model="modalVisible"
    width="700"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="white--text"
        color="#76ab63"
        depressed
        small
        v-bind="attrs"
        :disabled="disabled"
        @click="onAddGenomesFromTaxonClick"
        v-on="on"
      >
        <v-icon left>
          {{ addGenomesSvg }}
        </v-icon>
        GTDB Taxon
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 white--text" style="background-color: #5a6855">
        <v-icon dark left>
          {{ addGenomesSvg }}
        </v-icon>
        Add genomes from GTDB taxon
      </v-card-title>

      <v-card-text class="py-1">
        <v-row no-gutters>
          <TaxonSearchAutocomplete
            v-model="selectedTaxon"
            :disabled="formDisabled"
            class="ml-2 mt-3"
            label="Taxon"
          />
        </v-row>
        <v-row no-gutters>
          <v-checkbox
            v-model="spReps"
            :disabled="formDisabled"
            class="ml-2"
            label="Only include species representatives"
          ></v-checkbox>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-chip>
          <template v-if="getTaxonSearching">
            Loading...
          </template>
          <template v-else>
            {{ nGenomesInTaxon }} genomes to add
          </template>

        </v-chip>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="formDisabled"
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
import {mdiShapePlus} from "@mdi/js";
import {isDefined, maybeToLocaleString} from "~/assets/ts/common";
import {FastAniQueryRow} from "~/assets/models/fastani";
import {TaxonGenomesDetailRow} from "~/assets/api/taxon";

export default Vue.extend({
  components: {TaxonSearchAutocomplete},

  props: {
    disabled: Boolean
  },

  data: () => ({
    // Icons
    addGenomesSvg: mdiShapePlus,

    // Modal data
    modalVisible: false,

    // Form data
    selectedTaxon: '',
    spReps: true,

    // API calls
    getTaxonSearching: false,

    // API return data
    apiSearchResult: [] as FastAniQueryRow[],

  }),

  watch: {
    // If the taxon changes, we need to load those genomes
    selectedTaxon(after: string, before: string) {
      if (after && after.length > 0 && after != before) {
        this.getGenomesFromTaxon();
      }
    },
    // If the user toggles the species representatives checkbox, we need to reload the genomes
    spReps(after: boolean, before: boolean) {
      if (after !== before && this.selectedTaxon.length > 3) {
        this.getGenomesFromTaxon();
      }
    },

  },

  computed: {
    nGenomesInTaxon(): string {
      return maybeToLocaleString(this.apiSearchResult.length) as string;
    },
    formDisabled(): boolean {
      return this.getTaxonSearching;
    },
  },

  methods: {
    // Emit the chosen genome ids to the parent
    emitGenomeIds() {
      this.$emit('update', this.apiSearchResult);
      this.modalVisible = false;
    },

    // Load the genomes associated with a taxon
    getGenomesFromTaxon() {
      if (isDefined(this.selectedTaxon) && this.selectedTaxon.length > 3) {

        // Register the start of the search
        this.getTaxonSearching = true;

        // Make the API call
        this.$api.taxon.getTaxonGenomesDetail(this.selectedTaxon, this.spReps).then(resp => {
          const out: FastAniQueryRow[] = [];
          for (let i = 0; i < resp.data.rows.length; i++) {
            const curItem: TaxonGenomesDetailRow = resp.data.rows[i];
            out.push({
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
          this.apiSearchResult = out;
        })
          .catch((err) => {
            this.$accessor.api.defaultCatch(err);
          })
          .finally(() => {
            this.getTaxonSearching = false;
          })
      }
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
