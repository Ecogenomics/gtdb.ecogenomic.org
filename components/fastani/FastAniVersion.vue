<template>
  <v-chip-group
    v-model="selectedVersion"
    column
    mandatory
    @change="onChange"
  >
    <template v-for="ver in versions">
      <v-chip
        :key="ver"
        :value="ver"
        filter
        outlined
      >
        {{ ver }}
      </v-chip>
    </template>
  </v-chip-group>
</template>


<script lang="ts">
import Vue from "vue";
import {isDefined} from "~/assets/ts/common";

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '1.33'
    }
  },
  data: () => ({
    selectedVersion: '1.33',
    versions: ['1.33', '1.32', '1.31', '1.3', '1.2', '1.1', '1.0'],
  }),
  methods: {
    onChange() {
      this.$emit('input', this.selectedVersion);
    }
  },
  mounted() {
    if (isDefined(this.value)) {
      this.selectedVersion = this.value;
    }
  }
})
</script>

<style scoped>

</style>
