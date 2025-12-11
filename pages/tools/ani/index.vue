<template>
  <v-container class="gtdb-container">
    <v-card>

      <v-card-title class="text-h5">
        ANI calculator
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">

        <!-- Navigation bar -->
        <AniNavigationBar :job-id="jobId"/>

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
            </v-row>

            <!-- First row that contains configuration settings -->
            <v-row no-gutters>

              <!-- Button to load an example and submit the form -->
              <v-btn
                :disabled="isFormDisabled"
                class="white--text"
                color="#5a6855"
                depressed
                to="/tools/ani/heatmap?job-id=1"
              >
                <v-icon left>
                  {{ mdiHandshakeSvg }}
                </v-icon>
                load example
              </v-btn>

              <!-- Program & version selection -->
              <AniProgramListDropdown
                v-model="aniProgram"
                :disabled="isFormDisabled || aniProgram == null"
                :server-config="serverConfig"
                class="ml-2"
                style="max-width: 200px;"
              />

              <!-- Parameters for the current version -->
              <AniParametersFastAni
                v-if="isFastAniProgram"
                v-model="fastAniParameters"
                :disabled="isFormDisabled"
              />
              <AniParametersSkani
                v-else-if="isSkaniProgram"
                v-model="skaniParameters"
                :disabled="isFormDisabled"
              />
              <div v-else>
                <v-btn
                  :disabled="true"
                  class="white--text ml-2"
                  color="#5a6855"
                  depressed
                >
                  <v-icon left>
                    {{ paramIconSvg }}
                  </v-icon>
                  Parameters
                </v-btn>
              </div>


              <!-- New query -->
              <v-btn
                class="white--text ml-2"
                color="#a26464"
                depressed
                href="/tools/ani"
              >
                <v-icon left>
                  {{ mdiRestartSvg }}
                </v-icon>
                New query
              </v-btn>

            </v-row>

            <!-- Parameter code block -->
            <v-row no-gutters>
              <template v-if="isSkaniProgram">
                <AniCodeBlockSkani
                  v-model="skaniParameters"
                  :program="aniProgram"
                />
              </template>
              <template v-else-if="isFastAniProgram">
                <AniCodeBlockFastAni
                  v-model="fastAniParameters"
                  :program="aniProgram"
                />
              </template>
            </v-row>


            <v-row no-gutters>

              <v-col class="mr-1">
                <AniGenomeInput
                  v-model="aniQryList"
                  :allow-upload="true"
                  :disabled="isFormDisabled"
                  :server-config="serverConfig"
                  title="Query genomes"
                  @newFiles="processNewFiles"
                />
              </v-col>
              <v-col class="ml-1">
                <AniGenomeInput
                  v-model="aniRefList"
                  :disabled="isFormDisabled"
                  :server-config="serverConfig"
                  title="Reference genomes"
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
                :disabled="isFormDisabled || aniQryList.length === 0 || aniRefList.length === 0"
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

              {{ fastAniParameters }}


              {{ skaniParameters }}

              <p>
                {{ isFastAniProgram }} {{ isSkaniProgram }}
              </p>

              <p>
                {{ uploadedFiles }}
              </p>

            </v-row>

          </v-card-text>
        </v-card>


      </v-card-text>

    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import AniNavigationBar from "~/components/ani/AniNavigationBar.vue";
import {isDefined} from "~/assets/ts/common";
import {
  mdiChartScatterPlotHexbin,
  mdiCog,
  mdiHandshake,
  mdiMagnify,
  mdiProgressCheck,
  mdiRestart,
  mdiTable
} from "@mdi/js";
import AniProgramListDropdown from "~/components/ani/AniProgramListDropdown.vue";
import AniParameters from "~/components/ani/AniParameters.vue";
import AniCodeBlockSkani from "~/components/ani/AniCodeBlockSkani.vue";
import AniCodeBlockFastAni from "~/components/ani/AniCodeBlockFastAni.vue";
import {
  AniConfigResponse,
  AniJobRequest,
  AniJobResultResponseIndex,
  AniParametersFastAniJson,
  AniParametersSkaniJson,
  AniProgramEnum,
  AniProgramFastAni,
  AniProgramSkani,
  AniQueryRow,
  AniUploadedGenomeRequest,
  convertAniEnumToAniProgram,
  convertAniProgramToEnum
} from "~/assets/api/ani";

