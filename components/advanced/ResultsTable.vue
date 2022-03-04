<template>
  <v-card v-if="searchHasBeenRun" style="width: 100%">

    <!-- Table header -->
    <v-card-title>
      <v-row align="center" no-gutters>
        <h4>Search Results</h4>
        <v-spacer></v-spacer>

        <!-- Select which columns to show -->
        <v-select
          v-model="selectTableHeaders"
          :items="tableHeaders"
          background-color="white"
          class="mr-3"
          dense
          hide-details
          label="Columns"
          multiple
          return-object
          style="max-width: 150px;"
        >
          <template v-slot:selection="{ item, index }">
        <span
          v-if="index === 0"
          class="grey--text caption"
        >
          Visible: {{ selectTableHeaders.length }}/{{ tableHeaders.length }}
        </span>
          </template>
        </v-select>

        <!-- Search field -->
        <!--      <v-text-field-->
        <!--        v-model="search"-->
        <!--        class="mr-3"-->
        <!--        dense-->
        <!--        append-icon="mdi-magnify"-->
        <!--        hide-details-->
        <!--        label="Search"-->
        <!--        single-line-->
        <!--        style="max-width: 300px;"-->
        <!--      ></v-text-field>-->

        <ResultsDownload></ResultsDownload>

      </v-row>
    </v-card-title>

    <v-data-table
      :disable-sort="true"
      :footer-props="{'items-per-page-options': [10, 50, 100, 250, 500, 1000]}"
      :headers="tableHeadersDisplay"
      :items="tableRows"
      :items-per-page.sync="curItemsPerPage"
      :loading="isLoading"
      :page.sync="curPageNo"
      :search="search"
      :server-items-length="totalNumberOfItems"
      :sort-by.sync="curSortBy"
      :sort-desc.sync="curSortDesc"
      class="elevation-1"
      dense
      item-key="organism_name"
      loading-text="Searching..."
    >
      <!-- Accession -->
      <template v-slot:item.organism_name="{ item }">
        <nuxt-link :to="'/genome?gid=' + item.organism_name" target="_blank">
          {{ item.organism_name }}
        </nuxt-link>
      </template>

      <!-- NCBI taxonomy string -->
      <template v-slot:item.ncbi_taxonomy="{ item }">
        {{ item.ncbi_taxonomy.replace(/;/g, '; ') }}
      </template>

      <!-- GTDB taxonomy string -->
      <template v-slot:item.gtdb_taxonomy="{ item }">
        <template v-for="hit in extractRanks(item.gtdb_taxonomy)">
          <template v-if="hit.length > 3">
            <a :href="'/tree?r='+ hit" target="_blank">{{ hit }}</a>;
          </template>
          <template v-else> {{ hit }};</template>
        </template>
      </template>

      <!-- Representative of species -->
      <template v-slot:item.gtdb_representative="{ item }">
        <v-chip v-if="item.gtdb_representative == false" color="#FFABAB" small text-color="black">
          FALSE
        </v-chip>
        <v-chip v-else-if="item.gtdb_representative == true" color="#DBFFD6" small text-color="black">
          TRUE
        </v-chip>
        <v-chip v-else small>
          {{ item.gtdb_representative }}
        </v-chip>
      </template>

      <!-- Genome category -->
      <template v-slot:item.ncbi_genome_category="{ item }">
        <template v-if="item.ncbi_genome_category == null">
          <v-chip small>
            N/A
          </v-chip>
        </template>
        <template v-else>
          {{ item.ncbi_genome_category }}
        </template>
      </template>

      <!-- NCBI Type material designation -->
      <template v-slot:item.ncbi_type_material_designation="{ item }">
        <template v-if="item.ncbi_type_material_designation == null">
          <v-chip small>
            N/A
          </v-chip>
        </template>
        <template v-else>
          {{ item.ncbi_type_material_designation }}
        </template>
      </template>

    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import ResultsDownload from "~/components/advanced/ResultsDownload.vue";

export default Vue.extend({
  name: "ResultsTable",
  components: {ResultsDownload},
  data() {
    return {
      search: '',
      selectTableHeaders: [],
    }
  },
  computed: {
    curPageNo: {
      get: function () {
        return this.$accessor.advanced.resultsPageNo
      },
      set: function (value) {
        this.$accessor.advanced.SET_RESULTS_PAGE_NO(value)
      }
    },
    curItemsPerPage: {
      get: function () {
        return this.$accessor.advanced.resultsItemPerPage
      },
      set: function (value: number) {
        this.$accessor.advanced.SET_RESULTS_ITEMS_PER_PAGE(value)
      }
    },
    curSortBy: {
      get: function () {
        return this.$accessor.advanced.resultsSortBy
      },
      set: function (value) {
        this.$accessor.advanced.SET_RESULTS_SORT_BY(value)
      }
    },
    curSortDesc: {
      get: function () {
        return this.$accessor.advanced.resultsSortDesc
      },
      set: function (value: boolean) {
        this.$accessor.advanced.SET_RESULTS_SORT_DESC(value)
      }
    },
    totalNumberOfItems() {
      return this.$accessor.advanced.results == null ? 0 : this.$accessor.advanced.results.rows.length
    },
    searchHasBeenRun() {
      return this.$accessor.advanced.resultsHasBeenRun;
    },
    isLoading() {
      return this.$accessor.advanced.results == null || this.$accessor.advanced.resultsIsLoading
    },
    tableRows() {
      return this.$accessor.advanced.resultsPaginated == null ? [] : this.$accessor.advanced.resultsPaginated;
    },
    tableHeaders() {
      return this.$accessor.advanced.results == null ? [] : this.$accessor.advanced.results.headers;
    },
    tableHeadersDisplay() {
      if (this.selectTableHeaders.length > 0) {
        return (this as any).selectTableHeaders
      } else {
        return (this as any).tableHeaders;
      }
    },
  },
  methods: {
    extractRanks(rankStr: string) {
      const hits = [...rankStr.matchAll(/(d__.*);(p__.*);(c__.*);(o__.*);(f__.*);(g__.*);(s__.*)/g)];
      const out = [];
      for (let i = 1; i < hits[0].length; i++) {
        out.push(hits[0][i])
      }
      return out
    }
  }
})
</script>

<style scoped>
.v-data-table >>> .v-data-table-header {
  background-color: #7e8e7c;
}

.v-data-table >>> th {
  color: white !important;
}

.v-data-table >>> a {
  color: #2d8a2d !important;
}

.v-data-table >>> table th + th {
  border-left: 1px solid #a1b49f;
}

.v-data-table >>> table td + td {
  border-left: 1px solid #dddddd;
}
</style>
