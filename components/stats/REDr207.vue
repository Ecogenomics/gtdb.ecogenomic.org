<template>
  <div class="mt-2">
<!--    <h3>Bacteria</h3>-->
<!--    <div id="fig_el730431405688597008165473308651"></div>-->

<!--    <h3>Archaea</h3>-->
<!--    <div id="fig_el729391400845065580326015787637"></div>-->

  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import * as d3 from 'd3v5';
//@ts-ignore
import mpld3 from 'mpld3';

// const archaea = require('~/assets/data/stats/r202/red-archaea.json')
// const bacteria = require('~/assets/data/stats/r202/red-bacteria.json')

export default Vue.extend({
  mounted() {
    // mpld3.draw_figure("fig_el729391400845065580326015787637", archaea);
    // mpld3.draw_figure("fig_el730431405688597008165473308651", bacteria);
  }
})
</script>

<style scoped>

</style>
