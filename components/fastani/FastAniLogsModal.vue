<template>
  <v-dialog
    v-model="dialog"
    max-width="700"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="blue"
        icon
        small
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>
          {{ mdiHelpCircleSvg }}
        </v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        FastANI logs
      </v-card-title>

      <v-card-text>

        <div class="mt-2 pa-2 rounded bordered">
          <v-row no-gutters>
            <span class="text-h6 black--text">stdout</span>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <code>
              {{ stdout !== null ? stdout : 'n/a' }}
            </code>
          </v-row>
        </div>

        <div class="mt-2 pa-2 rounded bordered">
          <v-row no-gutters>
            <span class="text-h6 black--text">stderr</span>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <code>
              {{ stderr !== null ? stderr : 'n/a' }}
            </code>
          </v-row>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mdiHelpCircle} from "@mdi/js";

export default {
  props: {
    stdout: {
      type: String,
      default: null,
    },
    stderr: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    dialog: false,

    mdiHelpCircleSvg: mdiHelpCircle,
  }),

}
</script>

<style scoped>
.bordered {
  border: #d9d9d9 1px solid;;
}
</style>
