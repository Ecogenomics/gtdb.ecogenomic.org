<template>
  <v-select
    v-model="model"
    :items="scalePaletteOptions"
    dense
    label="Palette"
    outlined
  >
    <template v-slot:selection="{ item, index }">
      {{ item.text }}
    </template>
    <template v-slot:item="{ item }">
      <v-row no-gutters>
        <v-col cols="1" style="vertical-align: middle">
          {{ item.text }}
        </v-col>
        <v-col>
          <template v-if="item.value === 'cividis'">
            <img :alt="item.value" src="~/assets/images/d3-scale/cividis.png"/>
          </template>
          <template v-else-if="item.value === 'inferno'">
            <img :alt="item.value" src="~/assets/images/d3-scale/inferno.png"/>
          </template>
          <template v-else-if="item.value === 'magma'">
            <img :alt="item.value" src="~/assets/images/d3-scale/magma.png"/>
          </template>
          <template v-else-if="item.value === 'plasma'">
            <img :alt="item.value" src="~/assets/images/d3-scale/plasma.png"/>
          </template>
          <template v-else-if="item.value === 'BrBg'">
            <img :alt="item.value" src="~/assets/images/d3-scale/BrBg.png"/>
          </template>
          <template v-else-if="item.value === 'PRGn'">
            <img :alt="item.value" src="~/assets/images/d3-scale/PRGn.png"/>
          </template>
          <template v-else-if="item.value === 'PiYG'">
            <img :alt="item.value" src="~/assets/images/d3-scale/PiYG.png"/>
          </template>
          <template v-else-if="item.value === 'PuOr'">
            <img :alt="item.value" src="~/assets/images/d3-scale/PuOr.png"/>
          </template>
          <template v-else-if="item.value === 'RdBu'">
            <img :alt="item.value" src="~/assets/images/d3-scale/RdBu.png"/>
          </template>
          <template v-else-if="item.value === 'RdGy'">
            <img :alt="item.value" src="~/assets/images/d3-scale/RdGy.png"/>
          </template>
          <template v-else-if="item.value === 'RdYlBu'">
            <img :alt="item.value" src="~/assets/images/d3-scale/RdYlBu.png"/>
          </template>
          <template v-else-if="item.value === 'RdYlGn'">
            <img :alt="item.value" src="~/assets/images/d3-scale/RdYlGn.png"/>
          </template>
          <template v-else-if="item.value === 'Spectral'">
            <img :alt="item.value" src="~/assets/images/d3-scale/Spectral.png"/>
          </template>
          <template v-else-if="item.value === 'Blues'">
            <img :alt="item.value" src="~/assets/images/d3-scale/Blues.png"/>
          </template>
          <template v-else-if="item.value === 'Greens'">
            <img :alt="item.value" src="~/assets/images/d3-scale/Greens.png"/>
          </template>
          <template v-else-if="item.value === 'Greys'">
            <img :alt="item.value" src="~/assets/images/d3-scale/Greys.png"/>
          </template>
          <template v-else-if="item.value === 'Oranges'">
            <img :alt="item.value" src="~/assets/images/d3-scale/Oranges.png"/>
          </template>
          <template v-else-if="item.value === 'Purples'">
            <img :alt="item.value" src="~/assets/images/d3-scale/Purples.png"/>
          </template>
          <template v-else-if="item.value === 'Reds'">
            <img :alt="item.value" src="~/assets/images/d3-scale/Reds.png"/>
          </template>
          <template v-else>
            <img :alt="item.value" src="~/assets/images/d3-scale/viridis.png"/>
          </template>
        </v-col>
      </v-row>
    </template>
  </v-select>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: 'Greens',
    },
  },
  data: () => ({
    scalePaletteOptions: [
      {header: "Sequential (Multi-Hue)"},
      {text: "Viridis", value: "viridis"},
      {text: "Plasma", value: "plasma"},
      {text: "Inferno", value: "inferno"},
      {text: "Magma", value: "magma"},
      {text: "Cividis", value: "cividis"},
      {header: "Diverging"},
      {text: "BrBg", value: "BrBg"},
      {text: "PRGn", value: "PRGn"},
      {text: "PiYG", value: "PiYG"},
      {text: "PuOr", value: "PuOr"},
      {text: "RdBu", value: "RdBu"},
      {text: "RdGy", value: "RdGy"},
      {text: "RdYlBu", value: "RdYlBu"},
      {text: "RdYlGn", value: "RdYlGn"},
      {text: "Spectral", value: "Spectral"},
      {header: "Sequential (Single-Hue)"},
      {text: "Blues", value: "Blues"},
      {text: "Greens", value: "Greens"},
      {text: "Greys", value: "Greys"},
      {text: "Oranges", value: "Oranges"},
      {text: "Purples", value: "Purples"},
      {text: "Reds", value: "Reds"},
    ],
    scalePalette: "Greens",
  }),

  computed: {
    // Listen to / update the bound model
    model: {
      get(): string {
        return this.value;
      },
      set(value: string) {
        this.$emit('input', value);
      },
    },

  },
  methods: {}
})
</script>
