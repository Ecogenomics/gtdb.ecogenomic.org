<template>
  <v-btn
    :href="nuxt ? '' : href"
    :nuxt="nuxt"
    :ripple="false"
    :to="nuxt ? href : ''"
    class="menu-btn-style"
    color="transparent"
    dark
    depressed
    small
    active-class=""
    v-bind="attrs"
    v-on="on"
  >
    {{ text }}
    <v-icon
      v-if="icon"
      right
      color="#9e9e9e"
    >
      {{ icon }}
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: "MenuButton",
  props: {
    text: String,
    icon: String,
    href: String,
    nuxt: Boolean,
    attrs: Object,
    on: Object
  },
  data: () => ({
    menu: false
  }),
})
</script>

<style scoped>
.menu-btn-style {
  text-transform: none;
  font-size: 0.875rem !important;
  letter-spacing: normal;
}

.v-btn--active::before, .v-btn:focus::before {
  opacity: 0 !important;
}

</style>
