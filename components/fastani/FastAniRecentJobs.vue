<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="1000px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :disabled="isLoading"
          class="white--text"
          color="#5a6955"
          depressed
          small
          v-bind="attrs"
          v-on="on"
        >
          <v-icon left>
            {{ svgHistory }}
          </v-icon>
          Previous jobs ({{ nPreviousJobs }})
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5 white--text" style="background-color: #5a6855">
          <v-icon left dark>
            {{ svgHistory }}
          </v-icon>
          Previous Jobs

          <v-spacer></v-spacer>
          <v-btn
            color="#FFFFFF"
            icon
            outlined
            small
            @click="dialog = false"
          >
            <v-icon>
              {{ svgClose }}
            </v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="text--primary pt-5">

          <p>
          The most recent 50 jobs are shown below. Click on a job ID to view the results.
          </p>

          <v-btn
            small
            color="#5a6855"
            class="white--text"
            depressed
            :disabled="isLoading"
            @click="loadRecentJobs"
          >
            <v-icon left>
              {{ svgRefresh }}
            </v-icon>
            Refresh
          </v-btn>

          <v-data-table
            :headers="tableHeaders"
            :items="rows"
            :loading="isLoading"
            class="gtdb-table mt-2"
            dense
            multi-sort
          >
            <!-- Job ID column -->
            <template v-slot:item.jobId="{ item }">
              <a :href="`fastani?job-id=${item.jobId}`">
                {{ item.jobId }}
              </a>
            </template>

            <!-- Creation column -->
            <template v-slot:item.createdOn="{ item }">
              {{ convertEpochToString(item.createdOn) }}
            </template>

            <!-- Status column -->
            <template v-slot:item.status="{ item }">
              <v-chip v-if="item.status === 'running'" color="orange" small text-color="white">
                {{ item.status }}
              </v-chip>
              <v-chip v-else-if="item.status === 'finished'" color="green" small text-color="white">
                {{ item.status }}
              </v-chip>
              <v-chip v-else-if="item.status === 'error'" color="red" small text-color="white">
                {{ item.status }}
              </v-chip>
              <v-chip v-else small text-color="white">
                {{ item.status }}
              </v-chip>
            </template>

            <!-- Delete column -->
            <template v-slot:item.delete="{ item }">
              <v-btn
                depressed
                icon
                small
                @click="removeJob(item.jobId)"
              >
                <v-icon>
                  {{ svgRemoveRow }}
                </v-icon>
              </v-btn>
            </template>
          </v-data-table>

        </v-card-text>
      </v-card>

    </v-dialog>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import {FastAniJobInfo} from "~/assets/api/fastani";
import {mdiClose, mdiHistory, mdiRefresh, mdiTrashCanOutline} from "@mdi/js";


export default Vue.extend({
  props: {
    update: {
      type: String,
      default: '',
    }
  },
  watch: {
    update(after, before) {
      after && !this.isLoading && before !== after && this.loadRecentJobs();
    }
  },
  data: () => ({
    svgRemoveRow: mdiTrashCanOutline,
    svgRefresh: mdiRefresh,
    svgHistory: mdiHistory,
    svgClose: mdiClose,
    isLoading: true,
    panelExpanded: [],
    dialog: false,
    fastAniJobCookieName: process.env.fastAniJobCookieName,
    rows: [] as FastAniJobInfo[],

    tableHeaders: [
      {
        text: 'Job ID',
        value: 'jobId'
      },
      {
        text: 'Created',
        value: 'createdOn'
      },
      {
        text: 'Status',
        align: 'middle',
        value: 'status'
      },
      {
        text: 'Delete',
        value: 'delete',
        align: 'middle',
        sortable: false
      }
    ],
    tableItemsPerPage: 10,

  }),

  computed: {
    nPreviousJobs(): string {
      if (this.isLoading) {
        return 'Loading...'
      } else {
        return this.rows.length.toLocaleString()
      }
    }
  },

  methods: {
    // Return job ids from cookie
    getJobIdsFromCookie(): string[] {
      if (this.fastAniJobCookieName) {
        const cookie = this.$cookies.get(this.fastAniJobCookieName);
        if (cookie) {
          const jobIds = cookie.split(',');
          const out = [];
          const jobUnq = new Set<string>(jobIds);
          for (const jobId of jobIds) {
            if(jobUnq.has(jobId)) {
              out.push(jobId);
            }
          }
          return out;
        }
      }
      return [];
    },

    // Updates the cookie and resets it to only those jobs in the rows
    updateCookieFromRows(): void {
      if (this.fastAniJobCookieName) {
        const jobIds = this.rows.map((row) => row.jobId);
        this.$cookies.set(this.fastAniJobCookieName, jobIds.join(','), {
          path: '/',
          maxAge: 60 * 60 * 24 * 365
        });
      }
    },

    // The main method to reload the content
    async loadRecentJobs() {

      // Load the job ids from the cookie
      const jobIds = this.getJobIdsFromCookie();
      if (jobIds.length === 0) {
        this.isLoading = false;
        return;
      }

      // There are jobs, load all of them asynchronously
      try {
        this.isLoading = true;
        this.rows = [];
        const promises = jobIds.map((jobId) => {
          return this.$api.fastani.getJobInfo(jobId);
        });
        const results = await Promise.all(promises);
        for (const result of results) {
          if (result && result.status < 300 && result.status >= 200) {
            this.rows.push({
              jobId: result.data.jobId,
              createdOn: result.data.createdOn,
              status: result.data.status,
            });
          }
        }

        // If it was successful, update the cookie
        this.updateCookieFromRows();

      } finally {
        this.isLoading = false;
      }
    },

    removeJob(jobId: string): void {
      console.log(jobId)

      // Remove the job from the rows
      this.rows = this.rows.filter((row) => row.jobId !== jobId);

      // Remove the job from the cookie
      this.updateCookieFromRows();

    },

    convertEpochToString(ts: number) {
      const date = new Date(ts * 1000);
      // convert to utc date
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return date.toLocaleString();
    }
  },

  mounted() {
    this.loadRecentJobs();
  },

})
</script>

<style scoped>
</style>
