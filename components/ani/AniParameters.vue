<template>
  <v-dialog
    v-model="showDialog"
    max-width="1000"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="disabled"
        class="white--text ml-2"
        color="#5a6855"
        depressed
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
        <template v-if="isSkaniProgram">
          <AniParametersSkani
            :program="program"
            :skaniBothMinAf.sync="valSkaniBothMinAf"
            :skaniCFactor.sync="valSkaniCFactor"
            :skaniFasterSmall.sync="valSkaniFasterSmall"
            :skaniMFactor.sync="valSkaniMFactor"
            :skaniMinAf.sync="valSkaniMinAf"
            :skaniNoLearnedAni.sync="valSkaniNoLearnedAni"
            :skaniNoMarkerIndex.sync="valSkaniNoMarkerIndex"
            :skaniPreset.sync="valSkaniPreset"
            :skaniRobust.sync="valSkaniRobust"
            :skaniScreen.sync="valSkaniScreen"
            :skaniUseMedian.sync="valSkaniUseMedian"
          />
        </template>

        <template v-else-if="isFastAniProgram">
          <AniParametersFastAni
            :fastAniFragLen.sync="valFastAniFragLen"
            :fastAniKmer.sync="valFastAniKmer"
            :fastAniMinFrac.sync="valFastAniMinFrac"
            :fastAniMinFrag.sync="valFastAniMinFrag"
            :program="program"
          />
        </template>

        <template v-else>
          Error parsing program name.
        </template>
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
import Vue from "vue";
import {mdiCog} from "@mdi/js";
import {AniProgramFastAni, AniProgramSkani} from "~/assets/api/ani";
import AniParametersFastAni from "~/components/ani/AniParametersFastAni.vue";
import AniParametersSkani from "~/components/ani/AniParametersSkani.vue";

export default Vue.extend({
  components: {AniParametersSkani, AniParametersFastAni},

  props: {
    program: {
      type: String
    },
    disabled: Boolean,

    // FastANI parameters
    fastAniFragLen: Number,
    fastAniKmer: Number,
    fastAniMinFrac: Number,
    fastAniMinFrag: Number,

    // skani parameters
    skaniMinAf: Number,
    skaniBothMinAf: Number,
    skaniPreset: String,
    skaniCFactor: Number,
    skaniFasterSmall: Boolean,
    skaniMFactor: Number,
    skaniUseMedian: Boolean,
    skaniNoLearnedAni: Boolean,
    skaniNoMarkerIndex: Boolean,
    skaniRobust: Boolean,
    skaniScreen: Number,
  },


  computed: {
    isFastAniProgram(): boolean {
      //@ts-ignore
      return AniProgramFastAni.includes(this.program);
    },
    isSkaniProgram(): boolean {
      //@ts-ignore
      return AniProgramSkani.includes(this.program);
    },
  },

  data: () => ({
    paramIconSvg: mdiCog,
    showDialog: false,

    // To avoid directly mutating props
    valFastAniKmer: null as null | number,
    valFastAniFragLen: null as null | number,
    valFastAniMinFrag: null as null | number,
    valFastAniMinFrac: null as null | number,

    valSkaniMinAf: null as null | number,
    valSkaniBothMinAf: null as null | number,
    valSkaniPreset: null as null | string,
    valSkaniCFactor: null as null | number,
    valSkaniFasterSmall: null as null | boolean,
    valSkaniMFactor: null as null | number,
    valSkaniUseMedian: null as null | boolean,
    valSkaniNoLearnedAni: null as null | boolean,
    valSkaniNoMarkerIndex: null as null | boolean,
    valSkaniRobust: null as null | boolean,
    valSkaniScreen: null as null | number,
  }),

  methods: {
    saveParameters() {
      this.showDialog = false;

      // Send the updated FastANI values to the parent
      //@ts-ignore
      if (this.isFastAniProgram) {
        this.$emit('update:fastAniFragLen', this.valFastAniFragLen)
        this.$emit('update:fastAniKmer', this.valFastAniKmer)
        this.$emit('update:fastAniMinFrac', this.valFastAniFragLen)
        this.$emit('update:fastAniMinFrag', this.valFastAniMinFrag)
      }

        // Send the updated skani values to the parent
      //@ts-ignore
      else if (this.isSkaniProgram) {
        this.$emit('update:skaniMinAf', this.valSkaniMinAf)
        this.$emit('update:skaniBothMinAf', this.valSkaniBothMinAf)
        this.$emit('update:skaniPreset', this.valSkaniPreset)
        this.$emit('update:skaniCFactor', this.valSkaniCFactor)
        this.$emit('update:skaniFasterSmall', this.valSkaniFasterSmall)
        this.$emit('update:skaniMFactor', this.valSkaniMFactor)
        this.$emit('update:skaniUseMedian', this.valSkaniUseMedian)
        this.$emit('update:skaniNoLearnedAni', this.valSkaniNoLearnedAni)
        this.$emit('update:skaniNoMarkerIndex', this.valSkaniNoMarkerIndex)
        this.$emit('update:skaniRobust', this.valSkaniRobust)
        this.$emit('update:skaniScreen', this.valSkaniScreen)
      }

    },

    mounted() {
      this.valFastAniKmer = this.fastAniKmer;
      this.valFastAniFragLen = this.fastAniFragLen;
      this.valFastAniMinFrag = this.fastAniMinFrag;
      this.valFastAniMinFrac = this.fastAniMinFrac;

      this.valSkaniMinAf = this.skaniMinAf
      this.valSkaniBothMinAf = this.skaniBothMinAf
      this.valSkaniPreset = this.skaniPreset
      this.valSkaniCFactor = this.skaniCFactor
      this.valSkaniFasterSmall = this.skaniFasterSmall
      this.valSkaniMFactor = this.skaniMFactor
      this.valSkaniUseMedian = this.skaniUseMedian
      this.valSkaniNoLearnedAni = this.skaniNoLearnedAni
      this.valSkaniNoMarkerIndex = this.skaniNoMarkerIndex
      this.valSkaniRobust = this.skaniRobust
      this.valSkaniScreen = this.skaniScreen
    }

  },
})
</script>

<style scoped>

</style>
