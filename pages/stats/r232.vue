<template>
  <v-container class="gtdb-container">

    <SectionedPage :items="items">

      <template #title>
          <v-row no-gutters>
            <v-col>
              <StatsTitle date="15th April, 2025" release="232" />
            </v-col>
            <v-col cols="4" ><v-switch
        v-model="cdv_switch"
        class="switch align-content-end"
        label="Colour vision deficiency"
        color="#7e8e7d"
      /></v-col>
          </v-row>

      </template>


      <template #taxon-overview>
        GTDB R232 spans 901,341 genomes organized into 199,923 species clusters.
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
              <td>162</td>
              <td>24</td>
              <td>186</td>
            </tr>
            <tr>
              <td>Class</td>
              <td>572</td>
              <td>69</td>
              <td>641</td>
            </tr>
            <tr>
              <td>Order</td>
              <td>2,164</td>
              <td>179</td>
              <td>2,343</td>
            </tr>
            <tr>
              <td>Family</td>
              <td>6,026</td>
              <td>699</td>
              <td>6,725</td>
            </tr>
            <tr>
              <td>Genus</td>
              <td>34,834</td>
              <td>2,669</td>
              <td>37,503</td>
            </tr>
            <tr>
              <td>Species</td>
              <td>189,801</td>
              <td>10,122</td>
              <td>199,923</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>

      <template #species-overview>
        GTDB R232 is comprised of 878,998 bacterial and 22,343 archaeal genomes organized into 189,801 bacterial and
        10,122
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
              <td>R09-RS220</td>
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
              <td>R11-RS232</td>
              <td>878,998</td>
              <td>22,343</td>
              <td>189,801</td>
              <td>10,122</td>
            </tr>
            <tr>
              <td><b>Growth from R10-RS226</b></td>
              <td>22.90%</td>
              <td>29.56%</td>
              <td>38.90%</td>
              <td>45.26%</td>
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
          :full="require('~/assets/images/stats/r232/genome-category-per-rank-cvd.svg')"
          :preview="require('~/assets/images/stats/r232/genome-category-per-rank-cvd.svg')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        />
      </template>
      <template v-else>
        <ImgToggle
          :full="require('~/assets/images/stats/r232/genome-category-per-rank.svg')"
          :preview="require('~/assets/images/stats/r232/genome-category-per-rank.svg')"

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
          :full="require('~/assets/images/stats/r232/sp-rep-type-cvd.svg')"
          :preview="require('~/assets/images/stats/r232/sp-rep-type-cvd.svg')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        />
      </template>
      <template v-else>
        <ImgToggle
          :full="require('~/assets/images/stats/r232/sp-rep-type.svg')"
          :preview="require('~/assets/images/stats/r232/sp-rep-type.svg')"
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
          :full="require('~/assets/images/stats/r232/genome-quality-species-cvd.png')"
          :preview="require('~/assets/images/stats/r232/genome-quality-species-cvd.png')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        />
      </template>
      <template v-else>
        <ImgToggle
          :full="require('~/assets/images/stats/r232/genome-quality-species.png')"
          :preview="require('~/assets/images/stats/r232/genome-quality-species.png')"
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
              <td>Pseudomonadota 46,828</td>
              <td>Gammaproteobacteria 25,165</td>
              <td>Burkholderiales 9,155</td>
              <td>Lachnospiraceae 4,549</td>
              <td>Streptomyces 2,311</td>
            </tr>
            <tr>
              <td>Bacillota 27,167</td>
              <td>Bacteroidia 21,942</td>
              <td>Bacteroidales 8,804</td>
              <td>Flavobacteriaceae 3,764</td>
              <td>Collinsella 1,181</td>
            </tr>
            <tr>
              <td>Actinomycetota 24,968</td>
              <td>Alphaproteobacteria 21,473</td>
              <td>Oscillospirales 7,815</td>
              <td>Rhodobacteraceae 3,226</td>
              <td>Flavobacterium 1,026</td>
            </tr>
            <tr>
              <td>Bacteroidota 23,901</td>
              <td>Clostridia 20,027</td>
              <td>Rhizobiales 5,752</td>
              <td>Burkholderiaceae_C 2,966</td>
              <td>Aquipseudomonas 993</td>
            </tr>
            <tr>
              <td>Patescibacteriota 10,945</td>
              <td>Actinomycetes 14,793</td>
              <td>Lachnospirales 4,973</td>
              <td>Sphingomonadaceae 2,805</td>
              <td>Prevotella 959</td>
            </tr>
            <tr>
              <td>Acidobacteriota 7,453</td>
              <td>Bacilli 4,864</td>
              <td>Pseudomonadales 4,700</td>
              <td>Streptomycetaceae 2,611</td>
              <td>Pelagibacter 938</td>
            </tr>
            <tr>
              <td>Chloroflexota 6,831</td>
              <td>Minisyncoccia 4,322</td>
              <td>Flavobacteriales 4,674</td>
              <td>Acutalibacteraceae 2,322</td>
              <td>Mycobacterium 850</td>
            </tr>
            <tr>
              <td>Planctomycetota 4,995</td>
              <td>Terriglobia 4,081</td>
              <td>Actinomycetales 4,579</td>
              <td>Acidobacteriaceae 2,202</td>
              <td>Streptococcus 761</td>
            </tr>
            <tr>
              <td>Verrucomicrobiota 4,825</td>
              <td>Bacilli_A 3,799</td>
              <td>Mycobacteriales 3,781</td>
              <td>Chitinophagaceae 2,191</td>
              <td>Cryptobacteroides 643</td>
            </tr>
            <tr>
              <td>Desulfobacterota 4,552</td>
              <td>Verrucomicrobiia 3,767</td>
              <td>Chitinophagales 3,446</td>
              <td>Bacteroidaceae 2,100</td>
              <td>Microbacterium 593</td>
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
              <th class="text-left">
                Species
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Pseudomonadota 324,613</td>
              <td>Gammaproteobacteria 273,004</td>
              <td>Enterobacterales 162,324</td>
              <td>Enterobacteriaceae 139,599</td>
              <td>Escherichia 37,464</td>
              <td>Escherichia coli 36,408</td>
            </tr>
            <tr>
              <td>Bacillota 228,026</td>
              <td>Bacilli 112,556</td>
              <td>Bacteroidales 75,895</td>
              <td>Lachnospiraceae 42,630</td>
              <td>Klebsiella 35,140</td>
              <td>Klebsiella pneumoniae 28,487</td>
            </tr>
            <tr>
              <td>Bacteroidota 107,378</td>
              <td>Clostridia 107,138</td>
              <td>Lactobacillales 62,342</td>
              <td>Staphylococcaceae 28,460</td>
              <td>Staphylococcus 27,543</td>
              <td>Salmonella enterica 21,527</td>
            </tr>
            <tr>
              <td>Actinomycetota 80,926</td>
              <td>Bacteroidia 103,615</td>
              <td>Pseudomonadales 50,143</td>
              <td>Streptococcaceae 25,663</td>
              <td>Streptococcus 23,747</td>
              <td>Staphylococcus aureus 19,502</td>
            </tr>
            <tr>
              <td>Patescibacteriota 16,000</td>
              <td>Actinomycetes 60,544</td>
              <td>Lachnospirales 43,929</td>
              <td>Muribaculaceae 25,055</td>
              <td>Salmonella 21,848</td>
              <td>ECMA0423 sp047199055 13,724</td>
            </tr>
            <tr>
              <td>Bacillota_I 14,528</td>
              <td>Alphaproteobacteria 51,346</td>
              <td>Burkholderiales 35,997</td>
              <td>Pseudomonadaceae 24,656</td>
              <td>Acinetobacter 16,492</td>
              <td>Pseudomonas aeruginosa 12,456</td>
            </tr>
            <tr>
              <td>Campylobacterota 14,392</td>
              <td>Bacilli_A 14,528</td>
              <td>Oscillospirales 33,622</td>
              <td>Bacteroidaceae 23,694</td>
              <td>ECMA0423 13,724</td>
              <td>Acinetobacter baumannii 11,844</td>
            </tr>
            <tr>
              <td>Verrucomicrobiota 10,795</td>
              <td>Campylobacteria 14,392</td>
              <td>Staphylococcales 28,714</td>
              <td>Mycobacteriaceae 18,607</td>
              <td>Pseudomonas 12,771</td>
              <td>Streptococcus pneumoniae 9,634</td>
            </tr>
            <tr>
              <td>Acidobacteriota 10,449</td>
              <td>Verrucomicrobiia 8,872</td>
              <td>Mycobacteriales 22,121</td>
              <td>Moraxellaceae 17,964</td>
              <td>Mycobacterium 12,726</td>
              <td>Mycobacterium tuberculosis 7,759</td>
            </tr>
            <tr>
              <td>Chloroflexota 10,423</td>
              <td>Acidimicrobiia 7,655</td>
              <td>Actinomycetales 17,794</td>
              <td>Lactobacillaceae 14,996</td>
              <td>Streptomyces 11,995</td>
              <td>Enterococcus faecalis 5,041</td>
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
          <REDr232></REDr232>
        </template>
        <template v-else>
          <h2>Bacteria</h2>
          <ImgToggle
            :full="require('~/assets/images/stats/r232/red-bacteria.png')"
            :preview="require('~/assets/images/stats/r232/red-bacteria.png')"
            class="mt-2"
            preview-max-width="800px"
            preview-width="75%"
          >
          </ImgToggle>

          <hr>

          <h2>Archaea</h2>
          <ImgToggle
            :full="require('~/assets/images/stats/r232/red-archaea.png')"
            :preview="require('~/assets/images/stats/r232/red-archaea.png')"
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
          :full="require('~/assets/images/stats/r232/ncbi-compare-species-cvd.svg')"
          :preview="require('~/assets/images/stats/r232/ncbi-compare-species-cvd.svg')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        >
        </ImgToggle>
        <hr>
        <ImgToggle
          :full="require('~/assets/images/stats/r232/ncbi-compare-genomes-cvd.svg')"
          :preview="require('~/assets/images/stats/r232/ncbi-compare-genomes-cvd.svg')"
          class="mt-3"
          preview-max-width="800px"
          preview-width="75%"
        >
        </ImgToggle>
      </template>
      <template v-else>
        <ImgToggle
          :full="require('~/assets/images/stats/r232/ncbi-compare-species.svg')"
          :preview="require('~/assets/images/stats/r232/ncbi-compare-species.svg')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        >
        </ImgToggle>
        <hr>
        <ImgToggle
          :full="require('~/assets/images/stats/r232/ncbi-compare-genomes.svg')"
          :preview="require('~/assets/images/stats/r232/ncbi-compare-genomes.svg')"
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
          :full="require('~/assets/images/stats/r232/genomic-stats-genomes.svg')"
          :preview="require('~/assets/images/stats/r232/genomic-stats-genomes.svg')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        >
        </ImgToggle>

        <hr>

        <h2>Species</h2>
        <ImgToggle
          :full="require('~/assets/images/stats/r232/genomic-stats-species.svg')"
          :preview="require('~/assets/images/stats/r232/genomic-stats-species.svg')"
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
              <td>75 (46.30%)</td>
              <td>87 (53.70%)</td>
              <td>16 (66.67%)</td>
              <td>8 (33.33%)</td>
              <td>91 (48.92%)</td>
              <td>95 (51.08%)</td>
            </tr>
            <tr>
              <td>Class</td>
              <td>174 (30.42%)</td>
              <td>398 (69.58%)</td>
              <td>42 (60.87%)</td>
              <td>27 (39.13%)</td>
              <td>216 (33.70%)</td>
              <td>425 (66.30%)</td>
            </tr>
            <tr>
              <td>Order</td>
              <td>417 (19.27%)</td>
              <td>1,747 (80.73%)</td>
              <td>72 (40.22%)</td>
              <td>107 (59.78%)</td>
              <td>489 (20.87%)</td>
              <td>1,854 (79.13%)</td>
            </tr>
            <tr>
              <td>Family</td>
              <td>892 (14.80%)</td>
              <td>5,134 (85.20%)</td>
              <td>117 (16.74%)</td>
              <td>582 (83.26%)</td>
              <td>1,009 (15.00%)</td>
              <td>5,716 (85.00%)</td>
            </tr>
            <tr>
              <td>Genus</td>
              <td>4,422 (12.69%)</td>
              <td>30,412 (87.31%)</td>
              <td>304 (11.39%)</td>
              <td>2,365 (88.61%)</td>
              <td>4,726 (12.60%)</td>
              <td>32,777 (87.40%)</td>
            </tr>
            <tr>
              <td>Species</td>
              <td>19,798 (10.43%)</td>
              <td>170,003 (89.57%)</td>
              <td>888 (8.77%)</td>
              <td>9,234 (91.23%)</td>
              <td>20,686 (10.35%)</td>
              <td>179,237 (89.65%)</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>


                <template v-if="cdv_switch">
        <ImgToggle
          :full="require('~/assets/images/stats/r232/nomenclatural-per-rank-cvd.svg')"
          :preview="require('~/assets/images/stats/r232/nomenclatural-per-rank-cvd.svg')"
          class="mt-2"
          preview-max-width="800px"
          preview-width="75%"
        />
      </template>
      <template v-else>
        <ImgToggle
          :full="require('~/assets/images/stats/r232/nomenclatural-per-rank.svg')"
          :preview="require('~/assets/images/stats/r232/nomenclatural-per-rank.svg')"
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
        <p><strong>Note:</strong> RED-normalised values represent the median phylogenetic diversity (PD) across RED-scaled trees, each rooted with a phylum containing at least two classes.</p>

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
      title: 'R232 Statistics',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Statistics describing GTDB release R232.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `R232, statistics, GTDB, release 232, stats`
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
  {
   taxon: "AGJL01",
   scaled: 0.34,
   unscaled: 0.2
  },
  {
   taxon: "Aenigmatarchaeota",
   scaled: 5.94,
   unscaled: 7.18
  },
  {
   taxon: "Altiarchaeota",
   scaled: 1.22,
   unscaled: 1.13
  },
  {
   taxon: "Asgardarchaeota",
   scaled: 3.92,
   unscaled: 3.94
  },
  {
   taxon: "B1Sed10-29",
   scaled: 0.94,
   unscaled: 0.84
  },
  {
   taxon: "CAYFZR01",
   scaled: 0.03,
   unscaled: 0.01
  },
  {
   taxon: "CAYQAE01",
   scaled: 0.18,
   unscaled: 0.14
  },
  {
   taxon: "EX4484-52",
   scaled: 0.6,
   unscaled: 0.69
  },
  {
   taxon: "Hadarchaeota",
   scaled: 1.09,
   unscaled: 0.81
  },
  {
   taxon: "Halobacteriota",
   scaled: 10.81,
   unscaled: 7.72
  },
  {
   taxon: "Huberarchaeota",
   scaled: 0.0,
   unscaled: 0.0
  },
  {
   taxon: "Hydrothermarchaeota",
   scaled: 0.73,
   unscaled: 0.49
  },
  {
   taxon: "Iainarchaeota",
   scaled: 3.03,
   unscaled: 3.97
  },
  {
   taxon: "JAADCQ01",
   scaled: 0.04,
   unscaled: 0.03
  },
  {
   taxon: "JACRDV01",
   scaled: 0.0,
   unscaled: 0.0
  },
  {
   taxon: "Korarchaeota",
   scaled: 0.52,
   unscaled: 0.56
  },
  {
   taxon: "Methanobacteriota",
   scaled: 1.7,
   unscaled: 1.01
  },
  {
   taxon: "Methanobacteriota_B",
   scaled: 0.87,
   unscaled: 0.62
  },
  {
   taxon: "Micrarchaeota",
   scaled: 6.33,
   unscaled: 8.74
  },
  {
   taxon: "Nanobdellota",
   scaled: 24.39,
   unscaled: 32.68
  },
  {
   taxon: "Nanohalarchaeota",
   scaled: 0.71,
   unscaled: 0.89
  },
  {
   taxon: "SpSt-1190",
   scaled: 0.46,
   unscaled: 0.46
  },
  {
   taxon: "Thermoplasmatota",
   scaled: 11.95,
   unscaled: 9.91
  },
  {
   taxon: "Thermoproteota",
   scaled: 18.12,
   unscaled: 17.01
  },
  {
   taxon: "Undinarchaeota",
   scaled: 0.51,
   unscaled: 0.42
  }
 ],

