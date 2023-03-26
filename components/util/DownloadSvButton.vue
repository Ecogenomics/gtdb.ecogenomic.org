<template>
  <v-tooltip open-delay="150" top transition="slide-x-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :loading="loading"
        elevation="0"
        small
        v-bind="attrs"
        @click="buttonClicked"
        :disabled="disabled"
        v-on="on"
      >
        <template v-if="type === 'csv'">
          csv
          <v-icon right>
            {{ mdiFileDelimitedSvg }}
          </v-icon>
        </template>
        <template v-else>
          tsv
          <v-icon right>
            {{ mdiKeyboardTabSvg }}
          </v-icon>
        </template>
      </v-btn>
    </template>
    <span v-if="type === 'csv'">
      Download results in comma-separated format
    </span>
    <span v-else>
      Download results in tab-separated format
    </span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue';
import {mdiFileDelimited, mdiKeyboardTab} from '@mdi/js';
import {sleep} from "~/assets/ts/common";

export default Vue.extend({
  props: {
    type: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data: () => ({
    mdiFileDelimitedSvg: mdiFileDelimited,
    mdiKeyboardTabSvg: mdiKeyboardTab,
    loading: false,
  }),
  methods: {
    buttonClicked() {
      this.loading = true;
      this.$emit('click');
      sleep(2000).then(() => {
        this.loading = false;
      });
    },
  }
})
</script>

<style scoped>

</style>
