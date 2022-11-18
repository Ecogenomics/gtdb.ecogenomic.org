<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      max-width="700"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="#cfad46"
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
          Bergey's Manual
        </v-card-title>

        <v-card-text>
          <div class="pt-3">
            <p>
              Bergey's Manual of Systematic of Archaea and Bacteria requires a license for access,
              check with your institution if you are unable to view the content.
            </p>
            <p>
              A best effort has been made to ensure that all taxa in Bergey's Manual are mapped to their corresponding
              GTDB taxon. Please <nuxt-link to="contact">contact us</nuxt-link> if you notice any mistakes.
            </p>
            <p>
              For more information, see: <a href="https://www.bergeys.org/publications/#archea-bacteria" target="_blank">Bergey's Manual</a>.
            </p>
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
