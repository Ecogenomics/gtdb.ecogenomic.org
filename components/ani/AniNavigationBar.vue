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
    <v-tab :to="`/tools/ani${getJobIdQueryString}`">
      Query
      <v-icon left>
        {{ mdiMagnifySvg }}
      </v-icon>
    </v-tab>

    <v-tab
      :disabled="isDisabled"
      :to="`/tools/ani/result${getJobIdQueryString}`"
    >
      Tabular results
      <v-icon left>
        {{ mdiTableSvg }}
      </v-icon>
    </v-tab>

    <v-tab
      :disabled="isDisabled"
      :to="`/tools/ani/heatmap${getJobIdQueryString}`"
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
      return !(isDefined(this.jobId) && this.jobId.length === 36);
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
