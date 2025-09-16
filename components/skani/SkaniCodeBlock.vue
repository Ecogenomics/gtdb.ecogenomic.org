<template>
  <div class="codeBlock w-100 pa-3 rounded mb-4">
    {{ textCommand }}
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {isDefined, isNumeric} from "~/assets/ts/common";
import {SkaniCalculationMode, SkaniParameters, SkaniParametersPreset} from "~/assets/api/skani";

export default Vue.extend({

  components: {},

  props: {
    program: {
      type: String
    },

    value: Object as PropType<SkaniParameters>,
    mode: String as PropType<SkaniCalculationMode>,
  },

  watch: {},

  computed: {

    textCommand(): string {
      const command = ['skani'];

      if (this.mode === SkaniCalculationMode.QVR) {
        command.push('dist --ql <QUERY_LIST> --rl <REFERENCE_LIST>');
      } else if (this.mode === SkaniCalculationMode.TRIANGLE) {
        command.push('triangle -l <QUERY_LIST>')
      } else {
        command.push("Error: Unknown calculation mode!")
      }

      if (isDefined(this.value)) {

        if (isDefined(this.value.minAf) && isNumeric(this.value.minAf)) {
          command.push(`--min-af ${this.value.minAf}`)
        }
        if (isDefined(this.value.bothMinAf) && isNumeric(this.value.bothMinAf)) {
          command.push(`--both-min-af ${this.value.bothMinAf}`)
        }

        if (isDefined(this.value.skaniPreset)) {
          command.push(`--${this.value.skaniPreset}`)
        }

        // Only include these values if the preset isn't enabled
        if (!isDefined(this.value.skaniPreset)) {
          if (isDefined(this.value.cFactor) && isNumeric(this.value.cFactor)) {
            command.push(`-c ${this.value.cFactor}`)
          }
        }
        if (this.value.skaniPreset != null && this.value.skaniPreset !== SkaniParametersPreset.SMALL_GENOMES) {
          if (this.value.fasterSmall) {
            command.push(`--faster-small`)
          }
          if (isDefined(this.value.mFactor) && isNumeric(this.value.mFactor)) {
            command.push(`-m ${this.value.mFactor}`)
          }
        }
        if (this.value.useMedian) {
          command.push(`--median`)
        }
        if (this.value.noLearnedAni) {
          command.push(`--no-learned-ani`)
        }
        if (this.value.noMarkerIndex) {
          command.push(`--no-marker-index`)
        }
        if (this.value.robust) {
          command.push(`--robust`)
        }
        if (isDefined(this.value.screen) && isNumeric(this.value.screen)) {
          command.push(`-s ${this.value.screen}`)
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
