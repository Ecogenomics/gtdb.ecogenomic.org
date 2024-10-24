<template>
  <v-container class="gtdb-container">
    <v-card>
      <v-card-title class="text-h5">
        Tools
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">

        <!-- GTDB Data Files -->
        <v-flex class="mt-5 mt-1">
          <span class="text-h6">Third-party tools</span>
        </v-flex>
        <v-simple-table class="gtdb-table">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Software
              </th>
              <th class="text-left">
                Description
              </th>
              <th class="text-left" style="min-width: 150px;">
                Link
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>AnnoTree</td>
              <td>AnnoTree is an interactive bacterial tree of life enabling the visualization of millions of
                precomputed functional annotations.
              </td>
              <td><a href="http://annotree.uwaterloo.ca/" target="_blank">Homepage</a></td>
            </tr>
            <tr>
              <td>IDTAXA</td>
              <td>A novel approach to taxonomic classification that employs principles from machine learning to reduce
                over classification errors
                (see <a href="https://microbiomejournal.biomedcentral.com/articles/10.1186/s40168-018-0521-5"
                        target="_blank">manuscript</a>).
              </td>
              <td><a href="http://www2.decipher.codes/Classification.html" target="_blank">Homepage</a></td>
            </tr>
            <tr>
              <td>SingleM</td>
              <td>SingleM is a tool to find the abundances of discrete operational taxonomic units (OTUs) directly from
                shotgun metagenome data,
                without heavy reliance on reference sequence databases. It is able to differentiate closely related
                species even if those species are from lineages new to science.
              </td>
              <td><a href="https://github.com/wwood/singlem" target="_blank">Homepage</a></td>
            </tr>
            <tr>
              <td>sourmash</td>
              <td>sourmash is a command-line tool and Python library for computing hash sketches from DNA sequences, comparing them to each other, and plotting the results. Prepared databases for GTDB are provided.
              </td>
              <td><a href="https://sourmash.readthedocs.io/en/latest/" target="_blank">Homepage</a></td>
            </tr>
            <tr>
              <td>iTOL</td>
              <td>Interactive Tree Of Life is an online tool for the display, annotation and management of phylogenetic and other trees.</td>
              <td>
                <a href="https://itol.embl.de/" target="_blank">Homepage</a><br>
                <a href="https://itol.embl.de/shared/ecogenomics" target="_blank">GTDB trees</a>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-flex class="mt-5">
          <span class="text-h6">Third-party GTDB databases</span>
        </v-flex>
        <v-simple-table class="gtdb-table mt-1">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Database
              </th>
              <th class="text-left">
                Description
              </th>
              <th class="text-left">
                Authors
              </th>
              <th class="text-left">
                Link
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>HUMANn 2, Kraken 2, Bracken 2</td>
              <td>HUMANn 2, Kraken 2 and Bracken 2 databases (see <a
                href="https://academic.oup.com/bioinformatics/article/36/7/2314/5645179" target="_blank">manuscript</a>).
              </td>
              <td>Jacobo de la Cuesta-Zuluaga, Ruth Ley, Nicholas Youngblut</td>
              <td><a href="https://github.com/leylabmpi/Struo" target="_blank">GitHub Repository</a></td>
            </tr>
            <tr>
              <td>Centrifuge, Kraken</td>
              <td>Centrfuge, Kraken 1, and Kraken 2 databases (see <a
                href="https://www.biorxiv.org/content/10.1101/712166v1" target="_blank">bioRxiv preprint</a>).
              </td>
              <td>Guillaume Méric, Ryan Wick and colleagues</td>
              <td><a href="https://monash.figshare.com/articles/GTDB_r89_54k/8956970" target="_blank">Monash
                University</a></td>
            </tr>
            <tr>
              <td>Kraken</td>
              <td>Kraken database.</td>
              <td>Henk den Bakker and Lee Katz.</td>
              <td><a href="https://github.com/hcdenbakker/GTDB_Kraken" target="_blank">GitHub Repository</a></td>
            </tr>
            <tr>
              <td>DADA 2</td>
              <td>DADA2 16S rRNA database.</td>
              <td>Ali Alishum and colleagues.</td>
              <td><a href="https://doi.org/10.5281/zenodo.2541238" target="_blank">Zenodo</a></td>
            </tr>
            <tr>
              <td>SBDI</td>
              <td>SBDI Sativa curated 16S GTDB database.</td>
              <td>Daniel Lundin, Anders Andersson and colleagues.</td>
              <td><a
                href="https://scilifelab.figshare.com/articles/dataset/SBDI_Sativa_curated_16S_GTDB_database/14869077"
                target="_blank">Figshare</a></td>
            </tr>
            <tr>
                <td>KMCP</td>
                <td>Accurate metagenomic profiler.</td>
                <td>Wei Shen</td>
                <td><a
                    href="https://github.com/shenwei356/kmcp"
                    target="_blank">GitHub</a></td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>

        <!-- Related Software -->
        <v-flex class="mt-5">
          <span class="text-h6">Third-party scripts</span>
        </v-flex>
        <v-simple-table class="gtdb-table mt-1">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Script
              </th>
              <th class="text-left">
                Description
              </th>
              <th class="text-left">
                Author
              </th>
              <th class="text-left">
                Link
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>tax_from_gtdb.py</td>
              <td>Generate NCBI-style taxonomy files from GTDB taxonomy files.</td>
              <td>Ryan Wick</td>
              <td><a href="https://github.com/rrwick/Metagenomics-Index-Correction" target="_blank">GitHub
                Repository</a></td>
            </tr>
            <tr>
              <td>genome_updater</td>
              <td>Bash script to download and update snapshots of the NCBI genomes (refseq/genbank).</td>
              <td>Vitor C. Piro</td>
              <td><a href="https://github.com/pirovc/genome_updater" target="_blank">GitHub Repository</a></td>
            </tr>
            <tr>
              <td>gtdb_to_taxdump</td>
              <td>Convert GTDB taxonomy to NCBI taxdump format.</td>
              <td>Nick Youngblut</td>
              <td><a href="https://github.com/nick-youngblut/gtdb_to_taxdump" target="_blank">GitHub Repository</a></td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'Third-party tools',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `A list of third-party tools that use the GTDB taxonomy.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `gtdbtk, gtdb-tk, gtdb tk, scripts, tools, third-party, third party, gtdb, taxonomy`
        }
      ]
    }
  },
})
</script>

<style scoped>

</style>
