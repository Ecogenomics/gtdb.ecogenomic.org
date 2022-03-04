<template>
  <v-card flat>
    <v-card-title>Genome Characteristics <GenomeDialogCharacteristics class="ml-1" /></v-card-title>
    <v-card-text>
      <v-simple-table dense>
          <tbody>
          <tr>
            <td class="gtdb-green-bg-table first-table-col rounded-tl">CheckM Completeness</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_gene.checkm_completeness == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_gene.checkm_completeness.toLocaleString() }}%
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">CheckM Contamination</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_gene.checkm_contamination == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_gene.checkm_contamination.toLocaleString() }}%
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">CheckM Strain Heterogeneity</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_gene.checkm_strain_heterogeneity == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_gene.checkm_strain_heterogeneity.toLocaleString() }}
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">5S Count</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_gene.lsu_5s_count == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_gene.lsu_5s_count.toLocaleString() }}
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">16S Count</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_gene.ssu_count == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_gene.ssu_count.toLocaleString() }}
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">23S Count</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_gene.lsu_23s_count == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_gene.lsu_23s_count.toLocaleString() }}
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">tRNA Count</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_nucleotide.trna_aa_count == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_nucleotide.trna_aa_count.toLocaleString() }}
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Contig Count</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_nucleotide.contig_count == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_nucleotide.contig_count.toLocaleString() }}
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">N50 Contigs</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_nucleotide.n50_contigs == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_nucleotide.n50_contigs.toLocaleString() }} bp
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Longest Contig</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_nucleotide.longest_contig == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_nucleotide.longest_contig.toLocaleString() }} bp
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Scaffold Count</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_nucleotide.scaffold_count == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_nucleotide.scaffold_count.toLocaleString() }}
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">N50 Scaffolds</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_nucleotide.n50_scaffolds == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_nucleotide.n50_scaffolds.toLocaleString() }} bp
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Longest Scaffold</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_nucleotide.longest_scaffold == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_nucleotide.longest_scaffold.toLocaleString() }} bp
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Genome Size</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_nucleotide.genome_size == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_nucleotide.genome_size.toLocaleString() }} bp
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Protein Count</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_gene.protein_count == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_gene.protein_count.toLocaleString() }}
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Coding Density</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_gene.coding_density == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ parseFloat(genomeCard.metadata_gene.coding_density).toFixed(2).toLocaleString() }}%
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">GC Percentage</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_nucleotide.gc_percentage == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ parseFloat(genomeCard.metadata_nucleotide.gc_percentage).toFixed(2).toLocaleString() }}%
                </template>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Ambiguous Bases</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadata_nucleotide.ambiguous_bases == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadata_nucleotide.ambiguous_bases.toLocaleString() }}
                </template>
              </template>
            </td>
          </tr>


          <template
            v-if="!isLoading && genomeCard.metadataTaxonomy.gtdb_representative && genomeCard.metadataTaxonomy.gtdb_genome_representative">
            <tr>
              <td class="gtdb-green-bg-table first-table-col">GTDB representative</td>

              <template v-if="genomeCard.metadataTaxonomy.gtdb_genome_representative == null">
                <NullChip/>
              </template>

              <template
                v-else-if="genomeCard.metadataTaxonomy.gtdb_genome_representative.startsWith('R') || genomeCard.metadataTaxonomy.gtdb_genome_representative.startsWith('G')">
                <td>
                  <nuxt-link :to="{
                    name: 'genome',
                    query: {
                      gid: genomeCard.metadataTaxonomy.gtdb_genome_representative.substring(3)
                    }
                  }">
                    {{ genomeCard.speciesRepName }}
                  </nuxt-link>
                </td>
              </template>
              <template v-else>
                <td>
                  <nuxt-link :to="{
                    name: 'genome',
                    query: {
                      gid: genomeCard.metadataTaxonomy.gtdb_genome_representative.substring(2)
                    }
                  }">
                    {{ genomeCard.speciesRepName }}
                  </nuxt-link>
                </td>
              </template>
            </tr>
          </template>

          <tr>
            <td class="gtdb-green-bg-table first-table-col rounded-bl">GTDB representative of species</td>
            <td>
              <template v-if="isLoading">
                <v-skeleton-loader
                  type="text"
                ></v-skeleton-loader>
              </template>
              <template v-else>
                <template v-if="genomeCard.metadataTaxonomy.gtdb_representative == null">
                  <NullChip/>
                </template>
                <template v-else>
                  {{ genomeCard.metadataTaxonomy.gtdb_representative }}
                </template>
              </template>
            </td>
          </tr>


          </tbody>


      </v-simple-table>

    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {GenomeCard} from "~/assets/api/genome";
import NullChip from "~/components/util/NullChip.vue";
import GenomeDialogCharacteristics from "~/components/genome/GenomeDialogCharacteristics.vue";

export default Vue.extend({
  components: {GenomeDialogCharacteristics, NullChip},
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
  data: () => ({}),
  methods: {}
})
</script>

<style scoped>
.first-table-col {
  width: 250px !important;
}
</style>
