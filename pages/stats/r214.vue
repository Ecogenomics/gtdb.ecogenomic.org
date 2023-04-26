<template>
  <v-container class="gtdb-container">

    <SectionedPage :items="items">

      <template #title>
        <StatsTitle date="XXXTBA, 2022" release="214"/>
      </template>

      <template #taxon-overview>
        GTDB R214 spans 402,709 genomes organized into 85,205 species clusters.
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
              <td>161</td>
              <td>20</td>
              <td>181</td>
            </tr>
            <tr>
              <td>Class</td>
              <td>488</td>
              <td>60</td>
              <td>548</td>
            </tr>
            <tr>
              <td>Order</td>
              <td>1,624</td>
              <td>148</td>
              <td>1,772</td>
            </tr>
            <tr>
              <td>Family</td>
              <td>4,262</td>
              <td>508</td>
              <td>4,772</td>
            </tr>
            <tr>
              <td>Genus</td>
              <td>19,153</td>
              <td>1,586</td>
              <td>20,739</td>
            </tr>
            <tr>
              <td>Species</td>
              <td>80,789</td>
              <td>4,416</td>
              <td>82,205</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>

      <template #species-overview>
        GTDB R207 is comprised of 394,932 bacterial and 7,777 archaeal genomes organized into 80,789 bacterial and 4,416 archaeal species clusters.
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
                R08-RS214
              </th>
              <th class="text-left">
                Growth from R07-RS207 (%)
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
              <td>394,932</td>
              <td>26.79</td>
            </tr>
            <tr>
              <td>Archaeal genomes</td>
              <td>2,392</td>
              <td>3,073</td>
              <td>4,316</td>
              <td>6,062</td>
              <td>7,777</td>
              <td>28.29</td>
            </tr>
            <tr>
              <td>Bacterial species clusters</td>
              <td>23,458</td>
              <td>30,238</td>
              <td>45,555</td>
              <td>62,291</td>
              <td>80,789</td>
              <td>29.70</td>
            </tr>
            <tr>
              <td>Archaeal species clusters</td>
              <td>1,248</td>
              <td>1,672</td>
              <td>2,339</td>
              <td>3,412</td>
              <td>4,416</td>
              <td>29.43</td>
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
          :full="require('~/assets/images/stats/r214/genome-category-per-rank.svg')"
          :preview="require('~/assets/images/stats/r214/genome-category-per-rank.svg')"
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
          :full="require('~/assets/images/stats/r214/sp-rep-type.svg')"
          :preview="require('~/assets/images/stats/r214/sp-rep-type.svg')"
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
          :full="require('~/assets/images/stats/r214/genome-quality-species.png')"
          :preview="require('~/assets/images/stats/r214/genome-quality-species-small.jpg')"
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
              <td>Pseudomonadota 21,693</td>
              <td>Gammaproteobacteria 11,935</td>
              <td>Bacteroidales 4,720</td>
              <td>Lachnospiraceae 2,902</td>
              <td>Streptomyces 948</td>
            </tr>
            <tr>
              <td>Bacillota_A 11,264</td>
              <td>Clostridia 11,207</td>
              <td>Oscillospirales 4,184</td>
              <td>Flavobacteriaceae 1,785</td>
              <td>Pelagibacter 855</td>
            </tr>
            <tr>
              <td>Bacteroidota 11,000</td>
              <td>Bacteroidia 10,262</td>
              <td>Burkholderiales 4,020</td>
              <td>Rhodobacteraceae 1,479</td>
              <td>Pseudomonas_E 693</td>
            </tr>
            <tr>
              <td>Actinomycetota 8,813</td>
              <td>Alphaproteobacteria 9,662</td>
              <td>Lachnospirales 3,140</td>
              <td>Bacteroidaceae 1,384</td>
              <td>Prevotella 659</td>
            </tr>
            <tr>
              <td>Bacillota 5,292</td>
              <td>Actinomycetia 6,393</td>
              <td>Flavobacteriales 2,789</td>
              <td>Oscillospiraceae 1,183</td>
              <td>Collinsella 502</td>
            </tr>
            <tr>
              <td>Patescibacteria 3,374</td>
              <td>Bacilli 5,292</td>
              <td>Pseudomonadales 2,563</td>
              <td>Burkholderiaceae_B 1,145</td>
              <td>Flavobacterium 485</td>
            </tr>
            <tr>
              <td>Chloroflexota 1,910</td>
              <td>Paceibacteria 1,369</td>
              <td>Rhizobiales 2,368</td>
              <td>Acutalibacteraceae 1,144</td>
              <td>Cryptobacteroides 463</td>
            </tr>
            <tr>
              <td>Cyanobacteriota 1,830</td>
              <td>Cyanobacteriia 1,276</td>
              <td>Actinomycetales 2,302</td>
              <td>Pelagibacteraceae 1,138</td>
              <td>Streptococcus 420</td>
            </tr>
            <tr>
              <td>Verrucomicrobiota 1,722</td>
              <td>Verrucomicrobiae 1,211</td>
              <td>Mycobacteriales 1,827</td>
              <td>Sphingomonadaceae 1,113</td>
              <td>Mycobacterium 417</td>
            </tr>
            <tr>
              <td>Planctomycetota 1,664</td>
              <td>Coriobacteriia 963</td>
              <td>Christensenellales 1,567</td>
              <td>Streptomycetaceae 1,026</td>
              <td>Microbacterium 282</td>
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
              <td>Pseudomonadota 174,676</td>
              <td>Gammaproteobacteria 150,865</td>
              <td>Enterobacterales 80,364</td>
              <td>Enterobacteriaceae 80,364</td>
              <td>Escherichia 34,358</td>
              <td>Escherichia coli 33,849</td>
            </tr>
            <tr>
              <td>Bacillota 74,157</td>
              <td>Bacilli 74,157</td>
              <td>Lactobacillales 38,051</td>
              <td>Staphylococcaceae 20,155</td>
              <td>Staphylococcus 19,627</td>
              <td>Klebsiella pneumoniae 14,975</td>
            </tr>
            <tr>
              <td>Actinomycetota 33,994</td>
              <td>Clostridia 33,352</td>
              <td>Pseudomonadales 27,546</td>
              <td>Streptococcaceae 19,088</td>
              <td>Streptococcus 18,492</td>
              <td>Staphylococcus aureus 14,959</td>
            </tr>
            <tr>
              <td>Bacillota_A 33,495</td>
              <td>Actinomycetia 28,469</td>
              <td>Staphylococcales 20,270</td>
              <td>Pseudomonadaceae 14,789</td>
              <td>Klebsiella 18,145</td>
              <td>Salmonella enterica 13,832</td>
            </tr>
            <tr>
              <td>Bacteroidota 29,028</td>
              <td>Bacteroidia 27,250</td>
              <td>Burkholderiales 18,787</td>
              <td>Mycobacteriaceae 13,735</td>
              <td>Salmonella 14,109</td>
              <td>Streptococcus pneumoniae 8,895</td>
            </tr>
            <tr>
              <td>Campylobacterota 8,496</td>
              <td>Alphaproteobacteria 23,655</td>
              <td>Bacteroidales 17,142</td>
              <td>Moraxellaceae 9,879</td>
              <td>Mycobacterium 10,657</td>
              <td>Mycobacterium tuberculosis 7,132</td>
            </tr>
            <tr>
              <td>Patescibacteria 5,830</td>
              <td>Campylobacteria 8,470</td>
              <td>Mycobacteriales 14,998</td>
              <td>Lachnospiraceae 9,794</td>
              <td>Acinetobacter 9,221</td>
              <td>Pseudomonas aeruginosa 7,037</td>
            </tr>
            <tr>
              <td>Cyanobacteriota 3,846</td>
              <td>Cyanobacteriia 2,997</td>
              <td>Enterobacterales_A 12,508</td>
              <td>Bacteroidaceae 8,212</td>
              <td>Pseudomonas 7,187</td>
              <td>Acinetobacter baumannii 6,912</td>
            </tr>
            <tr>
              <td>Verrucomicrobiota 3,678</td>
              <td>Verrucomicrobiae 2,834</td>
              <td>Oscillospirales 10,969</td>
              <td>Burkholderiaceae 7,042</td>
              <td>Pseudomonas_E 6,686</td>
              <td>Clostridioides difficile 2,701</td>
            </tr>
            <tr>
              <td>Chloroflexota 3,064</td>
              <td>Coriobacteriia 2,570</td>
              <td>Lachnospirales 10,229</td>
              <td>Lactobacillaceae 6,794</td>
              <td>Vibrio 6,120</td>
              <td>Enterococcus_B faecium 2,657</td>
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

