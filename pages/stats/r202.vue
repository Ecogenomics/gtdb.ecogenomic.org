<template>
  <v-container class="gtdb-container">

  <SectionedPage :items="items"  >

      <template #title>
        <StatsTitle date="April 27, 2021" release="202"/>
      </template>

      <template #taxon-overview>
        GTDB R202 spans 258,406 genomes organized into 47,894 species clusters.
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
              <td>127</td>
              <td>19</td>
              <td>146</td>
            </tr>
            <tr>
              <td>Class</td>
              <td>360</td>
              <td>47</td>
              <td>407</td>
            </tr>
            <tr>
              <td>Order</td>
              <td>1,163</td>
              <td>116</td>
              <td>1,279</td>
            </tr>
            <tr>
              <td>Family</td>
              <td>2,886</td>
              <td>336</td>
              <td>3,222</td>
            </tr>
            <tr>
              <td>Genus</td>
              <td>12,037</td>
              <td>851</td>
              <td>12,888</td>
            </tr>
            <tr>
              <td>Species</td>
              <td>45,555</td>
              <td>2,339</td>
              <td>47,894</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>

      <template #species-overview>
        GTDB R202 is comprised of 254,090 bacterial and 4,316 archaeal genomes organized into 45,555 bacterial and 2,339
        archaeal species clusters. This is an increase of 63,806 (32.79%) genomes and 15,984 (50.09%) species clusters
        compared to GTDB R95.
        <v-simple-table class="gtdb-table mt-3" dense style="max-width: 700px;">
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
                Growth from R05-RS95 (%)
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Bacterial genomes</td>
              <td>143,512</td>
              <td>191,527</td>
              <td>254,090</td>
              <td>32.67</td>
            </tr>
            <tr>
              <td>Archaeal genomes</td>
              <td>2,392</td>
              <td>3,073</td>
              <td>4,316</td>
              <td>40.45</td>
            </tr>
            <tr>
              <td>Bacterial species clusters</td>
              <td>23,458</td>
              <td>30,238</td>
              <td>45,555</td>
              <td>50.65</td>
            </tr>
            <tr>
              <td>Archaeal species clusters</td>
              <td>1,248</td>
              <td>1,672</td>
              <td>2,339</td>
              <td>39.89</td>
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
          :full="require('~/assets/images/stats/r202/genome-category-per-rank.png')"
          :preview="require('~/assets/images/stats/r202/genome-category-per-rank-small.jpg')"
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
          :full="require('~/assets/images/stats/r202/sp-rep-type.png')"
          :preview="require('~/assets/images/stats/r202/sp-rep-type-small.jpg')"
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
          :full="require('~/assets/images/stats/r202/genome-quality-species.png')"
          :preview="require('~/assets/images/stats/r202/genome-quality-species-small.jpg')"
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
              <td>Proteobacteria 14,419</td>
              <td>Gammaproteobacteria 7,998</td>
              <td>Burkholderiales 2,491</td>
              <td>Burkholderiaceae 1,668</td>
              <td>Pelagibacter 841</td>
            </tr>
            <tr>
              <td>Actinobacteriota 6,192</td>
              <td>Alphaproteobacteria 6,379</td>
              <td>Bacteroidales 2,083</td>
              <td>Flavobacteriaceae 1,247</td>
              <td>Streptomyces 762</td>
            </tr>
            <tr>
              <td>Bacteroidota 5,818</td>
              <td>Bacteroidia 5,402</td>
              <td>Pseudomonadales 1,886</td>
              <td>Lachnospiraceae 1,155</td>
              <td>Pseudomonas_E 574</td>
            </tr>
            <tr>
              <td>Firmicutes_A 4,062</td>
              <td>Actinomycetia 4,864</td>
              <td>Flavobacteriales 1,847</td>
              <td>Pelagibacteraceae 1,114</td>
              <td>Prevotella 383</td>
            </tr>
            <tr>
              <td>Firmicutes 3,390</td>
              <td>Clostridia 3,566</td>
              <td>Enterobacterales 1,701</td>
              <td>Rhodobacteraceae 1,015</td>
              <td>Mycobacterium 339</td>
            </tr>
            <tr>
              <td>Patescibacteria 1,601</td>
              <td>Bacilli 3,352</td>
              <td>Actinomycetales 1,678</td>
              <td>Streptomycetaceae 846</td>
              <td>Flavobacterium 319</td>
            </tr>
            <tr>
              <td>Cyanobacteria 1,067</td>
              <td>Cyanobacteriia 920</td>
              <td>Mycobacteriales 1,426</td>
              <td>Mycobacteriaceae 811</td>
              <td>Collinsella 316</td>
            </tr>
            <tr>
              <td>Chloroflexota 982</td>
              <td>Verrucomicrobiae 699</td>
              <td>Rhizobiales 1,395</td>
              <td>Sphingomonadaceae 762</td>
              <td>Streptococcus 301</td>
            </tr>
            <tr>
              <td>Verrucomicrobiota 917</td>
              <td>Paceibacteria 684</td>
              <td>Lachnospirales 1,285</td>
              <td>Pseudomonadaceae 731</td>
              <td>Prochlorococcus_A 265</td>
            </tr>
            <tr>
              <td>Planctomycetota 748</td>
              <td>Coriobacteriia 594</td>
              <td>Oscillospirales 1,249</td>
              <td>Enterobacteriaceae 724</td>
              <td>Microbacterium 206</td>
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
              <td>Proteobacteria 120,757</td>
              <td>Gammaproteobacteria 104,665</td>
              <td>Enterobacterales 64,157</td>
              <td>Enterobacteriaceae 55,347</td>
              <td>Escherichia 23,687</td>
              <td>Escherichia flexneri 14,743</td>
            </tr>
            <tr>
              <td>Firmicutes 53,879</td>
              <td>Bacilli 53,835</td>
              <td>Lactobacillales 28,917</td>
              <td>Streptococcaceae 16,112</td>
              <td>Streptococcus 15,765</td>
              <td>Staphylococcus aureus 12,022</td>
            </tr>
            <tr>
              <td>Actinobacteriota 24,602</td>
              <td>Actinomycetia 21,459</td>
              <td>Pseudomonadales 19,449</td>
              <td>Staphylococcaceae 15,139</td>
              <td>Staphylococcus 14,962</td>
              <td>Salmonella enterica 11,523</td>
            </tr>
            <tr>
              <td>Bacteroidota 13,917</td>
              <td>Alphaproteobacteria 16,016</td>
              <td>Staphylococcales 15,215</td>
              <td>Mycobacteriaceae 11,561</td>
              <td>Salmonella 11,772</td>
              <td>Klebsiella pneumoniae 9,621</td>
            </tr>
            <tr>
              <td>Firmicutes_A 12,649</td>
              <td>Bacteroidia 12,772</td>
              <td>Burkholderiales 13,431</td>
              <td>Pseudomonadaceae 10,859</td>
              <td>Klebsiella 10,886</td>
              <td>Streptococcus pneumoniae 8,405</td>
            </tr>
            <tr>
              <td>Campylobacterota 5,968</td>
              <td>Clostridia 11,762</td>
              <td>Mycobacteriales 12,534</td>
              <td>Burkholderiaceae 8,796</td>
              <td>Mycobacterium 9,568</td>
              <td>Mycobacterium tuberculosis 6,684</td>
            </tr>
            <tr>
              <td>Patescibacteria 3,496</td>
              <td>Campylobacteria 5,957</td>
              <td>Bacteroidales 7,082</td>
              <td>Moraxellaceae 6,881</td>
              <td>Acinetobacter 6,462</td>
              <td>Pseudomonas aeruginosa 5,211</td>
            </tr>
            <tr>
              <td>Cyanobacteria 2,210</td>
              <td>Cyanobacteriia 1,949</td>
              <td>Campylobacterales 5,940</td>
              <td>Vibrionaceae 4,865</td>
              <td>Pseudomonas 5,311</td>
              <td>Acinetobacter baumannii 4,766</td>
            </tr>
            <tr>
              <td>Verrucomicrobiota 2,095</td>
              <td>Verrucomicrobiae 1,742</td>
              <td>Bacillales 4,944</td>
              <td>Enterococcaceae 4,454</td>
              <td>Pseudomonas_E 4,871</td>
              <td>Escherichia coli 4,370</td>
            </tr>
            <tr>
              <td>Spirochaetota 1,689</td>
              <td>Paceibacteria 1,561</td>
              <td>Rhizobiales 4,913</td>
              <td>Lactobacillaceae 4,070</td>
              <td>Vibrio 4,447</td>
              <td>Streptococcus pyogenes 2,136</td>
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
          <REDr202></REDr202>
        </template>
        <template v-else>
          <h2>Bacteria</h2>
          <ImgToggle
            :full="require('~/assets/images/stats/r202/red-bacteria.png')"
            :preview="require('~/assets/images/stats/r202/red-bacteria.png')"
            class="mt-2"
            preview-max-width="800px;"
            preview-width="75%"
          >
          </ImgToggle>
          <h2>Archaea</h2>
          <ImgToggle
            :full="require('~/assets/images/stats/r202/red-archaea.png')"
            :preview="require('~/assets/images/stats/r202/red-archaea.png')"
            class="mt-2"
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
          :full="require('~/assets/images/stats/r202/ncbi-compare-species.png')"
          :preview="require('~/assets/images/stats/r202/ncbi-compare-species-small.jpg')"
          class="mt-2"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
        <ImgToggle
          :full="require('~/assets/images/stats/r202/ncbi-compare-genomes.png')"
          :preview="require('~/assets/images/stats/r202/ncbi-compare-genomes-small.jpg')"
          class="mt-2"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
      </template>

      <template #genomic-statistics>
        Key genomic statistics for the GTDB species representative genomes and all genomes in the GTDB.
        <ImgToggle
          :full="require('~/assets/images/stats/r202/genomic-stats-genomes.png')"
          :preview="require('~/assets/images/stats/r202/genomic-stats-genomes-small.jpg')"
          class="mt-2"
          preview-max-width="800px;"
          preview-width="75%"
        >
        </ImgToggle>
        <ImgToggle
          :full="require('~/assets/images/stats/r202/genomic-stats-species.png')"
          :preview="require('~/assets/images/stats/r202/genomic-stats-species-small.jpg')"
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
import REDr202 from "~/components/stats/REDr202.vue";
import ImgToggle from "~/components/layout/ImgToggle.vue";
import StatsTitle from "~/components/stats/StatsTitle.vue";

export default Vue.extend({
  components: {StatsTitle, REDr202, SectionedPage, ImgToggle},
  head() {
    return {
      title: 'R202 Statistics',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Statistics describing GTDB release R202.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `R202, statistics, GTDB, release 202, stats`
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
