<template>
  <v-card flat>
    <v-card-text class="text--primary">

      <p>
        A maximum of <b>{{ fastAniMaxPairwise.toLocaleString() }}</b> pairwise comparisons can be made at a time.
        <br>
        <v-progress-linear
          v-model="curPctPairwise"
          :color="progressBarColour"
          height="24"
          rounded
          style="pointer-events: none"
        >
          <template v-slot:default>
            <strong>{{ curNumPairwise.toLocaleString() }}/{{ fastAniMaxPairwise.toLocaleString() }}
              ({{ Math.ceil(curPctPairwise) }})%</strong>
          </template>
        </v-progress-linear>
      </p>


      <!-- Quick access buttons -->
      <v-card
        class="mt-5"
        flat
      >

        <!-- Button to load an example and submit the form -->
        <v-btn
          class="white--text"
          color="#5a6855"
          depressed
          small
          to="/tools/fastani/heatmap?job-id=1"
        >
          <v-icon left>
            {{ loadExampleSvg }}
          </v-icon>
          load example
        </v-btn>

        <FastAniQueryParameters
          v-model="fastAniParameters"
          :disabled="isFormDisabled"
        ></FastAniQueryParameters>


        <!-- FastANI priority queue -->
        <FastAniPriorityQueue
          v-model="priorityQueueSecret"
          :disabled="isFormDisabled"
        >
        </FastAniPriorityQueue>

      </v-card>


      <!-- Tabular view of jobs -->
      <v-row class="mt-5" no-gutters>
        <v-col>
          <FastAniQueryGenomesTable v-model="qryRows" title="Query genomes"/>
        </v-col>
        <v-col>
          <FastAniQueryGenomesTable v-model="refRows" title="Reference genomes"/>
        </v-col>
      </v-row>

      <!-- Actions -->
      <v-row class="mt-5" justify="center" no-gutters>
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
          :loading="isJobBeingCreated"
          class="w-20 white--text"
          color="#5a6855"
          depressed
          large
          @click="createJob"
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
import Vue from 'vue'
import {mdiHandshake, mdiProgressCheck} from "@mdi/js";
import {isDefined} from "~/assets/ts/common";
import {FastAniAddGenomesFromUserInput, FastAniQueryRow} from "~/assets/models/fastani";
import FastAniQueryTable from "~/components/fastani/FastAniQueryTable.vue";
import FastAniAddGenomesFromTaxon from "~/components/fastani/FastAniAddGenomesFromTaxon.vue";
import FastAniAddGenomesFromText from "~/components/fastani/FastAniAddGenomesFromText.vue";
import FastAniPriorityQueue from "~/components/fastani/FastAniPriorityQueue.vue";
import FastAniQueryParameters from "~/components/fastani/FastAniQueryParameters.vue";
import {FastAniJobRequest, FastAniParameters} from "~/assets/api/fastani";
import FastAniQueryGenomesTable from "~/components/fastani/query/FastAniQueryGenomesTable.vue";

