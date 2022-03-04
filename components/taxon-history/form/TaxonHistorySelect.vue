<template>
  <v-select
    v-model="input"
    :items="items"
    dense
    :label="label"
    outlined
    style="max-width: 200px;"
  ></v-select>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

export default Vue.extend({
  props: {
    label: {
      type: String
    },
    items: {
      type: Array as PropType<VSelectItem[]>
    },
    value: {
      type: String
    }
  },
  computed: {
    input: {
      get(): string {
        return this.value
      },
      set(value: string) {
        this.$emit('input', value)
      }
    }
  },
})
</script>

<style scoped>

</style>
