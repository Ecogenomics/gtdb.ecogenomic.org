<template>
  <div>
    <div v-if="areJobsRunning">
      <p>
        Press the "Refresh" button below to reload the results.
        <!--        The table below will be automatically refreshed every-->
        <!--        {{ (refreshEveryMs / 1000).toLocaleString() }} seconds.-->
      </p>
      <p v-if="positionInQueue !== null">
        Position in queue: {{ positionInQueue.toLocaleString() }}
      </p>
    </div>
    <div v-else>
      <p>
        The job has completed.
      </p>
    </div>

    <!-- TODO: This is currently broken, this is being replaced with a manual refresh for now -->
    <!--    <v-btn-->
    <!--      :color="isAutoRefreshEnabled ? '#e79595' : '#74d993'"-->
    <!--      :disabled="!areJobsRunning"-->
    <!--      depressed-->
    <!--      small-->
    <!--      @click="toggleAutoRefresh"-->
    <!--    >-->
    <!--      {{ isAutoRefreshEnabled ? 'Disable' : 'Enable' }} Auto Refresh-->
    <!--      <v-icon right>-->
    <!--        {{ mdiCogRefreshSvg }}-->
    <!--      </v-icon>-->
    <!--    </v-btn>-->

    <v-btn
      :disabled="!areJobsRunning"
      :loading="isManualRefreshLoading || isRefreshQueryStillRunning"
      depressed
      small
      @click="manualRefresh"
    >
      Refresh
      <v-icon right>
        {{ mdiRefreshSvg }}
      </v-icon>
    </v-btn>

    <v-btn
      :href="downloadCsvUrl"
      class="ml-2"
      depressed
      small
    >
      Download
      <v-icon right>
        {{ mdiDownloadSvg }}
      </v-icon>
    </v-btn>

    <!--    <v-btn-->
    <!--      class="ml-2"-->
    <!--      :loading="isManualRefreshLoading || isRefreshQueryStillRunning"-->
    <!--      depressed-->
    <!--      small-->
    <!--      @click="toggleGroupResults"-->
    <!--    >-->
    <!--      <template v-if="shouldGroupResults">-->
    <!--        Un-group results-->
    <!--        <v-icon right>-->
    <!--          {{ mdiSortNumericAscendingSvg }}-->
    <!--        </v-icon>-->
    <!--      </template>-->
    <!--      <template v-else>-->
    <!--        Group (maximum)-->
    <!--        <v-icon right>-->
    <!--          {{ mdiSortNumericDescendingSvg }}-->
    <!--        </v-icon>-->
    <!--      </template>-->
    <!--    </v-btn>-->

    <v-data-table
      :footer-props="{'items-per-page-options': [20, 50, 100, 250, 500, -1]}"
      :headers="headers"
      :items="results"
      :loading="isAutoRefreshEnabled"
      class="gtdb-table mt-5"
      dense
      item-key="id"
      multi-sort
    >

      <!-- Progress bar -->
      <template v-slot:progress>
        <v-progress-linear v-show="isRefreshQueryStillRunning" color="white" height="6"
                           indeterminate></v-progress-linear>
      </template>

      <!-- Header -->
      <template v-slot:header.ani="{ header }">
        {{ header.text }}
        <HelpTooltip text="Percentage of average nucleotide identity."/>
      </template>

      <template v-slot:header.af="{ header }">
        {{ header.text }}
        <HelpTooltip text="Ratio of bidirectional fragment mappings / total query fragments."/>
      </template>

      <template v-slot:header.mappings="{ header }">
        {{ header.text }}
        <HelpTooltip text="Bidirectional fragment mappings."/>
      </template>

      <template v-slot:header.fragments="{ header }">
        {{ header.text }}
        <HelpTooltip text="Total query fragments."/>
      </template>

      <template v-slot:header.status="{ header }">
        {{ header.text }}
        <HelpTooltip text="FastANI job status."/>
      </template>


      <!-- Rows -->

      <!-- ANI row -->
      <template v-slot:item.ani="{ item }">
        <template v-if="item.qvr.data.ani">
          {{ item.qvr.data.ani }}
        </template>
        <template v-else-if="!isStatusFinished(item.qvr.data.status)">
          <v-chip color="gray" small text-color="black">
            -
          </v-chip>
        </template>
        <template v-else>
          <v-chip color="gray" small text-color="black">
            < 80%
          </v-chip>
        </template>
      </template>

      <!-- AF row -->
      <template v-slot:item.af="{ item }">
        <template v-if="item.qvr.data.af">
          {{ item.qvr.data.af }}
        </template>
        <template v-else-if="!isStatusFinished(item.qvr.data.status)">
          <v-chip color="gray" small text-color="black">
            -
          </v-chip>
        </template>
        <template v-else>
          <v-chip color="gray" small text-color="black">
            n/a
          </v-chip>
        </template>

      </template>

      <!-- Mapped fragments row -->
      <template v-slot:item.mapped="{ item }">
        <template v-if="item.qvr.data.mapped">
          {{ item.qvr.data.mapped }}
        </template>
        <template v-else-if="!isStatusFinished(item.qvr.data.status)">
          <v-chip color="gray" small text-color="black">
            -
          </v-chip>
        </template>
        <template v-else>
          <v-chip color="gray" small text-color="black">
            n/a
          </v-chip>
        </template>
      </template>

      <!-- Total fragments row -->
      <template v-slot:item.total="{ item }">


        <template v-if="item.qvr.data.total">
          {{ item.qvr.data.total }}
        </template>
        <template v-else-if="!isStatusFinished(item.qvr.data.status)">
          <v-chip color="gray" small text-color="black">
            -
          </v-chip>
        </template>
        <template v-else>
          <v-chip color="gray" small text-color="black">
            n/a
          </v-chip>
        </template>

      </template>

      <!-- Status row -->
      <template v-slot:item.status="{ item }">


        <!-- Ungrouped results -->
        <template v-if="isStatusQueued(item.qvr.data.status)">
          <v-chip color="gray" small text-color="black">
            queued
          </v-chip>
        </template>
        <template v-else-if="isStatusRunning(item.qvr.data.status)">
          <v-chip color="orange" small text-color="white">
            running
          </v-chip>
        </template>
        <template v-else-if="isStatusStopped(item.qvr.data.status)">
          <v-chip color="red" small text-color="white">
            failed
          </v-chip>
        </template>
        <template v-else-if="isStatusFinished(item.qvr.data.status)">
          <v-chip color="green" small text-color="white">
            finished
          </v-chip>
        </template>
        <template v-else>
          {{ item.qvr.data.status }}
        </template>

      </template>

      <!-- logs row -->
      <template v-slot:item.logs="{ item }">
        <FastAniLogsModal
          :stderr="item.qvr.data.stderr"
          class="ml-1"
        />
      </template>

      <!--      &lt;!&ndash; Expandable row &ndash;&gt;-->
      <!--      <template v-slot:expanded-item="{ headers, item }">-->

      <!--        &lt;!&ndash; Display the forward and reverse grouping &ndash;&gt;-->
      <!--        <template v-if="shouldGroupResults && item.rvq && item.query !== item.reference">-->
      <!--          <td colspan="1">-->
      <!--          </td>-->
      <!--          <td class="expandable-text" colspan="1">-->
      <!--            {{ item.query }}<br>-->
      <!--            {{ item.reference }}-->
      <!--          </td>-->
      <!--          <td class="expandable-text" colspan="1">-->
      <!--            {{ item.reference }}<br>-->
      <!--            {{ item.query }}-->
      <!--          </td>-->
      <!--          <td class="expandable-text" colspan="1">-->
      <!--            {{ item.qvr.data.ani ? item.qvr.data.ani : 'n/a' }}<br>-->
      <!--            {{ item.rvq.data.ani ? item.rvq.data.ani : 'n/a' }}-->
      <!--          </td>-->
      <!--          <td class="expandable-text" colspan="1">-->
      <!--            {{ item.qvr.data.af ? item.qvr.data.af : 'n/a' }}<br>-->
      <!--            {{ item.rvq.data.af ? item.rvq.data.af : 'n/a' }}-->
      <!--          </td>-->
      <!--          <td class="expandable-text" colspan="1">-->
      <!--            {{ item.qvr.data.mapped ? item.qvr.data.mapped : 'n/a' }}<br>-->
      <!--            {{ item.rvq.data.mapped ? item.rvq.data.mapped : 'n/a' }}-->
      <!--          </td>-->
      <!--          <td class="expandable-text" colspan="1">-->
      <!--            {{ item.qvr.data.total ? item.qvr.data.total : 'n/a' }}<br>-->
      <!--            {{ item.rvq.data.total ? item.rvq.data.total : 'n/a' }}-->
      <!--          </td>-->
      <!--          <td class="expandable-text" colspan="1">-->
      <!--            {{ item.qvr.data.status }}-->
      <!--            <FastAniLogsModal-->
      <!--              :stderr="item.qvr.data.stderr"-->
      <!--              class="ml-1"-->
      <!--            />-->
      <!--            <br>-->
      <!--            {{ item.rvq.data.status }}-->
      <!--            <FastAniLogsModal-->
      <!--              :stderr="item.rvq.data.stderr"-->
      <!--              :stdout="item.rvq.data.stdout"-->
      <!--              class="ml-1"-->
      <!--            />-->
      <!--          </td>-->
      <!--        </template>-->

      <!--        &lt;!&ndash; Otherwise, just display the stdout/stderr for the qvr &ndash;&gt;-->
      <!--        <template v-else>-->
      <!--          <td colspan="1">-->
      <!--          </td>-->
      <!--          <td class="expandable-text" colspan="1">-->
      <!--          </td>-->
      <!--          <td class="expandable-text" colspan="1">-->
      <!--          </td>-->
      <!--          <td class="expandable-text" colspan="1">-->
      <!--          </td>-->
      <!--          <td class="expandable-text" colspan="1">-->
      <!--          </td>-->
      <!--          <td class="expandable-text" colspan="1">-->
      <!--          </td>-->
      <!--          <td class="expandable-text" colspan="1">-->
      <!--          </td>-->
      <!--          <td class="expandable-text" colspan="1">-->
      <!--            <FastAniLogsModal-->
      <!--              :stderr="item.qvr.data.stderr"-->
      <!--              class="ml-1"-->
      <!--            />-->
      <!--          </td>-->
      <!--        </template>-->

      <!--      </template>-->

    </v-data-table>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';

