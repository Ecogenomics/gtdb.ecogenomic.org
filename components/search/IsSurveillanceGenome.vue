<template>
  <v-card
    v-if="isSurveillance"
    class="ma-5"
    outlined
    color="#f0f9fd"
  >
    <v-card-title>
      <v-icon left>
        {{ mdiAlertCircleSvg }}
      </v-icon>
      NCBI surveillance genome
    </v-card-title>

    <v-divider></v-divider>
    <v-card-text>
      <p>You searched for the accession <b>{{ surveyAccession }}</b>, which is a known surveillance genome.</p>

      <p>The <a href="https://www.ncbi.nlm.nih.gov/pathogens/" target="_blank">NCBI Pathogen Detection Assembly</a>
        (surveillance) genomes have been excluded from the GTDB as they include extremely large quantities of well
        described taxa.</p>

      <p class="mb-0">For more information, search the NCBI assembly database: NCBI - <a
        :href="`https://www.ncbi.nlm.nih.gov/assembly/${surveyAccession}/`" target="_blank">{{ surveyAccession }}</a></p cla>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import {mdiAlertCircle} from "@mdi/js";

export default Vue.extend({
  props: {
    accession: {
      type: String,
      required: true
    }
  },
  watch: {
    accession(val) {
      val && val !== this.lastAccession && this.loadGenomeMetadata(val);
    }
  },
  data: () => ({
    loading: false,
    lastAccession: '',
    isSurveillance: false,
    mdiAlertCircleSvg: mdiAlertCircle,
    surveyAccession: '',
  }),
  mounted() {
    this.loadGenomeMetadata(this.accession);
  },
  methods: {
    loadGenomeMetadata(accession: string) {
      this.isSurveillance = false;
      this.lastAccession = accession;
      this.loading = true;
      this.$api.genome.getMetadata(accession).then(response => {
        this.isSurveillance = response.data.isNcbiSurveillance;
        this.surveyAccession = response.data.accession;
      })
        .finally(() => {
          this.loading = false;
        });
    }
  }
})
</script>

<style scoped>

</style>
