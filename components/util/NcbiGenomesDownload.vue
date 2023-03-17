<template>
  <v-tooltip open-delay="150" top transition="slide-x-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        elevation="0"
        small
        v-bind="attrs"
        @click="dialog = !dialog"
        v-on="on"
      >
        Genomes
        <v-icon right>
          {{ mdiDownloadSvg }}
        </v-icon>

        <v-dialog
          v-model="dialog"
          activator="parent"
          width="auto"
        >
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Download genomes
            </v-card-title>

            <v-card-text>
              <div class="pt-3">
                <p>
                  Use <b>one</b> of the methods below to download the genomes present in the search results from NCBI:
                </p>

                <v-row>
                  <v-checkbox
                    v-model="gff"
                    class="mx-2"
                    dense
                    hide-details
                    label="GFF"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="rna"
                    class="mx-2"
                    dense
                    label="RNA"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="cds"
                    class="mx-2"
                    dense
                    label="CDS"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="protein"
                    class="mx-2"
                    dense
                    label="Protein"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="genome"
                    class="mx-2"
                    dense
                    label="Genome"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="seqReport"
                    class="mx-2"
                    dense
                    label="Sequence report"
                  ></v-checkbox>
                </v-row>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-btn dense @click="download('curl')">
                curl
              </v-btn>
              <v-btn dense @click="download('datasets')">
                datasets
              </v-btn>
            </v-card-actions>

          </v-card>
        </v-dialog>

      </v-btn>
    </template>
    <span>
      Download genomes from NCBI
    </span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue';
import {mdiDownload} from '@mdi/js';

export default Vue.extend({
  data: () => ({
    mdiDownloadSvg: mdiDownload,
    dialog: false,
    gff: false,
    rna: false,
    cds: false,
    protein: false,
    genome: true,
    seqReport: false,
  }),
  methods: {
    download(method: string) {
      const [expr, args] = this.$accessor.advanced.treeAsEncodedPayload;
      const urlParams = [];

      urlParams.push(`gff=${encodeURIComponent(String(this.gff))}`)
      urlParams.push(`rna=${encodeURIComponent(String(this.rna))}`)
      urlParams.push(`cds=${encodeURIComponent(String(this.cds))}`)
      urlParams.push(`protein=${encodeURIComponent(String(this.protein))}`)
      urlParams.push(`genome=${encodeURIComponent(String(this.genome))}`)
      urlParams.push(`seqReport=${encodeURIComponent(String(this.seqReport))}`)
      urlParams.push(`method=${encodeURIComponent(String(method))}`)

      urlParams.push(`exp=${encodeURIComponent(String(expr))}`)
      if (expr.length > 0 && Object.keys(args).length > 0) {
        for (const [k, v] of Object.entries(args)) {
          urlParams.push(`${k}=${encodeURIComponent(String(v))}`);
        }
        const url = `${process.env.apiBase}/advanced/search/download-genomes?${urlParams.join('&')}`
        window.open(url, "_blank")
      }
    },
  }
})
</script>

