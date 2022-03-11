<template>
  <v-dialog
    v-model="dialog"
    scrollable
    max-width="70%"
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
            <span class="text-h6 black--text">
              <v-icon left>
                {{ mdiConsoleSvg }}
              </v-icon>
              Command</span>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <code>
              {{ cmd !== null && cmd.length > 0 ? cmd : 'n/a' }}
            </code>
          </v-row>
        </div>

        <div class="mt-2 pa-2 rounded bordered">
          <v-row no-gutters>
            <v-icon left>
              {{ mdiScriptTextOutlineSvg }}
            </v-icon>
            <span class="text-h6 black--text">stdout</span>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <code style="white-space: pre;">{{ stdout !== null && stdout.length > 0 ? stdout : 'n/a' }}</code>
          </v-row>
        </div>

        <div class="mt-2 pa-2 rounded bordered">
          <v-row no-gutters>
            <span class="text-h6 black--text">
                   <v-icon left>
              {{ mdiScriptTextOutlineSvg }}
            </v-icon>
              stderr</span>
          </v-row>
          <v-row class="mt-1" no-gutters>
            <code style="white-space: pre;">{{ stderr !== null && stderr.length > 0 ? stderr : 'n/a' }}</code>
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
import {mdiConsole, mdiHelpCircle, mdiScriptTextOutline} from "@mdi/js";

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
    cmd: {
      type: String,
      default: null,
    }
  },
  data: () => ({
    dialog: false,

    mdiHelpCircleSvg: mdiHelpCircle,
    mdiConsoleSvg: mdiConsole,
    mdiScriptTextOutlineSvg: mdiScriptTextOutline,
  }),

}
</script>

<style scoped>
.bordered {
  border: #d9d9d9 1px solid;;
}
</style>
