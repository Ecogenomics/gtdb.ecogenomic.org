<template>
  <div>
    <div v-if="areJobsRunning">
      <p>
        The table below will be automatically refreshed every
        {{ (refreshEveryMs / 1000).toLocaleString() }} seconds.
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

    <v-btn
      :color="isAutoRefreshEnabled ? '#e79595' : '#74d993'"
      :disabled="!areJobsRunning"
      depressed
      small
      @click="toggleAutoRefresh"
    >
      {{ isAutoRefreshEnabled ? 'Disable' : 'Enable' }} Auto Refresh
      <v-icon right>
        {{ mdiCogRefreshSvg }}
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

    <v-data-table
      :footer-props="{'items-per-page-options': [20, 50, 100, 250, 500, -1]}"
      :headers="headers"
      :items="results"
      :loading="isAutoRefreshEnabled"
      class="gtdb-table mt-5"
      dense
      item-key="id"
      multi-sort
      show-expand
    >

      <!-- Progress bar -->
      <template v-slot:progress>
        <v-progress-linear v-show="isRefreshQueryStillRunning" indeterminate color="white" height="6"></v-progress-linear>
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
        <template v-if="item.ani">
          {{ item.ani }}
        </template>
        <template v-else-if="!isStatusFinished(item.status)">
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
        <template v-if="item.af">
          {{ item.af.toPrecision(4) }}
        </template>
        <template v-else-if="!isStatusFinished(item.status)">
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
        <template v-if="item.mapped">
          {{ item.mapped }}
        </template>
        <template v-else-if="!isStatusFinished(item.status)">
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
        <template v-if="item.total">
          {{ item.total }}
        </template>
        <template v-else-if="!isStatusFinished(item.status)">
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
        <template v-if="isStatusQueued(item.status)">
          <v-chip color="gray" small text-color="black">
            queued
          </v-chip>
        </template>
        <template v-else-if="isStatusRunning(item.status)">
          <v-chip color="orange" small text-color="white">
            running
          </v-chip>
        </template>
        <template v-else-if="isStatusStopped(item.status)">
          <v-chip color="red" small text-color="white">
            failed
          </v-chip>
        </template>
        <template v-else-if="isStatusFinished(item.status)">
          <v-chip color="green" small text-color="white">
            finished
          </v-chip>
        </template>
        <template v-else>
          {{ item.status }}
        </template>
      </template>

      <!-- Expandable row -->
      <template v-slot:expanded-item="{ headers, item }">
        <td colspan="1">
        </td>
        <td class="expandable-text" colspan="1">
          {{ item.query }}<br>
          {{ item.reference }}
        </td>
        <td class="expandable-text" colspan="1">
          {{ item.reference }}<br>
          {{ item.query }}
        </td>
        <td class="expandable-text" colspan="1">
          {{ item.qvr.ani ? item.qvr.ani : 'n/a' }}<br>
          {{ item.rvq.ani ? item.rvq.ani : 'n/a' }}
        </td>
        <td class="expandable-text" colspan="1">
          {{ item.qvr.ani ? (item.qvr.mapped / item.qvr.total).toPrecision(4) : 'n/a' }}<br>
          {{ item.rvq.ani ? (item.rvq.mapped / item.rvq.total).toPrecision(4) : 'n/a' }}
        </td>
        <td class="expandable-text" colspan="1">
          {{ item.qvr.mapped ? item.qvr.mapped : 'n/a' }}<br>
          {{ item.rvq.mapped ? item.rvq.mapped : 'n/a' }}
        </td>
        <td class="expandable-text" colspan="1">
          {{ item.qvr.total ? item.qvr.total : 'n/a' }}<br>
          {{ item.rvq.total ? item.rvq.total : 'n/a' }}
        </td>
        <td class="expandable-text" colspan="1">
          {{ item.qvr.status }}
          <FastAniLogsModal
            :stderr="item.qvr.stderr"
            :stdout="item.qvr.stdout"
            class="ml-1"
          />
          <br>
          {{ item.rvq.status }}
          <FastAniLogsModal
            :stderr="item.rvq.stderr"
            :stdout="item.rvq.stdout"
            class="ml-1"
          />
        </td>
      </template>

    </v-data-table>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';

import {RqJobStatus} from "~/assets/api/models";
import HelpTooltip from "~/components/layout/HelpTooltip.vue";
import {mdiCogRefresh, mdiDownload} from "@mdi/js";
import {FastAniResult, FastAniResultData} from "~/assets/api/fastani";
import FastAniLogsModal from "~/components/fastani/FastAniLogsModal.vue";
import {DataOptions} from "vuetify";
import {isDefined, JsonEqual} from "~/assets/ts/common";