export default Vue.extend({
  components: {
    FastAniQueryGenomesTable,
    FastAniQueryParameters,
    FastAniPriorityQueue,
    FastAniAddGenomesFromText,
    FastAniAddGenomesFromTaxon,
    FastAniQueryTable

  },

  // Load the initial content to be baked into the page
  async asyncData({$api}) {

    // FastANI Config
    const fastAniConfig = await $api.fastani.getConfig();
    const fastAniMaxPairwise = fastAniConfig.data.maxPairwise;

    // Merge with data
    return {
      fastAniMaxPairwise
    }
  },

  watch: {},

  data: () => ({
    // Icons
    loadExampleSvg: mdiHandshake,
    submitIconSvg: mdiProgressCheck,

    // Config
    fastAniMaxPairwise: 1000,

    jobId: 0,
    isJobBeingLoaded: false,

    // Job information
    qryRows: [] as FastAniQueryRow[],
    refRows: [] as FastAniQueryRow[],
    isJobBeingCreated: false,

    // Table data
    qryToDelete: [] as FastAniQueryRow[],
    refToDelete: [] as FastAniQueryRow[],

    fastAniParameters: {
      kmer: 16,
      frag_len: 3000,
      min_frag: 50,
      min_frac: 0.2,
      version: '1.33'
    } as FastAniParameters,
    priorityQueueSecret: '',
    textareaQry: '',
    textareaRef: '',
    email: '',

    // Data from the add genomes from taxon modal
    genomesFromTaxon: null as null | FastAniAddGenomesFromUserInput,
    genomesFromText: null as null | FastAniAddGenomesFromUserInput,
    genomesFromExample: null as null | FastAniAddGenomesFromUserInput,

  }),
  computed: {
    isFormDisabled(): boolean {
      return this.isJobBeingCreated || this.isJobBeingLoaded;
    },
    isFormValid(): boolean {
      return this.curNumPairwise > 0 && this.curPctPairwise <= 100
    },
    curNumPairwise(): number {
      return this.qryRows.length * this.refRows.length;
    },

    curPctPairwise(): number {
      return this.curNumPairwise / this.fastAniMaxPairwise * 100;
    },

    progressBarColour(): string {
      if (this.curNumPairwise > this.fastAniMaxPairwise) {
        return "red";
      } else if (this.curNumPairwise > this.fastAniMaxPairwise) {
        return "orange";
      } else {
        return "#5a6855";
      }
    },


  },
  methods: {

    createJob() {

      // Create the payload
      const payload = {
        query: this.qryRows.map(row => row.name),
        reference: this.refRows.map(row => row.name),
        parameters: this.fastAniParameters,
        priority: this.priorityQueueSecret,
        email: this.email
      } as FastAniJobRequest;

      // Make the request
      this.isJobBeingCreated = true;
      this.$api.fastani.newJob(payload)
        .then((resp) => {
          // Create / update the cookie
          // if (this.fastAniJobCookieName) {
          //   // Check if the cookie exists and get the existing content
          //   const existingCookie = this.$cookies.get(this.fastAniJobCookieName);
          //   let existingCookieContent: string[] = [];
          //   if (existingCookie) {
          //     existingCookieContent = existingCookie.split(',');
          //   }
          //   // add the job id to the front
          //   existingCookieContent.unshift(this.jobId.toString());
          //
          //   // remove duplicates
          //   existingCookieContent = existingCookieContent.filter((v, i, a) => a.indexOf(v) === i);
          //
          //   // return the first 50 items in the queue
          //   existingCookieContent = existingCookieContent.slice(0, 50);
          //
          //   this.$cookies.set(this.fastAniJobCookieName, existingCookieContent.join(','), {
          //     path: '/',
          //     maxAge: 60 * 60 * 24 * 365
          //   });
          // }

          // Track this event
          this.$plausible.trackEvent("FastANI job created",
            {
              props: {
                comparisons: resp.data.group_1.length * resp.data.group_2.length,
                // @ts-ignore
                email: isDefined(payload.email) && payload.email.length > 3,
              }
            },
          );

          // Set the target panel to be opened
          if ((resp.data.group_1.length > 100 || resp.data.group_2.length > 100)) {
            this.$router.push({
              path: '/tools/fastani/result',
              query: {
                // @ts-ignore
                'job-id': resp.data.job_id
              }
            })
          } else {
            this.$router.push({
              path: '/tools/fastani/heatmap',
              query: {
                // @ts-ignore
                'job-id': resp.data.job_id
              }
            })
          }
        })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
        })
        .finally(() => {
          this.isJobBeingCreated = false;
        })

    },

    // Retrieve the job data and populate the form content
    loadJob(jobId: number) {
      this.isJobBeingLoaded = true;
      this.$api.fastani.getFastAniJobMetadata(jobId)
        .then((resp) => {

          const newQuery: FastAniQueryRow[] = [];
          for (const genome of resp.data.query) {
            newQuery.push({
              name: genome.accession,
              isRep: genome.isSpRep,
              domain: genome.gtdbDomain,
              phylum: genome.gtdbPhylum,
              class: genome.gtdbClass,
              order: genome.gtdbOrder,
              family: genome.gtdbFamily,
              genus: genome.gtdbGenus,
              species: genome.gtdbSpecies,
            });
          }

          const newRef: FastAniQueryRow[] = [];
          for (const genome of resp.data.reference) {
            newRef.push({
              name: genome.accession,
              isRep: genome.isSpRep,
              domain: genome.gtdbDomain,
              phylum: genome.gtdbPhylum,
              class: genome.gtdbClass,
              order: genome.gtdbOrder,
              family: genome.gtdbFamily,
              genus: genome.gtdbGenus,
              species: genome.gtdbSpecies,
            });
          }

          // Update the form content
          this.fastAniParameters = resp.data.parameters;
          this.qryRows = newQuery;
          this.refRows = newRef;

        })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
        })
        .finally(() => {
          this.isJobBeingLoaded = false;
        })
    }

  },


  mounted() {
    // When the application loads, check if the ?job-id=x parameter is present.
    const queryJobId = this.$route.query['job-id'];
    // If it is present, then parse it and set the jobId
    if (isDefined(queryJobId) && queryJobId.length > 0) {
      // @ts-ignore
      const jobIdParsed = parseInt(queryJobId);
      // The default value is 0, ignore it if it's the case
      if (jobIdParsed > 0) {
        console.log('i have job id', jobIdParsed)
        this.jobId = jobIdParsed;
        this.loadJob(this.jobId);
      }
    }
  }
})
</script>

<style scoped>
.fastAniQueryTableHeader {
  font-size: 16px;
}

</style>
