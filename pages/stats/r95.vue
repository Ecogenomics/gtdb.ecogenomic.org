<template>
  <v-container class="gtdb-container">

    <SectionedPage :items="items" >

      <template #title>
        Release 95 statistics
      </template>

      <template #taxon-overview>
        GTDB r95 spans 194,600 genomes organized into 31,910 species clusters.
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
              <td>111</td>
              <td>18</td>
              <td>129</td>
            </tr>
            <tr>
              <td>Class</td>
              <td>327</td>
              <td>42</td>
              <td>369</td>
            </tr>
            <tr>
              <td>Order</td>
              <td>917</td>
              <td>103</td>
              <td>1,020</td>
            </tr>
            <tr>
              <td>Family</td>
              <td>2,282</td>
              <td>276</td>
              <td>2,558</td>
            </tr>
            <tr>
              <td>Genus</td>
              <td>8,778</td>
              <td>650</td>
              <td>9,428</td>
            </tr>
            <tr>
              <td>Species</td>
              <td>30,238</td>
              <td>1,672</td>
              <td>31,910</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>

      <template #species-overview>
        GTDB r95 is comprised of 191,527 bacterial and 3,073 archaeal genomes organized into 30,238 bacterial and 1,672
        archaeal species clusters. This is an increase of 48,862 (33.4%) genomes and 7,219 (29.2%) species clusters
        compared to GTDBr89. Of the 145,896 genomes in r89, 145,566 (99.77%) were assigned to the same species cluster
        in r95, 172 (0.12%) were assigned to a different species cluster in r95, and 158 (0.11%) are no longer present
        in the GTDB. Of the 24,706 species representatives in r89, 23,955 (96.96%) are unchanged in r95, 729 (2.95%)
        have been replaced with a preferred representative in r95 (e.g. type strain of species), 7(0.03%) are no longer
        present in the GTDB, and 15 (0.06%) were merged with another r95 species cluster.
        <v-simple-table class="gtdb-table mt-3" dense style="max-width: 500px;">
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
                Growth(%)
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Bacterial genomes</td>
              <td>143,512</td>
              <td>191,527</td>
              <td>33.5</td>
            </tr>
            <tr>
              <td>Archaeal genomes</td>
              <td>2,392</td>
              <td>3,073</td>
              <td>28.4</td>
            </tr>
            <tr>
              <td>Bacterial species clusters</td>
              <td>23,458</td>
              <td>30,238</td>
              <td>28.9</td>
            </tr>
            <tr>
              <td>Archaeal species clusters</td>
              <td>1,248</td>
              <td>1,672</td>
              <td>34.0</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>

      <template #genome-categories>
        GTDB taxa are comprised of isolate genomes, metagenome-assembled genomes (MAGs),
        and single-amplified genomes (SAGs). The following plot indicates the proportion of taxa at each
        taxonomic rank comprised exclusively of isolate genomes, exclusively of environmental genomes
        (i.e. MAGs/SAGs), or both isolate and environmental genomes.
        <ImgToggle
          :full="require('~/assets/images/stats/r95/genome-category-per-rank.png')"
          :preview="require('~/assets/images/stats/r95/genome-category-per-rank-small.jpg')"
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
          :full="require('~/assets/images/stats/r95/sp-rep-type.png')"
          :preview="require('~/assets/images/stats/r95/sp-rep-type-small.jpg')"
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
          :full="require('~/assets/images/stats/r95/genome-quality-species.png')"
          :preview="require('~/assets/images/stats/r95/genome-quality-species-small.jpg')"
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
              <td>Proteobacteria 9,474</td>
              <td>Gammaproteobacteria 5,779</td>
              <td>Burkholderiales 1,620</td>
              <td>Burkholderiaceae 1,096</td>
              <td>Streptomyces 571</td>
            </tr>
            <tr>
              <td>Actinobacteriota 4,261</td>
              <td>Alphaproteobacteria 3,659</td>
              <td>Pseudomonadales 1,503</td>
              <td>Flavobacteriaceae 871</td>
              <td>Pseudomonas_E 476</td>
            </tr>
            <tr>
              <td>Bacteroidota 3,781</td>
              <td>Bacteroidia 3,524</td>
              <td>Enterobacterales 1,448</td>
              <td>Lachnospiraceae 805</td>
              <td>Mycobacterium 287</td>
            </tr>
            <tr>
              <td>Firmicutes 2,737</td>
              <td>Actinomycetia 3,491</td>
              <td>Bacteroidales 1,367</td>
              <td>Rhodobacteraceae 754</td>
              <td>Prevotella 280</td>
            </tr>
            <tr>
              <td>Firmicutes_A 2,636</td>
              <td>Bacilli 2,702</td>
              <td>Flavobacteriales 1,304</td>
              <td>Mycobacteriaceae 671</td>
              <td>Streptococcus 270</td>
            </tr>
            <tr>
              <td>Patescibacteria 1,131</td>
              <td>Clostridia 2,361</td>
              <td>Actinomycetales 1,246</td>
              <td>Streptomycetaceae 635</td>
              <td>Flavobacterium 239</td>
            </tr>
            <tr>
              <td>Cyanobacteria 727</td>
              <td>Cyanobacteriia 648</td>
              <td>Rhizobiales 1,181</td>
              <td>Enterobacteriaceae 613</td>
              <td>Collinsella 223</td>
            </tr>
            <tr>
              <td>Desulfobacterota 560</td>
              <td>Paceibacteria 432</td>
              <td>Mycobacteriales 1,128</td>
              <td>Rhizobiaceae 607</td>
              <td>Prochlorococcus_A 178</td>
            </tr>
            <tr>
              <td>Halobacteriota 545</td>
              <td>Coriobacteriia 409</td>
              <td>Lachnospirales 866</td>
              <td>Pseudomonadaceae 597</td>
              <td>Vibrio 157</td>
            </tr>
            <tr>
              <td>Chloroflexota 520</td>
              <td>Verrucomicrobiae 367</td>
              <td>Lactobacillales 838</td>
              <td>Sphingomonadaceae 511</td>
              <td>Microbacterium 155</td>
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
              <td>Proteobacteria 92,617</td>
              <td>Gammaproteobacteria 83,163</td>
              <td>Enterobacterales 52,385</td>
              <td>Enterobacteriaceae 45,359</td>
              <td>Escherichia 19,596</td>
              <td>Escherichia flexneri 12,267</td>
            </tr>
            <tr>
              <td>Firmicutes 44,883</td>
              <td>Bacilli 44,844</td>
              <td>Lactobacillales 24,694</td>
              <td>Streptococcaceae 14,735</td>
              <td>Streptococcus 14,475</td>
              <td>Salmonella enterica 10,510</td>
            </tr>
            <tr>
              <td>Actinobacteriota 19,045</td>
              <td>Actinomycetia 17,443</td>
              <td>Pseudomonadales 15,826</td>
              <td>Staphylococcaceae 12,904</td>
              <td>Staphylococcus 12,748</td>
              <td>Staphylococcus aureus 10,497</td>
            </tr>
            <tr>
              <td>Firmicutes_A 8,008</td>
              <td>Alphaproteobacteria 9,386</td>
              <td>Staphylococcales 12,955</td>
              <td>Mycobacteriaceae 10,757</td>
              <td>Salmonella 10,729</td>
              <td>Streptococcus pneumoniae 8,340</td>
            </tr>
            <tr>
              <td>Bacteroidota 7,836</td>
              <td>Clostridia 7,534</td>
              <td>Mycobacteriales 11,486</td>
              <td>Pseudomonadaceae 9,264</td>
              <td>Mycobacterium 9,228</td>
              <td>Klebsiella pneumoniae 7,580</td>
            </tr>
            <tr>
              <td>Campylobacterota 4,994</td>
              <td>Bacteroidia 7,338</td>
              <td>Burkholderiales 9,893</td>
              <td>Burkholderiaceae 6,197</td>
              <td>Klebsiella 8,343</td>
              <td>Mycobacterium tuberculosis 6,514</td>
            </tr>
            <tr>
              <td>Patescibacteria 2,580</td>
              <td>Campylobacteria 4,985</td>
              <td>Campylobacterales 4,972</td>
              <td>Moraxellaceae 5,293</td>
              <td>Acinetobacter 4,996</td>
              <td>Pseudomonas aeruginosa 4,561</td>
            </tr>
            <tr>
              <td>Cyanobacteria 1,384</td>
              <td>Cyanobacteriia 1,235</td>
              <td>Rhizobiales 4,939</td>
              <td>Rhizobiaceae 3,941</td>
              <td>Pseudomonas 4,641</td>
              <td>Acinetobacter baumannii 3,975</td>
            </tr>
            <tr>
              <td>Spirochaetota 1,328</td>
              <td>Paceibacteria 993</td>
              <td>Bacillales 4,898</td>
              <td>Vibrionaceae 3,912</td>
              <td>Pseudomonas_E 4,067</td>
              <td>Escherichia coli 3,724</td>
            </tr>
            <tr>
              <td>Halobacteriota 992</td>
              <td>Coriobacteriia 809</td>
              <td>Bacteroidales 3,842</td>
              <td>Enterococcaceae 3,596</td>
              <td>Vibrio 3,576</td>
              <td>Clostridioides difficile 2,007</td>
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
          v-model="showRedAsD3"
          v-if="$vuetify.breakpoint.mdAndUp"
          inset
          color="blue"
          :label="`Interactive: ${showRedAsD3.toString()}`"
        ></v-switch>
        <template v-if="showRedAsD3">
          <REDr95></REDr95>
        </template>
        <template v-else>
          <h2>Bacteria</h2>
          <ImgToggle
            :full="require('~/assets/images/stats/r95/red-bacteria.png')"
            :preview="require('~/assets/images/stats/r95/red-bacteria.png')"
            class="mt-2"
            preview-max-width="800px;"
            preview-width="75%"
          >
          </ImgToggle>
          <h2>Archaea</h2>
          <ImgToggle
            :full="require('~/assets/images/stats/r95/red-archaea.png')"
            :preview="require('~/assets/images/stats/r95/red-archaea.png')"
            class="mt-2"
            preview-max-width="800px;"
            preview-width="75%"
          >
          </ImgToggle>
        </template>


      </template>

      <template #comparison-of-gtdb-and-ncbi-taxa>
        Comparison of GTDB and NCBI taxonomic assignments across GTDB species representative genomes and all
        GTDB genomes which have an assigned NCBI taxonomy. For each taxonomic rank, a taxon was classified as
        being unchanged if its name was identical in both taxonomies, passively changed if the GTDB taxonomy
        provided name information absent in the NCBI taxonomy, or actively changed if the name was different
        between the two taxonomies.
        <ImgToggle
          :full="require('~/assets/images/stats/r95/ncbi-compare-species.png')"
          :preview="require('~/assets/images/stats/r95/ncbi-compare-species-small.jpg')"
          class="mt-2"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
        <ImgToggle
          :full="require('~/assets/images/stats/r95/ncbi-compare-genomes.png')"
          :preview="require('~/assets/images/stats/r95/ncbi-compare-genomes-small.jpg')"
          class="mt-2"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
      </template>

      <template #genomic-statistics>
        Key genomic statistics for the GTDB species representative genomes and all genomes in the GTDB.
        <ImgToggle
          :full="require('~/assets/images/stats/r95/genomic-stats-species.png')"
          :preview="require('~/assets/images/stats/r95/genomic-stats-species-small.jpg')"
          class="mt-2"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
        <ImgToggle
          :full="require('~/assets/images/stats/r95/genomic-stats-genomes.png')"
          :preview="require('~/assets/images/stats/r95/genomic-stats-genomes-small.jpg')"
          class="mt-2"
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
import REDr95 from "~/components/stats/REDr95.vue";
import ImgToggle from "~/components/layout/ImgToggle.vue";

export default Vue.extend({
  components: {REDr95, SectionedPage, ImgToggle},
  head() {
    return {
      title: 'Statistics (R95)',
      meta: [
        {
          hid: 'stats/r95',
          name: 'description',
          content: `Statistics describing GTDB release R95.`
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