const RUNNING_STATUSES = ['queued', 'started', 'deferred', 'scheduled'];


// The data structure used in the table
interface TableRow {
  id: number,
  query: string,
  reference: string,
  ani: number | null,
  af: number | null,
  mapped: number,
  total: number,
  status: RqJobStatus,
  qvr: FastAniResultData,
  rvq: FastAniResultData,

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

    // Refreshing results
    isAutoRefreshEnabled: false,
    refreshEveryMs: 1000 * 10,
    refreshStopAfterMs: 1000 * 60 * 5,
    autoRefreshStartTime: new Date(),
    lastRefreshRequestStartTime: new Date(),
    refreshProgressPct: 0,
    isRefreshQueryStillRunning: false,

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
    ],
    results: ([] as FastAniResult[]),
  }),
  methods: {
    // Starts a new auto-refresh interval if it is not already running, otherwise disables it
    toggleAutoRefresh() {
      if (!this.isAutoRefreshEnabled) {
        this.startNewAutoRefreshInterval();
      }
      this.isAutoRefreshEnabled = !this.isAutoRefreshEnabled;
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

          let curAni = null as null | number;
          let curAf = null as null | number;
          let curMapped = null as null | number;
          let curTotal = null as null | number;
          let curStatus = RqJobStatus.FAILED as RqJobStatus;

          // Determine ANI
          if (result.qvr.ani && result.rvq.ani) {
            curAni = Math.max(result.qvr.ani, result.rvq.ani);
          } else if (result.qvr.ani) {
            curAni = result.qvr.ani;
          } else if (result.rvq.ani) {
            curAni = result.rvq.ani;
          } else {
            curAni = null;
          }

          // Determine AF
          if (result.qvr.ani && result.rvq.ani) {
            const qvrAf = result.qvr.mapped / result.qvr.total;
            const rvqAf = result.rvq.mapped / result.rvq.total;
            if (qvrAf > rvqAf) {
              curAf = qvrAf;
              curMapped = result.qvr.mapped;
              curTotal = result.qvr.total;
            } else {
              curAf = rvqAf;
              curMapped = result.rvq.mapped;
              curTotal = result.rvq.total;
            }
          } else if (result.qvr.ani) {
            curAf = result.qvr.mapped / result.qvr.total;
            curMapped = result.qvr.mapped;
            curTotal = result.qvr.total;
          } else if (result.rvq.ani) {
            curAf = result.rvq.mapped / result.rvq.total;
            curMapped = result.rvq.mapped;
            curTotal = result.rvq.total;
          } else {
            curAf = null;
            curMapped = null;
            curTotal = null;
          }

          // Determine status
          if (result.qvr.status === result.rvq.status) {
            curStatus = result.qvr.status;
          } else if (FAIL_STATUS.includes(result.qvr.status) || FAIL_STATUS.includes(result.rvq.status)) {
            curStatus = RqJobStatus.FAILED;
          } else if (result.qvr.status === RqJobStatus.STARTED || result.rvq.status === RqJobStatus.STARTED) {
            curStatus = RqJobStatus.STARTED;
          } else if (QUEUE_STATUS.includes(result.qvr.status) || QUEUE_STATUS.includes(result.rvq.status)) {
            curStatus = RqJobStatus.QUEUED;
          } else {
            curStatus = result.qvr.status;
          }

          const curRow = {
            id: i,
            query: result.query,
            reference: result.reference,
            ani: curAni,
            af: curAf,
            mapped: curMapped,
            total: curTotal,
            status: curStatus,
            qvr: result.qvr,
            rvq: result.rvq,
          } as TableRow;
          newResults.push(curRow);

          // Check if any jobs are running
          if (RUNNING_STATUSES.includes(result.qvr.status) || RUNNING_STATUSES.includes(result.rvq.status)) {
            anyJobsRunning = true;
          }
        }

        // Set the data
        this.results = newResults;
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
        this.startNewAutoRefreshInterval()
      }
    }
  },
  mounted() {
    // If this component is loaded with a job id in the url, then load
    if (this.hasJobId) {
      this.getJobData()
      this.startNewAutoRefreshInterval()
    }
  }
})
</script>

<style scoped>
.expandable-text {
  color: #696969;
}
</style>
