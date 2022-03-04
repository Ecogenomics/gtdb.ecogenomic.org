<template>
  <div>
    <!-- CSV -->
    <v-tooltip open-delay="150" top transition="slide-x-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on"
               elevation="0"
               small
               @click="downloadFile('csv')"
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
        <v-btn v-bind="attrs" v-on="on"
               elevation="0"
               small
               @click="downloadFile('tsv')"
        >
          tsv
          <v-icon right>
            {{  mdiKeyboardTabSvg  }}
          </v-icon>
        </v-btn>
      </template>
      <span>Download results in tab-separated format</span>
    </v-tooltip>

<!--    &lt;!&ndash; Excel &ndash;&gt;-->
<!--    <v-tooltip open-delay="150" top transition="slide-x-transition">-->
<!--      <template v-slot:activator="{ on, attrs }">-->
<!--        <v-btn v-bind="attrs" v-on="on"-->
<!--               elevation="0"-->
<!--               small-->
<!--               @click="downloadFile('excel')"-->
<!--        >-->
<!--          Excel-->
<!--          <v-icon right>-->
<!--            {{  mdiFileExcelSvg }}-->
<!--          </v-icon>-->
<!--        </v-btn>-->
<!--      </template>-->
<!--      <span>Download results in .xlsx format</span>-->
<!--    </v-tooltip>-->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {mdiFileDelimited, mdiFileExcel, mdiKeyboardTab} from "@mdi/js";


export default Vue.extend({
  name: "ResultsDownload",
  data: () => ({
    mdiFileDelimitedSvg: mdiFileDelimited,
    mdiKeyboardTabSvg: mdiKeyboardTab,
    mdiFileExcelSvg: mdiFileExcel,
  }),
  methods: {
    downloadFile(format: string) {
      const [expr, args] = this.$accessor.advanced.treeAsEncodedPayload;
      const urlParams = [];
      urlParams.push(`exp=${encodeURIComponent(String(expr))}`)
      if (expr.length > 0 && Object.keys(args).length > 0) {
        for (const [k, v] of Object.entries(args)) {
          urlParams.push(`${k}=${encodeURIComponent(String(v))}`);
        }
        const url = `${process.env.apiBase}/advanced/search/download/${format}?${urlParams.join('&')}`
        window.open(url, "_blank")
      }
    },
  }
})

</script>

<style scoped>

</style>
