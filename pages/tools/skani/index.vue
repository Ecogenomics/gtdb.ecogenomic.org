<template>
  <v-container class="gtdb-container">
    <v-card>

      <v-card-title class="text-h5">
        skani calculator
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">

        <!-- Navigation bar -->
        <SkaniNavigationBar :job-id="jobId"/>

        <!-- Query form -->
        <v-card class="rounded-t-0 rounded-b" outlined>
          <v-card-text>

            <!-- Introduction to this page -->
            <v-row no-gutters>
              <p>
                We have provided a interface to assist in exploring prokaryotic NCBI genomes using third-party programs.
                We periodically download new
                genomes from NCBI, missing genomes will be ignored.
              </p>
              <p>
                For more information on skani, consult the
                <a href="https://doi.org/10.1038/s41592-023-02018-3" target="_blank">manuscript</a>
                or the <a href="https://github.com/bluenote-1577/skani" target="_blank">documentation</a>.
              </p>
            </v-row>

            <v-divider></v-divider>

            <!-- First row that contains configuration settings -->
            <v-row class="mt-5" no-gutters>

              <!-- Button to load an example and submit the form -->
              <v-btn
                  :disabled="isFormDisabled"
                  class="white--text"
                  color="#5a6855"
                  depressed
                  to="/tools/skani/heatmap?job-id=12345678"
              >
                <v-icon left>
                  {{ mdiHandshakeSvg }}
                </v-icon>
                load example
              </v-btn>

              <!-- Program & version selection -->
              <SkaniProgramDropdown
                  v-model="skaniVersion"
                  :disabled="isFormDisabled || skaniVersion == null"
                  :supported-programs="serverConfig?.supportedPrograms"
                  class="ml-2"
                  style="max-width: 200px;"
              />

              <SkaniCalculationMode
                  v-model="calculationMode"
                  class="ml-2"
                  style="max-width: 250px;"
              />

              <!-- Parameters for the current version -->
              <SkaniParameters
                  v-model="parameters"
                  :disabled="isFormDisabled"
                  :mode="calculationMode"
                  :version="skaniVersion"
              />

              <!-- New query -->
              <v-btn
                  class="white--text ml-2"
                  color="#a26464"
                  depressed
                  href="/tools/skani"
              >
                <v-icon left>
                  {{ mdiRestartSvg }}
                </v-icon>
                New query
              </v-btn>

            </v-row>

            <!-- Parameter code block -->
            <v-row no-gutters>
              <SkaniCodeBlock
                  v-model="parameters"
                  :mode="calculationMode"
                  :program="skaniVersion"
              />
            </v-row>

            <v-divider></v-divider>


            <v-row no-gutters class="mt-5">

              <v-col class="mr-1">
                <SkaniGenomeInput
                    v-model="aniQryList"
                    :allow-upload="true"
                    :disabled="isFormDisabled"
                    :server-config="serverConfig"
                    :title="showRefGenomeInputTable ? 'Query Genomes': 'Input Genomes'"
                    @newFiles="processNewFiles"
                />
              </v-col>
              <v-col v-if="showRefGenomeInputTable" class="ml-1">
                <SkaniGenomeInput
                    v-model="aniRefList"
                    :allow-upload="true"
                    :disabled="isFormDisabled"
                    :server-config="serverConfig"
                    title="Reference Genomes"
                    @newFiles="processNewFiles"
                />
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
                  :disabled="isFormDisabled || isSubmitDisabled"
                  :loading="isJobBeingCreated"
                  class="w-20 white--text"
                  color="#5a6855"
                  depressed
                  large
                  @click="createJob"
              >
                Submit
                <v-icon right>
                  {{ mdiProgressCheckSvg }}
                </v-icon>
              </v-btn>
            </v-row>

          </v-card-text>
        </v-card>
      </v-card-text>

    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  mdiChartScatterPlotHexbin,
  mdiCog,
  mdiHandshake,
  mdiMagnify,
  mdiProgressCheck,
  mdiRestart,
  mdiTable
} from "@mdi/js";
import {
  SkaniCalculationMode,
  SkaniJobDataIndexResponse,
  SkaniJobRequest,
  SkaniJobUploadMetadata,
  SkaniParameters,
  SkaniServerConfig,
  SkaniVersion
} from "~/assets/api/skani";
import {parseSkaniJobId, SkaniTableRow} from "~/assets/ts/skani";
import {SkaniAddGenomesFromUploadOutput} from "~/components/skani/SkaniAddGenomesFromUpload.vue";

