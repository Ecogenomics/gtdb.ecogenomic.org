<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <MenuButton
        :attrs="attrs"
        :icon="mdiMenuDownSvg"
        :on="on"
        :text="text"
      />
    </template>
    <v-list
      class="gtdb-list"
      color="#c3e3c2"
      dense
    >
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        :href="item.nuxt ? '' : item.to"
        :nuxt="item.nuxt"
        :to="item.nuxt ? item.to : ''"
        dense
        link
      >
        <v-list-item-title style="font-weight: 400; font-size: 0.875rem;">
          {{ item.title }}
          <v-icon v-if="item.external" small>{{ mdiOpenInNewSvg }}</v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {MenuItem} from "~/assets/ts/interfaces";
import MenuButton from "~/components/layout/MenuButton.vue";
import {mdiMenuDown, mdiOpenInNew} from "@mdi/js";


export default Vue.extend({
  name: "MenuDropdown",
  components: {MenuButton},
  props: {
    text: String,
    items: [] as PropType<MenuItem[]>
  },
  data: () => ({
    menu: false,
    mdiMenuDownSvg: mdiMenuDown,
    mdiOpenInNewSvg: mdiOpenInNew
  }),
})
</script>

<style scoped>
.gtdb-list .v-list-item--dense {
  min-height: 35px;
}

.gtdb-list .theme--light.v-list-item:hover::before {
  opacity: 0.2;
}
</style>
