<template>
  <div class="codeBlock w-100 pa-3 rounded mb-4">
    {{ textCommand }}
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {isDefined, isNumeric} from "~/assets/ts/common";
import {AniParametersSkaniJson, SkaniParametersPresetEnum} from "~/assets/api/ani";

export default Vue.extend({

  components: {},

  props: {
    program: {
      type: String
    },

    value: Object as PropType<AniParametersSkaniJson>,
  },

  watch: {},

  computed: {

    textCommand(): string {
      const command = [`skani dist -ql <QUERY_LIST> -rl <REFERENCE_LIST>`];

      if (isDefined(this.value)) {


        if (isDefined(this.value.skaniMinAf) && isNumeric(this.value.skaniMinAf)) {
          command.push(`--min-af ${this.value.skaniMinAf}`)
        }
        if (isDefined(this.value.skaniBothMinAf) && isNumeric(this.value.skaniBothMinAf)) {
          command.push(`--both-min-af ${this.value.skaniBothMinAf}`)
        }

        if (this.value.skaniDetailed === true) {
          command.push('--detailed')
        }

        if (isDefined(this.value.skaniPreset)) {
          command.push(`--${this.value.skaniPreset}`)
        }

        // Only include these values if the preset isn't enabled
        if (!isDefined(this.value.skaniPreset)) {
          if (isDefined(this.value.skaniCFactor) && isNumeric(this.value.skaniCFactor)) {
            command.push(`-c ${this.value.skaniCFactor}`)
          }
        }
        if (this.value.skaniPreset !== SkaniParametersPresetEnum.SMALL_GENOMES) {
          if (this.value.skaniFasterSmall) {
            command.push(`--faster-small`)
          }
          if (isDefined(this.value.skaniMFactor) && isNumeric(this.value.skaniMFactor)) {
            command.push(`-m ${this.value.skaniMFactor}`)
          }
        }
        if (this.value.skaniUseMedian) {
          command.push(`--median`)
        }
        if (this.value.skaniNoLearnedAni) {
          command.push(`--no-learned-ani`)
        }
        if (this.value.skaniNoMarkerIndex) {
          command.push(`--no-marker-index`)
        }
        if (this.value.skaniRobust) {
          command.push(`--robust`)
        }
        if (isDefined(this.value.skaniScreen) && isNumeric(this.value.skaniScreen)) {
          command.push(`-s ${this.value.skaniScreen}`)
        }
      }
      return command.join(" ")
    },

  },


  data: () => ({}),

  methods: {}

})
</script>

<style scoped>
.codeBlock {
  background-color: #333333;
  color: white;
  font-size: 12px;
  font-family: "Roboto Mono", monospace;
  white-space: normal;
  word-break: keep-all;
}
</style>
