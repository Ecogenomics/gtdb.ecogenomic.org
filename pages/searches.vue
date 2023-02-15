<template>
  <v-container class="gtdb-container">

    <v-card>

      <v-card-title class="text-h5">
        Search
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">

        <template v-if="search">

          <IsSurveillanceGenome :accession="search"/>

          <ResultsFromPreviousReleases :taxon="search"/>

          <!-- Row above table -->
          <v-row
            class="mt-2"
            no-gutters
          >
            <v-col style="max-width: 400px;">
              <v-checkbox
                v-model="gtdbSpeciesRepOnly"
                color="blue"
                dense
                hide-details
                label="GTDB species representatives only"
              ></v-checkbox>
            </v-col>

            <v-col style="max-width: 400px;">
              <v-checkbox
                v-model="ncbiTypeMatOnly"
                color="blue"
                dense
                hide-details
                label="NCBI type material only"
              ></v-checkbox>
            </v-col>

            <v-col>
              <v-text-field
                v-model="filterText"
                class="ml-auto mr-0"
                clearable
                dense
                hide-details
                label="Search"
                single-line
                style="max-width: 300px;"
              >
                <v-icon
                  slot="prepend-inner"
                >
                  {{ mdiMagnifySvg }}
                </v-icon>
              </v-text-field>
            </v-col>
          </v-row>

          <div class="d-flex flex-row mt-3">
            <v-btn
              :disabled="loading"
              :href="downloadUrlTsv"
              depressed
              small
            >
              TSV
              <v-icon right>
                {{ mdiKeyboardTabSvg }}
              </v-icon>
            </v-btn>

            <v-btn
              :disabled="loading"
              :href="downloadUrlCsv"
              class="ml-3"
              depressed
              small
            >
              CSV
              <v-icon right>
                {{ mdiFileDelimitedSvg }}
              </v-icon>
            </v-btn>

          </div>

          <v-data-table
            :footer-props="{'items-per-page-options': itemsPerPage}"
            :headers="headers"
            :items="rows"
            :loading="loading"
            :options.sync="options"
            :server-items-length="totalRows"
            class="gtdb-table mt-5"
            dense
            loading-text="Loading..."
            multi-sort
          >

            <!-- Rows -->
            <template v-slot:item.accession="{ item }">
              <nuxt-link :to="`/genome?gid=${item.gid}`">{{ item.accession }}</nuxt-link>
            </template>

            <template v-slot:item.isGtdbSpeciesRep="{ item }">
              <template v-if="item.isGtdbSpeciesRep">
                yes
              </template>
            </template>

            <template v-slot:item.isNcbiTypeMaterial="{ item }">
              <template v-if="item.isNcbiTypeMaterial">
                yes
              </template>
            </template>

          </v-data-table>
        </template>

        <template v-else>
          Enter a search term into the menu search field to query the GTDB.
        </template>

      </v-card-text>

    </v-card>

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import ResultsFromPreviousReleases from "~/components/search/ResultsFromPreviousReleases.vue";
import {SearchGtdbRequest, SearchGtdbRow} from "~/assets/api/search";
import {DataOptions} from "vuetify";
import {mdiFileDelimited, mdiFileExcel, mdiKeyboardTab, mdiMagnify} from "@mdi/js";
import IsSurveillanceGenome from "~/components/search/IsSurveillanceGenome.vue";

