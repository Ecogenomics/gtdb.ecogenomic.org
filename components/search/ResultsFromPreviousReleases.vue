<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="1000px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :disabled="loading"
          class="white--text overflow-hidden"
          color="#7a8979"
          depressed
          small
          v-bind="attrs"
          v-on="on"
        >
          <v-icon left>
            {{ mdiHistorySvg }}
          </v-icon>
          <span class="text-wrap">
            Results from previous releases ({{ loading ? 'Loading...' : rows.length.toLocaleString() }})
          </span>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Results from previous releases
        </v-card-title>

        <v-card-text>
          <p class="mt-4">
            Below is a list containing partial matches to any GTDB taxon that first appeared
            in a previous release, and is <b>not present in the current release</b>.
          </p>

          <v-data-table
            :headers="headers"
            :items="rows"
            :items-per-page="-1"
            class="gtdb-table mt-5"
            dense
          >

            <!-- Rows -->
            <template v-slot:item.view="{ item }">
              <nuxt-link :to="`/taxon-history?from=${item.firstSeen}&to=R202&query=${item.taxon}`">
                Taxon History ({{ item.firstSeen }} to {{ item.lastSeen }})
              </nuxt-link>
            </template>

          </v-data-table>

        </v-card-text>

      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {TaxonPreviousReleases} from "~/assets/api/taxon";
import {mdiHistory} from "@mdi/js";

export default Vue.extend({
  props: {
    taxon: {
      type: String,
      required: true
    }
  },
  watch: {
    taxon(val) {
      val && val !== this.searchTaxon && this.loadPreviousReleases(val);
    }
  },
  data: () => ({
    searchTaxon: '',
    loading: false,
    headers: [
      {text: 'Taxon', value: 'taxon'},
      {text: 'First seen', value: 'firstSeen'},
      {text: 'Last seen', value: 'lastSeen'},
      {text: 'View', value: 'view'},
    ],
    rows: [] as TaxonPreviousReleases[],
    dialog: false,
    mdiHistorySvg: mdiHistory
  }),
  mounted() {
    this.loadPreviousReleases(this.taxon);
  },
  methods: {
    loadPreviousReleases(searchTaxon: string) {
      this.searchTaxon = searchTaxon;

      this.loading = true;
      this.$api.taxon.getPreviousReleases(searchTaxon).then(response => {
        this.rows = response.data
      })
        .finally(() => {
          this.loading = false;
        });
    }
  }
})
</script>

<style scoped>

</style>
