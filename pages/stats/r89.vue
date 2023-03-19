<template>

  <v-container class="gtdb-container">

  <SectionedPage :items="items">

    <template #title>
      <StatsTitle date="June 17, 2019" release="89"/>
    </template>

    <template #taxon-overview>
      <span>GTDB r89 spans 145,904 genomes organized into 24,706 species clusters.</span>
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
            <td>112</td>
            <td>16</td>
            <td>128</td>
          </tr>
          <tr>
            <td>Class</td>
            <td>296</td>
            <td>36</td>
            <td>332</td>
          </tr>
          <tr>
            <td>Order</td>
            <td>816</td>
            <td>96</td>
            <td>912</td>
          </tr>
          <tr>
            <td>Family</td>
            <td>1,969</td>
            <td>238</td>
            <td>2,207</td>
          </tr>
          <tr>
            <td>Genus</td>
            <td>7,372</td>
            <td>534</td>
            <td>7,906</td>
          </tr>
          <tr>
            <td>Species</td>
            <td>23,458</td>
            <td>1,248</td>
            <td>24,706</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </template>

    <template #genome-categories>
          <span>GTDB taxa are comprised of isolate genomes, metagenome-assembled genomes (MAGs),
          and single-amplified genomes (SAGs). The following plot indicates the proportion of taxa at each
          taxonomic rank comprised exclusively of isolate genomes, exclusively of environmental genomes
          (i.e. MAGs/SAGs), or both isolate and environmental genomes.</span>
      <ImgToggle
        :full="require('~/assets/images/stats/r89/genome-category-per-rank.png')"
        :preview="require('~/assets/images/stats/r89/genome-category-per-rank-small.jpg')"
        class="mt-2"
        preview-max-width="800px;"
        preview-width="100%"
      >
      </ImgToggle>
    </template>

    <template #gtdb-species-representatives>
      Each GTDB species cluster is represented by a single genome. Genomes assembled from the type strain of the
      species were selected where possible, though the majority of species clusters are currently assigned only
      placeholder names. The proportion of species clusters comprised of isolates or environmental genomes is given
      for each species category.
      <ImgToggle
        :full="require('~/assets/images/stats/r89/sp-rep-type.png')"
        :preview="require('~/assets/images/stats/r89/sp-rep-type-small.jpg')"
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
        :full="require('~/assets/images/stats/r89/genome-quality-species.png')"
        :preview="require('~/assets/images/stats/r89/genome-quality-species-small.jpg')"
        class="mt-2"
        preview-max-width="800px;"
        preview-width="50%"
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
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Bacteria 23,458</td>
            <td>Proteobacteria 7,630</td>
            <td>Gammaproteobacteria 4,645</td>
            <td>Burkholderiales 1,273</td>
            <td>Burkholderiaceae 856</td>
            <td>Streptomyces 470</td>
          </tr>
          <tr>
            <td>Archaea 1,248</td>
            <td>Actinobacteriota 3,118</td>
            <td>Alphaproteobacteria 2,955</td>
            <td>Pseudomonadales 1,270</td>
            <td>Flavobacteriaceae 675</td>
            <td>Pseudomonas_E 404</td>
          </tr>
          <tr>
            <td></td>
            <td>Bacteroidota 2,843</td>
            <td>Actinobacteria 2,735</td>
            <td>Enterobacterales 1,186</td>
            <td>Lachnospiraceae 615</td>
            <td>Prevotella 229</td>
          </tr>
          <tr>
            <td></td>
            <td>Firmicutes_A 1,886</td>
            <td>Bacteroidia 2,677</td>
            <td>Flavobacteriales 1,045</td>
            <td>Mycobacteriaceae 611</td>
            <td>Streptococcus 224</td>
          </tr>
          <tr>
            <td></td>
            <td>Firmicutes 1,878</td>
            <td>Bacilli 1,878</td>
            <td>Bacteroidales 1,029</td>
            <td>Rhodobacteraceae 578</td>
            <td>Prochlorococcus_A 178</td>
          </tr>
          <tr>
            <td></td>
            <td>Patescibacteria 1,031</td>
            <td>Clostridia 1,836</td>
            <td>Rhizobiales 961</td>
            <td>Streptomycetaceae 528</td>
            <td>Flavobacterium 176</td>
          </tr>
          <tr>
            <td></td>
            <td>Cyanobacteria 654</td>
            <td>Cyanobacteriia 597</td>
            <td>Mycobacteriales 948</td>
            <td>Pseudomonadaceae 514</td>
            <td>Vibrio 140</td>
          </tr>
          <tr>
            <td></td>
            <td>Halobacterota 411</td>
            <td>Paceibacteria 392</td>
            <td>Actinomycetales 944</td>
            <td>Enterobacteriaceae 509</td>
            <td>Corynebacterium 133</td>
          </tr>
          <tr>
            <td></td>
            <td>Verrucomicrobiota 358</td>
            <td>Verrucomicrobiae 292</td>
            <td>Lactobacillales 674</td>
            <td>Rhizobiaceae 476</td>
            <td>Mycolicibacterium 122</td>
          </tr>
          <tr>
            <td></td>
            <td>Chloroflexota 350</td>
            <td>Bacilli_A 283</td>
            <td>Lachnospirales 662</td>
            <td>Sphingomonadaceae 398</td>
            <td>Microbacterium 119</td>
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
            <th class="text-left">Domain</th>
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
            <td>Bacteria 143,512</td>
            <td>Proteobacteria 65,677</td>
            <td>Gammaproteobacteria 58,746</td>
            <td>Enterobacterales 37,723</td>
            <td>Enterobacteriaceae 32,509</td>
            <td>Escherichia 13,879</td>
            <td>Staphylococcus aureus 9,444</td>
          </tr>
          <tr>
            <td>Archaea 2,392</td>
            <td>Firmicutes 36,312</td>
            <td>Bacilli 36,312</td>
            <td>Lactobacillales 19,567</td>
            <td>Streptococcaceae 12,474</td>
            <td>Streptococcus 12,273</td>
            <td>Escherichia flexneri 9,084</td>
          </tr>
          <tr>
            <td></td>
            <td>Actinobacteriota 14,912</td>
            <td>Actinobacteria 14,045</td>
            <td>Staphylococcales 11,372</td>
            <td>Staphylococcaceae 11,330</td>
            <td>Staphylococcus 11,225</td>
            <td>Salmonella enterica 8,698</td>
          </tr>
          <tr>
            <td></td>
            <td>Bacteroidota 5,620</td>
            <td>Alphaproteobacteria 6,870</td>
            <td>Pseudomonadales 10,071</td>
            <td>Mycobacteriaceae 9,384</td>
            <td>Salmonella 8,878</td>
            <td>Streptococcus pneumoniae 8,201</td>
          </tr>
          <tr>
            <td></td>
            <td>Firmicutes_A 5,049</td>
            <td>Bacteroidia 5,288</td>
            <td>Mycobacteriales 9,911</td>
            <td>Pseudomonadaceae 5,171</td>
            <td>Mycobacterium 6,112</td>
            <td>Mycobacterium tuberculosis 5,596</td>
          </tr>
          <tr>
            <td></td>
            <td>Campylobacterota 3,912</td>
            <td>Clostridia 4,929</td>
            <td>Burkholderiales 7,087</td>
            <td>Burkholderiaceae 4,378</td>
            <td>Klebsiella 4,527</td>
            <td>Klebsiella pneumoniae 4,086</td>
          </tr>
          <tr>
            <td></td>
            <td>Patescibacteria 2,469</td>
            <td>Campylobacteria 3,903</td>
            <td>Bacillales 4,037</td>
            <td>Moraxellaceae 3,831</td>
            <td>Acinetobacter 3,623</td>
            <td>Acinetobacter baumannii 2,796</td>
          </tr>
          <tr>
            <td></td>
            <td>Cyanobacteria 1,158</td>
            <td>Cyanobacteriia 1,048</td>
            <td>Campylobacterales 3,894</td>
            <td>Vibrionaceae 2,937</td>
            <td>Pseudomonas 2,808</td>
            <td>Pseudomonas aeruginosa 2,744</td>
          </tr>
          <tr>
            <td></td>
            <td>Spirochaetota 1,096</td>
            <td>Paceibacteria 942</td>
            <td>Rhizobiales 3,317</td>
            <td>Listeriaceae 2,579</td>
            <td>Vibrio 2,643</td>
            <td>Escherichia coli 2,432</td>
          </tr>
          <tr>
            <td></td>
            <td>Halobacterota 758</td>
            <td>Verrucomicrobiae 607</td>
            <td>Bacteroidales 2,614</td>
            <td>Campylobacteraceae 2,490</td>
            <td>Listeria 2,568</td>
            <td>Mycobacteroides abscessus 1,589</td>
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
        <REDr89></REDr89>
      </template>
      <template v-else>
        <h2>Bacteria</h2>
        <ImgToggle
          :full="require('~/assets/images/stats/r89/red-bacteria.png')"
          :preview="require('~/assets/images/stats/r89/red-bacteria.png')"
          class="mt-2"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
        <h2>Archaea</h2>
        <ImgToggle
          :full="require('~/assets/images/stats/r89/red-archaea.png')"
          :preview="require('~/assets/images/stats/r89/red-archaea.png')"
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
        :full="require('~/assets/images/stats/r89/ncbi-compare-species.png')"
        :preview="require('~/assets/images/stats/r89/ncbi-compare-species-small.jpg')"
        class="mt-2"
        preview-max-width="800px;"
        preview-width="75%"
      >
      </ImgToggle>
      <ImgToggle
        :full="require('~/assets/images/stats/r89/ncbi-compare-genomes.png')"
        :preview="require('~/assets/images/stats/r89/ncbi-compare-genomes-small.jpg')"
        class="mt-2"
        preview-max-width="800px;"
        preview-width="75%"
      >
      </ImgToggle>
    </template>

    <template #genomic-statistics>
      Key genomic statistics for the GTDB species representative genomes and all genomes in the GTDB.
      <ImgToggle
        :full="require('~/assets/images/stats/r89/genomic-stats-species.png')"
        :preview="require('~/assets/images/stats/r89/genomic-stats-species-small.jpg')"
        class="mt-2"
        preview-max-width="800px;"
        preview-width="75%"
      >
      </ImgToggle>
      <ImgToggle
        :full="require('~/assets/images/stats/r89/genomic-stats-genomes.png')"
        :preview="require('~/assets/images/stats/r89/genomic-stats-genomes-small.jpg')"
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
import REDr89 from "~/components/stats/REDr89.vue";
import ImgToggle from "~/components/layout/ImgToggle.vue";
import StatsTitle from "~/components/stats/StatsTitle.vue";

export default Vue.extend({
  components: {StatsTitle, ImgToggle, REDr89, SectionedPage},
  head() {
    return {
      title: 'R89 Statistics',
      meta: [
      {
        hid: 'description',
        name: 'description',
        content: `Statistics describing GTDB release R89.`
      },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `R89, statistics, GTDB, release 89, stats`
        }
    ]
    }
  },
  data: () => ({
    items: [
      {text: 'Taxon overview', ref: 'taxon-overview'},
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
