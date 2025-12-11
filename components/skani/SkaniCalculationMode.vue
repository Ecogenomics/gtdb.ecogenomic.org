<template>
  <v-select
    v-model="selectedItem"
    :items="calculationMode"
    dense
    label="Calculation mode"
    outlined
    @input="onChange"
  ></v-select>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {SkaniCalculationMode} from "~/assets/api/skani";


export default Vue.extend({
  props: {
    disabled: Boolean,
    value: String as PropType<SkaniCalculationMode>,
  },
  watch: {
    value(val) {
      if (val != null) {
        this.selectedItem = val;
      }
    }
  },
  computed: {},
  data: () => ({
    selectedItem: SkaniCalculationMode.QVR,
    calculationMode: [{ text: 'Query vs Reference', value: SkaniCalculationMode.QVR}, { text: 'All vs All', value: SkaniCalculationMode.TRIANGLE}],
  }),
  methods: {
    onChange() {
      this.$emit('input', this.selectedItem);
    }
  },
})
</script>

<style scoped>


</style>
