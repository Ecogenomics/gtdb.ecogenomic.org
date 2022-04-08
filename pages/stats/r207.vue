<template>
  <v-container class="gtdb-container">

    <SectionedPage :items="items">

      <template #title>
        Release 207 statistics
      </template>

      <template #taxon-overview>
        GTDB R207 spans 317,542 genomes organized into 65,703 species clusters.
        <v-simple-table class="gtdb-table mt-3" dense style="max-width: 500px;">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">

              </th>
              <th class="text-left">
                Bacteria
              </th>
              <th class="text-left">
                Archaea
              </th>
              <th class="text-left">
                Total
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Phylum</td>
              <td>148</td>
              <td>18</td>
              <td>166</td>
            </tr>
            <tr>
              <td>Class</td>
              <td>425</td>
              <td>52</td>
              <td>477</td>
            </tr>
            <tr>
              <td>Order</td>
              <td>1,439</td>
              <td>132</td>
              <td>1,571</td>
            </tr>
            <tr>
              <td>Family</td>
              <td>3,614</td>
              <td>456</td>
              <td>4,070</td>
            </tr>
            <tr>
              <td>Genus</td>
              <td>15,342</td>
              <td>1,344</td>
              <td>16,686</td>
            </tr>
            <tr>
              <td>Species</td>
              <td>62,291</td>
              <td>3,412</td>
              <td>65,703</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>

      <template #species-overview>
        GTDB R207 is comprised of 311,480 bacterial and 6,062 archaeal genomes organized into 62,291 bacterial and 3,412
        archaeal species clusters.
        <v-simple-table class="gtdb-table mt-3" dense>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
              </th>
              <th class="text-left">
                R04-RS89
              </th>
              <th class="text-left">
                R05-RS95
              </th>
              <th class="text-left">
                R06-RS202
              </th>
              <th class="text-left">
                R07-RS207
              </th>
              <th class="text-left">
                Growth from R06-RS202 (%)
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Bacterial genomes</td>
              <td>143,512</td>
              <td>191,527</td>
              <td>254,090</td>
              <td>311,480</td>
              <td>22.59</td>
            </tr>
            <tr>
              <td>Archaeal genomes</td>
              <td>2,392</td>
              <td>3,073</td>
              <td>4,316</td>
              <td>6,062</td>
              <td>40.45</td>
            </tr>
            <tr>
              <td>Bacterial species clusters</td>
              <td>23,458</td>
              <td>30,238</td>
              <td>45,555</td>
              <td>62,291</td>
              <td>36.73</td>
            </tr>
            <tr>
              <td>Archaeal species clusters</td>
              <td>1,248</td>
              <td>1,672</td>
              <td>2,339</td>
              <td>3,412</td>
              <td>45.87</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>

      <template #genome-categories>
        GTDB taxa are comprised of isolate genomes, metagenome-assembled genomes (MAGs), and single-amplified genomes
        (SAGs). The following plot indicates the proportion of taxa at each taxonomic rank comprised exclusively of
        isolate genomes, exclusively of environmental genomes (i.e. MAGs/SAGs), or both isolate and environmental
        genomes.
        <ImgToggle
          :full="require('~/assets/images/stats/r207/genome-category-per-rank.png')"
          :preview="require('~/assets/images/stats/r207/genome-category-per-rank-small.jpg')"
          class="mt-2"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
      </template>

      <template #gtdb-species-representatives>
        Each GTDB species cluster is represented by a single genome. Genomes assembled from the type strain of the
        species were selected where possible, though the majority of species clusters are currently assigned only
        placeholder names. The proportion of representatives which are isolates, MAGs, or SAGs is given for each
        category.
        <ImgToggle
          :full="require('~/assets/images/stats/r207/sp-rep-type.png')"
          :preview="require('~/assets/images/stats/r207/sp-rep-type-small.jpg')"
          class="mt-2"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
      </template>

      <template #quality-of-gtdb-representative-genomes>
        The quality of the genomes selected as GTDB species representatives is given below.
        Genome completeness and contamination were estimated using
        <a href="https://github.com/Ecogenomics/CheckM" target="_blank">CheckM</a> and are colored based
        on the <a href="https://dx.doi.org/10.1038/nbt.3893" target="_blank">MIMAG genome standards</a>. In general,
        representative genomes were restricted to having a
        quality satisfying completeness - 5*contamination >50. A few exceptions exist in order to retain
        well-known species with abnormal CheckM quality estimates.
        <ImgToggle
          :full="require('~/assets/images/stats/r207/genome-quality-species.png')"
          :preview="require('~/assets/images/stats/r207/genome-quality-species-small.jpg')"
          class="mt-2"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
      </template>

      <template #taxa-with-the-largest-number-of-species>
        Taxa encompassing the largest number of GTDB species clusters is given for each taxonomic rank.
        <v-simple-table class="gtdb-table mt-2" dense>
          <template v-slot:default>
            <thead>
            <tr>
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
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Proteobacteria 17,350</td>
              <td>Gammaproteobacteria 9,582</td>
              <td>Bacteroidales 3,805</td>
              <td>Lachnospiraceae 2,184</td>
              <td>Streptomyces 855</td>
            </tr>
            <tr>
              <td>Bacteroidota 8,588</td>
              <td>Clostridia 8,185</td>
              <td>Burkholderiales 3,181</td>
              <td>Burkholderiaceae 2,063</td>
              <td>Pelagibacter 855</td>
            </tr>
            <tr>
              <td>Firmicutes_A 8,243</td>
              <td>Bacteroidia 8,033</td>
              <td>Oscillospirales 3,168</td>
              <td>Flavobacteriaceae 1,452</td>
              <td>Pseudomonas_E 626</td>
            </tr>
            <tr>
              <td>Actinobacteriota 7,328</td>
              <td>Alphaproteobacteria 7,684</td>
              <td>Lachnospirales 2,360</td>
              <td>Rhodobacteraceae 1,187</td>
              <td>Prevotella 554</td>
            </tr>
            <tr>
              <td>Firmicutes 4,216</td>
              <td>Actinomycetia 5,591</td>
              <td>Flavobacteriales 2,233</td>
              <td>Bacteroidaceae 1,135</td>
              <td>Collinsella 403</td>
            </tr>
            <tr>
              <td>Patescibacteria 2,485</td>
              <td>Bacilli 4,215</td>
              <td>Pseudomonadales 2,152</td>
              <td>Pelagibacteraceae 1,134</td>
              <td>Flavobacterium 395</td>
            </tr>
            <tr>
              <td>Chloroflexota 1,387</td>
              <td>Cyanobacteriia 1,113</td>
              <td>Actinomycetales 1,980</td>
              <td>Streptomycetaceae 924</td>
              <td>Mycobacterium 370</td>
            </tr>
            <tr>
              <td>Cyanobacteria 1,372</td>
              <td>Paceibacteria 961</td>
              <td>Enterobacterales 1,767</td>
              <td>Acutalibacteraceae 919</td>
              <td>Streptococcus 365</td>
            </tr>
            <tr>
              <td>Verrucomicrobiota 1,325</td>
              <td>Verrucomicrobiae 912</td>
              <td>Rhizobiales 1,709</td>
              <td>Mycobacteriaceae 891</td>
              <td>Cryptobacteroides 361</td>
            </tr>
            <tr>
              <td>Planctomycetota 1,071</td>
              <td>Coriobacteriia 779</td>
              <td>Mycobacteriales 1,620</td>
              <td>Sphingomonadaceae 883</td>
              <td>Prochlorococcus_A 272</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>

      <template #taxa-with-the-largest-number-of-sequenced-genomes>
        Taxa encompassing the largest number of genomes in the GTDB is given for each taxonomic ranks.
        <v-simple-table class="gtdb-table mt-2" dense>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">Phylum</th>
              <th class="text-left">Class</th>
              <th class="text-left">Order</th>
              <th class="text-left">Family</th>
              <th class="text-left">Genus</th>
              <th class="text-left">Species</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Proteobacteria 141,114</td>
              <td>Gammaproteobacteria 121,804</td>
              <td>Enterobacterales 74,108</td>
              <td>Enterobacteriaceae 63,971</td>
              <td>Escherichia 27,205</td>
              <td>Escherichia coli 26,859</td>
            </tr>
            <tr>
              <td>Firmicutes 61,795</td>
              <td>Bacilli 61,794</td>
              <td>Lactobacillales 32,177</td>
              <td>Staphylococcaceae 17,191</td>
              <td>Staphylococcus 16,835</td>
              <td>Staphylococcus aureus 13,059</td>
            </tr>
            <tr>
              <td>Actinobacteriota 28,532</td>
              <td>Actinomycetia 24,379</td>
              <td>Pseudomonadales 22,407</td>
              <td>Streptococcaceae 17,088</td>
              <td>Streptococcus 16,657</td>
              <td>Salmonella enterica 12,285</td>
            </tr>
            <tr>
              <td>Firmicutes_A 21,744</td>
              <td>Clostridia 21,601</td>
              <td>Staphylococcales 17,289</td>
              <td>Mycobacteriaceae 12,366</td>
              <td>Klebsiella 13,720</td>
              <td>Klebsiella pneumoniae 11,294</td>
            </tr>
            <tr>
              <td>Bacteroidota 20,893</td>
              <td>Bacteroidia 19,504</td>
              <td>Burkholderiales 15,809</td>
              <td>Pseudomonadaceae 12,187</td>
              <td>Salmonella 12,544</td>
              <td>Streptococcus pneumoniae 8,452</td>
            </tr>
            <tr>
              <td>Campylobacterota 6,845</td>
              <td>Alphaproteobacteria 19,166</td>
              <td>Mycobacteriales 13,541</td>
              <td>Burkholderiaceae 10,295</td>
              <td>Mycobacterium 9,983</td>
              <td>Mycobacterium tuberculosis 6,836</td>
            </tr>
            <tr>
              <td>Patescibacteria 4,645</td>
              <td>Campylobacteria 6,825</td>
              <td>Bacteroidales 11,844</td>
              <td>Moraxellaceae 7,998</td>
              <td>Acinetobacter 7,409</td>
              <td>Pseudomonas aeruginosa 5,623</td>
            </tr>
            <tr>
              <td>Verrucomicrobiota 2,848</td>
              <td>Cyanobacteriia 2,387</td>
              <td>Campylobacterales 6,808</td>
              <td>Lachnospiraceae 6,306</td>
              <td>Pseudomonas 5,738</td>
              <td>Acinetobacter baumannii 5,417</td>
            </tr>
            <tr>
              <td>Cyanobacteria 2,818</td>
              <td>Verrucomicrobiae 2,221</td>
              <td>Oscillospirales 6,803</td>
              <td>Vibrionaceae 5,492</td>
              <td>Pseudomonas_E 5,692</td>
              <td>Clostridioides difficile 2,225</td>
            </tr>
            <tr>
              <td>Spirochaetota 2,331</td>
              <td>Coriobacteriia 1,961</td>
              <td>Lachnospirales 6,595</td>
              <td>Enterococcaceae 5,353</td>
              <td>Vibrio 5,056</td>
              <td>Enterococcus_B faecium 2,177</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>

      <template #relative-evolutionary-divergence>
        The following graphs show the relative evolutionary divergence (RED) of taxa at each taxonomic rank from
        phylum to genus. RED values provide an operational approximation of relative time with extant taxa existing
        in the present (RED=1), the last common ancestor occurring at a fixed time in the past (RED=0), and internal
        nodes being linearly interpolated between these values according to lineage-specific rates of evolution. RED
        intervals for normalizing taxa at taxonomic ranks was operationally defined as the median RED value
        (indicated by a blue bar) at each rank ±0.1 (indicated by grey bars).

        <v-switch
          v-if="$vuetify.breakpoint.mdAndUp"
          v-model="showRedAsD3"
          :label="`Interactive: ${showRedAsD3.toString()}`"
          color="blue"
          inset
        ></v-switch>
        <template v-if="showRedAsD3">
          <REDr207></REDr207>
        </template>
        <template v-else>
          <h2>Bacteria</h2>
          <ImgToggle
            :full="require('~/assets/images/stats/r207/red-bacteria.png')"
            :preview="require('~/assets/images/stats/r207/red-bacteria.png')"
            class="mt-2"
            preview-max-width="800px;"
            preview-width="75%"
          >
          </ImgToggle>

          <hr>

          <h2>Archaea</h2>
          <ImgToggle
            :full="require('~/assets/images/stats/r207/red-archaea.png')"
            :preview="require('~/assets/images/stats/r207/red-archaea.png')"
            class="mt-3"
            preview-max-width="800px;"
            preview-width="75%"
          >
          </ImgToggle>
        </template>
      </template>

      <template #comparison-of-gtdb-and-ncbi-taxa>
        Comparison of GTDB and NCBI taxonomic assignments across GTDB species representative genomes and all GTDB
        genomes which have an assigned NCBI taxonomy. For each taxonomic rank, a taxon was classified as being unchanged
        if its name was identical in both taxonomies, passively changed if the GTDB taxonomy provided name information
        absent in the NCBI taxonomy, or actively changed if the name was different between the two taxonomies.
        <ImgToggle
          :full="require('~/assets/images/stats/r207/ncbi-compare-species.png')"
          :preview="require('~/assets/images/stats/r207/ncbi-compare-species-small.jpg')"
          class="mt-2"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
        <hr>
        <ImgToggle
          :full="require('~/assets/images/stats/r207/ncbi-compare-genomes.png')"
          :preview="require('~/assets/images/stats/r207/ncbi-compare-genomes-small.jpg')"
          class="mt-3"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
      </template>

      <template #genomic-statistics>
        Key genomic statistics for the GTDB species representative genomes and all genomes in the GTDB.

        <h2>Genomes</h2>
        <ImgToggle
          :full="require('~/assets/images/stats/r207/genomic-stats-genomes.png')"
          :preview="require('~/assets/images/stats/r207/genomic-stats-genomes-small.jpg')"
          class="mt-2"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>

        <hr>

        <h2>Species</h2>
        <ImgToggle
          :full="require('~/assets/images/stats/r207/genomic-stats-species.png')"
          :preview="require('~/assets/images/stats/r207/genomic-stats-species-small.jpg')"
          class="mt-3"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
      </template>

    </SectionedPage>
  </v-container>

