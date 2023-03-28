<template>
  <v-container class="gtdb-container">
    <v-card>

      <v-card-title class="text-h5">
        FastANI calculator
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">
        <p>
          We have provided a interface to <a href="https://github.com/ParBLiSS/FastANI" target="_blank">FastANI</a>
          (<a href="https://doi.org/10.1038/s41467-018-07641-9" target="_blank">Jain, C., Rodriguez-R, L.M., Phillippy,
          A.M. et al.</a>)
          to assist in exploring NCBI genomes.
        </p>
        <div>

          <v-expansion-panels
            v-model="openSectionIndex"
            class="mt-5"
            multiple
          >

            <!-- Query -->
            <v-expansion-panel :key="0">
              <v-expansion-panel-header class="text-h6" ripple>
                <span>
                  <v-icon left>
                    {{ mdiMagnifySvg }}
                  </v-icon>
                  Query
                </span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>
                  Input any GenBank or RefSeq accessions, for example: <code>GCA_000005845.2</code> or <code>GCF_002949675.1</code>.
                </p>
                <p>
                  The results will include all pairwise comparisons between the first, and second
                  comparison groups.
                </p>
                <p>
                  Note that requests that use more than <b>{{ fastAniMaxPairwise.toLocaleString() }}</b> pairwise
                  comparisons will be processed in the low priority queue ({{ curNumPairwise.toLocaleString() }} used).
                </p>
                <v-btn
                  :disabled="isJobLoading"
                  class="white--text"
                  color="#5a6855"
                  depressed
                  small
                  @click="loadExample"
                >
                  <v-icon left>
                    {{ mdiHandshakeSvg }}
                  </v-icon>
                  load example
                </v-btn>

                <v-dialog
                  v-model="modalAddGenomesFromTaxonVisible"
                  width="700"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :disabled="isJobLoading"
                      class="ml-3 white--text"
                      color="#5a6855"
                      depressed
                      small
                      v-bind="attrs"
                      @click="modalAddGenomesFromTaxonVisible"
                      v-on="on"
                    >
                      <v-icon left>
                        {{ mdiPlusThickSvg }}
                      </v-icon>
                      Add genomes from taxon
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                      Add genomes from taxon
                    </v-card-title>

                    <v-card-text>
                      <div class="mt-4">
                        Select a taxon from the dropdown below to add a list of genomes from that taxon.
                      </div>
                      <v-row no-gutters>
                        <TaxonSearchAutocomplete
                          v-model="addGenomesToGroupSelectedTaxon"
                          class="ml-2 mt-3"
                          label="taxon (e.g: p__Proteobacteria)"
                        />
                      </v-row>
                      <v-row no-gutters>
                        <v-select
                          v-model="addGenomesToGroupSelectedGroup"
                          :items="addGenomesToGroupSelectOptions"
                          class="ml-2 mt-3"
                          clearable
                          dense
                          hide-details
                          label="Add genomes to"
                          outlined
                          style="max-width: 500px;"
                        >
                        </v-select>
                      </v-row>
                      <v-row no-gutters>
                        <v-checkbox
                          v-model="addGenomesFromTaxonSpReps"
                          class="ml-2"
                          label="Only include species representatives"
                        ></v-checkbox>
                      </v-row>
                      <v-row no-gutters>
                        <v-btn
                          :disabled="addGenomesToGroupSelectedTaxon == null || addGenomesToGroupSelectedGroup == null"
                          :loading="addGenomesFromTaxonLoading"
                          class="ml-2 mt-3"
                          depressed
                          @click="addGenomesFromTaxonToGroup"
                        >
                          <v-icon left>
                            {{ mdiPlusThickSvg }}
                          </v-icon>
                          Add genomes
                        </v-btn>
                      </v-row>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        text
                        @click="modalAddGenomesFromTaxonVisible = false"
                      >
                        Close
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <!-- FastANI priority queue -->
                <v-dialog
                  v-model="modalFastAniPriorityQueueVisible"
                  width="700"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :disabled="isJobLoading"
                      class="ml-3 white--text"
                      color="#5a6855"
                      depressed
                      small
                      v-bind="attrs"
                      @click="modalFastAniPriorityQueueVisible"
                      v-on="on"
                    >
                      <v-icon left>
                        {{ mdiExclamationSvg }}
                      </v-icon>
                      Priority queue
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                      Priority Queue
                    </v-card-title>

                    <v-card-text>
                      <div class="mt-4">
                        If you have been given the priority queue secret key, enter it below:
                      </div>
                      <v-text-field
                        v-model="fastAniPriorityQueueSecret"
                        class="mt-5"
                        label="Priority queue secret key"
                        outlined
                      />
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        text
                        @click="savePriorityQueueModal"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>


                <v-row class="mt-5" no-gutters>
                  <v-col class="pr-5" cols="6">
                    <v-textarea
                      v-model="textareaGroupA"
                      :disabled="isJobLoading"
                      clearable
                      hint="e.g. GCA_000005845.2"
                      label="First comparison group"
                      outlined
                      rows="10"
                    ></v-textarea>
                  </v-col>
                  <v-col class="pl-5" cols="6">
                    <v-textarea
                      v-model="textareaGroupB"
                      :disabled="isJobLoading"
                      clearable
                      hint="e.g. GCF_002949675.1"
                      label="Second comparison group"
                      outlined
                      rows="10"
                    ></v-textarea>
                  </v-col>
                </v-row>

                <v-row justify="center" no-gutters>
                  <v-btn
                    :disabled="isSubmitButtonDisabled || !isFormValid || isJobLoading"
                    :loading="isSubmitButtonLoading"
                    class="w-20 text--white"
                    depressed
                    large
                    @click="submitRequest"
                  >
                    Submit
                    <v-icon right>
                      {{ mdiProgressCheckSvg }}
                    </v-icon>
                  </v-btn>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel key="4">
              <v-expansion-panel-header class="text-h6" ripple>
                <span>
                  <v-icon left>
                    {{ mdiCogSvg }}
                  </v-icon>
                  Parameters
                </span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>
                  The parameters below are the default for the specific version of FastANI selected.
                </p>
                <p>
                  For more information on parameters, consult the manuscript:
                  <a href="https://doi.org/10.1038/s41467-018-07641-9" target="_blank">Jain, C.,
                    Rodriguez-R, L.M.,
                    Phillippy, A.M. et al. High throughput ANI analysis of 90K prokaryotic genomes
                    reveals clear species
                    boundaries. Nat Commun 9, 5114 (2018).
                    https://doi.org/10.1038/s41467-018-07641-9</a>
                </p>

                <!-- Version / Minimum fragment length -->
                <v-row align="center" no-gutters>
                  <v-col class="pr-5" cols="6">
                    <span class="mr-4  v-label theme--light">Version</span>
                    <FastAniVersion @input="getFastAniVersion"/>
                  </v-col>
                  <v-col class="pl-5" cols="6">
                    <v-text-field
                      v-model="fragmentLength"
                      hint="fragment length [default : 3,000]"
                      label="Fragment length"
                      outlined
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row align="center" class="pt-3" no-gutters>
                  <!-- kmer size -->
                  <v-col class="pr-5" cols="6">
                    <v-text-field
                      v-model="kmerSize"
                      hint="kmer size <= 16 [default 16]"
                      label="kmer size"
                      outlined
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <!-- Minimum alignment fraction -->
                  <v-col class="pl-5" cols="6">
                    <template v-if="showMinFrac">
                      <v-text-field
                        v-model="minAlignmentFraction"
                        hint="minimum fraction of genome that must be shared for trusting ANI [default: 0.2]"
                        label="Minimum alignment fraction"
                        outlined
                        type="number"
                      ></v-text-field>
                    </template>
                    <template v-else>
                      <v-text-field
                        v-model="minAlignedFragments"
                        hint="minimum fragments for trusting ANI [default : 50]"
                        label="Minimum aligned fragments"
                        outlined
                        type="number"
                      ></v-text-field>
                    </template>
                  </v-col>
                </v-row>

              </v-expansion-panel-content>
            </v-expansion-panel>

            <!-- Results -->
            <v-expansion-panel
              :key="1"
              :disabled="!hasJobId"
            >
              <v-expansion-panel-header class="text-h6" ripple>
                <span>
                  <v-icon left>
                    {{ mdiTableSvg }}
                  </v-icon>
                  Tabular results
                </span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <FastAniResults :job-id="computedJobId"/>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <!-- Heatmap -->
            <v-expansion-panel
              :key="3"
              :disabled="!hasJobId"
            >
              <v-expansion-panel-header class="text-h6" ripple>
                <span>
                  <v-icon left>
                    {{ mdiChartScatterPlotHexbinSvg }}
                  </v-icon>
                  Heatmap
                </span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <FastAniHeatmap :job-id="computedJobId"/>
              </v-expansion-panel-content>
            </v-expansion-panel>

          </v-expansion-panels>
        </div>

      </v-card-text>

      <!-- Show this if an error is encountered -->
      <v-snackbar
        v-model="snackbar"
        multi-line
      >
      <span
        v-for="(item, index) in errorMessages"
        :key="index"
        class="d-block"
      >
        {{ item }}
      </span>
        <template v-slot:action="{ attrs }">
          <v-btn
            color="red"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>

    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import FastAniVersion from "~/components/fastani/FastAniVersion.vue";