export default Vue.extend({
  head() {
    return {
      title: 'ANI calculator',
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
          href: `https://gtdb.ecogenomic.org/tools/ani`,
        }
      ]
    }
  },
  components: {
    AniNavigationBar,
    AniProgramListDropdown,
    AniParameters,
    AniCodeBlockSkani,
    AniCodeBlockFastAni
  },


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

    aniProgram: null as AniProgramEnum | null,
    aniQryList: [] as AniQueryRow[],
    aniRefList: [] as AniQueryRow[],
    email: null,

    isJobBeingCreated: false,


    fastAniParameters: {
      fastAniFragLen: null,
      fastAniKmer: null,
      fastAniMinFrac: null,
      fastAniMinFrag: null,
    } as AniParametersFastAniJson,

    skaniParameters: {
      skaniMinAf: null,
      skaniBothMinAf: null,
      skaniPreset: null,
      skaniCFactor: null,
      skaniFasterSmall: null,
      skaniUseMedian: null,
      skaniMFactor: null,
      skaniNoLearnedAni: null,
      skaniNoMarkerIndex: null,
      skaniRobust: null,
      skaniScreen: null,
      skaniDetailed: null,
    } as AniParametersSkaniJson,


    uploadedFiles: {
      files: [],
      deleteAfter: 'disabled',
    } as AniUploadedGenomeRequest,

    serverConfig: null as null | AniConfigResponse,


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
      this.uploadedFiles.files = this.uploadedFiles.files.filter(file => fileNamesToKeep.has(file.name));
    }
  },

  computed: {
    isFormDisabled(): boolean {
      return this.isJobBeingCreated;
    },

    isFastAniProgram(): boolean {
      if (isDefined(this.aniProgram)) {
        //@ts-ignore
        return AniProgramFastAni.includes(this.aniProgram);
      }
      return false;
    },
    isSkaniProgram(): boolean {
      if (isDefined(this.aniProgram)) {
        //@ts-ignore
        return AniProgramSkani.includes(this.aniProgram);
      }
      return false;
    },


  },

  methods: {

    loadAniConfiguration() {
      this.$api.ani.getConfig().then((resp) => {
        this.serverConfig = resp.data;
      }).catch((err: any) => {
        this.$accessor.api.defaultCatch(err);
      })
    },

    processNewFiles(input: AniUploadedGenomeRequest) {
      // This will be an incremental update of the uploaded files

      console.log(input);

      // Add already existing file names
      const existingFileNames = new Set<string>();
      this.uploadedFiles.files.forEach(file => {
        existingFileNames.add(file.name);
      });

      // Add new files if they are not already present
      input.files.forEach(file => {
        if (!existingFileNames.has(file.name)) {
          this.uploadedFiles.files.push(file);
          existingFileNames.add(file.name);
        }
      });

      // Store the parameters
      this.uploadedFiles.deleteAfter = input.deleteAfter;
    },

    createJob() {
      this.isJobBeingCreated = true;

      try {

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
          program: this.aniProgram != null ? convertAniEnumToAniProgram(this.aniProgram) : null,
          email: this.email,
          userGenomes: this.uploadedFiles,
        } as AniJobRequest;

        if (this.isFastAniProgram) {
          payload.paramsFastAni = this.fastAniParameters;
        } else if (this.isSkaniProgram) {
          payload.paramsSkani = this.skaniParameters;
        }

        this.$api.ani.createNewJob(payload)
          .then((resp) => {

            console.log("RESP");
            console.log(resp);

            // Set the target panel to be opened
            if ((payload.query.length > 100 || payload.reference.length > 100)) {
              this.$router.push({
                path: '/tools/ani/result',
                query: {
                  'job-id': resp.data.jobId
                }
              })
            } else {
              this.$router.push({
                path: '/tools/ani/heatmap',
                query: {
                  'job-id': resp.data.jobId
                }
              })
            }

          })
          .catch((err) => {
            this.$accessor.api.defaultCatch(err);
          })
          .finally(() => {
            this.isJobBeingCreated = false;
          });

      } finally {
        this.isJobBeingCreated = false;
      }

    },

  },

  mounted() {

    // Load the server side configuration
    this.loadAniConfiguration();

    // When the application loads, check if the ?job-id=x parameter is present.
    const queryJobId = this.$route.query['job-id'];
    const queryPassword = this.$route.query['password'];
    // If it is present, then parse it and set the jobId
    if (isDefined(queryJobId) && queryJobId.length == 36) {
      //@ts-ignore
      this.jobId = queryJobId;

      let queryPasswordParsed = null;
      if (isDefined(queryPassword) && queryPassword.length > 0) {
        queryPasswordParsed = queryPassword;
      }

      // Also load the index summary data for this job
      //@ts-ignore
      this.$api.ani.getJob(queryJobId, queryPasswordParsed).then((resp) => {

        const data: AniJobResultResponseIndex = resp.data;
        this.aniProgram = convertAniProgramToEnum(data.program);

        console.log(resp);
      }).catch((err) => {
        this.$accessor.api.defaultCatch(err);
      })

    }
  }
})
</script>

<style scoped>
</style>
