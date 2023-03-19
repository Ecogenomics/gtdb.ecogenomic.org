<template>
  <v-container class="gtdb-container">
    <v-card>

      <v-card-title>
        <div class="text-h5">
          <span style="font-style: italic; font-weight: 700;">{{ species }}</span> cluster
        </div>

        <div class="w-100 mt-1">
          <div v-if="!isLoading">
            <v-chip
              :href="`/tree?r=${encodeURIComponent(clusterData.d)}`"
              nuxt
              small
            >
              {{ clusterData.d }}
            </v-chip>
            <v-chip
              :href="`/tree?r=${encodeURIComponent(clusterData.p)}`"
              nuxt
              small
            >
              {{ clusterData.p }}
            </v-chip>
            <v-chip
              :href="`/tree?r=${encodeURIComponent(clusterData.c)}`"
              nuxt
              small
            >
              {{ clusterData.c }}
            </v-chip>
            <v-chip
              :href="`/tree?r=${encodeURIComponent(clusterData.o)}`"
              nuxt
              small
            >
              {{ clusterData.o }}
            </v-chip>
            <v-chip
              :href="`/tree?r=${encodeURIComponent(clusterData.f)}`"
              nuxt
              small
            >
              {{ clusterData.f }}
            </v-chip>
            <v-chip
              :href="`/tree?r=${encodeURIComponent(clusterData.g)}`"
              nuxt
              small
            >
              {{ clusterData.g }}
            </v-chip>
            <v-chip
              :href="`/tree?r=${encodeURIComponent(clusterData.s)}`"
              nuxt
              small
            >
              {{ clusterData.s }}
            </v-chip>

          </div>
          <div v-else class="d-flex">
            <v-skeleton-loader
              class="mr-1"
              type="chip"
            ></v-skeleton-loader>
            <v-skeleton-loader
              class="mr-1"
              type="chip"
            ></v-skeleton-loader>
            <v-skeleton-loader
              class="mr-1"
              type="chip"
            ></v-skeleton-loader>
            <v-skeleton-loader
              class="mr-1"
              type="chip"
            ></v-skeleton-loader>
            <v-skeleton-loader
              class="mr-1"
              type="chip"
            ></v-skeleton-loader>
            <v-skeleton-loader
              class="mr-1"
              type="chip"
            ></v-skeleton-loader>
            <v-skeleton-loader
              type="chip"
            ></v-skeleton-loader>
          </div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">

        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchString"
            :disabled="isLoading"
            dense
            hide-details
            label="Search"
            single-line
            style="max-width: 300px;"
          >

            <v-icon
              slot="prepend-inner"
              :disabled="isLoading"
            >
              {{ mdiMagnifySvg }}
            </v-icon>
          </v-text-field>
        </div>

        <v-data-table
          :footer-props="{'items-per-page-options': [50, 100, 250, 500, 1000]}"
          :headers="headers"
          :items="tableRows"
          :loading="isLoading"
          :search="searchString"
          class="gtdb-table mt-3"
          dense
          loading-text="Loading..."
        >
          <template v-slot:item.accession="{ item }">
            <nuxt-link :to="`/genome?gid=${encodeURIComponent(item.accession)}`">{{ item.accession }}</nuxt-link>
          </template>
        </v-data-table>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {SpeciesCluster} from "~/assets/api/species";
import {mdiMagnify} from "@mdi/js";
import {MetaInfo} from 'vue-meta'

export default Vue.extend({
  head(): MetaInfo {
    return {
      title: this.species,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `A list of all genomes in the ${this.species} species cluster.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `${this.species}, s__${this.species}, species, species cluster, cluster`
        }
      ]
    }
  },
  data: () => ({
    // Icons
    mdiMagnifySvg: mdiMagnify,

    // Table search string
    searchString: '',

    // If the API call is still running
    isLoading: true,

    // Species cluster information
    clusterData: ({} as SpeciesCluster),

    // Table headers
    headers: [
      {text: "Accession", value: "accession"},
      {text: "NCBI organism name", value: "ncbi_org_name"},
      {text: "NCBI taxonomy", value: "ncbi_tax"},
      {text: "GTDB species representative", value: "gtdb_species_rep"},
      {text: "NCBI type material", value: "ncbi_type_material"},
    ],
  }),
  computed: {
    tableRows() {
      return this.clusterData.genomes
    },
    species(): string {
      const species = this.$route.query.id || this.$route.query.s;
      if (species) {
        return species as string;
      } else {
        return 'Loading'
      }
    },
  },
  methods: {
    getSpeciesCluster() {
      this.isLoading = true;
      this.$api.species.getByName(this.species)
        .then((resp) => {
          this.clusterData = resp.data
        })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
          return this.$nuxt.error({statusCode: 404, message: `No species cluster found for "${this.species}".`});
        })
        .finally(() => {
          this.isLoading = false;
        })
    }
  },
  mounted() {
    this.getSpeciesCluster();
  }
})
</script>

<style scoped>

</style>
