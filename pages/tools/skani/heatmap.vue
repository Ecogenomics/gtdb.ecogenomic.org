<template>
  <v-container class="gtdb-container">
    <v-card>

      <v-card-title class="text-h5">
        skani calculator
      </v-card-title>

      <v-divider></v-divider>


      <v-card-text class="text--primary">


        <SkaniNavigationBar :job-id="jobId"/>

        <SkaniNoJobError v-if="noJob" />

        <SkaniHeatmap :job-id="jobId" @update="noJob = $event" v-else />


      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {parseSkaniJobId} from "~/assets/ts/skani";
import SkaniNavigationBar from "~/components/skani/SkaniNavigationBar.vue";
import SkaniHeatmap from "~/components/skani/SkaniHeatmap.vue";

export default Vue.extend({
  head() {
    return {
      title: 'skani calculator heatmap',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `The results page of an ANI search visualised as a heatmap.`
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
          href: `https://gtdb.ecogenomic.org/tools/skani/heatmap`,
        }
      ]
    }
  },
  components: {SkaniHeatmap, SkaniNavigationBar},

  data: () => ({
    jobId: '',
    noJob: false,
  }),

  mounted() {
    // When the application loads, check if the ?job-id=x parameter is present.
    const queryJobId = parseSkaniJobId(this.$route.query['job-id']);

    // If it is present, then parse it and set the jobId
    if (queryJobId != null) {
      // @ts-ignore
      this.jobId = queryJobId;
    } else {
      this.noJob = true;
    }
  }
})
</script>

<style scoped>

</style>
