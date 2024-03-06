<template>
  <v-dialog
    v-model="showDialog"
    width="700"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="disabled"
        class="white--text"
        color="#5a6855"
        depressed
        small
        v-bind="attrs"
        @click="showDialog"
        v-on="on"
      >
        <v-icon left>
          {{ priorityQueueSvg }}
        </v-icon>
        Priority queue
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 white--text" style="background-color: #5a6855">
        <v-icon dark left>
          {{ priorityQueueSvg }}
        </v-icon>
        Priority queue
      </v-card-title>

      <v-card-text>
        <div class="mt-4">
          If you have been given the priority queue secret key, enter it below:
        </div>
        <v-text-field
          v-model="fastAniPriorityQueueSecret"
          class="mt-5"
          label="Priority queue secret key"
          outlined
        />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="savePriorityQueueModal"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import FastAniVersion from "~/components/fastani/FastAniVersion.vue";
import {mdiExclamation} from "@mdi/js";

export default Vue.extend({
  components: {FastAniVersion},
  props: {
    input: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    priorityQueueSvg: mdiExclamation,
    showDialog: false,
    modalFastAniPriorityQueueVisible: false,
    fastAniPriorityQueueSecret: '',
    fastAniPriorityQueueCookieName: 'fastAniPriorityQueueSecret',
  }),

  methods: {
    // Save the priority queue modal and set the cookie
    savePriorityQueueModal() {
      this.showDialog = false;
      this.$cookies.set(this.fastAniPriorityQueueCookieName, this.fastAniPriorityQueueSecret, {
        path: '/',
        maxAge: 31536000, // 1 year
        sameSite: true,
      });
      this.$emit('input', this.fastAniPriorityQueueSecret);
    },

  },

  mounted() {
    // Load the priority queue (if the cookie is present)
    const fastAniPriorityQCookie = this.$cookies.get(this.fastAniPriorityQueueCookieName);
    if (fastAniPriorityQCookie) {
      this.fastAniPriorityQueueSecret = fastAniPriorityQCookie;
      this.$emit('input', this.fastAniPriorityQueueSecret);
    }
  }

})
</script>

<style scoped>
</style>
