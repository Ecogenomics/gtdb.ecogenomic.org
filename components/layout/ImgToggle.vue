<template>
  <v-dialog
    v-model="dialog"
    max-width="70vw"
    width="100%"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-img
        :lazy-src="preview"
        :max-width="previewMaxWidth"
        :src="full"
        :width="previewWidth"
        class="img-toggle"
        v-bind="attrs"
        v-on="on"
      ></v-img>
    </template>

    <v-card>
      <v-card-text>
        <v-img
          :lazy-src="preview"
          :src="full"
          contain
          height="100%"
          max-height="80vh"
          width="100%"
          max-width="80vw"
          class="mx-auto"
        ></v-img>
      </v-card-text>
      <v-card-actions  style="background-color: #efefef">
        <a
          :href="full"
          style="font-size: 14px;"
          target="_blank">
          View
        </a>
        <v-btn
          :href="full"
          class="mr-0 ml-auto"
          download
          outlined
          small
        >
          Download
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    full: String,
    preview: String,
    previewWidth: String,
    previewMaxWidth: String,
  },
  data: () => ({
    dialog: false,
  }),
})
</script>

<style scoped>
.img-toggle {
  cursor: pointer;
}
</style>
