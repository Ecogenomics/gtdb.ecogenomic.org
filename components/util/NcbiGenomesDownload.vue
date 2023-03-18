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

      const urlSearchParams = new URLSearchParams();
      urlSearchParams.append('exp', encodeURIComponent(String(expr)));
      urlSearchParams.append('gff', encodeURIComponent(String(this.gff)));
      urlSearchParams.append('rna', encodeURIComponent(String(this.rna)));
      urlSearchParams.append('cds', encodeURIComponent(String(this.cds)));
      urlSearchParams.append('protein', encodeURIComponent(String(this.protein)));
      urlSearchParams.append('genome', encodeURIComponent(String(this.genome)));
      urlSearchParams.append('seqReport', encodeURIComponent(String(this.seqReport)));
      urlSearchParams.append('method', encodeURIComponent(String(method)));

      if (expr.length > 0 && Object.keys(args).length > 0) {
        for (const [k, v] of Object.entries(args)) {
          urlSearchParams.append(k, encodeURIComponent(String(v)));
        }
        const url = this.$api.advanced.getSearchGenomesDownloadUrl(urlSearchParams);
        window.open(url, "_blank")
      }
    },
  }
})
</script>

