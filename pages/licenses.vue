<template>
  <v-container class="gtdb-container">

    <v-card>

      <v-card-title class="text-h5">
        Licenses
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">

        Our resources, the Genome Taxonomy Database and the Genome Taxonomy Database Toolkit, are made available under
        two different licenses. Here's what you need to know about these licenses.


        <v-card class="mt-3" outlined>
          <v-card-title>
            Genome Taxonomy Database (GTDB)
          </v-card-title>
          <v-card-text class="text--primary">
            The Genome Taxonomy Database is licensed under the Creative Commons Attribution-ShareAlike 4.0 International
            License. This means that you are free to:

            <ul>
              <li><b>Share</b> — copy and redistribute the material in any medium or format</li>
              <li><b>Adapt</b> — remix, transform, and build upon the material for any purpose, even commercially.</li>
            </ul>

            <br>

            However, this is provided that:

            <ul>
              <li><b>Attribution</b> — You must give appropriate credit, provide a link to the license, and indicate if
                changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor
                endorses you or your use.
              </li>
              <li><b>ShareAlike</b> — If you remix, transform, or build upon the material, you must distribute your
                contributions under the same license as the original.
              </li>
            </ul>

            <br>

            For more information, please refer to the <a href="https://creativecommons.org/licenses/by-sa/4.0/"
                                                         target="_blank">full text</a> of the Creative Commons
            Attribution-ShareAlike 4.0 International License.
          </v-card-text>
        </v-card>


        <v-card class="mt-3" outlined>
          <v-card-title>
            Genome Taxonomy Database Toolkit (GTDB-Tk)
          </v-card-title>
          <v-card-text class="text--primary">
            The Genome Taxonomy Database Toolkit is licensed under the GNU General Public License v3.0. This is a free
            software license that guarantees end users the freedom to run, study, share and modify the software.
            <br><br>
            In particular, the freedoms ensured by this license are:

            <ul>
              <li>The freedom to run the program for any purpose.</li>
              <li>The freedom to study how the program works, and change it to make it do what you
                wish.
              </li>
              <li>The freedom to redistribute copies so you can help others.</li>
              <li>The freedom to distribute copies of your modified versions to others.</li>
            </ul>
            <br>

            It's important to note that these freedoms come with a notable stipulation: if you distribute this software
            or any modifications of it, you must also distribute the source code under the GPL license.
            <br>
            For the complete details on the GNU General Public License v3.0, please visit the <a
            href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank">official GNU site</a>.
            <br>
            We encourage you to take the time to understand these licenses and your responsibilities as a user. We
            believe in the principles of open science and open software, and these licenses help ensure the free use,
            distribution, and evolution of our tools. If you have any questions or need further clarification, please do
            not hesitate to contact us.
          </v-card-text>
        </v-card>


      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return {
      title: 'Licenses',
      meta: [
        {
          hid: 'licenses',
          name: 'licenses',
          content: `Software licenses that are used for the Genome Taxonomy Database (GTDB) and Toolkit (GTDB-Tk).`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `license, website, gtdb, gtdbtk`
        }
      ]
    }
  },
  data: () => ({}),
})
</script>

<style scoped>

</style>
