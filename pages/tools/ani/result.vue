<template>
  <v-container class="gtdb-container">
    <v-card>

      <v-card-title class="text-h5">
        ANI calculator
      </v-card-title>

      <v-divider></v-divider>


      <v-card-text class="text--primary">

        <AniNavigationBar :job-id="jobId" />

        <v-card class="rounded-t-0 rounded-b" outlined>
          <v-card-text>

            <!-- Introduction to this page -->
            <v-row no-gutters>
              <AniResultTable :job-id="jobId" />
            </v-row>

          </v-card-text>
        </v-card>


      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import FastAniResults from "~/components/fastani/FastAniResults.vue";
import {mdiChartScatterPlotHexbin, mdiMagnify, mdiTable} from "@mdi/js";
import {FastAniJobRequest} from "~/assets/api/fastani";
import FastAniHeatmap from "~/components/fastani/FastAniHeatmap.vue";
import {isDefined} from "~/assets/ts/common";
import FastAniRecentJobs from "~/components/fastani/FastAniRecentJobs.vue";
import FastAniQuery from "~/components/fastani/FastAniQuery.vue";
import FastAniNavigationBar from "~/components/fastani/navigation/FastAniNavigationBar.vue";

export default Vue.extend({
  head() {
    return {
      title: 'ANI Calculator Result',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `The results page of an ANI search.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `ANI, AF, average nucleotide identity, alignment fraction, pairwise, gtdb`
        }
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://gtdb.ecogenomic.org/tools/ani/result`,
        }
      ]
    }
  },
  components: {
    FastAniResults,
    FastAniNavigationBar

  },


  watch: {

  },


  computed: {


  },
  methods: {

  },

  data: () => ({
    jobId: ''
  }),
  mounted() {
    // When the application loads, check if the ?job-id=x parameter is present.
    const queryJobId = this.$route.query['job-id'];
    // If it is present, then parse it and set the jobId
    if (isDefined(queryJobId) && queryJobId.length  === 36) {
      // @ts-ignore
        this.jobId = queryJobId;
    }
  }
})
</script>

<style scoped>

</style>
