<template>
  <v-slider
    v-model="value"
    :max="max"
    :min="min"
    :thumb-size="24"
    step="1"
    thumb-label="always"
    @input="onChange"
    label="k-mer size"
  >
    <template v-slot:append>
      <v-text-field
        v-model="value"
        class="mt-0 pt-0"
        hide-details
        single-line
        style="width: 60px"
        type="number"
      ></v-text-field>
    </template>
  </v-slider>
</template>

<script>
export default {
  props: {
    min: Number,
    max: Number,
  },
  data: () => ({
    value: 16,
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