</template>

<script lang="ts">
import Vue from 'vue'

import SectionedPage from "~/components/layout/SectionedPage.vue";
import REDr207 from "~/components/stats/REDr207.vue";
import ImgToggle from "~/components/layout/ImgToggle.vue";

export default Vue.extend({
  components: {REDr207, SectionedPage, ImgToggle},
  head() {
    return {
      title: 'Statistics (R207)',
      meta: [
        {
          hid: 'stats/r207',
          name: 'description',
          content: `Statistics describing GTDB release R202.`
        }
      ]
    }
  },
  data: () => ({
    items: [
      {text: 'Taxon overview', ref: 'taxon-overview'},
      {text: 'Species overview', ref: 'species-overview'},
      {text: 'Genome categories', ref: 'genome-categories'},
      {text: 'GTDB species representatives', ref: 'gtdb-species-representatives'},
      {text: 'Quality of GTDB representative genomes', ref: 'quality-of-gtdb-representative-genomes'},
      {text: 'Taxa with the largest number of species', ref: 'taxa-with-the-largest-number-of-species'},
      {
        text: 'Taxa with the largest number of sequenced genomes',
        ref: 'taxa-with-the-largest-number-of-sequenced-genomes'
      },
      {text: 'Relative evolutionary divergence', ref: 'relative-evolutionary-divergence'},
      {text: 'Comparison of GTDB and NCBI taxa', ref: 'comparison-of-gtdb-and-ncbi-taxa'},
      {text: 'Genomic statistics', ref: 'genomic-statistics'},
    ],

    showRedAsD3: false,
  }),
})
</script>

<style scoped>

</style>
