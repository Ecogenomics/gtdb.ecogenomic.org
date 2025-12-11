<template>
  <v-select
    v-model="selectedItem"
    :disabled="disabled"
    :items="aniPrograms"
    dense
    label="Program"
    outlined
    @input="onChange"
  ></v-select>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {AniConfigResponse, AniProgramEnum, convertAniProgramToEnum} from "~/assets/api/ani";
import {isDefined} from "~/assets/ts/common";

export default Vue.extend({
  props: {
    disabled: Boolean,
    value: String,
    serverConfig: Object as PropType<null | AniConfigResponse>
  },
  watch: {
    value(val) {
      if (isDefined(val)) {
        this.selectedItem = val;
      }
    }
  },
  computed: {
    aniPrograms(): VSelectItem[] {
      const out = [];
      if (this.serverConfig != null) {
        for (const program of this.serverConfig.supportedPrograms) {
          out.push({
            text: `${program.name} v${program.version}`,
            value: convertAniProgramToEnum(program)
          })
        }
      }
      return out;
    },

  },
  data: () => ({
    selectedItem: AniProgramEnum.SKANI_0_3_0 as string,
  }),
  methods: {
    onChange() {
      this.$emit('input', this.selectedItem);
    }
  },
  mounted() {
    this.$emit('input', this.selectedItem);
  }
})
</script>

<style scoped>


</style>
