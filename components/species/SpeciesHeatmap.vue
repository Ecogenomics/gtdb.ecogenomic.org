<!--<template>-->
<!--  <v-row no-gutters>-->
<!--    <v-col>-->
<!--      <div ref="d3container" style="max-width: 1500px;">-->
<!--      </div>-->
<!--    </v-col>-->
<!--    <v-col>-->
<!--      <div ref="d3tooltip" class="heatmapTooltip">-->
<!--        <v-simple-table dense>-->
<!--          <tbody>-->
<!--          <tr>-->
<!--            <td class="gtdb-green-bg-table first-table-col">Query</td>-->
<!--            <td><span ref="d3tooltip_q"></span></td>-->
<!--          </tr>-->
<!--          <tr>-->
<!--            <td class="gtdb-green-bg-table first-table-col">Reference</td>-->
<!--            <td><span ref="d3tooltip_r"></span></td>-->
<!--          </tr>-->
<!--          <tr>-->
<!--            <td class="gtdb-green-bg-table first-table-col">ANI (%)</td>-->
<!--            <td><span ref="d3tooltip_ani"></span></td>-->
<!--          </tr>-->
<!--          <tr>-->
<!--            <td class="gtdb-green-bg-table first-table-col">Number of fragments</td>-->
<!--            <td><span ref="d3tooltip_n_frag"></span></td>-->
<!--          </tr>-->
<!--          <tr>-->
<!--            <td class="gtdb-green-bg-table first-table-col">Total number of fragments</td>-->
<!--            <td><span ref="d3tooltip_frag_tot"></span></td>-->
<!--          </tr>-->
<!--          <tr>-->
<!--            <td class="gtdb-green-bg-table first-table-col">Alignment Fraction</td>-->
<!--            <td><span ref="d3tooltip_af"></span></td>-->
<!--          </tr>-->
<!--          </tbody>-->
<!--        </v-simple-table>-->
<!--      </div>-->
<!--    </v-col>-->
<!--  </v-row>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import Vue from 'vue'-->
<!--import * as d3 from 'd3v6';-->
<!--import {SpeciesHeatmap} from "~/assets/api/species";-->

