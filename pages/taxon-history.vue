<template>
  <v-container class="gtdb-container">
    <v-card>
      <v-card-title class="text-h5">
        Taxon History
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">
        Enter a GTDB or NCBI taxon to visualise how genomes assigned to this taxon have changed between releases:

        <!-- The search form -->
        <div class="mt-4">
          <TaxonHistoryForm
            v-model="search"
          />
        </div>

        <!-- Only display the content below if the search has been run -->
        <template v-if="searchIsValid">

          <!-- The taxonomy of the current query -->
          <v-divider class="mb-4"></v-divider>
          <TaxonHistoryFullTaxonomy
            :search="search"
          />

          <!-- The sankey diagram and tabular results -->
          <v-divider class="my-5"></v-divider>
          <h2>Diagram</h2>
          <TaxonHistorySankey
            v-model="sankeyModel"
            :search="search"
            class="mt-2"
          />
        </template>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import TaxonHistoryForm from "~/components/taxon-history/form/TaxonHistoryForm.vue";
import TaxonHistorySankey from "~/components/taxon-history/TaxonHistorySankey.vue";
import TaxonHistoryFullTaxonomy from "~/components/taxon-history/TaxonHistoryFullTaxonomy.vue";
import {TaxonHistoryRelease, TaxonHistorySankeyModel, TaxonHistorySearch} from "~/assets/models/taxon-history";

export default Vue.extend({
  head() {
    return {
      title: 'Taxon History',
      meta: [
        {
          hid: 'taxon-history',
          name: 'description',
          content: 'Explore how a taxon has changed through GTDB releases.'
        }
      ]
    }
  },
  components: {TaxonHistoryFullTaxonomy, TaxonHistorySankey, TaxonHistoryForm},
  data: () => ({
    // The taxon history search model
    search: {
      from: TaxonHistoryRelease.R80,
      to: TaxonHistoryRelease.R207,
      taxon: '',
    } as TaxonHistorySearch,

    // Manipulations made by the sankey diagram
    sankeyModel: {
      filterToRank: '',
    } as TaxonHistorySankeyModel,
  }),
  watch: {
    // If there was a change to the search, update the query parameters
    search: {
      handler(after, before) {
        // When the page is loaded the filter is removed otherwise
        if (JSON.stringify(after) != JSON.stringify(before)) {
          this.resetFilter();
        }
        this.setUrlParameters();
      },
      deep: true,
    },
    sankeyModel: {
      handler() {
        this.setUrlParameters();
      },
      deep: true,
    },
  },
  computed: {
    // Returns true if the query is valid
    searchIsValid(): boolean {
      return !!(this.search.to && this.search.from && this.search.taxon);
    }
  },
  methods: {
    // If there are query parameters present in the URL, then set the model to them
    maybeLoadFromParams() {
      // from
      if (this.$route.query.from) {
        this.search.from = this.$route.query.from.toString().substring(1) as TaxonHistoryRelease;
      }
      // to
      if (this.$route.query.to) {
        this.search.to = this.$route.query.to === TaxonHistoryRelease.NCBI ? this.$route.query.to :
          this.$route.query.to.toString().substring(1) as TaxonHistoryRelease
      }
      // taxon
      this.search.taxon = (this.$route.query.query as string) || ''
      // filter
      if (this.$route.query.filter) {
        this.sankeyModel.filterToRank = this.$route.query.filter.toString()
      }
    },

    // Updates the query parameters to contain the selected values
    setUrlParameters() {
      const query = Object.assign({}, this.$route.query)
      if (this.searchIsValid) {
        const rFrom = `R${this.search.from}`;
        const rTo = this.search.to === TaxonHistoryRelease.NCBI ? 'NCBI' : `R${this.search.to}`;
        const filter = this.sankeyModel.filterToRank;
        const taxon = this.search.taxon;
        if (query.from !== rFrom || query.to !== rTo || query.query !== taxon || query.filter !== filter) {
          query.from = rFrom;
          query.to = rTo;
          query.query = taxon;
          if (filter) {
            query.filter = filter;
          } else if (query.filter) {
            delete query.filter;
          }
        }
      } else {
        if (query.from) {
          delete query.from;
        }
        if (query.to) {
          delete query.to;
        }
        if (query.query) {
          delete query.query;
        }
        if (query.filter) {
          delete query.filter;
        }
      }
      if (JSON.stringify(this.$route.query) !== JSON.stringify(query)) {
        this.$router.replace({query})
      }
    },

    // Remove the filter if either the taxon or the release change
    resetFilter() {
      this.sankeyModel.filterToRank = '';
    },
  },
  mounted() {
    this.maybeLoadFromParams();
  }
})
</script>

<style scoped>

</style>
