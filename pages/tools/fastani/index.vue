<template>
  <v-container class="gtdb-container">
    <v-card>

      <v-card-title class="text-h5">
        FastANI calculator
      </v-card-title>

      <v-divider></v-divider>


      <v-card-text class="text--primary">

        <!-- Introduction to this page -->
        <p>
          We have provided a interface to <a href="https://github.com/ParBLiSS/FastANI" target="_blank">FastANI</a>
          (<a href="https://doi.org/10.1038/s41467-018-07641-9" target="_blank">Jain, C., Rodriguez-R, L.M., Phillippy,
          A.M. et al.</a>)
          to assist in exploring prokaryotic NCBI genomes. We periodically download new genomes from NCBI, missing
          genomes will be
          ignored.
        </p>

        <FastAniNavigationBar :job-id="jobId" />

        <!-- User input -->
        <FastAniQueryForm/>

      </v-card-text>

    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import FastAniQueryForm from "~/components/fastani/query/FastAniQueryForm.vue";
import FastAniNavigationBar from "~/components/fastani/navigation/FastAniNavigationBar.vue";
import {isDefined} from "~/assets/ts/common";

export default Vue.extend({
  head() {
    return {
      title: 'FastANI Calculator',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `An interface to compute pairwise ANI of NCBI genomes using the GTDB taxonomy.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `fastani, ANI, AF, average nucleotide identity, alignment fraction, pairwise, gtdb`
        }
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://gtdb.ecogenomic.org/tools/fastani`,
        }
      ]
    }
  },
  components: {
    FastAniNavigationBar,
    FastAniQueryForm,
  },
  data: () => ({
    jobId: 0
  }),
  mounted() {
    // When the application loads, check if the ?job-id=x parameter is present.
    const queryJobId = this.$route.query['job-id'];
    // If it is present, then parse it and set the jobId
    if (isDefined(queryJobId) && queryJobId.length > 0) {
      // @ts-ignore
      const jobIdParsed = parseInt(queryJobId);
      // The default value is 0, ignore it if it's the case
      if (jobIdParsed > 0) {
        this.jobId = jobIdParsed;
      }
    }
  }
})
</script>

<style scoped>
</style>
