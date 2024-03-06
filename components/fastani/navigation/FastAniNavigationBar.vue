<template>
  <v-tabs
    v-model="tabModel"
    background-color="#7a8a79"
    centered
    dark
    fixed-tabs
    icons-and-text
    show-arrows
  >
    <v-tab :to="`/tools/fastani${getJobIdQueryString}`">
      Query
      <v-icon left>
        {{ mdiMagnifySvg }}
      </v-icon>
    </v-tab>

    <v-tab
      :to="`/tools/fastani/result${getJobIdQueryString}`"
      :disabled="isDisabled"
    >
      Tabular results
      <v-icon left>
        {{ mdiTableSvg }}
      </v-icon>
    </v-tab>

    <v-tab
      :to="`/tools/fastani/heatmap${getJobIdQueryString}`"
      :disabled="isDisabled"
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
import {mdiChartScatterPlotHexbin, mdiMagnify, mdiTable} from "@mdi/js";
import {isDefined} from "~/assets/ts/common";


export default Vue.extend({
  props: {
    jobId: {
      type: Number,
      default: 0
    }
  },

  components: {},

  computed: {
    getJobIdQueryString(): string {
      return this.jobId ? `?job-id=${this.jobId}` : '';
    },
    isDisabled(): boolean {
      return !(isDefined(this.jobId) && this.jobId > 0);
    }
  },


  data: () => ({
    // Icons
    mdiMagnifySvg: mdiMagnify,
    mdiTableSvg: mdiTable,
    mdiChartScatterPlotHexbinSvg: mdiChartScatterPlotHexbin,

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
