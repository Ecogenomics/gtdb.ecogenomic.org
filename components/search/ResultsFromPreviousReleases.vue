<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="1000px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :disabled="loading || totalRows === 0"
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
            Results from previous releases ({{ loading ? 'Loading...' : totalRows.toLocaleString() }})
          </span>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Results from previous releases {{ tableLoading }}
        </v-card-title>

        <v-card-text>
          <p class="mt-4">
            Below is a list containing partial matches to any GTDB taxon that first appeared
            in a previous release, and is <b>not present in the current release</b>.
          </p>

          <v-data-table
            :footer-props="{'items-per-page-options': itemsPerPage}"
            :headers="headers"
            :items="rows"
            :items-per-page="-1"
            :loading="tableLoading"
            :options.sync="options"
            :server-items-length="totalRows"
            class="gtdb-table mt-5"
            dense
            loading-text="Loading..."
          >

            <!-- Rows -->
            <template v-slot:item.view="{ item }">
              <nuxt-link :to="`/taxon-history?from=${item.firstSeen}&to=R207&query=${item.taxon}`">
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
import {DataOptions} from "vuetify";
import {JsonEqual} from "~/assets/ts/common";

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
    },


    // Watch for any changes that the table makes to the options - update the query parameters
    options: {
      handler(after, before) {
        if (!JsonEqual(after, before)) {
          if (this.hasDoneInitTableLoad) {
            this.loadPreviousReleasesOnTableChange();
          } else {
            this.hasDoneInitTableLoad = true;
          }
        }
      },
      deep: true,
    },

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
    mdiHistorySvg: mdiHistory,
    hasRows: false,

    tableLoading: true,
    itemsPerPage: [10, 50, 100, 250, 500, 1000],
    totalRows: 0,
    page: 0,
    options: ({} as DataOptions),
    hasDoneInitTableLoad: false,
  }),
  mounted() {
    this.loadPreviousReleases(this.taxon);
  },
  methods: {
    loadPreviousReleases(searchTaxon: string) {
      this.searchTaxon = searchTaxon;

      this.loading = true;
      this.tableLoading = true;
      this.$api.taxon.getPreviousReleasesPaginated(searchTaxon, this.options.page, this.options.itemsPerPage).then(response => {
        this.rows = response.data.rows
        this.totalRows = response.data.totalRows
      })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
        })
        .finally(() => {
          this.hasRows = this.rows.length > 0;
          this.loading = false;
          this.tableLoading = false;
        });
    },
    loadPreviousReleasesOnTableChange() {
      this.tableLoading = true;
      this.rows = [];
      this.$api.taxon.getPreviousReleasesPaginated(this.searchTaxon, this.options.page, this.options.itemsPerPage).then(response => {
        this.rows = response.data.rows
        this.totalRows = response.data.totalRows
      })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
        })
        .finally(() => {
          this.hasRows = this.rows.length > 0;
          this.tableLoading = false;
        });
    }
  }
})
</script>

<style scoped>

</style>