<!--        <v-switch-->
<!--          v-if="$vuetify.breakpoint.mdAndUp"-->
<!--          v-model="showRedAsD3"-->
<!--          :label="`Interactive: ${showRedAsD3.toString()}`"-->
<!--          color="blue"-->
<!--          inset-->
<!--        ></v-switch>-->
        <template v-if="showRedAsD3">
          <REDr214></REDr214>
        </template>
        <template v-else>
          <h2>Bacteria</h2>
          <ImgToggle
            :full="require('~/assets/images/stats/r214/red-bacteria.png')"
            :preview="require('~/assets/images/stats/r214/red-bacteria-small.png')"
            class="mt-2"
            preview-max-width="800px;"
            preview-width="75%"
          >
          </ImgToggle>

          <hr>

          <h2>Archaea</h2>
          <ImgToggle
            :full="require('~/assets/images/stats/r214/red-archaea.png')"
            :preview="require('~/assets/images/stats/r214/red-archaea-small.png')"
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
          :full="require('~/assets/images/stats/r214/ncbi-compare-species.svg')"
          :preview="require('~/assets/images/stats/r214/ncbi-compare-species.svg')"
          class="mt-2"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
        <hr>
        <ImgToggle
          :full="require('~/assets/images/stats/r214/ncbi-compare-genomes.svg')"
          :preview="require('~/assets/images/stats/r214/ncbi-compare-genomes.svg')"
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
          :full="require('~/assets/images/stats/r214/genomic-stats-genomes.svg')"
          :preview="require('~/assets/images/stats/r214/genomic-stats-genomes.svg')"
          class="mt-2"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>

        <hr>

        <h2>Species</h2>
        <ImgToggle
          :full="require('~/assets/images/stats/r214/genomic-stats-species.svg')"
          :preview="require('~/assets/images/stats/r214/genomic-stats-species.svg')"
          class="mt-3"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
      </template>

      <template #nomenclatural-types-per-rank>
      <p>
        This plot shows the breakdown of placeholder versus latinized names for each taxonomic rank.
      </p>

        <v-simple-table class="gtdb-table mt-3" dense>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
              </th>
              <th class="text-left">
                Bacteria: Latin
              </th>
              <th class="text-left">
                Bacteria: Placeholder
              </th>
              <th class="text-left">
                Archaea: Latin
              </th>
              <th class="text-left">
                Archaea: Placeholder
              </th>
              <th class="text-left">
                Latin
              </th>
              <th class="text-left">
                Placeholder
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Phylum</td>
              <td>71 (44.10%)</td>
              <td>90 (55.90%)</td>
              <td>15 (75.00%)</td>
              <td>5 (25.00%)</td>
              <td>86 (47.51%)</td>
              <td>95 (52.49%)</td>
            </tr>
            <tr>
              <td>Class</td>
              <td>153 (31.35%)</td>
              <td>335 (68.65%)</td>
              <td>39 (65.00%)</td>
              <td>21 (35.00%)</td>
              <td>192 (35.04%)</td>
              <td>356 (64.96%)</td>
            </tr>
            <tr>
              <td>Order</td>
              <td>356 (21.92%)</td>
              <td>1,268 (78.08%)</td>
              <td>59 (39.86%)</td>
              <td>89 (60.14%)</td>
              <td>415 (23.42%)</td>
              <td>1,357 (76.58%)</td>
            </tr>
            <tr>
              <td>Family</td>
              <td>758 (17.78%)</td>
              <td>3,506 (82.22%)</td>
              <td>91 (17.91%)</td>
              <td>417 (82.09%)</td>
              <td>849 (17.79%)</td>
              <td>3,923 (82.21%)</td>
            </tr>
            <tr>
              <td>Genus</td>
              <td>3,723 (19.44%)</td>
              <td>15,430 (80.56%)</td>
              <td>226 (14.25%)</td>
              <td>1,360 (85.75%)</td>
              <td>3,949 (19.04%)</td>
              <td>16,790 (80.96%)</td>
            </tr>
            <tr>
              <td>Species</td>
              <td>14,489 (17.93%)</td>
              <td>66,300 (82.07%)</td>
              <td>591 (13.38%)</td>
              <td>3,825 (86.62%)</td>
              <td>15,080 (17.70%)</td>
              <td>70,125 (82.30%)</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>

        <ImgToggle
          :full="require('~/assets/images/stats/r214/nomenclatural-per-rank.svg')"
          :preview="require('~/assets/images/stats/r214/nomenclatural-per-rank.svg')"
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
import REDr214 from "~/components/stats/REDr214.vue";
import ImgToggle from "~/components/layout/ImgToggle.vue";
import StatsTitle from "~/components/stats/StatsTitle.vue";

export default Vue.extend({
  components: {StatsTitle, REDr214, SectionedPage, ImgToggle},
  head() {
    return {
      title: 'R214 Statistics',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Statistics describing GTDB release R214.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `R214, statistics, GTDB, release 214, stats`
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
      {text: 'Nomenclatural types per rank', ref: 'nomenclatural-types-per-rank'},
    ],

    showRedAsD3: false,
  }),
})
</script>

<style scoped>

</style>
