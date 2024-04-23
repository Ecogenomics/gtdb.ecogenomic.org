<template>
  <div class="mt-2">
    <h3>Bacteria</h3>
    <div id="mpld3_bacteria_r214"></div>

    <h3>Archaea</h3>
    <div id="mpld3_archaea_r214"></div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import * as d3 from 'd3v5';
//@ts-ignore
import mpld3 from 'mpld3';

const archaea = require('~/assets/data/stats/r214/red-archaea.json')
const bacteria = require('~/assets/data/stats/r214/red-bacteria.json')

export default Vue.extend({
  mounted() {

    mpld3.register_plugin("axisreplacer", AxisReplacer);
    AxisReplacer.prototype = Object.create(mpld3.Plugin.prototype);
    AxisReplacer.prototype.constructor = AxisReplacer;
    AxisReplacer.prototype.requiredProps = ["data"];
    AxisReplacer.prototype.defaultProps = {}
    // @ts-ignore
    function AxisReplacer(fig, props){
      // @ts-ignore
      mpld3.Plugin.call(this, fig, props);
    }

    AxisReplacer.prototype.draw = function(){
      let data = this.props.data;
      let parent = document.getElementsByClassName("mpld3-yaxis")[0];
      let gTicks = parent.getElementsByTagName("g");
      for (let i=0; i < gTicks.length; i++) {
        let curTick = gTicks[i];
        let curText = curTick.getElementsByTagName("text")[0];
        curText.innerHTML = data[i];
      }
    };

    // @ts-ignore
    mpld3.draw_figure("mpld3_archaea_r214", archaea);
    mpld3.draw_figure("mpld3_bacteria_r214", bacteria);
  }
})
</script>

<style scoped>

</style>