import KmerSize from "~/components/fastani/KmerSize.vue";
import MinFraction from "~/components/fastani/MinFraction.vue";
import FragLength from "~/components/fastani/FragLength.vue";
import FastAniResults from "~/components/fastani/FastAniResults.vue";
import {
  mdiChartScatterPlotHexbin,
  mdiCog,
  mdiExclamation,
  mdiHandshake,
  mdiMagnify,
  mdiPlusThick,
  mdiProgressCheck,
  mdiTable
} from "@mdi/js";
import {FastAniJobRequest} from "~/assets/api/fastani";
import TaxonSearchAutocomplete from "~/components/shared/TaxonSearchAutocomplete.vue";
import FastAniHeatmap from "~/components/fastani/FastAniHeatmap.vue";
import {isDefined} from "~/assets/ts/common";

export default Vue.extend({
  head() {
    return {
      title: 'FastANI Calculator',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `An interface to compute pairwise ANI of NCBI genomes using the GTDB taxonomy.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `fastani, ANI, AF, average nucleotide identity, alignment fraction, pairwise, gtdb`
        }
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://gtdb.ecogenomic.org/tools/fastani`,
        }
      ]
    }
  },
  components: {
    FastAniHeatmap,
    FastAniVersion,
    KmerSize,
    MinFraction,
    FragLength,
    FastAniResults,
    TaxonSearchAutocomplete,
  },
  // Load the initial content to be baked into the page
  async asyncData({$api}) {

    // FastANI Config
    const fastAniConfig = await $api.fastani.getConfig();
    const fastAniMaxPairwise = fastAniConfig.data.maxPairwise;

    // Merge with data
    return {
      fastAniMaxPairwise,
    }
  },

  watch: {
    // Watch for any changes to the query parameters
    '$route.query': {
      handler(after: object, before: object) {
        // Check what filters are present in the query string and re-apply those filters
        if (isDefined(after) && after !== before) {
          this.getAndSetContentFromJobId();
        }
      }
    },
  },

  data: () => ({
    // Icons
    mdiProgressCheckSvg: mdiProgressCheck,
    mdiMagnifySvg: mdiMagnify,
    mdiCogSvg: mdiCog,
    mdiTableSvg: mdiTable,
    mdiHandshakeSvg: mdiHandshake,
    mdiPlusThickSvg: mdiPlusThick,
    mdiChartScatterPlotHexbinSvg: mdiChartScatterPlotHexbin,
    mdiExclamationSvg: mdiExclamation,

    // Default form values
    minAlignedFragments: 50,
    fragmentLength: 3000,
    minAlignmentFraction: 0.2,
    kmerSize: 16,
    textareaGroupA: '',
    textareaGroupB: '',
    fastAniVersion: '1.33',

    // Job information
    jobId: '',

    // Form management
    isSubmitButtonDisabled: false,
    isSubmitButtonLoading: false,
    isJobLoading: true,

    // Error handling
    snackbar: false,
    errorMessages: ([] as string[]),

    // Layout
    openSectionIndex: [0],

    // Config
    fastAniMaxPairwise: 1000,

    // Add genomes from taxon button
    modalAddGenomesFromTaxonVisible: false,
    addGenomesToGroupSelectOptions: ['First comparison group', 'Second comparison group'],
    addGenomesToGroupSelectedTaxon: null as null | string,
    addGenomesToGroupSelectedGroup: null as null | string,
    addGenomesFromTaxonLoading: false,
    addGenomesFromTaxonSpReps: true,

    // FastANI priority queue
    modalFastAniPriorityQueueVisible: false,
    fastAniPriorityQueueSecret: '',
    fastAniPriorityQueueCookieName: 'fastAniPriorityQueueSecret',
  }),
  computed: {
    // Returns True if the form can be submitted
    isFormValid(): boolean {
      if (this.textareaGroupA == null || this.textareaGroupB == null) {
        return false;
      }
      return this.textareaGroupA.length > 0 && this.textareaGroupB.length > 0
    },

    // Returns the JobID
    computedJobId(): string {
      return this.jobId;
    },

    hasJobId(): boolean {
      return this.jobId != null && this.jobId !== '';
    },
    showMinFrac(): boolean {
      return ['1.33', '1.32', '1.31', '1.3'].includes(this.fastAniVersion)
    },
    payload(): FastAniJobRequest {
      return {
        query: this.textAreaToAccessions(this.textareaGroupA),
        reference: this.textAreaToAccessions(this.textareaGroupB),
        parameters: {
          kmer: this.kmerSize,
          frag_len: this.fragmentLength,
          min_frag: this.minAlignedFragments,
          min_frac: this.minAlignmentFraction,
          version: this.fastAniVersion
        },
        priority: this.fastAniPriorityQueueSecret
      }
    },
    curNumPairwise(): number {
      const grpA = !!this.textareaGroupA ? this.textareaGroupA.split('\n').length : 0;
      const grpB = !!this.textareaGroupB ? this.textareaGroupB.split('\n').length : 0;
      return grpA * grpB;
    }
  },
  methods: {
    getAndSetContentFromJobId() {
      if (isDefined(this.jobId) && this.jobId.length == 36) {
        this.openSectionIndex = [2];
        this.isJobLoading = true;

        this.$api.fastani.getJob(this.jobId).then(resp => {

          // Set the input to be the genomes used in the Job
          if (resp.data.group_1) {
            this.textareaGroupA = resp.data.group_1.join('\n');
          }
          if (resp.data.group_2) {
            this.textareaGroupB = resp.data.group_2.join('\n');
          }

          // Set the target panel to be opened
          if ((resp.data.group_1.length * resp.data.group_2.length > this.fastAniMaxPairwise) || (resp.data.group_1.length > 100 || resp.data.group_2.length > 100)) {
            this.openSectionIndex = [2];
          } else {
            this.openSectionIndex = [3];
          }

          // Set parameters
          const params = resp.data.parameters;
          if (params) {
            if (params.frag_len) {
              this.fragmentLength = params.frag_len
            }
            if (params.kmer) {
              this.kmerSize = params.kmer
            }
            if (params.min_frac) {
              this.minAlignmentFraction = params.min_frac
            }
            if (params.min_frag) {
              this.minAlignedFragments = params.min_frag
            }
            if (params.version) {
              this.fastAniVersion = params.version
            }
          }
        })
          .catch((err) => {
            this.$accessor.api.defaultCatch(err);
          })
          .finally(() => {
            this.isJobLoading = false;
          });
      }
    },
    textAreaToAccessions(textarea: string): string[] {
      const out: string[] = [];
      textarea.split('\n').forEach((g) => {
        out.push(g.trim())
      })
      return out;
    },
    getFastAniVersion(value: any) {
      this.fastAniVersion = value
    },
    loadExample() {
      this.textareaGroupA = 'GCF_009363175.1\nGCF_009295665.1\nGCA_003537015.1\nGCF_001463265.1\nGCF_000759835.1\nGCA_002471245.1';
      this.textareaGroupB = 'GCF_009363175.1\nGCF_009295665.1\nGCA_003537015.1\nGCF_001463265.1\nGCF_000759835.1\nGCA_002471245.1';
      this.submitRequest();
    },
    submitRequest() {
      this.isSubmitButtonDisabled = true;
      this.isSubmitButtonLoading = true;
      this.isJobLoading = true;
      this.$api.fastani.newJob(this.payload)
        .then((resp) => {
          // Add the JobID to the current URL
          const encodedExp = encodeURIComponent(String(resp.data.job_id))
          history.pushState({}, "", `${this.$route.path}?job-id=${encodedExp}`);
          this.jobId = resp.data.job_id;

          // Set the target panel to be opened
          if ((resp.data.group_1.length * resp.data.group_2.length > this.fastAniMaxPairwise) || (resp.data.group_1.length > 100 || resp.data.group_2.length > 100)) {
            this.openSectionIndex = [2];
          } else {
            this.openSectionIndex = [3];
          }

        })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
        })
        .finally(() => {
          this.isSubmitButtonDisabled = false;
          this.isSubmitButtonLoading = false;
          this.isJobLoading = false;
        })
    },
    addGenomesFromTaxonToGroup() {
      // Load the genomes from that group
      if (this.addGenomesToGroupSelectedTaxon) {
        this.addGenomesFromTaxonLoading = true;
        this.$api.taxon.getTaxonGenomes(this.addGenomesToGroupSelectedTaxon, this.addGenomesFromTaxonSpReps).then(resp => {
          if (this.addGenomesToGroupSelectedGroup === this.addGenomesToGroupSelectOptions[0]) {
            if (this.textareaGroupA !== null && this.textareaGroupA.length > 0 && this.textareaGroupA.slice(-1) !== '\n') {
              this.textareaGroupA += '\n'
            }
            this.textareaGroupA += resp.data.join('\n');
          } else {
            if (this.textareaGroupB !== null && this.textareaGroupB.length > 0 && this.textareaGroupB.slice(-1) !== '\n') {
              this.textareaGroupB += '\n'
            }
            this.textareaGroupB += resp.data.join('\n');
          }
        })
          .catch((err) => {
            this.$accessor.api.defaultCatch(err);
          })
          .finally(() => {
            this.modalAddGenomesFromTaxonVisible = false;
            this.addGenomesFromTaxonLoading = false;
          })
      }
    },
    savePriorityQueueModal() {
      this.modalFastAniPriorityQueueVisible = false;
      this.$cookies.set(this.fastAniPriorityQueueCookieName, this.fastAniPriorityQueueSecret, {
        path: '/',
        maxAge: 31536000, // 1 year
        sameSite: true,
      });
    }
  },
  mounted() {
    // Load the Job ID
    const jobId = this.$route.query['job-id'];
    if (isDefined(jobId) && jobId.length == 36) {
      this.jobId = jobId as string;
      this.getAndSetContentFromJobId();
    } else {
      this.isJobLoading = false;
    }

    // Load the priority queue (if the cookie is present)
    const fastAniPriorityQCookie = this.$cookies.get(this.fastAniPriorityQueueCookieName);
    if (fastAniPriorityQCookie) {
      this.fastAniPriorityQueueSecret = fastAniPriorityQCookie;
    }
  }
})
</script>

<style scoped>

</style>
