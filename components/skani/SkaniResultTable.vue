<template>
  <v-card class="w-100" flat>
    <v-card-text class="text--primary">

      <v-row no-gutters>
        <v-btn
          :disabled="isManualRefreshLoading || isRefreshQueryStillRunning"
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


        <v-checkbox
          v-model="showNa"
          :disabled="isManualRefreshLoading"
          class="checkboxStyle ml-2 pa-1 my-auto"
          color="green"
          dense
          hide-details
          label="Show N/A rows (distant hits)"
          @change="manualRefresh"
        >
        </v-checkbox>

        <v-checkbox
          v-model="showSelf"
          :disabled="isManualRefreshLoading"
          class="checkboxStyle ml-2 pa-1 my-auto"
          color="green"
          dense
          hide-details
          label="Show self comparisons"
          @change="manualRefresh"
        >
        </v-checkbox>
      </v-row>

      <v-data-table
        :footer-props="{'items-per-page-options': [20, 50, 100, 250, 500, -1]}"
        :headers="tableHeaders"
        :items="tableRows"
        :loading="isRefreshQueryStillRunning"
        class="gtdb-table w-100 mt-5"
        dense
        item-key="id"
        multi-sort
      >

        <!-- ANI column -->
        <template v-slot:item.ani="{ item }">
          <template v-if="item.ani != null">
            {{ item.ani }}
          </template>
          <template v-else>
            <v-chip
              small
            >
              N/A
            </v-chip>
          </template>
        </template>

        <!-- AF query column -->
        <template v-slot:item.afQry="{ item }">
          <template v-if="item.afQry != null">
            {{ item.afQry }}
          </template>
          <template v-else>
            <v-chip
              small
            >
              N/A
            </v-chip>
          </template>
        </template>

        <!-- AF ref column -->
        <template v-slot:item.afRef="{ item }">
          <template v-if="item.afRef != null">
            {{ item.afRef }}
          </template>
          <template v-else>
            <v-chip
              small
            >
              N/A
            </v-chip>
          </template>
        </template>


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
import {sleep} from "~/assets/ts/common";
import {DataTableHeader} from "vuetify";
import {SkaniResultTableRow} from "~/assets/api/skani";

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

    tableRows: [] as SkaniResultTableRow[],

    showNa: false,
    showSelf: false,


    tableHeaders: [
      {text: "Query", value: "qry"},
      {text: "Reference", value: "ref"},
      {text: "ANI", value: "ani"},
      {text: "AF Query", value: "afQry"},
      {text: "AF Reference", value: "afRef"},
    ] as DataTableHeader[],


  }),
  computed: {

    hasJobId(): boolean {
      return this.jobId != null && this.jobId.length > 0;
    },

    downloadCsvUrl(): string {
      return this.$api.skani.getJobCsvUrl(this.jobId, this.showNa, this.showSelf);
    },

  },
  methods: {

    getJobData() {
      if (!this.hasJobId || this.isRefreshQueryStillRunning) {
        return;
      }
      this.isRefreshQueryStillRunning = true;
      this.$api.skani.getJobTablePage(this.jobId, this.showNa, this.showSelf).then((resp) => {
        // Add a unique id to each row for the table
        for (let i = 0; i < resp.data.rows.length; i++) {
          resp.data.rows[i].id = i;
        }
        this.tableRows = resp.data.rows;

      }).catch((err) => {
        this.$accessor.api.defaultCatch(err);
        this.$emit('update', true);
      })
        .finally(() => {
          this.isRefreshQueryStillRunning = false;
        })
    },

    manualRefresh() {
      if (this.isManualRefreshLoading || this.isRefreshQueryStillRunning) {
        return;
      }
      this.isManualRefreshLoading = true;
      this.getJobData();
      sleep(1000).finally(() => {
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
.checkboxStyle {
  border: #7a8979 1px solid;
  border-radius: 5px;
}
</style>
