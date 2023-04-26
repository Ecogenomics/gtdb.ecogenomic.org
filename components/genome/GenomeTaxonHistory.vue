<template>
  <v-card flat>
    <v-card-title>Taxon History</v-card-title>
    <v-card-text>
      <div
        v-if="apiFailed"
        class="rounded-lg errorBox pa-5"
      >
        <b>Error:</b> There was an API error loading the taxon history, please try again later.
      </div>
      <v-simple-table
        v-if="!apiFailed"
        dense
      >
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">
              Release
            </th>
            <th class="text-left">
              Domain
            </th>
            <th class="text-left">
              Phylum
            </th>
            <th class="text-left">
              Class
            </th>
            <th class="text-left">
              Order
            </th>
            <th class="text-left">
              Family
            </th>
            <th class="text-left">
              Genus
            </th>
            <th class="text-left">
              Species
            </th>
          </tr>
          </thead>

          <!-- Display this as the table body when the API is loading -->
          <tbody v-if="loading">
          <tr
            v-for="(trItem, trIdx) in [1, 2, 3, 4]"
            :key="trIdx"
          >
            <td
              :class="{
                                    'gtdb-green-bg-table': true,
                                    'rounded-tl': trIdx === 0,
                                    'rounded-bl': trIdx === rows.length - 1,
                                  }"
            >
              <v-skeleton-loader type="text"></v-skeleton-loader>
            </td>
            <td
              v-for="(tdItem, tdIdx) in [1, 2, 3, 4, 5, 6, 7]"
              :key="tdIdx"
            >
              <v-skeleton-loader type="text"></v-skeleton-loader>
            </td>
          </tr>
          </tbody>

          <!-- The API has loaded and is successful, show this -->
          <tbody v-else>
          <tr
            v-for="(item, index) in rows"
            :key="item.release"
          >
            <td :class="{
                'gtdb-green-bg-table': true,
                'rounded-tl': index === 0,
                'rounded-bl': index === rows.length - 1,
              }">{{ item.release }}
            </td>
            <td>
              <template v-if="item.d && item.d.length > 3">
                <nuxt-link :to="getHistUrl(item.d)">{{ item.d }}</nuxt-link>
              </template>
              <template v-else>
                {{ item.d }}
              </template>
            </td>
            <td>
              <template v-if="item.p && item.p.length > 3">
                <nuxt-link :to="getHistUrl(item.p)">{{ item.p }}</nuxt-link>
              </template>
              <template v-else>
                {{ item.p }}
              </template>
            </td>
            <td>
              <template v-if="item.c && item.c.length > 3">
                <nuxt-link :to="getHistUrl(item.c)">{{ item.c }}</nuxt-link>
              </template>
              <template v-else>
                {{ item.c }}
              </template>
            </td>
            <td>
              <template v-if="item.o && item.o.length > 3">
                <nuxt-link :to="getHistUrl(item.o)">{{ item.o }}</nuxt-link>
              </template>
              <template v-else>
                {{ item.o }}
              </template>
            </td>
            <td>
              <template v-if="item.f && item.f.length > 3">
                <nuxt-link :to="getHistUrl(item.f)">{{ item.f }}</nuxt-link>
              </template>
              <template v-else>
                {{ item.f }}
              </template>
            </td>
            <td>
              <template v-if="item.g && item.g.length > 3">
                <nuxt-link :to="getHistUrl(item.g)">{{ item.g }}</nuxt-link>
              </template>
              <template v-else>
                {{ item.g }}
              </template>
            </td>
            <td>
              <template v-if="item.s && item.s.length > 3">
                <nuxt-link :to="getHistUrl(item.s)">{{ item.s }}</nuxt-link>
              </template>
              <template v-else>
                {{ item.s }}
              </template>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import {mdiAlertCircle} from "@mdi/js";
import {GenomeTaxonHistory} from "~/assets/api/genome";

export default Vue.extend({
  props: {
    accession: {
      type: String,
      required: true
    }
  },
  watch: {
    accession(after, before) {
      after && before !== after && this.loadTaxonHist(after);
    }
  },
  data: () => ({
    // Icons
    mdiAlertCircleSvg: mdiAlertCircle,

    // API calls
    loading: true,
    apiFailed: false,

    // Each of the taxon history rows
    rows: [] as GenomeTaxonHistory[],
  }),
  mounted() {
    // Load the taxon history when this component is loaded
    this.loadTaxonHist(this.accession);
  },
  methods: {
    // Compute the taxon history URL for the current taxon
    getHistUrl(taxon: string) {
      return `/taxon-history?from=R80&to=R214&query=${encodeURIComponent(taxon)}`
    },

    // Retrieve the taxon history for this accession
    loadTaxonHist(accession: string) {
      this.loading = true;
      this.$api.genome.getTaxonHistory(accession)
        .then(response => {
          this.apiFailed = false;
          this.rows = response.data;
        })
        .catch((err) => {
          this.apiFailed = true;
          this.$accessor.api.defaultCatch(err);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
})
</script>

<style scoped>
.errorBox {
  background-color: #fcc6c6;
}
</style>
