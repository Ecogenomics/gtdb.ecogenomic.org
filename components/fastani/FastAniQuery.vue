<template>
  <v-card flat>
    <v-card-text>
      <p>
        Input any GenBank or RefSeq accessions, for example: <code>GCA_000005845.2</code> or
        <code>GCF_002949675.1</code>.
      </p>

      <p>
        The results will include all pairwise comparisons between the first, and second
        comparison groups.
      </p>
      <p>
        Requests that use more than <b>{{ fastAniMaxPairwise.toLocaleString() }}</b> pairwise
        comparisons will be processed in the low priority queue <br>

        <v-progress-linear
          v-model="curPctPairwise"
          :color="progressBarColour"
          height="24"
          rounded
          style="pointer-events: none"
        >
          <template v-slot:default>
            <strong>{{ curNumPairwise.toLocaleString() }}/{{ fastAniMaxPairwiseLow.toLocaleString() }}
              ({{ Math.ceil(curPctPairwise) }})%</strong>
          </template>
        </v-progress-linear>
      </p>

      <!-- Button to load an example and submit the form -->
      <v-btn
        :disabled="isFormDisabled"
        class="white--text"
        color="#5a6855"
        depressed
        small
        @click="loadExample"
      >
        <v-icon left>
          {{ loadExampleSvg }}
        </v-icon>
        load example
      </v-btn>

      <!-- Modal dialog to add genomes via taxon name -->
      <v-dialog
        v-model="modalAddGenomesFromTaxonVisible"
        width="700"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :disabled="isFormDisabled"
            class="white--text"
            color="#5a6855"
            depressed
            small
            v-bind="attrs"
            @click="onAddGenomesFromTaxonClick"
            v-on="on"
          >
            <v-icon left>
              {{ addGenomesSvg }}
            </v-icon>
            Add genomes from taxon
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 white--text" style="background-color: #5a6855">
            <v-icon dark left>
              {{ addGenomesSvg }}
            </v-icon>
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
                  {{ addGenomesSvg }}
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

      <FastAniQueryParameters
        v-model="fastAniParameters"
        :disabled="disabled"
      ></FastAniQueryParameters>

      <!-- FastANI priority queue -->
      <FastAniPriorityQueue
        :disabled="disabled"
      >
      </FastAniPriorityQueue>


      <v-row class="mt-5" no-gutters>
        <v-col class="pr-5" cols="6">
          <v-textarea
            v-model="textareaGroupA"
            :disabled="isFormDisabled"
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
            :disabled="isFormDisabled"
            clearable
            hint="e.g. GCF_002949675.1"
            label="Second comparison group"
            outlined
            rows="10"
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row justify="center" no-gutters>
        <v-text-field
          v-model="email"
          :disabled="isFormDisabled"
          clearable
          label="E-mail to be notified on completion (optional)"
          outlined
        ></v-text-field>
      </v-row>

      <v-row justify="center" no-gutters>
        <v-btn
          :disabled="isFormDisabled || !isFormValid"
          :loading="isSubmitButtonLoading"
          class="w-20 white--text"
          color="#5a6855"
          depressed
          large
          @click="returnPayload"
        >
          Submit
          <v-icon right>
            {{ submitIconSvg }}
          </v-icon>
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";

import TaxonSearchAutocomplete from "~/components/shared/TaxonSearchAutocomplete.vue";
import {mdiExclamation, mdiHandshake, mdiPlusThick, mdiProgressCheck} from "@mdi/js";
import {isDefined, isValidGenomeId} from "~/assets/ts/common";
import FastAniQueryParameters from "~/components/fastani/FastAniQueryParameters.vue";
import FastAniPriorityQueue from "~/components/fastani/FastAniPriorityQueue.vue";
import {FastAniJobRequest, FastAniParameters} from "~/assets/api/fastani";

