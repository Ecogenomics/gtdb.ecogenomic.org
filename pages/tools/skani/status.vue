<template>
  <v-container class="gtdb-container">
    <v-card>

      <v-card-title class="text-h5">
        skani calculator
      </v-card-title>

      <v-divider></v-divider>


      <v-card-text class="text--primary">

        <SkaniNavigationBar :job-id="jobId"/>

        <SkaniNoJobError v-if="noJob"/>

        <v-card
          v-else
          class="mx-auto mt-5"
          max-width="900px"
          outlined
        >
          <v-card-title>

            <v-row class="px-3" no-gutters>
              Job:
              <template v-if="!hasLoadedOnce">
                <v-skeleton-loader
                  class="my-auto ml-2"
                  type="text"
                  width="150px"
                >
                </v-skeleton-loader>
              </template>
              <template v-else>
                {{ jobId }}
              </template>

              <v-spacer></v-spacer>

              <template v-if="hasLoadedOnce">
                <v-chip
                  v-if="jobStatus.completedEpoch != null && jobStatus.error !== true"
                  color="#56B350"
                  text-color="#FFFFFF"
                >
                  Completed
                </v-chip>

                <template v-if="jobStatus.completedEpoch == null">
                  <v-chip
                    v-if="jobStatus.positionInQueue !== 1"
                    color="#367AE3"
                    text-color="#FFFFFF"
                  >
                    Queued
                  </v-chip>
                  <v-chip
                    v-else
                    color="#822bb3"
                    text-color="#FFFFFF"
                  >
                    Running
                  </v-chip>
                </template>


                <v-chip
                  v-if="jobStatus.completedEpoch != null && jobStatus.error === true"
                  color="#D93131"
                  text-color="#FFFFFF"
                >
                  Error
                </v-chip>
              </template>
            </v-row>


          </v-card-title>
          <v-card-text class="text--primary">

            <v-divider></v-divider>


            <v-simple-table
              class="mt-3"
              dense
            >
              <template v-slot:default>
                <tbody>

                <!-- New row -->
                <tr>
                  <td style="white-space: nowrap; width: 1%;">
                    <b>Created:</b>
                  </td>
                  <td>
                    <template v-if="!hasLoadedOnce">
                      <v-skeleton-loader
                        type="text"
                        width="150px"
                      >
                      </v-skeleton-loader>
                    </template>
                    <template v-else>
                      {{ createdTimeAgo }}
                    </template>
                  </td>
                </tr>

                <!-- New row -->
                <tr>
                  <td style="white-space: nowrap; width: 1%;">
                    <b>Completed:</b>
                  </td>
                  <td>
                    <template v-if="!hasLoadedOnce">
                      <v-skeleton-loader
                        type="text"
                        width="150px"
                      >
                      </v-skeleton-loader>
                    </template>
                    <template v-else>
                      <template v-if="completedTimeAgo === 'N/A'">
                        False
                      </template>
                      <template v-else>
                        {{ completedTimeAgo }}
                      </template>
                    </template>
                  </td>
                </tr>

                <!-- New row -->
                <tr>
                  <td style="white-space: nowrap; width: 1%;">
                    <b>Error:</b>
                  </td>
                  <td>
                    <template v-if="!hasLoadedOnce">
                      <v-skeleton-loader
                        type="text"
                        width="150px"
                      >
                      </v-skeleton-loader>
                    </template>
                    <template v-else>
                      <template v-if="jobStatus.error === true">
                        True
                      </template>
                      <template v-else-if="jobStatus.error === false">
                        False
                      </template>
                      <template v-else>
                        N/A
                      </template>
                    </template>
                  </td>
                </tr>

                <!-- New row -->
                <tr>
                  <td style="white-space: nowrap; width: 1%;">
                    <b>Delete after:</b>
                  </td>
                  <td>
                    <template v-if="!hasLoadedOnce">
                      <v-skeleton-loader
                        type="text"
                        width="150px"
                      >
                      </v-skeleton-loader>
                    </template>
                    <template v-else>
                      <template v-if="jobStatus.deleteAfter == null">
                        N/A
                      </template>
                      <template v-else>
                        {{ jobStatus.deleteAfter }}
                      </template>
                    </template>
                  </td>
                </tr>

                <!-- New row -->
                <tr>
                  <td style="white-space: nowrap; width: 1%;">
                    <b>Position in queue:</b>
                  </td>
                  <td>
                    <template v-if="!hasLoadedOnce">
                      <v-skeleton-loader
                        type="text"
                        width="150px"
                      >
                      </v-skeleton-loader>
                    </template>
                    <template v-else>
                      <template v-if="jobStatus.positionInQueue != null">
                        {{ jobStatus.positionInQueue }}
                      </template>
                      <template v-else>
                        N/A
                      </template>
                    </template>
                  </td>
                </tr>

                <!-- New row -->
                <tr>
                  <td style="white-space: nowrap; width: 1%;">
                    <b>Total jobs in queue:</b>
                  </td>
                  <td>
                    <template v-if="!hasLoadedOnce">
                      <v-skeleton-loader
                        type="text"
                        width="150px"
                      >
                      </v-skeleton-loader>
                    </template>
                    <template v-else>
                      <template v-if="jobStatus.totalPendingJobs != null">
                        {{ jobStatus.totalPendingJobs }}
                      </template>
                      <template v-else>
                        N/A
                      </template>
                    </template>
                  </td>
                </tr>

                <!-- New row -->
                <tr>
                  <td style="white-space: nowrap; width: 1%;">
                    <b>Output log:</b>
                  </td>
                  <td>
                    <template v-if="!hasLoadedOnce">
                      <v-skeleton-loader
                        type="text"
                        width="150px"
                      >
                      </v-skeleton-loader>
                    </template>
                    <template v-else>
                      <template v-if="jobStatus.stderr != null">
                        <v-textarea
                          v-model="jobStatus.stderr"
                          class="gtdbTextarea"
                          dense
                          hide-details
                          readonly>
                        </v-textarea>
                      </template>
                      <template v-else>
                        N/A
                      </template>
                    </template>
                  </td>
                </tr>

                </tbody>
              </template>
            </v-simple-table>

          </v-card-text>
          <v-card-actions>
            <v-row align="center" justify="center" no-gutters>
              <v-btn
                :disabled="isRefreshDisabled"
                :loading="isRefreshLoading"
                class="mx-1"
                color="#5a6855"
                depressed
                style="color: #FFFFFF"
                @click="refreshButton"
              >
                Refresh
              </v-btn>

              <v-btn
                v-if="isJobCompleted"
                :to="`/tools/skani/result?job-id=${jobId}`"
                class="mx-1"
                color="#5a6855"
                depressed
                style="color: #FFFFFF"
              >
                <v-icon left>
                  {{ mdiTableSvg }}
                </v-icon>
                View tabular results
              </v-btn>

              <v-btn
                v-if="isJobCompleted"
                :to="`/tools/skani/heatmap?job-id=${jobId}`"
                class="mx-1"
                color="#5a6855"
                depressed
                style="color: #FFFFFF"
              >
                <v-icon left>
                  {{ mdiChartScatterPlotHexbinSvg }}
                </v-icon>
                View heatmap
              </v-btn>
            </v-row>

          </v-card-actions>
        </v-card>

      </v-card-text>
    </v-card>


  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {SkaniJobStatusResponse} from "~/assets/api/skani";
