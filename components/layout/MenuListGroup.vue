<template>
  <v-list-group
    no-action
  >
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title>{{ text }}</v-list-item-title>
      </v-list-item-content>
    </template>

    <v-list-item
      v-for="(item, index) in items"
      :key="index"
      :href="item.nuxt ? '' : item.to"
      :to="item.nuxt ? item.to : ''"
      :nuxt="item.nuxt"
      link
    >
      <v-list-item-title v-text="item.title"></v-list-item-title>
    </v-list-item>
  </v-list-group>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {MenuItem} from "~/assets/ts/interfaces";

export default Vue.extend({
  name: "MenuListGroup",
  props: {
    text: String,
    items: [] as PropType<MenuItem[]>
  },
  data: () => ({
    menu: false
  }),
})
</script>

<style scoped>
</style>
