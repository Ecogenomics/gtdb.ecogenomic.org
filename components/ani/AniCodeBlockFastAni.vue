<template>
  <div class="codeBlock w-100 pa-3 rounded mb-4">
    {{ textCommand }}
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {isDefined, isNumeric} from "~/assets/ts/common";
import {AniParametersFastAniJson, AniProgramEnum, convertAniProgramStringToEnum} from "~/assets/api/ani";

export default Vue.extend({

  components: {},

  props: {
    program: {
      type: String
    },

    value: {
      type: Object as PropType<AniParametersFastAniJson>
    },
  },

  watch: {},

  computed: {

    isFastAniMinFragVersion(): boolean {
      if (isDefined(this.program)) {
        const programEnum = convertAniProgramStringToEnum(this.program);
        if (isDefined(programEnum)) {
          //@ts-ignore
          return [AniProgramEnum.FASTANI_1_0, AniProgramEnum.FASTANI_1_1, AniProgramEnum.FASTANI_1_2].includes(programEnum);
        }
      }
      return false;
    },

    textCommand(): string {
      const command = ['fastANI -ql ... -rl ...'];

      if (isDefined(this.value)) {
        if (isDefined(this.value.fastAniKmer) && isNumeric(this.value.fastAniKmer)) {
          command.push(`--kmer ${this.value.fastAniKmer}`);
        }
        if (isDefined(this.value.fastAniFragLen) && isNumeric(this.value.fastAniFragLen)) {
          command.push(`--fragLen ${this.value.fastAniFragLen}`)
        }
        if (this.isFastAniMinFragVersion && isDefined(this.value.fastAniMinFrag) && isNumeric(this.value.fastAniMinFrag)) {
          command.push(`--minFrag ${this.value.fastAniMinFrag}`);
        }
        if (!this.isFastAniMinFragVersion && isDefined(this.value.fastAniMinFrac) && isNumeric(this.value.fastAniMinFrac)) {
          command.push(`--minFraction ${this.value.fastAniMinFrac}`)
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
