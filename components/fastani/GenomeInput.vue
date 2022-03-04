<template>
  <v-textarea
    v-model="value"
    auto-grow
    hint="e.g. GCA_123456789.1"
    label="Comparison group"
    @input="onChange"
  ></v-textarea>
</template>

<script>
export default {
  data: () => ({
    value: ''
  }),
  methods: {
    onChange() {
      this.$emit('input', this.value);
    },
  }
}
</script>

<style scoped>

</style>