<!--export default Vue.extend({-->

<!--  props: {-->
<!--    species: {-->
<!--      type: String,-->
<!--      required: true-->
<!--    },-->
<!--  },-->

<!--  data: () => ({-->
<!--    heatmapData: {} as SpeciesHeatmap,-->
<!--  }),-->

<!--  methods: {-->

<!--    loadDataAndDraw() {-->
<!--      this.$api.species.getSpeciesHeatmap(`s__${this.species}`).then(response => {-->
<!--        this.heatmapData = response.data;-->
<!--        this.createPlot();-->
<!--      })-->
<!--        .catch((err) => {-->
<!--          this.$accessor.api.defaultCatch(err);-->
<!--        })-->
<!--    },-->

<!--    createPlot() {-->
<!--      const d3container = this.$refs.d3container as HTMLElement;-->
<!--      const d3tooltip = this.$refs.d3tooltip as HTMLElement;-->
<!--      const d3tooltipQ = this.$refs.d3tooltip_q as HTMLElement;-->
<!--      const d3tooltipR = this.$refs.d3tooltip_r as HTMLElement;-->
<!--      const d3tooltipAni = this.$refs.d3tooltip_ani as HTMLElement;-->
<!--      const d3tooltipNFrag = this.$refs.d3tooltip_n_frag as HTMLElement;-->
<!--      const d3tooltipFragTot = this.$refs.d3tooltip_frag_tot as HTMLElement;-->
<!--      const d3tooltipAf = this.$refs.d3tooltip_af as HTMLElement;-->

<!--      // set the dimensions and margins of the graph-->
<!--      const margin = {top: 30, right: 30, bottom: 30, left: 30},-->
<!--        width = 500 - margin.left - margin.right,-->
<!--        height = 500 - margin.top - margin.bottom;-->

<!--      // append the svg object to the body of the page-->
<!--      const svg = d3.select(d3container)-->
<!--        .append("svg")-->
<!--        // .attr("width", width + margin.left + margin.right)-->
<!--        // .attr("height", height + margin.top + margin.bottom)-->
<!--        .attr("preserveAspectRatio", "xMidYMid meet")-->
<!--        .attr("viewBox", "-100 -100 600 600")-->
<!--        .append("g")-->
<!--      // .attr("transform", `translate(${margin.left},${margin.top})`);-->

<!--      // Labels of row and columns-->
<!--      const myGroups = this.heatmapData.xLabels;-->
<!--      const myVars = this.heatmapData.yLabels;-->

<!--      const gtdbRep = this.heatmapData.gtdbRep;-->


<!--      // Build X scales and axis:-->
<!--      const x = d3.scaleBand()-->
<!--        .range([0, width])-->
<!--        .domain(myGroups)-->
<!--        .padding(0.01);-->
<!--      svg.append("g")-->
<!--        .attr("transform", `translate(0, ${height})`)-->
<!--        .call(d3.axisBottom(x))-->

<!--        // Rotate 90 degrees left-->
<!--        .selectAll("text")-->
<!--        .style("text-anchor", "end")-->
<!--        .attr("dx", "-10px")-->
<!--        .attr("dy", "-5.5px")-->
<!--        .attr("transform", "rotate(-90)")-->
<!--        //@ts-ignore-->
<!--        .attr("class", function (d) {-->
<!--          if (d === gtdbRep) {-->
<!--            return "textGtdbRep"-->
<!--          }-->
<!--        });-->


<!--      // Build Y scales and axis:-->
<!--      const y = d3.scaleBand()-->
<!--        .range([height, 0])-->
<!--        .domain(myVars)-->
<!--        .padding(0.01);-->
<!--      svg.append("g")-->
<!--        .call(d3.axisLeft(y))-->

<!--        .selectAll("text")-->
<!--        //@ts-ignore-->
<!--        .attr("class", function (d) {-->
<!--          if (d === gtdbRep) {-->
<!--            return "textGtdbRep"-->
<!--          }-->
<!--        })-->
<!--      ;-->

<!--      // Build color scale-->
<!--      let minValue = 100;-->
<!--      const maxValue = 100;-->
<!--      this.heatmapData.data.forEach((row) => {-->
<!--        minValue = Math.min(minValue, row[2]);-->
<!--      })-->
<!--      const myColor = d3.scaleLinear()-->
<!--        //@ts-ignore-->
<!--        .domain([minValue, maxValue])-->

<!--      const colorFunc = (t: number) => {-->
<!--        return d3.interpolateViridis(myColor(t))-->
<!--      }-->

<!--      // create a tooltip-->
<!--      const tooltip = d3.select(d3tooltip)-->
<!--      const tooltipQ = d3.select(d3tooltipQ)-->
<!--      const tooltipR = d3.select(d3tooltipR)-->
<!--      const tooltipAni = d3.select(d3tooltipAni)-->
<!--      const tooltipNFrag = d3.select(d3tooltipNFrag)-->
<!--      const tooltipFragTot = d3.select(d3tooltipFragTot)-->
<!--      const tooltipAf = d3.select(d3tooltipAf)-->

<!--      // Three function that change the tooltip when user hover / move / leave a cell-->
<!--      //@ts-ignore-->
<!--      const mouseover = function (event, d) {-->
<!--        tooltip-->
<!--          .transition()-->
<!--          .duration(200)-->
<!--        tooltip-->
<!--          .style("opacity", 1);-->

<!--        //@ts-ignore-->
<!--        tooltipQ.html(function () {-->
<!--          if (d[0] === gtdbRep) {-->
<!--            return `${d[0]} *`-->
<!--          } else {-->
<!--            return d[0]-->
<!--          }-->
<!--        });-->

<!--        tooltipR.html(function () {-->
<!--          if (d[1] === gtdbRep) {-->
<!--            return `${d[1]} *`-->
<!--          } else {-->
<!--            return d[1]-->
<!--          }-->
<!--        });-->

<!--        tooltipAni.html(d[2]);-->
<!--        tooltipNFrag.html(d[3]);-->
<!--        tooltipFragTot.html(d[4]);-->
<!--        tooltipAf.html((d[3] / d[4]).toFixed(4));-->

<!--      }-->
<!--      //@ts-ignore-->
<!--      const mouseleave = function (d) {-->
<!--        tooltip-->
<!--          .transition()-->
<!--          .duration(200)-->
<!--          .style("opacity", 0)-->
<!--      }-->

<!--      // add the squares-->
<!--      svg.selectAll()-->
<!--        //@ts-ignore-->
<!--        .data(this.heatmapData.data, function (d) {-->
<!--          //@ts-ignore-->
<!--          return `${d[0]}:${d[1]}`-->
<!--        })-->
<!--        .enter()-->
<!--        .append("rect")-->
<!--        .attr('class', 'heatmapBox')-->
<!--        .attr("rx", 2)-->
<!--        .attr("ry", 2)-->
<!--        //@ts-ignore-->
<!--        .attr("x", function (d) {-->
<!--          //@ts-ignore-->
<!--          return x(d[1])-->
<!--        })-->
<!--        //@ts-ignore-->
<!--        .attr("y", function (d) {-->
<!--          //@ts-ignore-->
<!--          return y(d[0])-->
<!--        })-->
<!--        .attr("width", x.bandwidth())-->
<!--        .attr("height", y.bandwidth())-->
<!--        .style("fill", function (d) {-->
<!--          //@ts-ignore-->
<!--          if (d[0] === d[1]) {-->
<!--            return 'rgb(220,220,220)'-->
<!--          } else {-->
<!--            return colorFunc(d[2])-->
<!--          }-->
<!--        })-->
<!--        .on("mouseover", mouseover)-->
<!--        .on("mouseleave", mouseleave)-->


<!--    }-->
<!--  },-->

<!--  mounted() {-->
<!--    this.loadDataAndDraw();-->
<!--  }-->
<!--})-->
<!--</script>-->

<!--<style>-->
<!--.heatmapBox {-->
<!--  stroke-width: 1px;-->
<!--  stroke: white;-->
<!--}-->

<!--.heatmapBox:hover {-->
<!--  stroke: black;-->
<!--}-->

<!--.heatmapTooltip {-->
<!--  opacity: 0;-->
<!--  background-color: #2d8a2d;-->
<!--}-->

<!--.textGtdbRep {-->
<!--  font-weight: 700;-->
<!--}-->
<!--</style>-->
