<template>
  <v-container class="gtdb-container">
    <v-card>

      <v-card-title class="text-h5">
        Convert Accessions
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text--primary">
        This tool will convert accessions of leaf nodes in a Newick tree between various GTDB and NCBI formats.

        <!-- First step -->
        <v-card
          class="ma-5"
          elevation="0"
          style="border: solid 1px #e0e0e0;"
        >
          <v-card-title>
            1 - Provide the tree in Newick format
          </v-card-title>
          <v-card-text>
            <span style="font-style: italic;">Note: If if both are provided, the file will be used.</span>
            <v-row class="mt-5" no-gutters>
              <v-col class="mr-3">
                <v-file-input
                  v-model="treeFile"
                  :prepend-icon="mdiGraphSvg"
                  dense
                  label="Tree as a Newick file"
                  outlined
                ></v-file-input>
              </v-col>
              <v-col class="ml-3">
                <v-textarea
                  v-model="treeString"
                  dense
                  label="Tree as Newick string"
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Second step -->
        <v-card
          class="ma-5"
          elevation="0"
          style="border: solid 1px #e0e0e0;"
        >
          <v-card-title>
            2 - Select the output accession format
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col>
                <b>NCBI Accessions (no user accession)</b>
                <v-radio-group
                  v-model="radioNoUserAcc"
                  dense
                  mandatory
                >
                  <v-radio
                    color="#4e9f49"
                    label="Do not change"
                    value="ignore"
                  ></v-radio>
                  <v-radio
                    color="#4e9f49"
                    label="GB_GCA_123456789.1"
                    value="long"
                  ></v-radio>
                  <v-radio
                    color="#4e9f49"
                    label="GCA_123456789.1"
                    value="short"
                  ></v-radio>
                  <v-radio
                    color="#4e9f49"
                    label="G123456789"
                    value="canonical"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col class="mx-3">
                <b>NCBI Accessions (previously user genomes)</b>
                <v-radio-group
                  v-model="radioPrevUser"
                  dense
                  mandatory
                >
                  <v-radio
                    color="#4e9f49"
                    label="Do not change"
                    value="ignore"
                  ></v-radio>
                  <v-radio
                    color="#4e9f49"
                    label="U_42"
                    value="user"
                  ></v-radio>
                  <v-radio
                    color="#4e9f49"
                    label="UBA9001"
                    value="uba"
                  ></v-radio>
                  <v-radio
                    color="#4e9f49"
                    label="GB_GCA_123456789.1"
                    value="long"
                  ></v-radio>
                  <v-radio
                    color="#4e9f49"
                    label="GCA_123456789.1"
                    value="short"
                  ></v-radio>
                  <v-radio
                    color="#4e9f49"
                    label="G123456789"
                    value="canonical"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col>
                <b>User Accessions (no NCBI accession)</b>
                <v-radio-group
                  v-model="radioUserAcc"
                  dense
                  mandatory
                >
                  <v-radio
                    color="#4e9f49"
                    label="Do not change"
                    value="ignore"
                  ></v-radio>
                  <v-radio
                    color="#4e9f49"
                    label="U_42"
                    value="user"
                  ></v-radio>
                  <v-radio
                    color="#4e9f49"
                    label="UBA9001"
                    value="uba"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Results step -->
        <v-card
          class="ma-5"
          elevation="0"
          style="border: solid 1px #e0e0e0;"
        >
          <v-card-title>
            3 - Convert the tree
          </v-card-title>
          <v-card-text>

            <v-btn
              :loading="loading"
              depressed
              elevation="1"
              @click="submitForm"
            >
              Download
              <v-icon right>
                {{ mdiDownloadSvg }}
              </v-icon>
            </v-btn>
          </v-card-text>
        </v-card>

      </v-card-text>

    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {mdiDownload, mdiGraph} from "@mdi/js";
import {UtilConvertTreeAccessionsRequest} from "~/assets/api/util";

export default Vue.extend({
  head() {
    return {
      title: 'Convert Accessions',
      meta: [
        {
          hid: 'tools/convert-accessions',
          name: 'description',
          content: `Convert between GTDB and NCBI accessions on a Newick tree.`
        }
      ]
    }
  },
  components: {},
  data: () => ({
    // Form values
    mdiGraphSvg: mdiGraph,
    mdiDownloadSvg: mdiDownload,

    // Step 1 form values
    treeString: '',
    treeFile: null as null | File,

    // Step 2 form values
    radioNoUserAcc: 'ignore',
    radioPrevUser: 'ignore',
    radioUserAcc: 'ignore',

    // Is api running
    loading: false,
    blobUrl: '',
  }),
  computed: {},
  methods: {
    submitForm() {
      this.loading = true;
      const payload = {
        newickFile: this.treeFile,
        newickString: this.treeString,
        noUserAcc: this.radioNoUserAcc,
        prevUser: this.radioPrevUser,
        userOnly: this.radioUserAcc,
      } as UtilConvertTreeAccessionsRequest;
      this.$api.util.convertTreeAccessions(payload)
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'gtdb-convert-accessions.zip'); //or any other extension
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          console.log(err);
          this.$accessor.api.defaultCatch(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
})
</script>

<style scoped>

</style>