export default Vue.extend({
  components: {FastAniPriorityQueue, FastAniQueryParameters, TaxonSearchAutocomplete},

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object as PropType<FastAniJobRequest>
    },
    jobId: {
      type: String,
      default: '',
    }
  },

  // Load the initial content to be baked into the page
  async asyncData({$api}) {

    // FastANI Config
    const fastAniConfig = await $api.fastani.getConfig();
    const fastAniMaxPairwise = fastAniConfig.data.maxPairwise;
    const fastAniMaxPairwiseLow = fastAniConfig.data.maxPairwiseLow;

    // Merge with data
    return {
      fastAniMaxPairwise,
      fastAniMaxPairwiseLow
    }
  },

  watch: {
    jobId(before, after) {
      if (before && before !== after) {
        this.getAndSetContentFromJobId();
      }
    }
  },

  computed: {

    isFormValid(): boolean {
      return this.curNumPairwise > 0
    },

    isFormDisabled(): boolean {
      return this.disabled || this.isGetApiQueryRunning;
    },


    groupAGenomes(): string[] {
      const out: string[] = [];
      if (this.textareaGroupA) {
        this.textareaGroupA.split('\n').forEach((line) => {
          if (isValidGenomeId(line.trim())) {
            out.push(line.trim());
          }
        });
      }
      return out
    },

    groupBGenomes(): string[] {
      const out: string[] = [];
      if (this.textareaGroupB) {
        this.textareaGroupB.split('\n').forEach((line) => {
          if (isValidGenomeId(line.trim())) {
            out.push(line.trim());
          }
        });
      }
      return out
    },

    curNumPairwise(): number {
      return this.groupAGenomes.length * this.groupBGenomes.length;
    },

    curPctPairwise(): number {
      return this.curNumPairwise / this.fastAniMaxPairwiseLow * 100;
    },

    progressBarColour(): string {
      if (this.curNumPairwise > this.fastAniMaxPairwiseLow) {
        return "red";
      } else if (this.curNumPairwise > this.fastAniMaxPairwise) {
        return "orange";
      } else {
        return "#5a6855";
      }
    },

    payload(): FastAniJobRequest {
      return {
        query: this.groupAGenomes,
        reference: this.groupBGenomes,
        parameters: this.fastAniParameters,
        priority: 'TODO',
        email: this.email
      }
    }
  },


  data: () => ({
    // Icons
    submitIconSvg: mdiProgressCheck,
    loadExampleSvg: mdiHandshake,
    addGenomesSvg: mdiPlusThick,
    priorityQueueSvg: mdiExclamation,

    isSubmitButtonLoading: false,

    // Config
    fastAniMaxPairwise: 1000,
    fastAniMaxPairwiseLow: 5000,

    textareaGroupA: '',
    textareaGroupB: '',

    // Add genomes from taxon button
    modalAddGenomesFromTaxonVisible: false,
    addGenomesToGroupSelectOptions: ['First comparison group', 'Second comparison group'],
    addGenomesToGroupSelectedTaxon: '',
    addGenomesToGroupSelectedGroup: 'First comparison group',
    addGenomesFromTaxonLoading: false,
    addGenomesFromTaxonSpReps: true,

    modalShowParameters: false,

    // FastANI priority queue
    modalFastAniPriorityQueueVisible: false,
    fastAniPriorityQueueSecret: '',
    fastAniPriorityQueueCookieName: 'fastAniPriorityQueueSecret',

    isGetApiQueryRunning: false,


    fastAniParameters: {
      kmer: 16,
      frag_len: 3000,
      min_frag: 50,
      min_frac: 0.2,
      version: '1.33'
    } as FastAniParameters,

    email: '',

  }),


  methods: {
    // onChange() {
    //   this.$emit('input', this.value);
    // }

    // Populate the textarea with an example and submit the request
    loadExample() {
      this.textareaGroupA = 'GCF_009363175.1\nGCF_009295665.1\nGCA_003537015.1\nGCF_001463265.1\nGCF_000759835.1\nGCA_002471245.1';
      this.textareaGroupB = 'GCF_009363175.1\nGCF_009295665.1\nGCA_003537015.1\nGCF_001463265.1\nGCF_000759835.1\nGCA_002471245.1';
      this.returnPayload();
    },

    onAddGenomesFromTaxonClick() {
      // Set the comparison group to be the one that has no genomes
      if (this.textareaGroupA.length === 0) {
        this.addGenomesToGroupSelectedGroup = this.addGenomesToGroupSelectOptions[0];
      } else if (this.textareaGroupB.length === 0) {
        this.addGenomesToGroupSelectedGroup = this.addGenomesToGroupSelectOptions[1];
      }
      // Toggle the modal
      this.modalAddGenomesFromTaxonVisible = !this.modalAddGenomesFromTaxonVisible;
    },

    // Add genomes to a textarea from the modal
    addGenomesFromTaxonToGroup() {
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

    // Save the priority queue modal and set the cookie
    savePriorityQueueModal() {
      this.modalFastAniPriorityQueueVisible = false;
      this.$cookies.set(this.fastAniPriorityQueueCookieName, this.fastAniPriorityQueueSecret, {
        path: '/',
        maxAge: 31536000, // 1 year
        sameSite: true,
      });
    },

    returnPayload() {
      this.$emit('submit', this.payload);
    },

    getAndSetContentFromJobId() {
      if (isDefined(this.jobId) && this.jobId.length == 36) {
        if (this.isGetApiQueryRunning) {
          return;
        }
        this.isGetApiQueryRunning = true;

        this.$api.fastani.getJob(this.jobId).then(resp => {

          // Set the input to be the genomes used in the Job
          if (resp.data.group_1) {
            this.textareaGroupA = resp.data.group_1.join('\n');
          }
          if (resp.data.group_2) {
            this.textareaGroupB = resp.data.group_2.join('\n');
          }

          // Set parameters
          const params = resp.data.parameters;
          if (params) {
            this.fastAniParameters = params;
          }
        })
          .catch((err) => {
            this.$accessor.api.defaultCatch(err);
          })
          .finally(() => {
            this.isGetApiQueryRunning = false;
          });
      }
    },


  },

  mounted() {
    // Load the priority queue (if the cookie is present)
    const fastAniPriorityQCookie = this.$cookies.get(this.fastAniPriorityQueueCookieName);
    if (fastAniPriorityQCookie) {
      this.fastAniPriorityQueueSecret = fastAniPriorityQCookie;
    }
    this.getAndSetContentFromJobId();
  }

})
</script>

<style scoped>

</style>
