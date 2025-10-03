<template>
  <v-select
    v-model="selectedItem"
    :disabled="isDisabled"
    :items="aniPrograms"
    dense
    label="Program"
    outlined
    @input="onChange"
  ></v-select>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {SkaniVersion} from "~/assets/api/skani";

export default Vue.extend({
  props: {
    disabled: Boolean,
    value: String as PropType<SkaniVersion>,
    supportedPrograms: Array as PropType<null | SkaniVersion[]>
  },
  watch: {
    value(val) {
      if (val != null) {
        this.selectedItem = val;
      }
    }
  },
  computed: {
    isDisabled(): boolean {
      if (this.supportedPrograms != null) {
        return this.disabled || this.supportedPrograms.length < 2;
      }
      return this.disabled;
    },
    aniPrograms(): VSelectItem[] {
      const out = [];
      if (this.supportedPrograms != null) {
        for (const program of this.supportedPrograms) {
          out.push({
            text: `skani v${program}`,
            value: program
          })
        }
      }
      return out;
    },

  },
  data: () => ({
    selectedItem: null as null | SkaniVersion,
  }),
  methods: {
    onChange() {
      this.$emit('input', this.selectedItem);
    }
  },

  mounted() {
    this.selectedItem = this.value;
  }
})
</script>

<style scoped>


</style>
