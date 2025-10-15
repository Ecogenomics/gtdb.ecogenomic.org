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


        <v-card class="rounded-t-0 rounded-b" outlined v-else>
          <v-card-text>

            <!-- Introduction to this page -->
            <v-row no-gutters>
              <SkaniResultTable :job-id="jobId" @update="noJob = $event" />
            </v-row>

          </v-card-text>
        </v-card>


      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {parseSkaniJobId} from "~/assets/ts/skani";
import SkaniResultTable from "~/components/skani/SkaniResultTable.vue";
import SkaniNavigationBar from "~/components/skani/SkaniNavigationBar.vue";

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
    SkaniNavigationBar,
    SkaniResultTable
  },


  watch: {},


  computed: {},
  methods: {},

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
