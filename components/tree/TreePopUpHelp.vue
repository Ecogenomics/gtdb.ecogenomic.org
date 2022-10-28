<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      max-width="700"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="#9e93ca"
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
          Taxon suffix counts
        </v-card-title>

        <v-card-text>
          <div class="pt-3">
            <p>
              Note that taxon ranks above genus with an alphabetical suffix are not included in the counts.
            </p>
            <p>
              For more information, see the
              <nuxt-link to="faq#why-do-some-family-and-higher-rank-names-end-with-an-alphabetic-suffix">FAQ</nuxt-link>.
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
