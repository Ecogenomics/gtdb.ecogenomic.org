<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="disabled"
        class="white--text"
        color="#5a6855"
        depressed
        small
        v-bind="attrs"
        v-on="on"
      >
        Filter to rank <span v-if="model">({{ model.substring(0, 1) }})</span>
        <v-icon right>
          {{ mdiFilterSvg }}
        </v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        link
        @click="model = item.value"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import {mdiFilter} from "@mdi/js";

export default Vue.extend({
  props: {
    value: {
      type: String,
    },
    disabled: Boolean,
  },
  computed: {
    // Listen to / update the bound model
    model: {
      get(): string {
        return this.value;
      },
      set(value: string) {
        this.$emit('input', value);
      },
    }
  },
  data: () => ({
    // Icons
    mdiFilterSvg: mdiFilter,

    // Filter options
    items: [
      {title: 'Domain', value: 'd__'},
      {title: 'Phylum', value: 'p__'},
      {title: 'Class', value: 'c__'},
      {title: 'Order', value: 'o__'},
      {title: 'Family', value: 'f__'},
      {title: 'Genus', value: 'g__'},
      {title: 'Species', value: 's__'}
    ],
  }),
})
</script>

<style scoped>

</style>
