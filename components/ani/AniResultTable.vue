<template>
  <v-card class="w-100" flat>
    <v-card-text class="text--primary">

      <v-row no-gutters>


        <v-btn
          :disabled="!areJobsRunning"
          :loading="isManualRefreshLoading || isRefreshQueryStillRunning"
          class="white--text"
          color="#5a6855"
          depressed
          @click="manualRefresh"
        >
          Refresh
          <v-icon right>
            {{ mdiRefreshSvg }}
          </v-icon>
        </v-btn>

        <v-btn
          :href="downloadCsvUrl"
          class="ml-2 white--text"
          color="#5a6855"
          depressed
        >
          Download
          <v-icon right>
            {{ mdiDownloadSvg }}
          </v-icon>
        </v-btn>

        <v-select
          v-model="selectedTableRows"
          :items="tableHeaders"
          class="ml-2"
          dense
          label="Columns"
          multiple
          outlined
          small-chips
        ></v-select>

      </v-row>

      <v-data-table
        :footer-props="{'items-per-page-options': [20, 50, 100, 250, 500, -1]}"
        :headers="tableHeaders"
        :items="tableRows"
        class="gtdb-table w-100"
        dense
        item-key="id"
        multi-sort
      >

      </v-data-table>


    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  mdiCogRefresh,
  mdiDownload,
  mdiRefresh,
  mdiSigma,
  mdiSortNumericAscending,
  mdiSortNumericDescending
} from "@mdi/js";
import {isDefined, sleep} from "~/assets/ts/common";
import {AniProgramFastAni, AniProgramSkani, AniTableResult, AniTableResultRow} from "~/assets/api/ani";
import {DataTableHeader, SelectItemKey} from "vuetify";

export default Vue.extend({
  components: {},

  props: {
    jobId: String,
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

  data: () => ({
    // Icons
    mdiCogRefreshSvg: mdiCogRefresh,
    mdiDownloadSvg: mdiDownload,
    mdiRefreshSvg: mdiRefresh,
    mdiSigmaSvg: mdiSigma,
    mdiSortNumericDescendingSvg: mdiSortNumericDescending,
    mdiSortNumericAscendingSvg: mdiSortNumericAscending,

    isRefreshQueryStillRunning: false,
    isManualRefreshLoading: false,

    areJobsRunning: true,

    selectedTableRows: ["query", "reference", "ani", "af", "status"],


    jobTableResults: null as null | AniTableResult ,


  }),
  computed: {

    hasJobId(): boolean {
      return isDefined(this.jobId) && this.jobId.length == 36;
    },

    downloadCsvUrl(): string {
      // alert("TODO");
      return "";
      // return this.$api.fastani.getJobCsvUrl(this.jobId)
    },

    tableRows(): AniTableResultRow[] {
      if (this.jobTableResults != null) {
        return this.jobTableResults.rows;
      } else {
        // @ts-ignore
        return [];
      }
    },

    tableHeaders(): DataTableHeader[] {
      // These are always present
      const out = [
        {text: "Query", value: "query"},
        {text: "Reference", value: "reference"},
        {text: "ANI", value: "ani"},
        {text: "AF", value: "af"},
        {text: "Status", value: "status"},
      ];

      // Include program-specific columns
      if (this.jobTableResults != null) {
        if (AniProgramSkani.includes(this.jobTableResults.program)) {
          out.push(
            {text: "Num. Ref Contigs", value: "skaniNumRefContigs"},
            {text: "Num. Qry Contigs", value: "skaniNumQryContigs"},
            {text: "ANI 5th %ile", value: "skaniAni5Percentile"},
            {text: "ANI 95th %ile", value: "skaniAni95Percentile"},
            {text: "Standard Deviation", value: "skaniStdDev"},
            {text: "Ref 90th %ile Contig Len.", value: "skaniRef90CtgLen"},
            {text: "Ref 50th %ile Contig Len.", value: "skaniRef50CtgLen"},
            {text: "Ref 10th %ile Contig Len.", value: "skaniRef10CtgLen"},
            {text: "Qry 90th %ile Contig Len.", value: "skaniQry90CtgLen"},
            {text: "Qry 50th %ile Contig Len.", value: "skaniQry50CtgLen"},
            {text: "Qry 10th %ile Contig Len.", value: "skaniQry10CtgLen"},
            {text: "Avg. Chain Length", value: "skaniAvgChainLen"},
            {text: "Total Bases Covered", value: "skaniTotalBasesCovered"}
          )
        } else  if (AniProgramFastAni.includes(this.jobTableResults.program)) {
          out.push(
            {text: "Mapped Fragments", value: "fastAniMappedFrags"},
            {text: "Total Fragments", value: "fastAniTotalFrags"}
          )
        }
      }
      return out;
    },



  },
  methods: {

    getJobData() {
      if (!this.hasJobId || this.isRefreshQueryStillRunning) {
        return;
      }
      this.isRefreshQueryStillRunning = true;

      // this.$api.ani.getJob(this.jobId).then((resp) => {
      //
      //   console.log(resp);
      //
      //
      //
      // });

    },

    manualRefresh() {
      if (this.isManualRefreshLoading || this.isRefreshQueryStillRunning) {
        return;
      }
      this.isManualRefreshLoading = true;
      this.getJobData();
      sleep(5000).finally(() => {
        this.isManualRefreshLoading = false;
      });
    }


  },


  mounted() {
    // If this component is loaded with a job id in the url, then load
    if (this.hasJobId) {
      this.getJobData()
    }
  }
})
</script>

<style scoped>

</style>
