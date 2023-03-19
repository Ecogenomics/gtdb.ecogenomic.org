<template>
  <v-container class="gtdb-container">

    <v-container fill-height fluid>

      <!-- Search tree -->
      <v-row no-gutters>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <h4>Advanced Search</h4>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="text--primary">

              <!-- The query preview -->
              <p class="text-subtitle-2">
                {{ userSearchQuery }}
              </p>

              <!-- The search tree -->
              <SearchNode
                :depth="0"
                :node="root"
                class=""
              >
              </SearchNode>
            </v-card-text>
            <v-card-actions>

              <!-- Search button -->
              <v-btn
                :disabled="isLoading"
                class="mx-auto btn-text-white"
                color="#424242"

                elevation="0"
                @click="submitSearch">
                Search
                <v-icon right>
                  {{ mdiMagnifySvg }}
                </v-icon>
              </v-btn>

            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Results table -->
      <v-row no-gutters>
        <ResultsTable class="mt-5"></ResultsTable>
      </v-row>

    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchNode from '~/components/advanced/SearchNode.vue'
import ResultsTable from "~/components/advanced/ResultsTable.vue";
import {Dict} from "~/assets/ts/interfaces";
import {mdiMagnify} from "@mdi/js";
import {ApiMessage, ApiMessageStatus} from "~/store/api";

export default Vue.extend({

  components: {ResultsTable, SearchNode},
  head() {
    return {
      title: 'Advanced Search',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Search the Genome Taxonomy Database (GTDB) using an advanced search query interface.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `search, advanced, query, sql, gtdb`
        }
      ]
    }
  },
  data: () => ({
    mdiMagnifySvg: mdiMagnify,
  }),
  computed: {
    root() {
      return this.$accessor.advanced.root
    },
    isLoading() {
      return this.$accessor.advanced.resultsIsLoading == true
    },
    userSearchQuery() {
      const searchQuery = this.$accessor.advanced.treeAsString
      if (searchQuery && searchQuery.length > 0) {
        return searchQuery
      } else {
        return "Your search query will appear here once you apply a search term."
      }
    },
  },
  mounted() {
    // Load initial data
    this.$accessor.advanced.fetchColumns()
    this.$accessor.advanced.fetchOperators()
    this.$accessor.advanced.fetchOptions()

    // Set initial state
    if (this.$route.query) {
      this.$accessor.advanced.setInitialStateByEncodedString(this.$route.query)
    }
  },
  methods: {
    undoHistory() {
      this.$accessor.advanced.undoHistory()
    },
    submitSearch() {
      const [expr, args] = this.$accessor.advanced.treeAsEncodedPayload;
      const argsForQuery: Dict<string> = {"exp": String(expr)};
      if (expr.length > 0 && Object.keys(args).length > 0) {
        const newUrl = [];
        for (const [k, v] of Object.entries(args)) {
          newUrl.push(`${k}=${v}`)
          argsForQuery[k] = v;
        }
        const encodedExp = encodeURIComponent(String(expr))
        history.pushState(
          {},
          "",
          `${this.$route.path}?exp=${encodedExp}&${newUrl.join('&')}`
        )

        // Execute the query
        this.$accessor.advanced.startNewQuery();
        this.$api.advanced.getSearch(argsForQuery)
          .then(resp => {
            this.$accessor.advanced.setResultsFromQuery(resp);
          })
          .catch((err) => {
            this.$accessor.api.defaultCatch(err);
          })
          .finally(() => {
            this.$accessor.advanced.queryHasFinished();
          })

        // this.$accessor.advanced.queryDatabase(argsForQuery);


      }
    }
  }
})
</script>

<style scoped>
.btn-text-white {
    color: white !important;
}
</style>
