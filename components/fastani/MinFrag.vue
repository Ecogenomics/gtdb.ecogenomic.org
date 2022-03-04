<template>
  <v-text-field
    v-model="value"
    type="number"
    @input="onChange"
    label="Minimum aligned fragments"
  ></v-text-field>
</template>

<script>
export default {
  data: () => ({
    value: 3000,
  }),
  methods: {
    onChange() {
      this.$emit('input', this.value);
    }
  }
}
</script>

<style scoped>

</style>
