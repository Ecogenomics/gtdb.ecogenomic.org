<template>
  <div class="mt-2">
    <h3>Bacteria</h3>
    <div id="fig_el19001406310551926967170213038"></div>

    <h3>Archaea</h3>
    <div id="fig_el1832140480597119608954246934"></div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import * as d3 from 'd3v5';
//@ts-ignore
import mpld3 from 'mpld3';

const archaea = require('~/assets/data/stats/r95/red-archaea.json')
const bacteria = require('~/assets/data/stats/r95/red-bacteria.json')

export default Vue.extend({
  mounted() {
    mpld3.draw_figure("fig_el1832140480597119608954246934", archaea);
    mpld3.draw_figure("fig_el19001406310551926967170213038", bacteria);
  }
})
</script>

<style scoped>

</style>
