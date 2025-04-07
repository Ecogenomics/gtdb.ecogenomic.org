<template>
  <v-container class="gtdb-container">

    <SectionedPage :items="items">

      <template #title>
          <v-row no-gutters>
            <v-col>
              <StatsTitle date="XXX April, 2025" release="226" />
            </v-col>
            <v-col cols="3" ><v-switch
        v-model="cdv_switch"
        class="switch align-content-end"
        label="Colour vision deficiency"
        color="#7e8e7d"
      /></v-col>
          </v-row>

      </template>

      <template #taxon-overview>
        GTDB R226 spans 732,475 genomes organized into 143,614 species clusters.
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
              <td>169</td>
              <td>20</td>
              <td>189</td>
            </tr>
            <tr>
              <td>Class</td>
              <td>571</td>
              <td>63</td>
              <td>634</td>
            </tr>
            <tr>
              <td>Order</td>
              <td>1,976</td>
              <td>171</td>
              <td>2,147</td>
            </tr>
            <tr>
              <td>Family</td>
              <td>5,311</td>
              <td>603</td>
              <td>5,914</td>
            </tr>
            <tr>
              <td>Genus</td>
              <td>27,326</td>
              <td>2,079</td>
              <td>29,405</td>
            </tr>
            <tr>
              <td>Species</td>
              <td>136,646</td>
              <td>6,968</td>
              <td>143,614</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>

      <template #species-overview>
        GTDB R226 is comprised of 715,230 bacterial and 17,245 archaeal genomes organized into 136,646 bacterial and
        6,968
        archaeal species clusters, respectively.

        <v-simple-table class="gtdb-table mt-3" dense>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Release
              </th>
              <th class="text-left">
                Bacterial Genomes
              </th>
              <th class="text-left">
                Archaeal Genomes
              </th>
              <th class="text-left">
                Bacterial Species Clusters
              </th>
              <th class="text-left">
                Archaeal Species Clusters
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>R04-RS89</td>
              <td>143,512</td>
              <td>2,392</td>
              <td>23,458</td>
              <td>1,248</td>
            </tr>
            <tr>
              <td>R05-RS95</td>
              <td>191,527</td>
              <td>3,073</td>
              <td>30,238</td>
              <td>1,672</td>
            </tr>
            <tr>
              <td>R06-RS202</td>
              <td>254,090</td>
              <td>4,316</td>
              <td>45,555</td>
              <td>2,339</td>
            </tr>
            <tr>
              <td>R07-RS207</td>
              <td>311,480</td>
              <td>6,062</td>
              <td>62,291</td>
              <td>3,412</td>
            </tr>
            <tr>
              <td>R08-RS214</td>
              <td>394,932</td>
              <td>7,777</td>
              <td>80,789</td>
              <td>4,416</td>
            </tr>
            <tr>
              <td>R10-RS220</td>
              <td>584,382</td>
              <td>12,477</td>
              <td>107,235</td>
              <td>5,869</td>
            </tr>
            <tr>
              <td>R10-RS226</td>
              <td>715,230</td>
              <td>17,245</td>
              <td>136,646</td>
              <td>6,968</td>
            </tr>
            <tr>
              <td><b>Growth from R09-RS220</b></td>
              <td>22.39%</td>
              <td>38.21%</td>
              <td>27.43%</td>
              <td>18.73%</td>
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
               <template v-if="cdv_switch">
        <ImgToggle
          :full="require('~/assets/images/stats/r226/genome-category-per-rank-cvd.svg')"
          :preview="require('~/assets/images/stats/r226/genome-category-per-rank-cvd.svg')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        />
      </template>
      <template v-else>
        <ImgToggle
          :full="require('~/assets/images/stats/r226/genome-category-per-rank.svg')"
          :preview="require('~/assets/images/stats/r226/genome-category-per-rank.svg')"

          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        />
      </template>
      </template>

      <template #gtdb-species-representatives>
        Each GTDB species cluster is represented by a single genome. Genomes assembled from the type strain of the
        species were selected where possible, though the majority of species clusters are currently assigned only
        placeholder names. The proportion of representatives which are isolates, MAGs, or SAGs is given for each
        category.
        <template v-if="cdv_switch">
        <ImgToggle
          :full="require('~/assets/images/stats/r226/sp-rep-type-cvd.svg')"
          :preview="require('~/assets/images/stats/r226/sp-rep-type-cvd.svg')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        />
      </template>
      <template v-else>
        <ImgToggle
          :full="require('~/assets/images/stats/r226/sp-rep-type.svg')"
          :preview="require('~/assets/images/stats/r226/sp-rep-type.svg')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        />
      </template>
      </template>

      <template #quality-of-gtdb-representative-genomes>
        The quality of the genomes selected as GTDB species representatives is given below.
        Genome completeness and contamination were estimated using
        <a href="https://github.com/Ecogenomics/CheckM" target="_blank">CheckM</a> and are colored based
        on the <a href="https://dx.doi.org/10.1038/nbt.3893" target="_blank">MIMAG genome standards</a>.

        In general, representative genomes were restricted to having a quality satisfying <code>completeness - 5*contamination >50</code>,
        unless a large portion of contamination could be attributed to strain heterogeneity.
        A few exceptions exist in order to retain well-known species with abnormal CheckM quality estimates, where contamination exceeds 10%.
        <template v-if="cdv_switch">
        <ImgToggle
          :full="require('~/assets/images/stats/r226/genome-quality-species-cvd.png')"
          :preview="require('~/assets/images/stats/r226/genome-quality-species-cvd.png')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        />
      </template>
      <template v-else>
        <ImgToggle
          :full="require('~/assets/images/stats/r226/genome-quality-species.png')"
          :preview="require('~/assets/images/stats/r226/genome-quality-species.png')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        />
      </template>
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
              <td>Pseudomonadota 35,839</td>
              <td>Gammaproteobacteria 19,731</td>
              <td>Burkholderiales	7,245</td>
              <td>Burkholderiaceae	4,466</td>
              <td>Streptomyces	1,739</td>
            </tr>
            <tr>
              <td>Bacillota 24,866</td>
              <td>Bacteroidia 16,912</td>
              <td>Bacteroidales 6,951</td>
              <td>Lachnospiraceae 3,903</td>
              <td>Collinsella 1,058</td>
            </tr>
            <tr>
              <td>Actinomycetota 16,922</td>
              <td>Alphaproteobacteria 15,970</td>
              <td>Oscillospirales 5,467</td>
              <td>Flavobacteriaceae 2,952</td>
              <td>Pelagibacter 891</td>
            </tr>
            <tr>
              <td>Bacteroidota 16,912</td>
              <td>Clostridia 15,463</td>
              <td>Flavobacteriales 4,528</td>
              <td>Rhodobacteraceae 2,553</td>
              <td>Prevotella 888</td>
            </tr>
            <tr>
              <td>Patescibacteriota 6,435</td>
              <td>Actinomycetes 10,924</td>
              <td>Lachnospirales 4,263</td>
              <td>Sphingomonadaceae 2,180</td>
              <td>Pseudomonas_E 878</td>
            </tr>
            <tr>
              <td>Chloroflexota 4,182</td>
              <td>Bacilli 7,498</td>
              <td>Rhizobiales 3,949</td>
              <td>Streptomycetaceae 1,950</td>
              <td>Flavobacterium 812</td>
            </tr>
            <tr>
              <td>Acidobacteriota 3,758</td>
              <td>Verrucomicrobiia 2,595</td>
              <td>Pseudomonadales 3,843</td>
              <td>Bacteroidaceae 1,845</td>
              <td>Streptococcus 693</td>
            </tr>
            <tr>
              <td>Verrucomicrobiota 3,351</td>
              <td>Minisyncoccia 2,547</td>
              <td>Actinomycetales 3,638</td>
              <td>Chitinophagaceae 1,598</td>
              <td>Mycobacterium 597</td>
            </tr>
            <tr>
              <td>Planctomycetota 3,168</td>
              <td>Acidimicrobiia 2,102</td>
              <td>Mycobacteriales 2,983</td>
              <td>Oscillospiraceae 1,587</td>
              <td>Cryptobacteroides 555</td>
            </tr>
            <tr>
              <td>Cyanobacteriota 2,718</td>
              <td>Cyanobacteriia 1,943</td>
              <td>Rhodobacterales 2,553</td>
              <td>Microbacteriaceae 1,524</td>
              <td>Microbacterium 451</td>
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
              <td>Pseudomonadota 267,130</td>
              <td>Gammaproteobacteria 226,629</td>
              <td>Enterobacterales 133,925</td>
              <td>Enterobacteriaceae 115,303</td>
              <td>Escherichia 45,533</td>
              <td>Escherichia coli 44,640</td>
            </tr>
            <tr>
              <td>Bacillota 205,871</td>
              <td>Bacilli 109,361</td>
              <td>Bacteroidales 67,821</td>
              <td>Lachnospiraceae 37,618</td>
              <td>Klebsiella 28,408</td>
              <td>Klebsiella pneumoniae 23,011</td>
            </tr>
            <tr>
              <td>Bacteroidota 89,203</td>
              <td>Clostridia 89,775</td>
              <td>Lactobacillales 54,361</td>
              <td>Staphylococcaceae 25,195</td>
              <td>Staphylococcus 24,405</td>
              <td>Staphylococcus aureus 17,542</td>
            </tr>
            <tr>
              <td>Actinomycetota 59,430</td>
              <td>Bacteroidia 89,203</td>
              <td>Pseudomonadales 42,287</td>
              <td>Muribaculaceae 24,600</td>
              <td>Streptococcus 21,852</td>
              <td>Salmonella enterica 17,159</td>
            </tr>
            <tr>
              <td>Campylobacterota 12,704</td>
              <td>Actinomycetes 45,222</td>
              <td>Lachnospirales 38,784</td>
              <td>Streptococcaceae 23,415</td>
              <td>Salmonella 17,457</td>
              <td>Pseudomonas aeruginosa 10,492</td>
            </tr>
            <tr>
              <td>Patescibacteriota 10,847</td>
              <td>Alphaproteobacteria 40,295</td>
              <td>Burkholderiales 30,358</td>
              <td>Pseudomonadaceae 21,139</td>
              <td>Acinetobacter 14,084</td>
              <td>Acinetobacter baumannii 10,048</td>
            </tr>
            <tr>
              <td>Verrucomicrobiota 8,325</td>
              <td>Campylobacteria 12,658</td>
              <td>Staphylococcales 25,423</td>
              <td>Bacteroidaceae 20,813</td>
              <td>Mycobacterium 11,924</td>
              <td>Streptococcus pneumoniae 9,446</td>
            </tr>
            <tr>
              <td>Cyanobacteriota 7,057</td>
              <td>Verrucomicrobiia 6,806</td>
              <td>Oscillospirales 25,303</td>
              <td>Burkholderiaceae 19,661</td>
              <td>Pseudomonas 10,723</td>
              <td>Mycobacterium tuberculosis 7,631</td>
            </tr>
            <tr>
              <td>Chloroflexota 6,904</td>
              <td>Coriobacteriia 6,002</td>
              <td>Mycobacteriales 19,389</td>
              <td>Mycobacteriaceae 16,757</td>
              <td>Pseudomonas_E 8,551</td>
              <td>Enterococcus faecalis 4,055</td>
            </tr>
            <tr>
              <td>Acidobacteriota 5,462</td>
              <td>Acidimicrobiia 5,487</td>
              <td>Actinomycetales 13,693</td>
              <td>Moraxellaceae 15,244</td>
              <td>Vibrio 8,461</td>
              <td>Enterococcus_B faecium 3,907</td>
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
        <br>
        <br>
        <!--        <v-switch-->
        <!--          v-if="$vuetify.breakpoint.mdAndUp"-->
        <!--          v-model="showRedAsD3"-->
        <!--          :label="`Interactive: ${showRedAsD3.toString()}`"-->
        <!--          color="blue"-->
        <!--          inset-->
        <!--        ></v-switch>-->
        <template v-if="showRedAsD3">
          <REDr226></REDr226>
        </template>
        <template v-else>
          <h2>Bacteria</h2>
          <ImgToggle
            :full="require('~/assets/images/stats/r226/red-bacteria.png')"
            :preview="require('~/assets/images/stats/r226/red-bacteria.png')"
            class="mt-2"
            preview-max-width="800px"
            preview-width="75%"
          >
          </ImgToggle>

          <hr>

          <h2>Archaea</h2>
          <ImgToggle
            :full="require('~/assets/images/stats/r226/red-archaea.png')"
            :preview="require('~/assets/images/stats/r226/red-archaea.png')"
            class="mt-3"
            preview-max-width="800px"
            preview-width="75%"
          >
          </ImgToggle>
        </template>
      </template>

      <template #comparison-of-gtdb-and-ncbi-taxa>
        <p>
          Comparison of GTDB and NCBI taxonomic assignments across GTDB species representative genomes and all GTDB
          genomes which have an assigned NCBI taxonomy. For each taxonomic rank, a taxon was classified as being
          unchanged
          if its name was identical in both taxonomies, passively changed if the GTDB taxonomy provided name information
          absent in the NCBI taxonomy, or actively changed if the name was different between the two taxonomies.
        </p>
        <p>
          Phylum names have been updated to follow the valid publication of 42 names in
          <a href="https://pubmed.ncbi.nlm.nih.gov/34694987/" target="_blank">IJSEM</a>. This has resulted in a large
          number of active phylum name changes relative to NCBI classifications at the time of this release.
          NCBI is also
          <a href="https://www.nlm.nih.gov/pubs/techbull/ma23/ma23_ncbi_taxonomy_names.html" target="_blank">adopting
            these new phyla names</a>.
        </p>
        <template v-if="cdv_switch">
        <ImgToggle
          :full="require('~/assets/images/stats/r226/ncbi-compare-species-cvd.svg')"
          :preview="require('~/assets/images/stats/r226/ncbi-compare-species-cvd.svg')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        >
        </ImgToggle>
        <hr>
        <ImgToggle
          :full="require('~/assets/images/stats/r226/ncbi-compare-genomes-cvd.svg')"
          :preview="require('~/assets/images/stats/r226/ncbi-compare-genomes-cvd.svg')"
          class="mt-3"
          preview-max-width="800px"
          preview-width="75%"
        >
        </ImgToggle>
      </template>
      <template v-else>
        <ImgToggle
          :full="require('~/assets/images/stats/r226/ncbi-compare-species.svg')"
          :preview="require('~/assets/images/stats/r226/ncbi-compare-species.svg')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        >
        </ImgToggle>
        <hr>
        <ImgToggle
          :full="require('~/assets/images/stats/r226/ncbi-compare-genomes.svg')"
          :preview="require('~/assets/images/stats/r226/ncbi-compare-genomes.svg')"
          class="mt-3"
          preview-max-width="800px"
          preview-width="75%"
        >
        </ImgToggle>
      </template>
      </template>

      <template #genomic-statistics>
        Key genomic statistics for the GTDB species representative genomes and all genomes in the GTDB.

        <h2>Genomes</h2>
        <ImgToggle
          :full="require('~/assets/images/stats/r226/genomic-stats-genomes.svg')"
          :preview="require('~/assets/images/stats/r226/genomic-stats-genomes.svg')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        >
        </ImgToggle>

        <hr>

        <h2>Species</h2>
        <ImgToggle
          :full="require('~/assets/images/stats/r226/genomic-stats-species.svg')"
          :preview="require('~/assets/images/stats/r226/genomic-stats-species.svg')"
          class="mt-3"
          preview-max-width="800px"
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
              <td>76 (44.97%)</td>
              <td>93 (55.03%)</td>
              <td>16 (80.00%)</td>
              <td>4 (20.00%)</td>
              <td>92 (48.68%)</td>
              <td>97 (51.32%)</td>
            </tr>
            <tr>
              <td>Class</td>
              <td>170 (29.77%)</td>
              <td>401 (70.23%)</td>
              <td>41 (65.08%)</td>
              <td>22 (34.92%)</td>
              <td>211 (33.28%)</td>
              <td>423 (66.72%)</td>
            </tr>
            <tr>
              <td>Order</td>
              <td>401 (20.29%)</td>
              <td>1,575 (79.71%)</td>
              <td>73 (42.69%)</td>
              <td>98 (57.31%)</td>
              <td>474 (22.08%)</td>
              <td>1,673 (77.92%)</td>
            </tr>
            <tr>
              <td>Family</td>
              <td>856 (16.12%)</td>
              <td>4,455 (83.88%)</td>
              <td>111 (18.41%)</td>
              <td>492 (81.59%)</td>
              <td>967 (16.35%)</td>
              <td>4,947 (83.65%)</td>
            </tr>
            <tr>
              <td>Genus</td>
              <td>4,230 (15.48%)</td>
              <td>23,096 (84.52%)</td>
              <td>294 (14.14%)</td>
              <td>1,785 (85.86%)</td>
              <td>4,524 (15.39%)</td>
              <td>24,881 (84.61%)</td>
            </tr>
            <tr>
              <td>Species</td>
              <td>17,977 (13.16%)</td>
              <td>118,669 (86.84%)</td>
              <td>811 (11.64%)</td>
              <td>6,157 (88.36%)</td>
              <td>18,788 (13.08%)</td>
              <td>124,826 (86.92%)</td>
            </tr>

            </tbody>
          </template>
        </v-simple-table>


                <template v-if="cdv_switch">
        <ImgToggle
          :full="require('~/assets/images/stats/r226/nomenclatural-per-rank-cvd.svg')"
          :preview="require('~/assets/images/stats/r226/nomenclatural-per-rank-cvd.svg')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        />
      </template>
      <template v-else>
        <ImgToggle
          :full="require('~/assets/images/stats/r226/nomenclatural-per-rank.svg')"
          :preview="require('~/assets/images/stats/r226/nomenclatural-per-rank.svg')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        />
      </template>

      </template>

      <template #phylum-pd>

        The following tables show the percentage contribution of each phylum to the Phylogenetic Diversity (PD) of the original and RED-normalised GTDB reference trees.<br><br>
        Phyla that are polyphyletic in the reference tree (suffixed as _A, _B, etc) can be collapsed using the toggle at the top right of each table. Click on headers to sort by column.
        <br><br>

        <h3>Archaea:</h3>
        <PhylumPd :rows="phylumPdArc"></PhylumPd>

        <br>

        <h3>Bacteria:</h3>
        <PhylumPd :rows="phylumPdBac"></PhylumPd>
      </template>


    </SectionedPage>
  </v-container>

