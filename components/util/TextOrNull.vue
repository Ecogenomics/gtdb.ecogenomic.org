<template>
  <div>
    <template v-if="text == null">
      <v-chip
        color="#e3e3e3"
        small
      >
        n/a
      </v-chip>
    </template>
    <template v-else>
      {{ text }}
    </template>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

export default Vue.extend({
  props: {
    text: {
      type: Object,
      required: false
    },
  },
  mounted() {
    console.log(this.text);

  }
})
</script>

<style scoped>

</style>
