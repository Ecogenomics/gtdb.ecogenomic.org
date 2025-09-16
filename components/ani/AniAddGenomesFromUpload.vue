<template>
  <v-dialog
    v-model="modalVisible"
    width="900"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="isDisabled"
        class="white--text"
        color="#76ab63"
        depressed
        small
        v-bind="attrs"
        @click="onAddGenomesFromTaxonClick"
        v-on="on"
      >
        <v-icon left>
          {{ mdiUploadSvg }}
        </v-icon>
        Upload
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 white--text" style="background-color: #5a6855">
        <v-icon dark left>
          {{ mdiUploadSvg }}
        </v-icon>
        Add genomes from upload
      </v-card-title>

      <v-card-text class="pt-3">
        <v-row no-gutters>
          <div class="d-block">
            <p class="mb-1">
              Select one or more genome nucleotide files in plain-text FASTA format.
            </p>
            <ul>
              <li
                :class="{ errorText: !fileRestrictionChecks.sizeValid}"
              >
                Maximum size of each file: {{ maxUserFileSizeMbEach }} MB
              </li>
              <li
                :class="{ errorText: !fileRestrictionChecks.nameLengthValid}"
              >
                Maximum file name length: {{ maxUserFileNameLength }}
              </li>
              <li
                :class="{ errorText: !fileRestrictionChecks.countValid}"
              >
                Maximum file count: {{ maxUserFileCount }}
              </li>
            </ul>
          </div>

        </v-row>

        <v-divider class="mt-5"></v-divider>

        <v-row class="mt-5" no-gutters>
          <v-file-input
            v-model="files"
            dense
            hide-details
            label="Genome FASTA file(s)"
            multiple
            outlined
            show-size
            small-chips
            truncate-length="15"
          ></v-file-input>
        </v-row>

        <v-divider class="mt-5"></v-divider>


        <v-row no-gutters>
          <v-select
            v-model="autoDeleteResultsSelected"
            :items="autoDeleteResultsOptions"
            class="mt-5 mx-2"
            dense
            flat
            hide-details
            label="Automatically delete results after completion"
            light
            outlined
            style="max-width: 500px;"
          />
        </v-row>

        <v-divider class="mt-5"></v-divider>

        <v-row class="mt-5" no-gutters>
          <div class="d-block">
            <b>How your data is handled:</b><br>
            <ul>
              <li>Uploaded genomes will be deleted after the job has been processed (either on success or fail).</li>
              <li>
                Only the file name and ANI results will be stored in the database.
              </li>
              <li>No sequence data will be kept after processing.</li>
              <li>File names are <b>publicly visible</b> to anyone with the job id.</li>
              <li>We make no guarantee on how long the ANI results will be available.</li>
            </ul>
          </div>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="isSaveDisabled"
          :loading="areFilesProcessing"
          color="primary"
          text
          @click="readUploadedFiles"
        >
          Save
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="modalVisible = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";

import TaxonSearchAutocomplete from "~/components/shared/TaxonSearchAutocomplete.vue";
import {mdiUpload} from "@mdi/js";
import {AniConfigResponse, AniUploadedGenomeRequest} from "~/assets/api/ani"; // Convert the FileReader to a promise so they can be synchronised

//
// // Convert the FileReader to a promise so they can be synchronised
// function readFileAsText(file: File): Promise<AniUploadedGenomeFile> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//
//     reader.onload = () => {
//       if (typeof reader.result === "string") {
//         resolve({
//           name: file.name,
//           content: reader.result
//         });
//       } else {
//         reject(new Error(`Unexpected result type: ${file.name}`));
//       }
//     };
//
//     reader.onerror = () => {
//       reject(reader.error ?? new Error(`Unknown file read error: ${file.name}`));
//     };
//     reader.readAsText(file);
//   });
// }


interface FileRestrictionCheck {
  countValid: boolean,
  nameLengthValid: boolean,
  sizeValid: boolean
}

