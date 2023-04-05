<template>
  <v-dialog
    v-model="showDialog"
    max-width="1000"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="disabled"
        class="white--text"
        color="#5a6855"
        depressed
        small
        v-bind="attrs"
        @click="showDialog = true"
        v-on="on"
      >
        <v-icon left>
          {{ paramIconSvg }}
        </v-icon>
        Parameters
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 white--text" style="background-color: #5a6855">
        <v-icon dark left>
          {{ paramIconSvg }}
        </v-icon>
        Parameters
      </v-card-title>

      <v-card-text class="mt-5 text--primary">
        <p>
          Parameters are pre-filled with the default values for the specific release.
          For more information, consult the manuscript: <a href="https://doi.org/10.1038/s41467-018-07641-9"
                                                           target="_blank">10.1038/s41467-018-07641-9</a>
        </p>

        <!-- Version / Minimum fragment length -->
        <v-row align="center" no-gutters>
          <v-col class="pa-2" cols="12" sm="6">
            <span class="mr-4 v-label theme--light">Version</span>
            <FastAniVersion v-model="fastAniVersion"/>
          </v-col>
          <v-col class="pa-2" cols="12" sm="6">
            <v-text-field
              v-model="fragmentLength"
              hide-details
              hint="fragment length [default : 3,000]"
              label="Fragment length"
              outlined
              type="number"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row align="center" class="pt-3" no-gutters>
          <!-- kmer size -->
          <v-col class="pa-2" cols="12" sm="6">
            <v-text-field
              v-model="kmerSize"
              hide-details
              hint="k-mer size <= 16 [default 16]"
              label="k-mer size"
              outlined
              type="number"
            ></v-text-field>
          </v-col>
          <!-- Minimum alignment fraction -->
          <v-col class="pa-2" cols="12" sm="6">
            <template v-if="showMinFrac">
              <v-text-field
                v-model="minAlignmentFraction"
                hide-details
                hint="minimum fraction of genome that must be shared for trusting ANI [default: 0.2]"
                label="Minimum alignment fraction"
                outlined
                type="number"
              ></v-text-field>
            </template>
            <template v-else>
              <v-text-field
                v-model="minAlignedFragments"
                hide-details
                hint="minimum fragments for trusting ANI [default : 50]"
                label="Minimum aligned fragments"
                outlined
                type="number"
              ></v-text-field>
            </template>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="saveParameters"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";
import {mdiCog} from "@mdi/js";
import FastAniVersion from "~/components/fastani/FastAniVersion.vue";
import {FastAniParameters} from "~/assets/api/fastani";
import {isDefined} from "~/assets/ts/common";

export default Vue.extend({
  components: {FastAniVersion},

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object as PropType<FastAniParameters>
    }
  },

  watch: {
    value(before, after) {
      if (before !== after) {
        this.updateFromValue()
      }
    }
  },

  computed: {
    showMinFrac(): boolean {
      return ['1.33', '1.32', '1.31', '1.3'].includes(this.fastAniVersion)
    },

    payload(): FastAniParameters {
      return {
        kmer: this.kmerSize,
        frag_len: this.fragmentLength,
        min_frag: this.minAlignedFragments,
        min_frac: this.minAlignmentFraction,
        version: this.fastAniVersion
      }
    },
  },

  data: () => ({
    paramIconSvg: mdiCog,
    showDialog: false,

    minAlignedFragments: 50,
    fragmentLength: 3000,
    minAlignmentFraction: 0.2,
    kmerSize: 16,
    fastAniVersion: '1.33',
  }),


  methods: {
    saveParameters() {
      this.showDialog = false;
      this.$emit('input', this.payload)
    },

    updateFromValue() {
      if (isDefined(this.value.min_frag)) {
        this.minAlignedFragments = this.value.min_frag
      }
      if (isDefined(this.value.frag_len)) {
        this.fragmentLength = this.value.frag_len
      }
      if (isDefined(this.value.min_frac)) {
        this.minAlignmentFraction = this.value.min_frac
      }
      if (isDefined(this.value.kmer)) {
        this.kmerSize = this.value.kmer
      }
      if (isDefined(this.value.version)) {
        this.fastAniVersion = this.value.version
      }
    }
  },
  mounted() {
  this.updateFromValue()
  }
})
</script>

<style scoped>
</style>