export default Vue.extend({
  components: {IsSurveillanceGenome, ResultsFromPreviousReleases},
  head() {
    return {
      title: 'Search',
      meta: [
        {
          hid: 'searches',
          name: 'description',
          content: `Results from a basic GTDB search.`
        }
      ]
    }
  },
  mounted() {
    this.getParamsFromUrl();
    this.runQuery();
  },
  data: () => ({

    query: '',

    mdiMagnifySvg: mdiMagnify,
    mdiFileDelimitedSvg: mdiFileDelimited,
    mdiKeyboardTabSvg: mdiKeyboardTab,
    mdiFileExcelSvg: mdiFileExcel,

    // Checkboxes
    gtdbSpeciesRepOnly: false,
    ncbiTypeMatOnly: false,

    // Table
    headers: [
      {text: "Accession", value: "accession"},
      {text: "NCBI organism name", value: "ncbiOrgName"},
      {text: "NCBI taxonomy", value: "ncbiTaxonomy"},
      {text: "GTDB taxonomy", value: "gtdbTaxonomy"},
      {text: "GTDB species representative", value: "isGtdbSpeciesRep"},
      {text: "NCBI type material", value: "isNcbiTypeMaterial"},
    ],
    rows: [] as SearchGtdbRow[],

    // Search query
    loading: false,
    runAgain: false,

    page: 1,
    itemsPerPage: [10, 50, 100, 250, 500, 1000],

    search: '',
    searchField: 'all',
    filterText: '',

    options: ({page: 1} as DataOptions),
    totalRows: 0,

    lastSearchRequest: {} as SearchGtdbRequest


  }),
  computed: {
    searchRequest(): SearchGtdbRequest {
      return {
        page: this.options.page,
        itemsPerPage: this.options.itemsPerPage,
        sortBy: this.options.sortBy,
        sortDesc: this.options.sortDesc,
        search: this.search,
        searchField: this.searchField,
        filterText: this.filterText,
        gtdbSpeciesRepOnly: this.gtdbSpeciesRepOnly,
        ncbiTypeMaterialOnly: this.ncbiTypeMatOnly,
      }
    },
    downloadUrlTsv(): string {
      return this.$api.search.getGtdbSearchExportUrl(this.searchRequest, 'tsv');
    },
    downloadUrlCsv(): string {
      return this.$api.search.getGtdbSearchExportUrl(this.searchRequest, 'csv');
    }
  },
  watch: {
    '$route.query': {
      handler() {
        this.getParamsFromUrl();
        this.runQuery();
      },
      deep: true
    },
    searchRequest() {
      this.runQuery()
    },
    options: {
      handler() {
        this.runQuery();
      },
      deep: true,
    },
    filterText() {
      // reset the page count so the user doesn't end up on a non-existent page if subset is < total
      this.options.page = 1;
      this.runQuery();
    }
  },
  methods: {
    getParamsFromUrl() {
      // Gets parameters from the URL, note: includes default parameters as well
      // TODO: Define an interface
      const query: any = this.$route.query;
      if (query.itemsPerPage) {
        this.options.itemsPerPage = parseInt(query.itemsPerPage);
      } else {
        this.options.itemsPerPage = this.itemsPerPage[0];
      }
      if (query.sortBy) {
        this.options.sortBy = query.sortBy.split(",");
      }
      if (query.sortDesc) {
        // @ts-ignore
        this.options.sortDesc = query.sortDesc.split(",").map(x => x === "true");
      }

      // These are the legacy items
      if (query.q) {
        this.search = query.q;
      }
      if (query.s) {
        if (query.s === "ncbiid" || query.s === "id" || query.s === "ncbi_id") {
          this.searchField = "ncbi_id";
        } else if (query.s === "org" || query.s === "ncbiorg" || query.s === "ncbi_org") {
          this.searchField = "ncbi_org";
        } else if (query.s === "nt" || query.s === "ncbitax" || query.s === "ncbi_tax") {
          this.searchField = "ncbi_tax";
        } else if (query.s === "gt" || query.s === "gtdbtax" || query.s === "gtdb_tax") {
          this.searchField = "gtdb_tax";
        } else {
          this.searchField = "all";
        }
      }

    },
    runQuery() {

      // A query is already running, should we queue another?
      if (this.loading) {
        // If another query is requested that is different, re-run this method.
        if (JSON.stringify(this.searchRequest) !== JSON.stringify(this.lastSearchRequest)) {
          this.runAgain = true
        }
        return
      }

      this.loading = true
      this.lastSearchRequest = this.searchRequest;
      this.rows = [];

      this.$api.search.getGtdbSearch(this.searchRequest).then(response => {
        this.totalRows = response.data.totalRows
        this.rows = response.data.rows
      })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
        })
        .finally(() => {
          this.loading = false;

          // Run the query again if it is queued
          if (this.runAgain) {
            this.runAgain = false;
            this.runQuery();
          }

        })
    },
  },
})
</script>

<style scoped>

</style>
