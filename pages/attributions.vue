<template>
  <v-container class="gtdb-container">

    <v-card>

      <v-card-title class="text-h5">
        Attributions
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">
        <v-simple-table class="gtdb-table">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Resource
              </th>
              <th class="text-left">
                Description
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                <nuxt-link to="/taxon-history">Taxon history</nuxt-link>
              </td>
              <td>The taxon history page is a derivative work of <a href="https://observablehq.com/@d3/sankey-diagram">"Sankey
                Diagram"</a>
                by <a href="https://gist.github.com/mbostock" target="_blank">Mike Bostock</a>,
                used under the <a href="https://opensource.org/licenses/ISC" target="_blank">ISC license</a>.
              </td>
            </tr>
            <tr>
              <td>
                Website
              </td>
              <td>
                This website was developed using the <a href="https://nuxtjs.org/" target="_blank">Nuxt</a>
                framework for <a href="https://vuejs.org/" target="_blank">Vue.js</a> and was
                statically generated.
              </td>
            </tr>
            <tr>
              <td>
                UI Framework
              </td>
              <td>
                This website uses <a href="https://vuetifyjs.com/en/" target="_blank">Vuetify</a> as a base for the UI.
              </td>
            </tr>
            <tr>
              <td>
                <a :href="apiUrl" target="_blank">GTDB API</a>
              </td>
              <td>
                The API was generated using <a href="https://fastapi.tiangolo.com/" target="_blank">FastAPI</a>.
              </td>
            </tr>
            <tr>
              <td>
                Compute
              </td>
              <td>
                The GTDB website, file server, API, and database are all hosted in the Australian Research Data Commons (ARDC)
                <a href="https://ardc.edu.au/services/nectar-research-cloud/" target="_blank">Nectar Research Cloud</a>, on
                Queensland Cyber Infrastructure Foundation (QCIF) infrastructure.
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'Attributions',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `A list of attributions to third-party software used in creating the GTDB website.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `attributions, website, gtdb`
        }
      ]
    }
  },
  data: () => ({
    apiUrl: process.env.apiBase
  }),
})
</script>

<style scoped>

</style>