phylumPdBac: [
    {   taxon: "2-12-FULL-45-22",scaled: 0.01,unscaled: 0.01},
  {   taxon: "4484-113",scaled: 0.04,unscaled: 0.04},
  {   taxon: "4572-55",scaled: 0.02,unscaled: 0.01},
  {   taxon: "ARS69",scaled: 0.02,unscaled: 0.02},
  {   taxon: "AUK180",scaled: 0.03,unscaled: 0.02},
  {   taxon: "Abyssobacteria",scaled: 0.03,unscaled: 0.02},
  {   taxon: "Acidobacteriota",scaled: 4.28,unscaled: 3.13},
  {   taxon: "Actinomycetota",scaled: 7.88,unscaled: 8.01},
  {   taxon: "Aerophobota",scaled: 0.05,unscaled: 0.04},
  {   taxon: "Aquificota",scaled: 0.12,unscaled: 0.12},
  {   taxon: "Arandabacterota",scaled: 0.04,unscaled: 0.02},
  {   taxon: "Armatimonadota",scaled: 0.75,unscaled: 0.73},
  {   taxon: "Atribacterota",scaled: 0.09,unscaled: 0.07},
  {   taxon: "Auribacterota",scaled: 0.19,unscaled: 0.12},
  {   taxon: "B130-G9",scaled: 0.01,unscaled: 0.01},
  {   taxon: "BMS3Abin14",scaled: 0.03,unscaled: 0.02},
  {   taxon: "BS750m-G25",scaled: 0.0,unscaled: 0.0},
  {   taxon: "Babelota",scaled: 0.33,unscaled: 0.41},
  {   taxon: "Bacillota",scaled: 13.16,unscaled: 12.79},
  {   taxon: "Bacillota_I",scaled: 2.66,unscaled: 3.28},
  {   taxon: "Bacteroidota",scaled: 7.59,unscaled: 9.03},
  {   taxon: "Bdellovibrionota",scaled: 0.86,unscaled: 0.81},
  {   taxon: "Bdellovibrionota_B",scaled: 0.16,unscaled: 0.18},
  {   taxon: "Bdellovibrionota_C",scaled: 0.18,unscaled: 0.19},
  {   taxon: "Bdellovibrionota_F",scaled: 0.02,unscaled: 0.02},
  {   taxon: "Bdellovibrionota_G",scaled: 0.05,unscaled: 0.04},
  {   taxon: "Bipolaricaulota",scaled: 0.15,unscaled: 0.16},
  {   taxon: "Blakebacterota",scaled: 0.02,unscaled: 0.01},
  {   taxon: "CAIJMQ01",scaled: 0.02,unscaled: 0.02},
  {   taxon: "CAIWAD01",scaled: 0.02,unscaled: 0.02},
  {   taxon: "CALINM01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "CAYJOG01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "CAYJRR01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "CAYMEV01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "CAYSBA01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "CAYTYR01",scaled: 0.02,unscaled: 0.01},
  {   taxon: "CAYUVA01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "CAZDME01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "CAZSTA01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "CAZTWC01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "CBDUZB01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "CG03",scaled: 0.05,unscaled: 0.06},
  {   taxon: "CG2-30-53-67",scaled: 0.03,unscaled: 0.02},
  {   taxon: "CLD3",scaled: 0.04,unscaled: 0.03},
  {   taxon: "CSSED10-310",scaled: 0.05,unscaled: 0.04},
  {   taxon: "Caldisericota",scaled: 0.1,unscaled: 0.1},
  {   taxon: "Calditrichota",scaled: 0.14,unscaled: 0.08},
  {   taxon: "Calescibacteriota",scaled: 0.01,unscaled: 0.01},
  {   taxon: "Campylobacterota",scaled: 0.59,unscaled: 0.61},
  {   taxon: "Campylobacterota_A",scaled: 0.05,unscaled: 0.04},
  {   taxon: "Chlamydiota",scaled: 0.61,unscaled: 0.68},
  {   taxon: "Chloroflexota",scaled: 4.5,unscaled: 4.61},
  {   taxon: "Chrysiogenota",scaled: 0.08,unscaled: 0.06},
  {   taxon: "Cloacimonadota",scaled: 0.22,unscaled: 0.19},
  {   taxon: "Coprothermobacterota",scaled: 0.03,unscaled: 0.03},
  {   taxon: "Cyanobacteriota",scaled: 1.4,unscaled: 1.02},
  {   taxon: "DAOPZR01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "DASVDK01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "DRYD01",scaled: 0.02,unscaled: 0.02},
  {   taxon: "DUMJ01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "DYJV01",scaled: 0.02,unscaled: 0.01},
  {   taxon: "Deinococcota",scaled: 0.19,unscaled: 0.18},
  {   taxon: "Desantisbacteria",scaled: 0.01,unscaled: 0.01},
  {   taxon: "Desulfobacterota",scaled: 3.81,unscaled: 2.51},
  {   taxon: "Desulfobacterota_D",scaled: 0.1,unscaled: 0.08},
  {   taxon: "Dictyoglomota",scaled: 0.01,unscaled: 0.01},
  {   taxon: "Edwardsbacteria",scaled: 0.04,unscaled: 0.02},
  {   taxon: "Eisenbacteria",scaled: 0.26,unscaled: 0.2},
  {   taxon: "Electryoneota",scaled: 0.14,unscaled: 0.11},
  {   taxon: "Elusimicrobiota",scaled: 0.48,unscaled: 0.47},
  {   taxon: "Fermentibacterota",scaled: 0.06,unscaled: 0.06},
  {   taxon: "Fibrobacterota",scaled: 0.22,unscaled: 0.21},
  {   taxon: "Fidelibacterota",scaled: 0.36,unscaled: 0.3},
  {   taxon: "Fusobacteriota",scaled: 0.12,unscaled: 0.1},
  {   taxon: "GCA-001730085",scaled: 0.02,unscaled: 0.01},
  {   taxon: "GCA-2686955",scaled: 0.02,unscaled: 0.01},
  {   taxon: "Gemmatimonadota",scaled: 1.24,unscaled: 0.97},
  {   taxon: "Hinthialibacterota",scaled: 0.07,unscaled: 0.05},
  {   taxon: "Hydrogenedentota",scaled: 0.17,unscaled: 0.13},
  {   taxon: "Hydrothermota",scaled: 0.35,unscaled: 0.33},
  {   taxon: "J088",scaled: 0.02,unscaled: 0.02},
  {   taxon: "JAAXHH01",scaled: 0.03,unscaled: 0.02},
  {   taxon: "JACPQY01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "JACPSX01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "JACPUC01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "JACQOV01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "JACRDZ01",scaled: 0.03,unscaled: 0.02},
  {   taxon: "JADFOP01",scaled: 0.02,unscaled: 0.01},
  {   taxon: "JADJOY01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "JAEEML01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "JAFGKV01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "JAFGND01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "JAGOBX01",scaled: 0.02,unscaled: 0.01},
  {   taxon: "JAGOEH01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "JAGRBM01",scaled: 0.02,unscaled: 0.01},
  {   taxon: "JAHJDO01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "JAJRZV01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "JAJVIF01",scaled: 0.03,unscaled: 0.03},
  {   taxon: "JALSQH01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "JAMCPX01",scaled: 0.03,unscaled: 0.02},
  {   taxon: "JAMORN01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "JAMOTN01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "JAUVQV01",scaled: 0.02,unscaled: 0.01},
  {   taxon: "JAUXIQ01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "JAUYMQ01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "JBBIVP01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "JBDRGX01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "JBFMHD01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "JBHIER01",scaled: 0.01,unscaled: 0.01},
  {   taxon: "Joyebacterota",scaled: 0.03,unscaled: 0.02},
  {   taxon: "Krumholzibacteriota",scaled: 0.23,unscaled: 0.17},
  {   taxon: "LJUI01",scaled: 0.0,unscaled: 0.0},
  {   taxon: "Latescibacterota",scaled: 0.17,unscaled: 0.13},
  {   taxon: "Lernaellota",scaled: 0.04,unscaled: 0.03},
  {   taxon: "Lindowbacteria",scaled: 0.01,unscaled: 0.01},
  {   taxon: "Macinerneyibacteriota",scaled: 0.02,unscaled: 0.02},
  {   taxon: "Margulisbacteria",scaled: 0.3,unscaled: 0.25},
  {   taxon: "Methylomirabilota",scaled: 0.21,unscaled: 0.13},
  {   taxon: "Moduliflexota",scaled: 0.02,unscaled: 0.01},
  {   taxon: "Muiribacteriota",scaled: 0.13,unscaled: 0.11},
  {   taxon: "Myxococcota",scaled: 0.48,unscaled: 0.37},
  {   taxon: "Myxococcota_A",scaled: 1.6,unscaled: 1.53},
  {   taxon: "Myxococcota_C",scaled: 0.01,unscaled: 0.01},
  {   taxon: "NPL-UPA2",scaled: 0.05,unscaled: 0.03},
  {   taxon: "Nitrospinota",scaled: 0.11,unscaled: 0.07},
  {   taxon: "Nitrospinota_A",scaled: 0.09,unscaled: 0.05},
  {   taxon: "Nitrospirota",scaled: 0.79,unscaled: 0.52},
  {   taxon: "Oederibacteriota",scaled: 0.18,unscaled: 0.13},
  {   taxon: "Omnitrophota",scaled: 1.33,unscaled: 1.17},
  {   taxon: "Orphanbacterota",scaled: 0.03,unscaled: 0.02},
  {   taxon: "Patescibacteriota",scaled: 9.85,unscaled: 15.66},
  {   taxon: "Planctomycetota",scaled: 3.77,unscaled: 4.44},
  {   taxon: "Poribacteria",scaled: 0.12,unscaled: 0.09},
  {   taxon: "Pseudomonadota",scaled: 17.34,unscaled: 15.94},
  {   taxon: "RBG-13-61-14",scaled: 0.04,unscaled: 0.03},
  {   taxon: "RBG-13-66-14",scaled: 0.05,unscaled: 0.04},
  {   taxon: "RUG730",scaled: 0.03,unscaled: 0.02},
  {   taxon: "Ratteibacteria",scaled: 0.08,unscaled: 0.08},
  {   taxon: "SAR324",scaled: 0.1,unscaled: 0.11},
  {   taxon: "SDB-A",scaled: 0.01,unscaled: 0.01},
  {   taxon: "SM23-31",scaled: 0.04,unscaled: 0.02},
  {   taxon: "SM23-81",scaled: 0.02,unscaled: 0.01},
  {   taxon: "SZUA-182",scaled: 0.05,unscaled: 0.03},
  {   taxon: "SZUA-79",scaled: 0.02,unscaled: 0.02},
  {   taxon: "Schekmanbacteria",scaled: 0.02,unscaled: 0.01},
  {   taxon: "Spirochaetota",scaled: 1.42,unscaled: 1.53},
  {   taxon: "Sumerlaeota",scaled: 0.17,unscaled: 0.14},
  {   taxon: "Synergistota",scaled: 0.21,unscaled: 0.19},
  {   taxon: "Sysuimicrobiota",scaled: 0.1,unscaled: 0.07},
  {   taxon: "T1Sed10-126",scaled: 0.03,unscaled: 0.02},
  {   taxon: "Tectomicrobia",scaled: 0.03,unscaled: 0.02},
  {   taxon: "Thermodesulfobiota",scaled: 0.01,unscaled: 0.01},
  {   taxon: "Thermosulfidibacterota",scaled: 0.03,unscaled: 0.02},
  {   taxon: "Thermotogota",scaled: 0.13,unscaled: 0.13},
  {   taxon: "UBA10199",scaled: 0.2,unscaled: 0.13},
  {   taxon: "UBA2233",scaled: 0.01,unscaled: 0.01},
  {   taxon: "UBA4055",scaled: 0.02,unscaled: 0.02},
  {   taxon: "UBA6262",scaled: 0.03,unscaled: 0.02},
  {   taxon: "UBA8248",scaled: 0.05,unscaled: 0.04},
  {   taxon: "UBA8481",scaled: 0.02,unscaled: 0.01},
  {   taxon: "UBA9089",scaled: 0.06,unscaled: 0.04},
  {   taxon: "UBP13",scaled: 0.01,unscaled: 0.01},
  {   taxon: "UBP14",scaled: 0.06,unscaled: 0.05},
  {   taxon: "UBP15",scaled: 0.03,unscaled: 0.03},
  {   taxon: "UBP18",scaled: 0.01,unscaled: 0.01},
  {   taxon: "UBP4",scaled: 0.02,unscaled: 0.01},
  {   taxon: "UBP6",scaled: 0.05,unscaled: 0.04},
  {   taxon: "UBP7",scaled: 0.02,unscaled: 0.02},
  {   taxon: "Verrucomicrobiota",scaled: 3.01,unscaled: 2.84},
  {   taxon: "Vulcanimicrobiota",scaled: 0.34,unscaled: 0.26},
  {   taxon: "Zhuqueibacterota",scaled: 0.28,unscaled: 0.16},
  {   taxon: "Zixibacteria",scaled: 0.35,unscaled: 0.25}
 ],



    showRedAsD3: false,
    cdv_switch: false,
  }),
})
</script>

<style scoped>

</style>
