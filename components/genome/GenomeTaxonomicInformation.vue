<template>
  <v-card flat>
    <v-card-title>Taxonomic Information
      <GenomeDialogTaxInfo class="ml-1"/>
    </v-card-title>
    <v-card-text>
      <v-simple-table dense>
        <tbody>

        <!-- GTDB Taxonomy -->
        <tr>
          <td class="gtdb-green-bg-table first-table-col rounded-tl">GTDB Taxonomy</td>
          <template v-if="isLoading">
            <td>
              <v-skeleton-loader
                type="text"
              ></v-skeleton-loader>
            </td>
          </template>
          <template v-else>
            <td v-if="genomeCard.metadataTaxonomy.gtdbPhylum && genomeCard.metadataTaxonomy.gtdbPhylum !== 'p__'">
              <nuxt-link :to="`/tree?r=${genomeCard.metadataTaxonomy.gtdbDomain}`">
                {{ genomeCard.metadataTaxonomy.gtdbDomain }};
              </nuxt-link>
              <nuxt-link :to="`/tree?r=${genomeCard.metadataTaxonomy.gtdbPhylum}`">
                {{ genomeCard.metadataTaxonomy.gtdbPhylum }};
              </nuxt-link>
              <nuxt-link :to="`/tree?r=${genomeCard.metadataTaxonomy.gtdbClass}`">
                {{ genomeCard.metadataTaxonomy.gtdbClass }};
              </nuxt-link>
              <nuxt-link :to="`/tree?r=${genomeCard.metadataTaxonomy.gtdbOrder}`">
                {{ genomeCard.metadataTaxonomy.gtdbOrder }};
              </nuxt-link>
              <nuxt-link :to="`/tree?r=${genomeCard.metadataTaxonomy.gtdbFamily}`">
                {{ genomeCard.metadataTaxonomy.gtdbFamily }};
              </nuxt-link>
              <nuxt-link :to="`/tree?r=${genomeCard.metadataTaxonomy.gtdbGenus}`">
                {{ genomeCard.metadataTaxonomy.gtdbGenus }};
              </nuxt-link>
              <template v-if="genomeCard.metadataTaxonomy.gtdbSpecies !== 's__'">
                <nuxt-link :to="`/tree?r=${genomeCard.metadataTaxonomy.gtdbSpecies}`">
                  {{ genomeCard.metadataTaxonomy.gtdbSpecies }}
                </nuxt-link>
              </template>
              <template v-else>
                {{ genomeCard.metadataTaxonomy.gtdbSpecies }}
              </template>
            </td>
            <td v-else>Undefined (Failed Quality Check)</td>
          </template>
        </tr>

        <!-- Filtered NCBI taxonomy -->
        <tr>
          <td class="gtdb-green-bg-table first-table-col">Filtered NCBI Taxonomy</td>
          <template v-if="isLoading">
            <td>
              <v-skeleton-loader
                type="text"
              ></v-skeleton-loader>
            </td>
          </template>
          <template v-else>
            <td v-if="genomeCard.ncbiTaxonomyFiltered">
                <span
                  v-for="(item, index) in genomeCard.ncbiTaxonomyFiltered"
                  :key="index"
                >
                  <template v-if="item.taxonId">
                    <a
                      :href="`https://www.ncbi.nlm.nih.gov/data-hub/taxonomy/${item.taxonId}/`"
                      target="_blank">
                      {{ item.taxon }}<template v-if="index !== genomeCard.ncbiTaxonomyFiltered.length - 1">;</template>
                    </a>
                  </template>
                  <template v-else>
                    {{ item.taxon }}<template v-if="index !== genomeCard.ncbiTaxonomyFiltered.length - 1">;</template>
                  </template>
                </span>

              <v-tooltip bottom max-width="400px">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ mdiHelpCircleSvg }}
                  </v-icon>
                </template>
                <span>The NCBI taxonomy associated with the reference genomes was obtained from the NCBI Taxonomy FTP. &#013;
							This taxonomy was standardized to seven ranks (domain to species) by removing non-standard ranks and identifying missing standard ranks with rank prefixes. &#013;
							Standard ranks were also prefixed with rank identifiers as previously described (McDonald et al., 2012).</span>
              </v-tooltip>

            </td>
            <td v-else>
              Undefined

              <v-tooltip bottom max-width="400px">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ mdiHelpCircleSvg }}
                  </v-icon>
                </template>
                <span>The NCBI taxonomy associated with the reference genomes was obtained from the NCBI Taxonomy FTP. &#013;
							This taxonomy was standardized to seven ranks (domain to species) by removing non-standard ranks and identifying missing standard ranks with rank prefixes. &#013;
							Standard ranks were also prefixed with rank identifiers as previously described (McDonald et al., 2012).</span>
              </v-tooltip>

            </td>
          </template>
        </tr>

        <!-- Unfiltered NCBI taxonomy -->
        <tr>
          <td class="gtdb-green-bg-table first-table-col">Unfiltered NCBI Taxonomy</td>
          <template v-if="isLoading">
            <td>
              <v-skeleton-loader
                type="text"
              ></v-skeleton-loader>
            </td>
          </template>
          <template v-else>
            <td v-if="genomeCard.ncbiTaxonomyUnfiltered">
                <span
                  v-for="(item, index) in genomeCard.ncbiTaxonomyUnfiltered"
                  :key="index"
                >
                  <template v-if="item.taxonId">
                    <a
                      :href="`https://www.ncbi.nlm.nih.gov/data-hub/taxonomy/${item.taxonId}/`"
                      target="_blank">
                      {{ item.taxon }}<template
                      v-if="index !== genomeCard.ncbiTaxonomyUnfiltered.length - 1">;</template>
                    </a>
                  </template>
                  <template v-else>
                    {{ item.taxon }}<template v-if="index !== genomeCard.ncbiTaxonomyUnfiltered.length - 1">;</template>
                  </template>
                </span>
            </td>
            <td v-else>
              Undefined
            </td>
          </template>
        </tr>

        <!-- NCBI Strain Identifiers -->
        <tr>
          <td class="gtdb-green-bg-table first-table-col"> NCBI strain identifiers</td>
          <template v-if="isLoading">
            <td>
              <v-skeleton-loader
                type="text"
              ></v-skeleton-loader>
            </td>
          </template>
          <template v-else>

            <td v-if="genomeCard.metadata_ncbi.ncbi_strain_identifiers">
              {{ genomeCard.metadata_ncbi.ncbi_strain_identifiers }}
            </td>
            <td v-else>
            </td>
          </template>
        </tr>

        <!-- GTDB Type material designation -->
        <tr>
          <td class="gtdb-green-bg-table first-table-col">Type Material Designation</td>
          <template v-if="isLoading">
            <td>
              <v-skeleton-loader
                type="text"
              ></v-skeleton-loader>
            </td>
          </template>
          <template v-else>
            <td v-if="genomeCard.gtdbTypeDesignation">
              {{ genomeCard.gtdbTypeDesignation }}
              <template
                v-if="genomeCard.metadata_type_material && genomeCard.metadata_type_material.gtdbTypeSpeciesOfGenus === true">
                ; type species of genus
              </template>
            </td>
            <td v-else>
              not type material
            </td>
          </template>
        </tr>

        <!-- GTDB representative of species -->
        <tr>
          <td class="gtdb-green-bg-table first-table-col rounded-bl">GTDB Representative of Species</td>
          <template v-if="isLoading">
            <td>
              <v-skeleton-loader
                type="text"
              ></v-skeleton-loader>
            </td>
          </template>
          <template v-else>
            <td
              v-if="!genomeCard.metadataTaxonomy.gtdb_representative && genomeCard.metadataTaxonomy.gtdb_genome_representative !== null">
              <template
                v-if="genomeCard.metadataTaxonomy.gtdb_genome_representative.startsWith('R') || genomeCard.metadataTaxonomy.gtdb_genome_representative.startsWith('G')">
                {{ genomeCard.metadataTaxonomy.gtdb_representative }} (representative is
                <nuxt-link
                  :to="`/genome?gid=${ genomeCard.metadataTaxonomy.gtdb_genome_representative.substring(3) }`">
                  {{ genomeCard.speciesRepName }}
                </nuxt-link>
                )
              </template>
              <template v-else>
                {{ genomeCard.metadataTaxonomy.gtdb_representative }} (representative is
                <nuxt-link
                  :to="`/genome?gid=${ genomeCard.metadataTaxonomy.gtdb_genome_representative.substring(2) }`">
                  {{ genomeCard.speciesRepName }}
                </nuxt-link>
                )
              </template>
            </td>
            <td v-else>
              {{ genomeCard.metadataTaxonomy.gtdb_representative }}
              <template v-if="genomeCard.speciesClusterCount !== null && genomeCard.speciesClusterCount > 0">
                <nuxt-link
                  :to="`/species?id=${encodeURIComponent(genomeCard.metadataTaxonomy.gtdbSpecies.substring(3))}`">
                  ({{ genomeCard.speciesClusterCount.toLocaleString() }}
                  {{ genomeCard.speciesClusterCount === 1 ? 'genome' : 'genomes' }} in species cluster)
                </nuxt-link>
              </template>
            </td>
          </template>
        </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {GenomeCard} from "~/assets/api/genome";
import GenomeDialogTaxInfo from "~/components/genome/GenomeDialogTaxInfo.vue";
import {mdiHelpCircle} from "@mdi/js";

export default Vue.extend({
  components: {GenomeDialogTaxInfo},
  props: {
    genomeCard: {
      type: Object as PropType<GenomeCard>,
      required: true
    }
  },
  computed: {
    isLoading(): boolean {
      return this.genomeCard.metadataTaxonomy == null;
    }
  },
  data: () => ({
    mdiHelpCircleSvg: mdiHelpCircle,
  }),
  methods: {}
})
</script>

<style scoped>
.first-table-col {
  width: 250px !important;
}
</style>
