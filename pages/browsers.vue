<template>
  <v-container class="gtdb-container">
    <v-card class="pa-2">

      <v-card-title class="text-h5">
        Alphabetical table
        <v-progress-circular
          v-if="tableLoading"
          class="ml-5"
          indeterminate
        ></v-progress-circular>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>

        <!-- Row above table -->
        <div class="d-flex flex-row flex-wrap">

          <!-- CSV Download -->
          <div class="d-flex flex-column my-auto">
            <DownloadSvButton
              :disabled="!hasRows"
              type="csv"
              @click="downloadFile('csv')"
            />
          </div>

          <!-- TSV Download -->
          <div class="d-flex flex-column ml-2 my-auto">
            <DownloadSvButton
              :disabled="!hasRows"
              type="tsv"
              @click="downloadFile('tsv')"
            />
          </div>

          <!-- Show only GTDB proposed names -->
          <div class="d-flex flex-column ml-5 my-auto">
            <v-checkbox
              v-model="gtdbProposedNamesOnly"
              color="green"
              dense
              hide-details
              label="Show only GTDB proposed names"
            >
              <template v-slot:append>
                <v-btn
                  color="#2d8a2d"
                  depressed
                  href="https://data.gtdb.ecogenomic.org/releases/release95/95.0/auxillary_files/gtdb_taxa_not_in_lit_r95_rev.txt"
                  icon
                  small
                  target="_blank"
                >
                  <v-icon>
                    {{ mdiDownloadSvg }}
                  </v-icon>
                </v-btn>
              </template>
            </v-checkbox>
          </div>

          <v-spacer></v-spacer>

          <!-- Search -->
          <div class="d-flex flex-column my-auto">
            <v-text-field
              v-model="searchString"
              clearable
              dense
              hide-details
              label="Search all columns"
            >
              <template v-slot:prepend-inner>
                <v-icon>
                  {{ mdiMagnifySvg }}
                </v-icon>
              </template>
            </v-text-field>
          </div>

          <!-- Advanced search button -->
          <div class="d-flex flex-column my-auto ml-5">
            <v-btn
              v-if="showColumnSearch"
              color="#c25151"
              dark
              depressed
              small
              width="160px"
              @click="toggleColumnSearch"
            >
              Remove filter
              <v-spacer></v-spacer>
              <v-icon right>
                {{ mdiFilterMinusSvg }}
              </v-icon>
            </v-btn>
            <v-btn
              v-else
              color="#5a6855"
              dark
              depressed
              small
              width="160px"
              @click="toggleColumnSearch"
            >
              Filter columns
              <v-spacer></v-spacer>
              <v-icon right>
                {{ mdiFilterPlusSvg }}
              </v-icon>
            </v-btn>
          </div>

        </div>
        <!-- End Row above table -->

        <!-- Second row above table -->
        <div
          v-if="showColumnSearch"
          class="d-flex flex-row flex-wrap mt-5 rounded pa-4"
          style="border: #c7c7c7 2px solid;"
        >
          <div class="d-flex w-100 mb-4">
            <b>Column Filter:</b>
          </div>

          <!-- Row 2,1 -->
          <div class="d-flex flex-column mr-4">
            <v-text-field
              v-model="filterDomain"
              clearable
              dense
              hide-details
              label="Domain"
              style="width: 90px;">
            </v-text-field>
          </div>
          <div class="d-flex flex-column mr-4">
            <v-text-field
              v-model="filterPhylum"
              clearable
              dense
              hide-details
              label="Phylum"
              style="width: 160px;">
            </v-text-field>
          </div>
          <div class="d-flex flex-column mr-4">
            <v-text-field
              v-model="filterClass"
              clearable
              dense
              hide-details
              label="Class"
              style="width: 150px;"
            >
            </v-text-field>
          </div>
          <div class="d-flex flex-column mr-4">
            <v-text-field
              v-model="filterOrder"
              clearable
              dense
              hide-details
              label="Order"
              style="width: 160px;">
            </v-text-field>
          </div>
          <div class="d-flex flex-column mr-4">
            <v-text-field
              v-model="filterFamily"
              clearable
              dense
              hide-details
              label="Family"
              style="width: 180px;"
            >
            </v-text-field>
          </div>
          <div class="d-flex flex-column mr-4">
            <v-text-field
              v-model="filterGenus"
              clearable
              dense
              hide-details
              label="Genus"
              style="width: 160px;"
            >
            </v-text-field>
          </div>
          <div class="d-flex flex-column">
            <v-text-field
              v-model="filterSpecies"
              clearable
              dense
              hide-details
              label="Species"
              style="width: 110px;"
            >
            </v-text-field>
          </div>
        </div>

        <!-- Table -->
        <v-data-table
          :footer-props="{'items-per-page-options': itemsPerPage}"
          :headers="headers"
          :items="tableRows"
          :loading="tableLoading"
          :options.sync="options"
          :server-items-length="totalRows"
          class="gtdb-table mt-2"
          dense
          loading-text="Loading..."
          multi-sort
          @current-items="onDataTableChange"
        >

          <template v-slot:item.d="{ item }">
            <nuxt-link :to="`/tree?r=d__${encodeURIComponent(item.d)}`">{{ item.d }}</nuxt-link>
            <TaxonNotInLit v-if="taxaNotInLit[item.d]" :tooltip="taxaNotInLit[item.d]"/>
          </template>

          <template v-slot:item.p="{ item }">
            <nuxt-link :to="`/tree?r=p__${encodeURIComponent(item.p)}`">{{ item.p }}</nuxt-link>
            <TaxonNotInLit v-if="taxaNotInLit[item.p]" :tooltip="taxaNotInLit[item.p]"/>
          </template>

          <template v-slot:item.c="{ item }">
            <nuxt-link :to="`/tree?r=c__${encodeURIComponent(item.c)}`">{{ item.c }}</nuxt-link>
            <TaxonNotInLit v-if="taxaNotInLit[item.c]" :tooltip="taxaNotInLit[item.c]"/>
          </template>

          <template v-slot:item.o="{ item }">
            <nuxt-link :to="`/tree?r=o__${encodeURIComponent(item.o)}`">{{ item.o }}</nuxt-link>
            <TaxonNotInLit v-if="taxaNotInLit[item.o]" :tooltip="taxaNotInLit[item.o]"/>
          </template>

          <template v-slot:item.f="{ item }">
            <nuxt-link :to="`/tree?r=f__${encodeURIComponent(item.f)}`">{{ item.f }}</nuxt-link>
            <TaxonNotInLit v-if="taxaNotInLit[item.f]" :tooltip="taxaNotInLit[item.f]"/>
          </template>

          <template v-slot:item.g="{ item }">
            <nuxt-link :to="`/tree?r=g__${encodeURIComponent(item.g)}`">{{ item.g }}</nuxt-link>
            <TaxonNotInLit v-if="taxaNotInLit[item.g]" :tooltip="taxaNotInLit[item.g]"/>
          </template>

          <template v-slot:item.s="{ item }">
            <nuxt-link :to="`/tree?r=s__${encodeURIComponent(item.s)}`">{{ item.s }}</nuxt-link>
            <TaxonNotInLit v-if="taxaNotInLit[item.s]" :tooltip="taxaNotInLit[item.s]"/>
          </template>

          <template v-slot:item.count="{ item }">
            <nuxt-link :to="`/species?id=${encodeURIComponent(item.s)}`">{{
                item.count.toLocaleString()
              }}
            </nuxt-link>
          </template>
        </v-data-table>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {TaxonomyCount, TaxonomyCountRequest, TaxonomyCountUrl} from "~/assets/api/taxonomy";
