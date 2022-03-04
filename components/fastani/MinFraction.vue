<template>
  <div>
    <v-slider
      v-model="value"
      :max="max"
      :min="min"
      class="align-center"
      hide-details
      step="0.1"
      @input="onChange"
      label="Minimum alignment fraction"
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
  </div>
</template>

<script>
export default {
  data: () => ({
    value: 0.2,
    min: 0,
    max: 1
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