export default Vue.extend({
  head() {
    return {
      title: 'skani calculator',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `An interface to compute pairwise ANI of NCBI genomes using the GTDB taxonomy.`
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `ANI, AF, average nucleotide identity, alignment fraction, pairwise, gtdb`
        }
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://gtdb.ecogenomic.org/tools/skani`,
        }
      ]
    }
  },
  components: {},


  data: () => ({
    jobId: '',

    // Icons
    mdiMagnifySvg: mdiMagnify,
    mdiTableSvg: mdiTable,
    paramIconSvg: mdiCog,
    mdiChartScatterPlotHexbinSvg: mdiChartScatterPlotHexbin,
    mdiHandshakeSvg: mdiHandshake,
    mdiRestartSvg: mdiRestart,
    mdiProgressCheckSvg: mdiProgressCheck,

    skaniVersion: SkaniVersion.SKANI_0_3_0,
    aniQryList: [] as SkaniTableRow[],
    aniRefList: [] as SkaniTableRow[],
    email: null,

    isJobBeingCreated: false,
    isJobLoading: false,

    parameters: {
      minAf: null,
      bothMinAf: null,
      skaniPreset: null,
      cFactor: null,
      fasterSmall: null,
      mFactor: null,
      useMedian: null,
      noLearnedAni: null,
      noMarkerIndex: null,
      robust: null,
      screen: null
    } as SkaniParameters,

    uploadMetadata: {
      fileNames: [],
      deleteAfter: null
    } as SkaniJobUploadMetadata,

    // Files that have been uploaded by the user
    userFiles: [] as File[],

    serverConfig: null as null | SkaniServerConfig,
    calculationMode: SkaniCalculationMode.QVR

  }),

  watch: {
    // Whenever the ANI query list is updated, we need to remove any uploaded sequences that are no longer present
    // i.e. if they are deleted
    aniQryList() {

      // Reflect the changes in the uploaded files
      const fileNamesToKeep = new Set<string>();
      this.aniQryList.forEach(item => {
        if (item.isUser) {
          fileNamesToKeep.add(item.name);
        }
      });

      // Filter the uploaded files to keep only those that are still referenced
      // this.uploadedFiles.files = this.uploadedFiles.files.filter(file => fileNamesToKeep.has(file.name));
    }
  },

  computed: {

    showRefGenomeInputTable(): boolean {
      return this.calculationMode == SkaniCalculationMode.QVR;
    },

    isFormDisabled(): boolean {
      return this.isJobBeingCreated || this.isJobLoading;
    },

    isSubmitDisabled(): boolean {
      if (this.isJobLoading) {
        return true;
      }
      if (this.calculationMode == SkaniCalculationMode.QVR) {
        // We then require at least one reference, and one query
        return this.aniQryList.length === 0 && this.aniRefList.length === 0;
      } else if (this.calculationMode == SkaniCalculationMode.TRIANGLE) {
        // Only the query list is required
        return this.aniQryList.length <= 1;
      } else {
        console.log("UNKNOWN CALCULATION MODE!")
        return false;
      }
    }


  },

  methods: {

    // Retrieve the server-side rules
    loadServerConfig() {
      this.$api.skani.getConfig().then((resp) => {
        this.serverConfig = resp.data;
      }).catch((err: any) => {
        this.$accessor.api.defaultCatch(err);
      })
    },

    // This may be an incremental update of
    processNewFiles(input: SkaniAddGenomesFromUploadOutput) {
      // This will be an incremental update of the uploaded files

      console.log(input);

      // Add already existing file names
      const existingFileNames = new Set<string>();
      this.userFiles.forEach(file => {
        existingFileNames.add(file.name);
      });

      // Add new files if they are not already present
      input.files.forEach(file => {
        if (!existingFileNames.has(file.name)) {
          this.userFiles.push(file);
          existingFileNames.add(file.name);
        }
      });

      // Store the parameters
      this.uploadMetadata.deleteAfter = input.deleteAfter;
    },

    // Send the job data to the server
    createJob() {
      this.isJobBeingCreated = true;

      // Extract the query list
      const qryList: string[] = [];
      this.aniQryList.forEach(item => {
        qryList.push(item["name"]);
      });

      // Extract the reference list
      const refList: string[] = [];
      this.aniRefList.forEach(item => {
        refList.push(item["name"])
      })

      const payload = {
        query: qryList,
        reference: refList,
        params: this.parameters,
        email: this.email,
        calcMode: this.calculationMode,
        version: this.skaniVersion,
      } as SkaniJobRequest;

      // Create the job in the database
      this.$api.skani.createJob(payload, this.userFiles, this.uploadMetadata)
          .then((resp) => {
            this.$router.push({
              path: '/tools/skani/status',
              query: {
                'job-id': resp.data.jobId
              }
            })
          })
          .catch((err) => {
            this.$accessor.api.defaultCatch(err);
          })
          .finally(() => {
            this.isJobBeingCreated = false;
          });
    },

  },

  mounted() {

    // Load the server side configuration
    this.loadServerConfig();

    // When the application loads, check if the ?job-id=x parameter is present.
    const queryJobId = parseSkaniJobId(this.$route.query['job-id']);
    // If it is present, then parse it and set the jobId
    if (queryJobId != null) {
      this.jobId = queryJobId;

      this.isJobLoading = true;
      this.$api.skani.getJobQueryPage(queryJobId).then((resp) => {

        const data: SkaniJobDataIndexResponse = resp.data;

        this.calculationMode = data.mode;
        this.parameters = data.params;
        this.skaniVersion = data.version;

        // Process genomes
        const newQryList: SkaniTableRow[] = [];
        for (const q of data.query) {
          newQryList.push({
            name: q.accession,
            isUser: q.isUser,
            isRep: q.isSpRep,
            domain: q.gtdbDomain,
            phylum: q.gtdbPhylum,
            class: q.gtdbClass,
            order: q.gtdbOrder,
            family: q.gtdbFamily,
            genus: q.gtdbGenus,
            species: q.gtdbSpecies
          })
        }
        this.aniQryList = newQryList;

        const newRefList: SkaniTableRow[] = [];
        for (const r of data.reference) {
          newRefList.push({
            name: r.accession,
            isUser: r.isUser,
            isRep: r.isSpRep,
            domain: r.gtdbDomain,
            phylum: r.gtdbPhylum,
            class: r.gtdbClass,
            order: r.gtdbOrder,
            family: r.gtdbFamily,
            genus: r.gtdbGenus,
            species: r.gtdbSpecies
          })
        }
        this.aniRefList = newRefList;
      }).catch((err) => {
        this.$accessor.api.defaultCatch(err);
      }).finally(() => {
        this.isJobLoading = false;
      })
    }
  }
})
</script>

<style scoped>
</style>
