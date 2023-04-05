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
          to assist in exploring NCBI genomes. We periodically download new genomes from NCBI, missing genomes will be
          ignored.
        </p>

        <!-- Show the recently created jobs (loaded by cookie) -->
        <FastAniRecentJobs :update="jobId"/>


        <!-- Show the new / previous job form -->
        <v-card
          class="mt-5"
          outlined
        >
          <v-tabs
            v-model="tabModel"
            background-color="#7a8a79"
            centered
            dark
            fixed-tabs
            icons-and-text
            show-arrows
          >
            <v-tab>
              Query
              <v-icon left>
                {{ mdiMagnifySvg }}
              </v-icon>
            </v-tab>

            <v-tab
              :disabled="!hasJobId"
            >
              Tabular results
              <v-icon left>
                {{ mdiTableSvg }}
              </v-icon>
            </v-tab>

            <v-tab
              :disabled="!hasJobId"
            >
              Heatmap
              <v-icon left>
                {{ mdiChartScatterPlotHexbinSvg }}
              </v-icon>
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tabModel">
            <v-tab-item>
              <FastAniQuery
                :disabled="isCreateJobRunning"
                :job-id="jobId"
                @submit="submitRequest"
              ></FastAniQuery>
            </v-tab-item>
            <v-tab-item>
              <FastAniResults :job-id="computedJobId"/>
            </v-tab-item>
            <v-tab-item>
              <FastAniHeatmap :job-id="computedJobId"/>
            </v-tab-item>
          </v-tabs-items>


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
    FastAniQuery,
    FastAniRecentJobs,
    FastAniHeatmap,
    FastAniResults,
  },


  watch: {
    // Watch for any changes to the query parameters
    '$route.query': {
      handler(after: object, before: object) {
        // Check what filters are present in the query string and re-apply those filters
        if (isDefined(after) && after !== before) {
          this.getAndSetContentFromJobId();
        }
      }
    },
  },

  data: () => ({
    // Icons
    mdiMagnifySvg: mdiMagnify,
    mdiTableSvg: mdiTable,
    mdiChartScatterPlotHexbinSvg: mdiChartScatterPlotHexbin,

    // Menu selection
    tabModel: 0,

    // Job information
    jobId: '',
    fastAniJobCookieName: process.env.fastAniJobCookieName,

    // Form management
    isCreateJobRunning: false,

  }),
  computed: {
    // Returns the JobID
    computedJobId(): string {
      return this.jobId;
    },

    hasJobId(): boolean {
      return this.jobId != null && this.jobId !== '';
    },

  },
  methods: {
    getAndSetContentFromJobId() {
      if (isDefined(this.jobId) && this.jobId.length == 36) {
        this.tabModel = 1;
      }
    },


    submitRequest(payload: FastAniJobRequest) {

      this.isCreateJobRunning = true;
      this.$api.fastani.newJob(payload)
        .then((resp) => {
          // Add the JobID to the current URL
          const encodedExp = encodeURIComponent(String(resp.data.job_id))
          history.pushState({}, "", `${this.$route.path}?job-id=${encodedExp}`);
          this.jobId = resp.data.job_id;

          // Create / update the cookie
          if (this.fastAniJobCookieName) {
            // Check if the cookie exists and get the existing content
            const existingCookie = this.$cookies.get(this.fastAniJobCookieName);
            let existingCookieContent: string[] = [];
            if (existingCookie) {
              existingCookieContent = existingCookie.split(',');
            }
            // add the job id to the front
            existingCookieContent.unshift(this.jobId);

            // remove duplicates
            existingCookieContent = existingCookieContent.filter((v, i, a) => a.indexOf(v) === i);

            // return the first 50 items in the queue
            existingCookieContent = existingCookieContent.slice(0, 50);

            this.$cookies.set(this.fastAniJobCookieName, existingCookieContent.join(','), {
              path: '/',
              maxAge: 60 * 60 * 24 * 365
            });
          }

          // Set the target panel to be opened
          if ((resp.data.group_1.length > 100 || resp.data.group_2.length > 100)) {
            this.tabModel = 1
          } else {
            this.tabModel = 2
          }

        })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
        })
        .finally(() => {
          this.isCreateJobRunning = false;
        })
    },
  },

  mounted() {
    // Load the Job ID
    const jobId = this.$route.query['job-id'];
    if (isDefined(jobId) && jobId.length == 36) {
      this.jobId = jobId as string;
      this.getAndSetContentFromJobId();
    }
  }
})
</script>

<style scoped>

</style>