export default Vue.extend({
  components: {TaxonSearchAutocomplete},

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    serverConfig: Object as PropType<AniConfigResponse | null>
  },


  data: () => ({
    // Icons
    mdiUploadSvg: mdiUpload,

    // Modal data
    modalVisible: false,

    // Form data
    files: [] as File[],

    areFilesProcessing: false,

    resultPassword: '',

    autoDeleteResultsSelected: 'disabled',
    autoDeleteResultsOptions: [
      {text: 'Disabled', value: 'disabled'},
      {text: '1 Hour', value: '1_hour'},
      {text: '1 Day', value: '1_day'},
      {text: '1 Week', value: '1_week'},
      {text: '1 Month', value: '1_month'},
    ] as VSelectItem[]

  }),

  computed: {

    isDisabled(): boolean {
      return this.disabled;
    },

    isSaveDisabled(): boolean {
      if (this.areFilesProcessing) {
        return true;
      }
      if (!(this.files != null && this.files.length > 0)) {
        return true;
      }
      return !this.fileRestrictionChecks.countValid || !this.fileRestrictionChecks.nameLengthValid || !this.fileRestrictionChecks.sizeValid;
    },


    maxUserFileSizeMbEach(): number | null {
      if (this.serverConfig != null) {
        return this.serverConfig.maxUserFileSizeMbEach;
      } else {
        return null;
      }
    },

    maxUserFileNameLength(): number | null {
      if (this.serverConfig != null) {
        return this.serverConfig.maxUserFileNameLength;
      } else {
        return null;
      }
    },

    maxUserFileCount(): number | null {
      if (this.serverConfig != null) {
        return this.serverConfig.maxUserFileCount;
      } else {
        return null;
      }
    },

    fileRestrictionChecks(): FileRestrictionCheck {
      if (this.files == null || this.files.length === 0) {
        return {
          countValid: true,
          nameLengthValid: true,
          sizeValid: true
        };
      }
      if (this.maxUserFileCount != null && this.maxUserFileNameLength != null && this.maxUserFileSizeMbEach != null) {
        let fileCount = 0;
        let fileMbTotal = 0;
        let fileNameLengthValid = true;
        for (const file of this.files) {
          fileCount += 1;
          fileMbTotal += file.size / (1024 * 1024);
          if (file.name.length > this.maxUserFileNameLength) {
            fileNameLengthValid = false;
          }
        }
        return {
          countValid: fileCount <= this.maxUserFileCount,
          nameLengthValid: fileNameLengthValid,
          sizeValid: fileMbTotal <= this.maxUserFileSizeMbEach
        }
      }
      return {
        countValid: true,
        nameLengthValid: true,
        sizeValid: true
      };
    },

  },


  methods: {


    readUploadedFiles() {

      // Close the modal and emit the new data
      this.modalVisible = false;
      this.$emit("update", {
        files: this.files,
        deleteAfter: this.autoDeleteResultsSelected,
      } as AniUploadedGenomeRequest);

      // Reset the file upload form
      this.files = [];
      //
      // // Create a promise for each of the files
      // const promises = [];
      // for (const file of this.files) {
      //   promises.push(readFileAsText(file))
      // }
      //
      // // Create a new array of processed files
      // const fileData: AniUploadedGenomeFile[] = [];
      //
      // // Wait for each of the promises to resolve
      // this.areFilesProcessing = true;
      // Promise.all(promises).then((results) => {
      //   for (let i = 0; i < results.length; i++) {
      //     const content = results[i];
      //     fileData.push(content)
      //   }
      //
      //   // Close the modal and emit the new data
      //   this.modalVisible = false;
      //   this.$emit("update", {
      //     files: this.files,
      //     deleteAfter: this.autoDeleteResultsSelected,
      //   } as AniUploadedGenomeRequest);
      //
      //   // Reset the file upload form
      //   this.files = [];
      //
      // }).catch((error) => {
      // }).finally(() => {
      //   this.areFilesProcessing = false;
      // });

    },

    // Toggle the modal open
    onAddGenomesFromTaxonClick() {
      this.modalVisible = !this.modalVisible;
    },

  },

})
</script>

<style scoped>
.errorText {
  color: red;
  font-weight: bold;
}
</style>