</template>

<script lang="ts">
import Vue from 'vue'

import SectionedPage from "~/components/layout/SectionedPage.vue";
import REDr220 from "~/components/stats/REDr220.vue";
import ImgToggle from "~/components/layout/ImgToggle.vue";
import StatsTitle from "~/components/stats/StatsTitle.vue";
import PhylumPd from "~/components/stats/PhylumPd.vue";

export default Vue.extend({
  components: {PhylumPd, StatsTitle, REDr220, SectionedPage, ImgToggle},
  head() {
    return {
      title: 'R226 Statistics',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Statistics describing GTDB release R226.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `R226, statistics, GTDB, release 226, stats`
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
      {text: 'Phylum phylogenetic diversity', ref: 'phylum-pd'}
    ],

    phylumPdArc: [
      { taxon: "Aenigmatarchaeota", scaled: 6.4, unscaled: 5.95},
      { taxon: "Altiarchaeota", scaled: 1.41, unscaled: 1.13},
      { taxon: "Asgardarchaeota", scaled: 4.75, unscaled: 4.9},
      { taxon: "B1Sed10-29", scaled: 1.09, unscaled: 0.86},
      { taxon: "EX4484-52", scaled: 1.01, unscaled: 0.93},
      { taxon: "Hadarchaeota", scaled: 0.76, unscaled: 0.54},
      { taxon: "Halobacteriota", scaled: 11.4, unscaled: 9.78},
      { taxon: "Huberarchaeota", scaled: 0.12, unscaled: 0.2},
      { taxon: "Hydrothermarchaeota", scaled: 0.79, unscaled: 0.54},
      { taxon: "Iainarchaeota", scaled: 3.08, unscaled: 3.32},
      { taxon: "JACRDV01", scaled: 0.1, unscaled: 0.05},
      { taxon: "Methanobacteriota", scaled: 2.37, unscaled: 1.69},
      { taxon: "Methanobacteriota_A", scaled: 0.54, unscaled: 0.33},
      { taxon: "Methanobacteriota_B", scaled: 1.19, unscaled: 0.81},
      { taxon: "Micrarchaeota", scaled: 7.91, unscaled: 9.19},
      { taxon: "Nanoarchaeota", scaled: 24.31, unscaled: 26.33},
      { taxon: "Nanohaloarchaeota", scaled: 0.79, unscaled: 0.84},
      { taxon: "SpSt-1190", scaled: 0.61, unscaled: 0.54},
      { taxon: "Thermoplasmatota", scaled: 12.54, unscaled: 12.65},
      { taxon: "Thermoproteota", scaled: 18.41, unscaled: 19.21},
      { taxon: "Undinarchaeota", scaled: 0.45, unscaled: 0.21},
    ],

    phylumPdBac: [
      { taxon: "2-12-FULL-45-22", scaled: 0.01, unscaled: 0.01},
      { taxon: "4484-113", scaled: 0.04, unscaled: 0.03},
      { taxon: "4572-55", scaled: 0.02, unscaled: 0.01},
      { taxon: "ARS69", scaled: 0.02, unscaled: 0.01},
      { taxon: "AUK180", scaled: 0.03, unscaled: 0.02},
      { taxon: "Abyssobacteria", scaled: 0.01, unscaled: 0.01},
      { taxon: "Acidobacteriota", scaled: 2.42, unscaled: 2.05},
      { taxon: "Actinomycetota", scaled: 7.02, unscaled: 6.82},
      { taxon: "Aerophobota", scaled: 0.06, unscaled: 0.04},
      { taxon: "Aquificota", scaled: 0.16, unscaled: 0.15},
      { taxon: "Armatimonadota", scaled: 0.66, unscaled: 0.6},
      { taxon: "Atribacterota", scaled: 0.1, unscaled: 0.07},
      { taxon: "Auribacterota", scaled: 0.02, unscaled: 0.01},
      { taxon: "B130-G9", scaled: 0.01, unscaled: 0.01},
      { taxon: "BMS3Abin14", scaled: 0.03, unscaled: 0.02},
      { taxon: "BS750m-G25", scaled: 0.01, unscaled: 0.0},
      { taxon: "Bacillota", scaled: 2.31, unscaled: 1.85},
      { taxon: "Bacillota_A", scaled: 11.34, unscaled: 12.87},
      { taxon: "Bacillota_B", scaled: 0.93, unscaled: 0.62},
      { taxon: "Bacillota_C", scaled: 0.54, unscaled: 0.38},
      { taxon: "Bacillota_D", scaled: 0.24, unscaled: 0.17},
      { taxon: "Bacillota_E", scaled: 0.43, unscaled: 0.31},
      { taxon: "Bacillota_F", scaled: 0.13, unscaled: 0.08},
      { taxon: "Bacillota_G", scaled: 0.42, unscaled: 0.25},
      { taxon: "Bacillota_H", scaled: 0.05, unscaled: 0.03},
      { taxon: "Bacillota_I", scaled: 3.94, unscaled: 3.61},
      { taxon: "Bacteroidota", scaled: 9.5, unscaled: 10.92},
      { taxon: "Bdellovibrionota", scaled: 1.04, unscaled: 1.13},
      { taxon: "Bdellovibrionota_F", scaled: 0.01, unscaled: 0.01},
      { taxon: "Bdellovibrionota_G", scaled: 0.03, unscaled: 0.02},
      { taxon: "Bipolaricaulota", scaled: 0.17, unscaled: 0.15},
      { taxon: "CAIJMQ01", scaled: 0.02, unscaled: 0.02},
      { taxon: "CAKKQC01", scaled: 0.01, unscaled: 0.01},
      { taxon: "CALINM01", scaled: 0.01, unscaled: 0.01},
      { taxon: "CG03", scaled: 0.06, unscaled: 0.05},
      { taxon: "CG2-30-53-67", scaled: 0.02, unscaled: 0.01},
      { taxon: "CG2-30-70-394", scaled: 0.01, unscaled: 0.01},
      { taxon: "CLD3", scaled: 0.03, unscaled: 0.02},
      { taxon: "CSP1-3", scaled: 0.08, unscaled: 0.05},
      { taxon: "CSSED10-310", scaled: 0.06, unscaled: 0.04},
      { taxon: "Caldisericota", scaled: 0.09, unscaled: 0.09},
      { taxon: "Calditrichota", scaled: 0.12, unscaled: 0.08},
      { taxon: "Calescibacterota", scaled: 0.01, unscaled: 0.02},
      { taxon: "Campylobacterota", scaled: 0.93, unscaled: 0.83},
      { taxon: "Campylobacterota_A", scaled: 0.05, unscaled: 0.04},
      { taxon: "Chlamydiota", scaled: 0.51, unscaled: 0.68},
      { taxon: "Chloroflexota", scaled: 3.79, unscaled: 3.69},
      { taxon: "Chrysiogenota", scaled: 0.01, unscaled: 0.01},
      { taxon: "Cloacimonadota", scaled: 0.24, unscaled: 0.2},
      { taxon: "Coprothermobacterota", scaled: 0.02, unscaled: 0.02},
      { taxon: "Cyanobacteriota", scaled: 1.71, unscaled: 1.36},
      { taxon: "DAOUPZ01", scaled: 0.01, unscaled: 0.0},
      { taxon: "DAOVTB01", scaled: 0.01, unscaled: 0.01},
      { taxon: "DRYD01", scaled: 0.02, unscaled: 0.02},
      { taxon: "DTU030", scaled: 0.03, unscaled: 0.02},
      { taxon: "DUMD01", scaled: 0.01, unscaled: 0.0},
      { taxon: "DUMJ01", scaled: 0.01, unscaled: 0.01},
      { taxon: "DYJV01", scaled: 0.01, unscaled: 0.01},
      { taxon: "Deferribacterota", scaled: 0.08, unscaled: 0.07},
      { taxon: "Deinococcota", scaled: 0.21, unscaled: 0.18},
      { taxon: "Delongbacteria", scaled: 0.05, unscaled: 0.04},
      { taxon: "Dependentiae", scaled: 0.32, unscaled: 0.34},
      { taxon: "Desantisbacteria", scaled: 0.01, unscaled: 0.01},
      { taxon: "Desulfobacterota", scaled: 3.22, unscaled: 2.56},
      { taxon: "Desulfobacterota_B", scaled: 0.26, unscaled: 0.2},
      { taxon: "Desulfobacterota_C", scaled: 0.03, unscaled: 0.02},
      { taxon: "Desulfobacterota_D", scaled: 0.09, unscaled: 0.07},
      { taxon: "Desulfobacterota_E", scaled: 0.05, unscaled: 0.04},
      { taxon: "Desulfobacterota_G", scaled: 0.07, unscaled: 0.05},
      { taxon: "Dictyoglomota", scaled: 0.02, unscaled: 0.01},
      { taxon: "Edwardsbacteria", scaled: 0.02, unscaled: 0.02},
      { taxon: "Eisenbacteria", scaled: 0.14, unscaled: 0.11},
      { taxon: "Electryoneota", scaled: 0.14, unscaled: 0.11},
      { taxon: "Elusimicrobiota", scaled: 0.54, unscaled: 0.51},
      { taxon: "Eremiobacterota", scaled: 0.28, unscaled: 0.23},
      { taxon: "FCPU426", scaled: 0.02, unscaled: 0.01},
      { taxon: "Fermentibacterota", scaled: 0.07, unscaled: 0.07},
      { taxon: "Fibrobacterota", scaled: 0.23, unscaled: 0.2},
      { taxon: "Firestonebacteria", scaled: 0.02, unscaled: 0.01},
      { taxon: "Fusobacteriota", scaled: 0.17, unscaled: 0.12},
      { taxon: "GCA-001730085", scaled: 0.02, unscaled: 0.01},
      { taxon: "GCA-2686955", scaled: 0.01, unscaled: 0.01},
      { taxon: "Gemmatimonadota", scaled: 0.68, unscaled: 0.61},
      { taxon: "Goldbacteria", scaled: 0.04, unscaled: 0.03},
      { taxon: "Hinthialibacterota", scaled: 0.05, unscaled: 0.04},
      { taxon: "Hydrogenedentota", scaled: 0.17, unscaled: 0.13},
      { taxon: "J088", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAAXHH01", scaled: 0.03, unscaled: 0.02},
      { taxon: "JAAXVQ01", scaled: 0.02, unscaled: 0.02},
      { taxon: "JAAYKD01", scaled: 0.02, unscaled: 0.01},
      { taxon: "JABDJQ01", scaled: 0.02, unscaled: 0.01},
      { taxon: "JABMQX01", scaled: 0.02, unscaled: 0.01},
      { taxon: "JACIXR01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JACPQU01", scaled: 0.01, unscaled: 0.0},
      { taxon: "JACPQY01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JACPSX01", scaled: 0.01, unscaled: 0.0},
      { taxon: "JACPUC01", scaled: 0.01, unscaled: 0.0},
      { taxon: "JACPWU01", scaled: 0.02, unscaled: 0.01},
      { taxon: "JACQOV01", scaled: 0.01, unscaled: 0.0},
      { taxon: "JACRDZ01", scaled: 0.03, unscaled: 0.02},
      { taxon: "JADFOP01", scaled: 0.01, unscaled: 0.0},
      { taxon: "JADJOY01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAFGBW01", scaled: 0.02, unscaled: 0.01},
      { taxon: "JAFGND01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAGLTZ01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAGLYR01", scaled: 0.03, unscaled: 0.02},
      { taxon: "JAGOBX01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAGOEH01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAGRBM01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAHJDO01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAJRZV01", scaled: 0.01, unscaled: 0.0},
      { taxon: "JAJVIF01", scaled: 0.02, unscaled: 0.02},
      { taxon: "JAJYCY01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAKLEM01", scaled: 0.02, unscaled: 0.01},
      { taxon: "JALSQH01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAMCPX01", scaled: 0.02, unscaled: 0.01},
      { taxon: "JAMORN01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAMOTN01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JANLFM01", scaled: 0.02, unscaled: 0.01},
      { taxon: "JAPLJL01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAQTZZ01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAUVQV01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAUXIB01", scaled: 0.01, unscaled: 0.01},
      { taxon: "JAUXIQ01", scaled: 0.01, unscaled: 0.0},
      { taxon: "JAUYMQ01", scaled: 0.01, unscaled: 0.0},
      { taxon: "JdFR-76", scaled: 0.03, unscaled: 0.02},
      { taxon: "KSB1", scaled: 0.18, unscaled: 0.11},
      { taxon: "Krumholzibacteriota", scaled: 0.18, unscaled: 0.15},
      { taxon: "Latescibacterota", scaled: 0.15, unscaled: 0.11},
      { taxon: "Lernaellota", scaled: 0.04, unscaled: 0.03},
      { taxon: "Lindowbacteria", scaled: 0.01, unscaled: 0.01},
      { taxon: "Lithacetigenota", scaled: 0.01, unscaled: 0.01},
      { taxon: "Margulisbacteria", scaled: 0.29, unscaled: 0.24},
      { taxon: "Marinisomatota", scaled: 0.42, unscaled: 0.38},
      { taxon: "Mcinerneyibacteriota", scaled: 0.02, unscaled: 0.01},
      { taxon: "Methylomirabilota", scaled: 0.13, unscaled: 0.09},
      { taxon: "Moduliflexota", scaled: 0.02, unscaled: 0.01},
      { taxon: "Muiribacteriota", scaled: 0.01, unscaled: 0.01},
      { taxon: "Myxococcota", scaled: 1.54, unscaled: 1.48},
      { taxon: "Myxococcota_A", scaled: 0.19, unscaled: 0.17},
      { taxon: "NPL-UPA2", scaled: 0.04, unscaled: 0.02},
      { taxon: "Nitrospinota", scaled: 0.2, unscaled: 0.15},
      { taxon: "Nitrospirota", scaled: 0.72, unscaled: 0.54},
      { taxon: "Nitrospirota_A", scaled: 0.04, unscaled: 0.03},
      { taxon: "Nitrospirota_B", scaled: 0.02, unscaled: 0.01},
      { taxon: "Omnitrophota", scaled: 1.36, unscaled: 1.17},
      { taxon: "PUNC01", scaled: 0.02, unscaled: 0.01},
      { taxon: "Patescibacteria", scaled: 8.49, unscaled: 10.58},
      { taxon: "Planctomycetota", scaled: 3.47, unscaled: 3.66},
      { taxon: "Poribacteria", scaled: 0.13, unscaled: 0.09},
      { taxon: "Pseudomonadota", scaled: 18.19, unscaled: 18.7},
      { taxon: "QNDG01", scaled: 0.05, unscaled: 0.03},
      { taxon: "RBG-13-61-14", scaled: 0.01, unscaled: 0.01},
      { taxon: "RBG-13-66-14", scaled: 0.05, unscaled: 0.04},
      { taxon: "RUG730", scaled: 0.02, unscaled: 0.01},
      { taxon: "Ratteibacteria", scaled: 0.09, unscaled: 0.08},
      { taxon: "Riflebacteria", scaled: 0.05, unscaled: 0.04},
      { taxon: "SAR324", scaled: 0.1, unscaled: 0.11},
      { taxon: "SLNR01", scaled: 0.01, unscaled: 0.0},
      { taxon: "SM23-31", scaled: 0.03, unscaled: 0.02},
      { taxon: "SZUA-182", scaled: 0.04, unscaled: 0.03},
      { taxon: "SZUA-79", scaled: 0.03, unscaled: 0.03},
      { taxon: "Schekmanbacteria", scaled: 0.02, unscaled: 0.01},
      { taxon: "Spirochaetota", scaled: 1.97, unscaled: 1.65},
      { taxon: "Sumerlaeota", scaled: 0.14, unscaled: 0.12},
      { taxon: "Synergistota", scaled: 0.3, unscaled: 0.26},
      { taxon: "T1SED10-198M", scaled: 0.01, unscaled: 0.01},
      { taxon: "T1Sed10-126", scaled: 0.01, unscaled: 0.01},
      { taxon: "TA06", scaled: 0.03, unscaled: 0.02},
      { taxon: "TA06_A", scaled: 0.03, unscaled: 0.01},
      { taxon: "Tectomicrobia", scaled: 0.02, unscaled: 0.02},
      { taxon: "Thermodesulfobiota", scaled: 0.01, unscaled: 0.01},
      { taxon: "Thermosulfidibacterota", scaled: 0.04, unscaled: 0.03},
      { taxon: "Thermotogota", scaled: 0.18, unscaled: 0.16},
      { taxon: "UBA10199", scaled: 0.18, unscaled: 0.13},
      { taxon: "UBA1439", scaled: 0.03, unscaled: 0.02},
      { taxon: "UBA2233", scaled: 0.01, unscaled: 0.01},
      { taxon: "UBA3054", scaled: 0.03, unscaled: 0.02},
      { taxon: "UBA6262", scaled: 0.05, unscaled: 0.03},
      { taxon: "UBA6266", scaled: 0.01, unscaled: 0.01},
      { taxon: "UBA8248", scaled: 0.03, unscaled: 0.03},
      { taxon: "UBA8481", scaled: 0.01, unscaled: 0.01},
      { taxon: "UBA9089", scaled: 0.06, unscaled: 0.04},
      { taxon: "UBP13", scaled: 0.01, unscaled: 0.01},
      { taxon: "UBP14", scaled: 0.06, unscaled: 0.04},
      { taxon: "UBP15", scaled: 0.02, unscaled: 0.02},
      { taxon: "UBP17", scaled: 0.03, unscaled: 0.03},
      { taxon: "UBP18", scaled: 0.01, unscaled: 0.01},
      { taxon: "UBP4", scaled: 0.02, unscaled: 0.01},
      { taxon: "UBP6", scaled: 0.04, unscaled: 0.04},
      { taxon: "UBP7", scaled: 0.01, unscaled: 0.02},
      { taxon: "VGIX01", scaled: 0.04, unscaled: 0.02},
      { taxon: "Verrucomicrobiota", scaled: 2.38, unscaled: 2.76},
      { taxon: "WOR-3", scaled: 0.36, unscaled: 0.31},
      { taxon: "Wallbacteria", scaled: 0.01, unscaled: 0.01},
      { taxon: "Zixibacteria", scaled: 0.31, unscaled: 0.23},
    ],



    showRedAsD3: false,
    cdv_switch: false,
  }),
})
</script>

<style scoped>

</style>
