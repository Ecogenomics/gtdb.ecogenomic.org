<template>
  <div>
    <!-- CSV -->
    <v-tooltip open-delay="150" top transition="slide-x-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn elevation="0" small
               v-bind="attrs"
               :disabled="disabled"
               @click="downloadFile('csv')"
               v-on="on"
        >
          csv
          <v-icon right>
            {{ mdiFileDelimitedSvg }}
          </v-icon>
        </v-btn>
      </template>
      <span>Download results in comma-separated format</span>
    </v-tooltip>

    <!-- TSV -->
    <v-tooltip open-delay="150" top transition="slide-x-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn elevation="0" small
               v-bind="attrs"
               :disabled="disabled"
               @click="downloadFile('tsv')"
               v-on="on"
        >
          tsv
          <v-icon right>
            {{ mdiKeyboardTabSvg }}
          </v-icon>
        </v-btn>
      </template>
      <span>Download results in tab-separated format</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {mdiFileDelimited, mdiFileExcel, mdiKeyboardTab} from "@mdi/js";


export default Vue.extend({
  name: "ResultsDownload",
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    mdiFileDelimitedSvg: mdiFileDelimited,
    mdiKeyboardTabSvg: mdiKeyboardTab,
    mdiFileExcelSvg: mdiFileExcel,
  }),
  methods: {
    downloadFile(format: string) {
      const [expr, args] = this.$accessor.advanced.treeAsEncodedPayload;
      const urlSearchParams: URLSearchParams = new URLSearchParams();
      urlSearchParams.append('exp', encodeURIComponent(String(expr)));
      if (expr.length > 0 && Object.keys(args).length > 0) {
        for (const [k, v] of Object.entries(args)) {
          urlSearchParams.append(k, encodeURIComponent(String(v)));
        }
        const urlNew = this.$api.advanced.getSearchDownloadUrl(urlSearchParams, format);
        console.log(urlNew);
        window.open(urlNew, "_blank")
      }
    },
  }
})

</script>

<style scoped>

</style>
