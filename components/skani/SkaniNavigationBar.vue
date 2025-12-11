<template>
  <v-tabs
      v-model="tabModel"
      background-color="#7a8a79"
      centered
      class="rounded-t"
      dark
      fixed-tabs
      icons-and-text
      show-arrows
  >
    <v-tab :to="`/tools/skani${getJobIdQueryString}`">
      Query
      <v-icon left>
        {{ mdiMagnifySvg }}
      </v-icon>
    </v-tab>

    <v-tab
        :disabled="isDisabled"
        :to="`/tools/skani/status${getJobIdQueryString}`">
      Status
      <v-icon left>
        {{ mdiCogSyncSvg }}
      </v-icon>
    </v-tab>

    <v-tab
        :disabled="isDisabled"
        :to="`/tools/skani/result${getJobIdQueryString}`"
    >
      Tabular results
      <v-icon left>
        {{ mdiTableSvg }}
      </v-icon>
    </v-tab>

    <v-tab
        :disabled="isDisabled"
        :to="`/tools/skani/heatmap${getJobIdQueryString}`"
    >
      Heatmap
      <v-icon left>
        {{ mdiChartScatterPlotHexbinSvg }}
      </v-icon>
    </v-tab>
  </v-tabs>
</template>

<script lang="ts">
import Vue from 'vue'
import {mdiChartScatterPlotHexbin, mdiCogSync, mdiMagnify, mdiTable} from "@mdi/js";


export default Vue.extend({
  props: {
    jobId: {
      type: String,
      default: ''
    }
  },

  components: {},

  computed: {
    getJobIdQueryString(): string {
      return this.jobId ? `?job-id=${this.jobId}` : '';
    },
    isDisabled(): boolean {
      return !(this.jobId != null && this.jobId.length === 8);
    }
  },


  data: () => ({
    // Icons
    mdiMagnifySvg: mdiMagnify,
    mdiTableSvg: mdiTable,
    mdiChartScatterPlotHexbinSvg: mdiChartScatterPlotHexbin,
    mdiCogSyncSvg: mdiCogSync,

    tabModel: 0,
  }),

  methods: {},


})
</script>

<style scoped>

.mainRow {
  background-color: #7a8a79;
}
</style>
