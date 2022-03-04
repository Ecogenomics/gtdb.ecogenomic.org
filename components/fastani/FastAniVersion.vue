<template>
  <v-chip-group
    v-model="value"
    column
    mandatory
    @change="onChange"
  >
    <template v-for="ver in versions">
      <v-chip
        filter
        outlined
      >
        {{ ver }}
      </v-chip>
    </template>
  </v-chip-group>
</template>

<script>
export default {
  data: () => ({
    value: '1.33',
    versions: ['1.33', '1.32', '1.31', '1.3', '1.2', '1.1', '1.0'],
  }),
  methods: {
    onChange() {
      this.$emit('input', this.versions[this.value]);
    }
  }
}
</script>

<style scoped>

</style>
