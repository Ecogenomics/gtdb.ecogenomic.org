<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      max-width="700"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="#2d8a2d"
          icon
          v-bind="attrs"
          x-small
          v-on="on"
        >
          <v-icon>
            {{ mdiHelpCircleSvg }}
          </v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          NCBI Information
        </v-card-title>

        <v-card-text>
          <div class="pt-3">
            The information on this table has been parsed from the NCBI FTP website.
          </div>
        </v-card-text>

      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mdiHelpCircle} from "@mdi/js";

export default Vue.extend({
  data: () => ({
    mdiHelpCircleSvg: mdiHelpCircle,
    dialog: false
  }),
})
</script>

<style scoped>
</style>