import {RqJobStatus} from "~/assets/api/models";
import HelpTooltip from "~/components/layout/HelpTooltip.vue";
import {
  mdiCogRefresh,
  mdiDownload,
  mdiRefresh,
  mdiSigma,
  mdiSortNumericAscending,
  mdiSortNumericDescending
} from "@mdi/js";
import {FastAniResult, FastAniResultData} from "~/assets/api/fastani";
import FastAniLogsModal from "~/components/fastani/FastAniLogsModal.vue";
import {isDefined, sleep} from "~/assets/ts/common";

const RUNNING_STATUSES = ['queued', 'started', 'deferred', 'scheduled'];


// The data structure used in the table
interface TableRow {
  id: number,
  query: string,
  reference: string,
  qvr: FastAniResult,
  rvq: FastAniResult | null,

}

const FAIL_STATUS = [RqJobStatus.FAILED, RqJobStatus.DEFERRED, RqJobStatus.STOPPED, RqJobStatus.CANCELED]
const QUEUE_STATUS = [RqJobStatus.QUEUED, RqJobStatus.SCHEDULED]


export default Vue.extend({
  props: {
    jobId: String
  },
  components: {FastAniLogsModal, HelpTooltip},
  data: () => ({
    // Icons
    mdiCogRefreshSvg: mdiCogRefresh,
    mdiDownloadSvg: mdiDownload,
    mdiRefreshSvg: mdiRefresh,
    mdiSigmaSvg: mdiSigma,
    mdiSortNumericDescendingSvg: mdiSortNumericDescending,
    mdiSortNumericAscendingSvg: mdiSortNumericAscending,

    // Refreshing results
    isAutoRefreshEnabled: false,
    refreshEveryMs: 1000 * 10,
    refreshStopAfterMs: 1000 * 60 * 5,
    autoRefreshStartTime: new Date(),
    lastRefreshRequestStartTime: new Date(),
    refreshProgressPct: 0,
    isRefreshQueryStillRunning: false,
    isManualRefreshLoading: false,

    shouldGroupResults: false,

    // Pagination
    totalRows: 0,

    // Results information
    areJobsRunning: true,
    positionInQueue: null as null | number,

    // Output table
    headers: [
      {text: "Query", value: "query"},
      {text: "Reference", value: "reference"},
      {text: "ANI", value: "ani"},
      {text: "AF", value: "af"},
      {text: "Mapped Fragments", value: "mapped"},
      {text: "Total Fragments", value: "total"},
      {text: "Status", value: "status"},
      {text: "Logs", value: "logs"}
    ],
    results: ([] as TableRow[]),
  }),
  methods: {

    getGroupedMappedFrags(qvr: FastAniResultData, rvq: FastAniResultData): number {
      let largest: null | FastAniResultData = null;
      if (qvr.af && rvq.af) {
        if (qvr.af > rvq.af) {
          largest = qvr;
        } else {
          largest = rvq;
        }
      } else if (qvr.af) {
        largest = qvr
      } else if (rvq.af) {
        largest = rvq
      } else {
        return 0;
      }
      return largest.mapped;
    },

    getGroupedTotalFrags(qvr: FastAniResultData, rvq: FastAniResultData): number {
      let largest: null | FastAniResultData = null;
      if (qvr.af && rvq.af) {
        if (qvr.af > rvq.af) {
          largest = qvr;
        } else {
          largest = rvq;
        }
      } else if (qvr.af) {
        largest = qvr
      } else if (rvq.af) {
        largest = rvq
      } else {
        return 0;
      }
      return largest.total;
    },

    isGroupedStatusFinished(qvr: FastAniResult, rvq: FastAniResult | null): boolean {
      if (rvq === null) {
        return this.isStatusFinished(qvr.data.status);
      } else {
        return this.isStatusFinished(qvr.data.status) && this.isStatusFinished(rvq.data.status);
      }
    },

    // Starts a new auto-refresh interval if it is not already running, otherwise disables it
    toggleAutoRefresh() {
      if (!this.isAutoRefreshEnabled) {
        this.startNewAutoRefreshInterval();
      }
      this.isAutoRefreshEnabled = !this.isAutoRefreshEnabled;
    },

    // Group forward and reverse results together and display the max value
    toggleGroupResults() {
      this.shouldGroupResults = !this.shouldGroupResults;
      this.manualRefresh();
    },

    groupResults() {
      const newResults = [] as TableRow[];

      // Generate a mapping from reference to query
      const queryToRefMap = new Map<string, Map<string, number>>();
      for (let i = 0; i < this.results.length; i++) {
        const curResult = this.results[i];
        if (!queryToRefMap.has(curResult.query)) {
          queryToRefMap.set(curResult.query, new Map<string, number>());
        }
        //@ts-ignore
        queryToRefMap.get(curResult.query).set(curResult.reference, i);
      }

      // Group the results
      const setOfDonePairs = new Set<number>();
      for (let i = 0; i < this.results.length; i++) {
        const curResult = this.results[i];

        // Skip those where the rvq has already been stored
        if (setOfDonePairs.has(i)) {
          continue;
        }

        // Get the reverse mapping for this
        const reverseMap = queryToRefMap.get(curResult.reference);
        if (reverseMap) {
          const reverseIdx = reverseMap.get(curResult.query);
          if (reverseIdx != undefined) {
            curResult.rvq = this.results[reverseIdx].qvr;
            setOfDonePairs.add(reverseIdx);
          }
        }
        newResults.push(curResult);
      }

      // Return the new results
      console.log(newResults);
      return newResults;
    },

    // Do a manual refresh of the data, force the user to wait a few seconds.
    manualRefresh() {
      if (this.isManualRefreshLoading || this.isRefreshQueryStillRunning) {
        return;
      }
      this.isManualRefreshLoading = true;
      this.getJobData();
      sleep(5000).finally(() => {
        this.isManualRefreshLoading = false;
      });
    },

    // A collection of status states
    isStatusRunning(status: RqJobStatus): boolean {
      return [RqJobStatus.STARTED].includes(status);
    },
    isStatusStopped(status: RqJobStatus): boolean {
      return [RqJobStatus.FAILED, RqJobStatus.STOPPED, RqJobStatus.CANCELED].includes(status);
    },
    isStatusQueued(status: RqJobStatus): boolean {
      return [RqJobStatus.QUEUED, RqJobStatus.DEFERRED, RqJobStatus.SCHEDULED].includes(status);
    },
    isStatusFinished(status: RqJobStatus): boolean {
      return [RqJobStatus.FINISHED].includes(status);
    },

    // The method to collect the data
    getJobData() {
      if (!this.hasJobId || this.isRefreshQueryStillRunning) {
        return;
      }
      this.isRefreshQueryStillRunning = true;

      this.$api.fastani.getJob(this.jobId).then((resp) => {

        this.positionInQueue = resp.data.positionInQueue;

        // Do a quick scan of all the jobs to check if any are still in a running state
        let anyJobsRunning = false;
        const newResults = [] as TableRow[];
        for (let i = 0; i < resp.data.results.length; i++) {
          const result = resp.data.results[i];

          const curRow = {
            id: i,
            query: result.query,
            reference: result.reference,
            qvr: result,
            rvq: null,
          } as TableRow;
          newResults.push(curRow);

          // Check if any jobs are running
          if (RUNNING_STATUSES.includes(result.data.status)) {
            anyJobsRunning = true;
          }
        }

        // Set the data
        this.results = newResults;
        // if (this.shouldGroupResults) {
        //   this.groupResults();
        // }
        this.areJobsRunning = anyJobsRunning;
      })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
          this.isAutoRefreshEnabled = false;
        })
        .finally(() => {
          this.isRefreshQueryStillRunning = false;
        })
    },

    // This interval will be responsible for refreshing the results and will expire
    startNewAutoRefreshInterval() {
      // Keep track of when the interval started
      if (!this.isAutoRefreshEnabled) {
        this.isAutoRefreshEnabled = true;
      } else {
        return;
      }

      this.autoRefreshStartTime = new Date();

      const interval = setInterval(() => {

        // Clear the interval if auto refresh has been disabled or no jobs are running
        if (!this.isAutoRefreshEnabled || !this.areJobsRunning) {
          this.isAutoRefreshEnabled = false;
          clearInterval(interval);
          return;
        }

        // Check if the interval has timed out
        if (new Date().getTime() - this.autoRefreshStartTime.getTime() > this.refreshStopAfterMs) {
          this.isAutoRefreshEnabled = false;
          clearInterval(interval);
          return;
        }

        // Update the progress bar
        const timeElapsed = new Date().getTime() - this.lastRefreshRequestStartTime.getTime();
        this.refreshProgressPct = Math.min(100, (timeElapsed / this.refreshEveryMs) * 100);
        if (this.refreshProgressPct >= 100) {
          this.getJobData();
          this.lastRefreshRequestStartTime = new Date();
        }
      }, 500)

    },
  },
  computed: {
    hasJobId(): boolean {
      return isDefined(this.jobId) && this.jobId.length > 0;
    },
    downloadCsvUrl(): string {
      return this.$api.fastani.getJobCsvUrl(this.jobId)
    },
  },
  watch: {
    // When the job id parameter changes, load
    jobId(after, before) {
      if (after && after !== before) {
        this.getJobData()
        // this.startNewAutoRefreshInterval()
      }
    }
  },
  mounted() {
    // If this component is loaded with a job id in the url, then load
    if (this.hasJobId) {
      this.getJobData()
      // this.startNewAutoRefreshInterval()
    }
  }
})
</script>

<style scoped>
.expandable-text {
  color: #696969;
}
</style>