import {sleep, timeAgo} from "~/assets/ts/common";
import {parseSkaniJobId} from "~/assets/ts/skani";
import {mdiChartScatterPlotHexbin, mdiTable} from "@mdi/js";

export default Vue.extend({
  head() {
    return {
      title: 'ANI Calculator Status',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `The status page of an ANI job.`
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
          href: `https://gtdb.ecogenomic.org/tools/skani/status`,
        }
      ]
    }
  },
  components: {},


  watch: {},


  computed: {

    createdTimeAgo(): string {
      return timeAgo(this.jobStatus.createdEpoch)
    },

    completedTimeAgo(): string {
      if (this.jobStatus.completedEpoch != null) {
        return timeAgo(this.jobStatus.createdEpoch)
      } else {
        return 'N/A'
      }
    },

    isRefreshLoading(): boolean {
      return this.isLoadingJob || this.refreshRateLimited
    },

    isRefreshDisabled(): boolean {
      return this.isLoadingJob || this.jobStatus.completedEpoch != null || this.refreshRateLimited
    },

    isJobCompleted(): boolean {
      return (this.jobStatus != null && this.jobStatus.completedEpoch != null)
    },

  },
  methods: {

    refreshButton() {
      const timeDelta = Date.now() - this.lastRefreshEpochMs;
      if (timeDelta > this.minWaitSeconds * 1000) {
        this.refreshRateLimited = true;
        this.loadJob();
        this.lastRefreshEpochMs = Date.now();

        // Keep the button disabled for this many seconds
        sleep(this.minWaitSeconds * 1000).finally(() => {
          this.refreshRateLimited = false;
        });
      }
    },

    loadJob() {
      if (this.jobId != null) {

        // Contact the API
        this.isLoadingJob = true;
        this.$api.skani.getJobStatusPage(this.jobId).then((resp) => {
          this.jobStatus = resp.data;
          this.hasLoadedOnce = true;
        }).catch((err: any) => {
          this.$accessor.api.defaultCatch(err);
          this.noJob = true;
        }).finally(() => {
          this.isLoadingJob = false;
        })
      }
    }
  },

  data: () => ({
    jobId: null as string | null,

    noJob: false,

    mdiTableSvg: mdiTable,
    mdiChartScatterPlotHexbinSvg: mdiChartScatterPlotHexbin,

    isLoadingJob: false,
    hasLoadedOnce: false,
    refreshRateLimited: false,


    lastRefreshEpochMs: 0,
    minWaitSeconds: 3,

    jobStatus: {
      jobId: '',
      createdEpoch: 0,
      completedEpoch: null,
      error: null,
      positionInQueue: null,
      totalPendingJobs: null,
      stdout: null,
      stderr: null,
      deleteAfter: null
    } as SkaniJobStatusResponse

  }),
  mounted() {
    // When the application loads, check if the ?job-id=x parameter is present.
    const queryJobId = parseSkaniJobId(this.$route.query['job-id']);
    // If it is present, then parse it and set the jobId
    if (queryJobId != null) {
      this.jobId = queryJobId;
      this.loadJob();
    } else {
      this.noJob = true;
    }
  }
})
</script>

<style scoped>
.gtdbTextarea {
  font-size: 11px;
  font-family: "Roboto Mono", monospace;
  white-space: normal;
  word-break: keep-all;

}

</style>
