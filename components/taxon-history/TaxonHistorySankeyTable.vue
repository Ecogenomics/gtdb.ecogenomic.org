<template>
  <div>
    Database and version numbers have been removed from NCBI accessions (e.g. GCA_002347985.1 becomes G002347985).
    Genomes which had a UBA accession in prior GTDB releases are referenced by their NCBI
    accession once available (e.g. UBA2234 is indicated as
    <a href="https://www.ncbi.nlm.nih.gov/data-hub/genome/GCA_002347985.1" target="_blank">G002347985</a>).

    <!-- Show the skeleton loader when the query is running -->
    <template v-if="loading">
      <v-skeleton-loader
        class="mx-auto"
        min-height="450px"
        min-width="100%"
        type="table"
      >
      </v-skeleton-loader>
    </template>

    <!-- Show the result -->
    <template v-else>
      <v-data-table
        :headers="headers"
        :items="rows"
        :items-per-page="-1"
        class="gtdb-table mt-5"
        dense
      >

        <!-- Count row -->
        <template v-slot:item.count="{ item }">
          {{ item.count.toLocaleString() }}
        </template>

      </v-data-table>
    </template>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';


export default Vue.extend({
  props: {
    rows: Array,
    loading: Boolean
  },
  data: () => ({
    headers: [
      {text: 'Release From', value: 'from'},
      {text: 'Release To', value: 'to'},
      {text: 'Count', value: 'count'}
    ],
  }),
})
</script>

<style scoped>

</style>
