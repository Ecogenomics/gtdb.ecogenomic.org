<template>
  <v-container class="gtdb-container">

  <v-card>

      <v-card-title class="text-h5">
        Downloads
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">


        <!-- Creative commons footer -->
        <v-flex>
          <v-row class="justify-center" no-gutters>
            <img alt="creative commons logo" height="31" src="~/assets/images/cc-by-sa-license.svg" width="88"/>
          </v-row>
          <v-row class="text-body-2 justify-center" no-gutters>
            This work is licensed under a
            <a class="ml-1" href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">
              Creative Commons Attribution-ShareAlike 4.0 International License
            </a>
          </v-row>
        </v-flex>


        <!-- GTDB Data Files -->
        <v-flex class="mt-10">
          <span class="text-h6">GTDB Data Files</span>
        </v-flex>
        <v-simple-table class="gtdb-table">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Location
              </th>
              <th class="text-left">
                Link
              </th>
              <th class="text-left">
                Recommended
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Europe (Denmark - Maintenance Sep 16, 2025)</td>
              <td><a href="https://data.gtdb.aau.ecogenomic.org/" target="_blank">https://data.gtdb.aau.ecogenomic.org/releases/</a></td>
              <td>Worldwide</td> 
            </tr>
            <tr>
              <td>Asia-Pacific 1 (Australia)</td>
              <td><a href="https://data.gtdb.ecogenomic.org/" target="_blank">https://data.gtdb.ecogenomic.org/releases/</a></td>
              <td>Australia</td>
            </tr>
            <tr>
              <td>Asia-Pacific 2 (Australia)</td>
              <td><a href="https://data.ace.uq.edu.au/public/gtdb/data/releases/" target="_blank">https://data.ace.uq.edu.au/public/gtdb/data/releases/</a></td>
              <td>Worldwide</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>


        <!-- Related Software -->
        <v-flex class="mt-10">
          <span class="text-h6">Related Software</span>
        </v-flex>
        <v-simple-table class="gtdb-table mt-1">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Software
              </th>
              <th class="text-left">
                Description
              </th>
              <th class="text-left">
                Link
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>GTDB-Tk</td>
              <td>Toolkit to classify genomes with the Genome Taxonomy Database.</td>
              <td><a href="https://github.com/Ecogenomics/GTDBTk" target="_blank">GitHub Repository</a></td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>


        <!-- Related Software -->
        <v-flex class="mt-10">
          <span class="text-h6">Data for papers based on GTDB</span>
        </v-flex>
        <v-simple-table class="gtdb-table mt-1">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Description
              </th>
              <th class="text-left">
                File
              </th>
              <th class="text-left">
                Date
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Population genomes described in `Comparative genomic analysis of the class Epsilonproteobacteria and
                proposed reclassification to Epsilonbacteraeota` (doi:
                <a href="https://doi.org/10.3389/fmicb.2017.00682" target="_blank">10.3389/fmicb.2017.00682</a>).
              </td>
              <td><a href="https://data.ace.uq.edu.au/public/gtdb/publications/Epsilonbacteraeota-Waite2017.zip"
                     target="_blank">Epsilonbacteraeota population genomes</a></td>
              <td>07/11/2017</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>

      </v-card-text>

    </v-card>

    <!--    <v-card class="mt-4">-->
    <!--      <v-card-title>GTDB data files</v-card-title>-->
    <!--      <v-card-text>-->
    <!--        <v-simple-table class="gtdb-table">-->
    <!--          <template v-slot:default>-->
    <!--            <thead>-->
    <!--            <tr>-->
    <!--              <th class="text-left">-->
    <!--                Source-->
    <!--              </th>-->
    <!--              <th class="text-left">-->
    <!--                Primary-->
    <!--              </th>-->
    <!--              <th class="text-left">-->
    <!--                Mirror-->
    <!--              </th>-->
    <!--            </tr>-->
    <!--            </thead>-->
    <!--            <tbody>-->
    <!--            <tr>-->
    <!--              <td>GTDB repository</td>-->
    <!--              <td><a href="https://data.gtdb.ecogenomic.org/" target="_blank">https://data.gtdb.ecogenomic.org/</a></td>-->
    <!--              <td><a href="https://data.ace.uq.edu.au/public/gtdb/data/releases/" target="_blank">https://data.ace.uq.edu.au/public/gtdb/data/releases/</a>-->
    <!--              </td>-->
    <!--            </tr>-->
    <!--            </tbody>-->
    <!--          </template>-->
    <!--        </v-simple-table>-->
    <!--      </v-card-text>-->
    <!--    </v-card>-->


    <!--    <v-card class="mt-4">-->
    <!--      <v-card-title>Related software</v-card-title>-->
    <!--      <v-card-text>-->
    <!--        <v-simple-table class="gtdb-table">-->
    <!--          <template v-slot:default>-->
    <!--            <thead>-->
    <!--            <tr>-->
    <!--              <th class="text-left">-->
    <!--                Software-->
    <!--              </th>-->
    <!--              <th class="text-left">-->
    <!--                Description-->
    <!--              </th>-->
    <!--              <th class="text-left">-->
    <!--                Link-->
    <!--              </th>-->
    <!--            </tr>-->
    <!--            </thead>-->
    <!--            <tbody>-->
    <!--            <tr>-->
    <!--              <td>GTDB-Tk</td>-->
    <!--              <td>Toolkit to classify genomes with the Genome Taxonomy Database.</td>-->
    <!--              <td><a href="https://github.com/Ecogenomics/GTDBTk" target="_blank">GitHub Repository</a></td>-->
    <!--            </tr>-->
    <!--            </tbody>-->
    <!--          </template>-->
    <!--        </v-simple-table>-->
    <!--      </v-card-text>-->
    <!--    </v-card>-->

    <!--    <v-card class="mt-4">-->
    <!--      <v-card-title>Data for papers based on the GTDB</v-card-title>-->
    <!--      <v-card-text>-->
    <!--        <v-simple-table class="gtdb-table ">-->
    <!--          <template v-slot:default>-->
    <!--            <thead>-->
    <!--            <tr>-->
    <!--              <th class="text-left">-->
    <!--                Description-->
    <!--              </th>-->
    <!--              <th class="text-left">-->
    <!--                File-->
    <!--              </th>-->
    <!--              <th class="text-left">-->
    <!--                Date-->
    <!--              </th>-->
    <!--            </tr>-->
    <!--            </thead>-->
    <!--            <tbody>-->
    <!--            <tr>-->
    <!--              <td>Population genomes described in `Comparative genomic analysis of the class Epsilonproteobacteria and-->
    <!--                proposed reclassification to Epsilonbacteraeota` (doi:-->
    <!--                <a href="https://doi.org/10.3389/fmicb.2017.00682" target="_blank">10.3389/fmicb.2017.00682</a>).-->
    <!--              </td>-->
    <!--              <td><a href="https://data.ace.uq.edu.au/public/gtdb/publications/Epsilonbacteraeota-Waite2017.zip"-->
    <!--                     target="_blank">Epsilonbacteraeota population genomes</a></td>-->
    <!--              <td>07/11/2017</td>-->
    <!--            </tr>-->
    <!--            </tbody>-->
    <!--          </template>-->
    <!--        </v-simple-table>-->
    <!--      </v-card-text>-->
    <!--    </v-card>-->
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'Downloads',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Download GTDB release files and supplementary data.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `download, release, gtdb`
        }
      ]
    }
  },
  data: () => ({}),
})
</script>

<style scoped>

</style>