import {mdiDownload, mdiFilterMinus, mdiFilterPlus, mdiMagnify} from "@mdi/js";
import {DataOptions, DataTableHeader} from "vuetify";
import DownloadSvButton from "~/components/util/DownloadSvButton.vue";
import {Dict} from "~/assets/ts/interfaces";
import TaxonNotInLit from "~/components/browse/TaxonNotInLit.vue";
import {isDefined, JsonEqual} from "~/assets/ts/common";


export default Vue.extend({
  head() {
    return {
      title: 'Alphabetical Table',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `A list of all taxa in the GTDB with a link to their respective species cluster.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `table, browse, taxa, gtdb`
        }
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://gtdb.ecogenomic.org/browsers`,
        }
      ]
    }
  },
  components: {TaxonNotInLit, DownloadSvButton},

  // Load the initial content to be baked into the page
  async asyncData({$api}) {

    // Taxa not in literature
    const apiTaxaNotInLit = await $api.taxonomy.notInLit();
    const taxaNotInLit = {} as Dict<string>;
    apiTaxaNotInLit.data.forEach((taxon) => {
      taxaNotInLit[taxon.taxon] = `${taxon.taxonStatus} ${taxon.notes}`;
    });

    // Initial table load
    const apiTaxCount = await $api.taxonomy.taxonomyCount({page: 1, itemsPerPage: 10})
    const tableRows = apiTaxCount.data.rows;
    const totalRows = apiTaxCount.data.totalRows;

    // Merge with data
    return {
      taxaNotInLit,
      tableRows,
      totalRows
    }
  },

  data: () => ({
    // Icons
    mdiMagnifySvg: mdiMagnify,
    mdiDownloadSvg: mdiDownload,
    mdiFilterPlusSvg: mdiFilterPlus,
    mdiFilterMinusSvg: mdiFilterMinus,

    // Taxa not in literature tooltip
    taxaNotInLit: {} as Dict<string>,

    // Toggle GTDB proposed names
    gtdbProposedNamesOnly: false,

    // Table filter
    searchString: '',
    searchTimeout: null as ReturnType<typeof setTimeout> | null,

    // Table
    tableLoading: false,
    tableRows: ([] as TaxonomyCount[]),
    itemsPerPage: [10, 50, 100, 250, 500, 1000],
    headers: [
      {text: "Domain", value: "d"},
      {text: "Phylum", value: "p"},
      {text: "Class", value: "c"},
      {text: "Order", value: "o"},
      {text: "Family", value: "f"},
      {text: "Genus", value: "g"},
      {text: "Species", value: "s"},
      {text: "No. Genomes", value: "count"},
    ] as DataTableHeader[],
    options: ({} as DataOptions),
    totalRows: 0,

    // Advanced search models
    showColumnSearch: false,
    filterDomain: '',
    filterPhylum: '',
    filterClass: '',
    filterOrder: '',
    filterFamily: '',
    filterGenus: '',
    filterSpecies: '',

    hasRows: false,
  }),

  watch: {
    // Watch for any changes to the query parameters
    '$route.query': {
      handler(after: object, before: object) {
        // Check what filters are present in the query string and re-apply those filters
        if (isDefined(after)) {
          const query = after as Record<string, string>;
          this.gtdbProposedNamesOnly = query["gtdb-proposed"] === "true";
          if (query.search) {
            this.searchString = query.search;
          } else {
            this.searchString = '';
          }
          if (query["filter-domain"]) {
            this.filterDomain = query["filter-domain"];
          }
          else {
            this.filterDomain = '';
          }
          if (query["filter-phylum"]) {
            this.filterPhylum = query["filter-phylum"];
          }
          else {
            this.filterPhylum = '';
          }
          if (query["filter-class"]) {
            this.filterClass = query["filter-class"];
          }
          else {
            this.filterClass = '';
          }
          if (query["filter-order"]) {
            this.filterOrder = query["filter-order"];
          }
          else {
            this.filterOrder = '';
          }
          if (query["filter-family"]) {
            this.filterFamily = query["filter-family"];
          }
          else {
            this.filterFamily = '';
          }
          if (query["filter-genus"]) {
            this.filterGenus = query["filter-genus"];
          }
          else {
            this.filterGenus = '';
          }
          if (query["filter-species"]) {
            this.filterSpecies = query["filter-species"];
          }
          else {
            this.filterSpecies = '';
          }
        }

        if (isDefined(after) && !JsonEqual(after, before)) {
          this.getTaxonomyCount(this.payload);
        }
      },
      deep: true
    },

    // Watch for any changes that the table makes to the options - update the query parameters
    options: {
      handler(after, before) {
        if (!JsonEqual(after, before)) {
          this.setUrlFromParams();
        }
      },
      deep: true,
    },

    // Watch for any changes to the search string - update the query parameters
    searchString: {
      handler(after, before) {
        if (after !== before) {
          this.options.page = 1;
          this.setUrlFromParams();
        }
      }
    },

    // Watch for any changes to the GTDB proposed names filter - update the query parameters
    gtdbProposedNamesOnly: {
      handler(after, before) {
        if (after !== before) {
          this.options.page = 1;
          this.setUrlFromParams();
        }
      }
    },

    filterDomain: {
      handler(after, before) {
        if (after !== before) {
          this.options.page = 1;
          this.setUrlFromParams();
        }
      }
    },
    filterPhylum: {
      handler(after, before) {
        if (after !== before) {
          this.options.page = 1;
          this.setUrlFromParams();
        }
      }
    },
    filterClass: {
      handler(after, before) {
        if (after !== before) {
          this.options.page = 1;
          this.setUrlFromParams();
        }
      }
    },
    filterOrder: {
      handler(after, before) {
        if (after !== before) {
          this.options.page = 1;
          this.setUrlFromParams();
        }
      }
    },
    filterFamily: {
      handler(after, before) {
        if (after !== before) {
          this.options.page = 1;
          this.setUrlFromParams();
        }
      }
    },
    filterGenus: {
      handler(after, before) {
        if (after !== before) {
          this.options.page = 1;
          this.setUrlFromParams();
        }
      }
    },
    filterSpecies: {
      handler(after, before) {
        if (after !== before) {
          this.options.page = 1;
          this.setUrlFromParams();
        }
      }
    },

  },

  computed: {
    // The current search payload
    payload(): TaxonomyCountRequest {
      return {
        page: this.options.page,
        itemsPerPage: this.options.itemsPerPage,
        sortBy: this.options.sortBy,
        sortDesc: this.options.sortDesc && this.options.sortBy && this.options.sortDesc.length > 0 ? this.options.sortDesc.slice(0, this.options.sortBy.length) : this.options.sortDesc,
        search: this.searchString,
        proposed: this.gtdbProposedNamesOnly,
        filterDomain: this.filterDomain,
        filterPhylum: this.filterPhylum,
        filterClass: this.filterClass,
        filterOrder: this.filterOrder,
        filterFamily: this.filterFamily,
        filterGenus: this.filterGenus,
        filterSpecies: this.filterSpecies,
      }
    },
  },

  methods: {
    onDataTableChange(e: TaxonomyCount[]) {
      this.hasRows = e.length > 0;
    },

    // Opens / closes the filter columns menu
    toggleColumnSearch() {
      // User is closing it
      if (this.showColumnSearch) {
        this.filterDomain = '';
        this.filterPhylum = '';
        this.filterClass = '';
        this.filterOrder = '';
        this.filterFamily = '';
        this.filterGenus = '';
        this.filterSpecies = '';
        this.showColumnSearch = false;
      }
      // User is opening it
      else {
        this.showColumnSearch = true;
      }
    },

    // Loads all query parameters and populates into the state
    loadParamsFromUrl() {
      const query: TaxonomyCountUrl = this.$route.query;
      if (query.page) {
        this.options.page = parseInt(query.page);
      }
      if (query["items-per-page"]) {
        this.options.itemsPerPage = parseInt(query["items-per-page"]);
      }
      if (query["sort-by"]) {
        this.options.sortBy = query["sort-by"].split(",");
      }
      if (query["sort-desc"]) {
        this.options.sortDesc = query["sort-desc"].split(",").map(x => x === "true");
      }
      if (query.search) {
        this.searchString = query.search;
      }
      if (query["gtdb-proposed"]) {
        this.gtdbProposedNamesOnly = query["gtdb-proposed"] !== "false";
      }
    },

    // Update the URL to reflect the current state
    setUrlFromParams() {
      const oldQuery = this.$route.query;
      let newQuery: TaxonomyCountUrl = {}
      if (this.options.page > 1) {
        newQuery.page = this.options.page.toString();
      }
      if (this.itemsPerPage[0] !== this.options.itemsPerPage) {
        newQuery["items-per-page"] = this.options.itemsPerPage.toString();
      }
      if (this.options.sortBy.length > 0 && this.options.sortDesc.length > 0) {
        newQuery["sort-by"] = this.options.sortBy.toString();
      }
      if (this.options.sortBy.length > 0 && this.options.sortDesc.length > 0) {
        newQuery["sort-desc"] = this.options.sortDesc.slice(0, this.options.sortBy.length).toString();
      }
      if (this.searchString && this.searchString.length > 0) {
        newQuery.search = this.searchString;
      }
      if (this.gtdbProposedNamesOnly) {
        newQuery["gtdb-proposed"] = "true";
      }
      if (this.filterDomain && this.filterDomain.length > 0) {
        newQuery["filter-domain"] = this.filterDomain;
      }
      if (this.filterPhylum && this.filterPhylum.length > 0) {
        newQuery["filter-phylum"] = this.filterPhylum;
      }
      if (this.filterClass && this.filterClass.length > 0) {
        newQuery["filter-class"] = this.filterClass;
      }
      if (this.filterOrder && this.filterOrder.length > 0) {
        newQuery["filter-order"] = this.filterOrder;
      }
      if (this.filterFamily && this.filterFamily.length > 0) {
        newQuery["filter-family"] = this.filterFamily;
      }
      if (this.filterGenus && this.filterGenus.length > 0) {
        newQuery["filter-genus"] = this.filterGenus;
      }
      if (this.filterSpecies && this.filterSpecies.length > 0) {
        newQuery["filter-species"] = this.filterSpecies;
      }
      if (JSON.stringify(oldQuery) !== JSON.stringify(newQuery)) {
        this.$router.push({
          //@ts-ignore
          'query': newQuery
        })
      }
    },

    // Action to take when the download button is pressed
    downloadFile(fmt: string) {
      window.open(this.$api.taxonomy.taxonomyCountDownloadUrl(this.payload, fmt), '_blank');
    },

    // Fetch the table data and populate it
    getTaxonomyCount(payload: TaxonomyCountRequest) {
      this.tableLoading = true;
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.$api.taxonomy.taxonomyCount(this.payload)
          .then((resp) => {
            // Only set the state data if this request is the most current one
            if (JsonEqual(this.payload, payload)) {
              this.tableRows = resp.data.rows;
              this.totalRows = resp.data.totalRows
            }
          })
          .catch((err) => {
            this.$accessor.api.defaultCatch(err);
          })
          .finally(() => {
            if (JsonEqual(this.payload, payload)) {
              this.tableLoading = false;
            }
          })
      }, 200);
    },
  },

  mounted() {
    this.loadParamsFromUrl();
    if (Object.keys(this.$route.query).length > 0) {
      this.getTaxonomyCount(this.payload);
    }
  },
})
</script>

<style scoped>
</style>
