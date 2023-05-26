<template>
  <v-card flat>
    <v-card-title>NCBI Metadata
      <GenomeDialogNcbiInfo class="ml-1"/>
    </v-card-title>
    <v-card-text>
      <template v-if="!isLoading">
        <v-simple-table dense>
          <tbody>


          <tr>
            <td class="gtdb-green-bg-table first-table-col">Assembly Level</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_assembly_level == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_assembly_level }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Assembly Name</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_assembly_name == null">
                <NullChip/>
              </template>
              <template v-else>
                <a
                  :href="`https://www.ncbi.nlm.nih.gov/data-hub/genome/${genomeCard.genome.accession}/`"
                  target="_blank"
                >
                  {{ genomeCard.metadata_ncbi.ncbi_assembly_name }}
                </a>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Assembly Type</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_assembly_type == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_assembly_type }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Bioproject</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_bioproject == null">
                <NullChip/>
              </template>
              <template v-else>
                <a
                  :href="`https://www.ncbi.nlm.nih.gov/bioproject/?term=${genomeCard.metadata_ncbi.ncbi_bioproject}`"
                  target="_blank"
                >
                  {{ genomeCard.metadata_ncbi.ncbi_bioproject }}
                </a>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Biosample</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_biosample == null">
                <NullChip/>
              </template>
              <template v-else>
                <a
                  :href="`https://www.ncbi.nlm.nih.gov/biosample/?term=${genomeCard.metadata_ncbi.ncbi_biosample}`"
                  target="_blank"
                >
                  {{ genomeCard.metadata_ncbi.ncbi_biosample }}
                </a>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Country</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_country == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_country }}
              </template>
            </td>
          </tr>
          <tr>
            <td class="gtdb-green-bg-table first-table-col">Date</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_date == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_date }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Genbank Assembly Accession</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_genbank_assembly_accession == null">
                <NullChip/>
              </template>
              <template v-else>
                <a
                  :href="`https://www.ncbi.nlm.nih.gov/data-hub/genome/${genomeCard.metadata_ncbi.ncbi_genbank_assembly_accession}/`"
                  target="_blank"
                >
                  {{ genomeCard.metadata_ncbi.ncbi_genbank_assembly_accession }}
                </a>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Genome Category</td>
            <td
              v-if="genomeCard.metadata_ncbi.ncbi_genome_category === 'derived from metagenome' || genomeCard.metadata_ncbi.ncbi_genome_category === 'derived from environmental_sample'">
              MAG
              <GenomeNcbiGenomeCatTooltip/>
            </td>
            <td v-else-if="genomeCard.metadata_ncbi.ncbi_genome_category === 'derived from single cell'">
              Single Cell
              <GenomeNcbiGenomeCatTooltip/>
            </td>
            <td
              v-else-if="genomeCard.metadata_ncbi.ncbi_genome_category !== null || genomeCard.metadata_ncbi.ncbi_genome_category === 'None'">
              <template v-if="genomeCard.metadata_ncbi.ncbi_genome_category == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_genome_category }}
              </template>
              <GenomeNcbiGenomeCatTooltip/>
            </td>
            <td v-else>
              Isolate
              <GenomeNcbiGenomeCatTooltip/>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Genome Representation</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_genome_representation == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_genome_representation }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Isolate</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_isolate == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_isolate }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Isolation Source</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_isolation_source == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_isolation_source }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Latitude Longitude</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_lat_lon == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_lat_lon }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Molecule Count</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_molecule_count == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_molecule_count.toLocaleString() }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">CDS Count</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_cds_count == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_cds_count.toLocaleString() }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Refseq Category</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_refseq_category == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_refseq_category }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Seq Rel Date</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_seq_rel_date == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_seq_rel_date }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Spanned Gaps</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_spanned_gaps == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_spanned_gaps }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Species Taxid</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_species_taxid == null">
                <NullChip/>
              </template>
              <template v-else>
                <a
                  :href="`https://www.ncbi.nlm.nih.gov/data-hub/taxonomy/${genomeCard.metadata_ncbi.ncbi_species_taxid}/`"
                  target="_blank">
                  {{ genomeCard.metadata_ncbi.ncbi_species_taxid }}
                </a>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">SSU Count</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_ssu_count == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_ssu_count }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Submitter</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_submitter == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_submitter }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Taxid</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_taxid == null">
                <NullChip/>
              </template>
              <template v-else>
                <a
                  :href="`https://www.ncbi.nlm.nih.gov/data-hub/taxonomy/${genomeCard.metadata_ncbi.ncbi_taxid}/`"
                  target="_blank">
                  {{ genomeCard.metadata_ncbi.ncbi_taxid }}
                </a>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Total Gap Length</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_total_gap_length == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_total_gap_length }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Translation Table</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_translation_table == null">
                <NullChip/>
              </template>
              <template v-else>
                <a
                  :href="`https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi#SG${genomeCard.metadata_ncbi.ncbi_translation_table}`"
                  target="_blank">
                  {{ genomeCard.metadata_ncbi.ncbi_translation_table }}
                </a>
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">tRNA Count (total)</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_trna_count == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_trna_count }}
              </template>
            </td>
          </tr>

          <tr>
            <td class="gtdb-green-bg-table first-table-col">Type Material</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_type_material_designation == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_type_material_designation }}
              </template>
            </td>
          </tr>


          <tr>
            <td class="gtdb-green-bg-table first-table-col">Unspanned Gaps</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_unspanned_gaps == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_unspanned_gaps }}
              </template>
            </td>
          </tr>


          <tr>
            <td class="gtdb-green-bg-table first-table-col">Version Status</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_version_status == null">
                <NullChip/>
              </template>
              <template v-else>
                {{ genomeCard.metadata_ncbi.ncbi_version_status }}
              </template>
            </td>
          </tr>


          <tr>
            <td class="gtdb-green-bg-table first-table-col">WGS Master</td>
            <td>
              <template v-if="genomeCard.metadata_ncbi.ncbi_wgs_master == null">
                <NullChip/>
              </template>
              <template v-else>
                <a
                  :href="`https://www.ncbi.nlm.nih.gov/nuccore/${genomeCard.metadata_ncbi.ncbi_wgs_master}`"
                  target="_blank"
                >
                  {{ genomeCard.metadata_ncbi.ncbi_wgs_master }}
                </a>
              </template>
            </td>
          </tr>


          </tbody>
        </v-simple-table>

      </template>

      <template v-else>
        <v-skeleton-loader
          type="table"
        ></v-skeleton-loader>
      </template>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {GenomeCard} from "~/assets/api/genome";
import NullChip from "~/components/util/NullChip.vue";
import GenomeDialogNcbiInfo from "~/components/genome/GenomeDialogNcbiInfo.vue";
import GenomeNcbiGenomeCatTooltip from "~/components/genome/GenomeNcbiGenomeCatTooltip.vue";

export default Vue.extend({
  components: {GenomeNcbiGenomeCatTooltip, GenomeDialogNcbiInfo, NullChip},
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

})
</script>

<style scoped>
.first-table-col {
  width: 250px !important;
}
</style>
