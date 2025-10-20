<template>
  <v-card flat>
    <v-card-text>

      <!-- Row for result text -->
      <v-row>
        <v-col>
          <ul>
            <li>GTDB Species representatives are in bold.</li>
            <li>To download the raw data see "Tabular results"</li>
            <li>If data are missing let us know, some genomes may have not synchronised with NCBI.</li>
          </ul>
        </v-col>
      </v-row>
      <!-- Row for buttons -->
      <v-row>

        <v-dialog
          v-model="showPlotConfig"
          width="800"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              small
              v-bind="attrs"
              v-on="on"
            >
              <v-icon left>
                {{ mdiWrenchSvg }}
              </v-icon>
              Plot customisation
            </v-btn>
          </template>
          <v-card class="w-100" outlined>
            <v-card-title>
              <v-icon left>
                {{ mdiWrenchSvg }}
              </v-icon>
              Plot customisation
            </v-card-title>
            <v-card-text>

              <v-divider></v-divider>

              <v-row class="mt-4" no-gutters>
                <h3>Attributes</h3>
              </v-row>

              <v-row class="mt-2" no-gutters>
                <v-col class="mr-2">
                  <v-text-field
                    v-model="plotWidth"
                    dense
                    hide-details
                    label="Width"
                    outlined
                  />
                </v-col>
                <v-col class="ml-2">
                  <v-text-field
                    v-model="plotHeight"
                    dense
                    hide-details
                    label="Height"
                    outlined
                  />
                </v-col>
              </v-row>

              <v-divider class="my-5"></v-divider>

              <v-row no-gutters>
                <h3>Colour scale</h3>
              </v-row>

              <v-row no-gutters>
                <SkaniColourRangePicker
                  v-model="plotColourScale"
                ></SkaniColourRangePicker>
              </v-row>


              <v-divider></v-divider>

            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :loading="isPlotDrawing"
                depressed
                @click="onPlotCustomisationSave"
              >
                Update plot
              </v-btn>
            </v-card-actions>

          </v-card>
        </v-dialog>
      </v-row>


      <v-divider class="mt-10"></v-divider>

      <!-- Row for graph -->
      <v-row class="mt-4">
        <div class="d-flex mx-auto">

          <div v-if="isPlotDrawing">
            <v-skeleton-loader
              :height="plotHeight"
              :width="plotWidth"
              type="image"
            />
          </div>


          <div id="plotlyContainer"></div>

        </div>
      </v-row>

      <!-- Tooltip -->
      <div ref="tooltipEle" class="tooltipStyle" style="visibility: hidden"></div>
    </v-card-text>
  </v-card>
</template>


<script lang="ts">
import Vue from 'vue';
import HelpTooltip from "~/components/layout/HelpTooltip.vue";
import {
  mdiAlertCircleOutline,
  mdiCogRefresh,
  mdiDownload,
  mdiRefresh,
  mdiScaleBalance,
  mdiSigma,
  mdiSortNumericAscending,
  mdiSortNumericDescending,
  mdiWrench
} from "@mdi/js";
import FastAniLogsModal from "~/components/fastani/FastAniLogsModal.vue";
import * as d3 from 'd3v6';
import {isDefined, isNumeric, pickTextColorBasedOnBgColorSimple, saveSvgElement, sleep} from "~/assets/ts/common";
import D3ScaleSelect from "~/components/d3/D3ScaleSelect.vue";
import {SkaniJobDataHeatmapResponse, SkaniJobHeatmapData} from "~/assets/api/skani";
import {generateHeatmapForSkani, SkaniColourRangePickerOutput} from "~/assets/ts/skani";
import SkaniColourRangePicker from "~/components/skani/SkaniColourRangePicker.vue";
import {axiosErrorToApiMessage} from "~/store/api";


function round(n: number, places: number) {
  return parseFloat(n.toFixed(places));
}

export default Vue.extend({
  props: {
    jobId: String
  },
  components: {SkaniColourRangePicker, D3ScaleSelect, FastAniLogsModal, HelpTooltip},
  data: () => ({
    // Icons
    mdiCogRefreshSvg: mdiCogRefresh,
    mdiDownloadSvg: mdiDownload,
    mdiRefreshSvg: mdiRefresh,
    mdiSigmaSvg: mdiSigma,
    mdiSortNumericDescendingSvg: mdiSortNumericDescending,
    mdiSortNumericAscendingSvg: mdiSortNumericAscending,
    mdiScaleBalanceSvg: mdiScaleBalance,
    mdiWrenchSvg: mdiWrench,

    mdiAlertCircleOutlineSvg: mdiAlertCircleOutline,

    clusterByOptions: [{text: "ANI", value: "ani"}, {text: "AF", value: "af"}],
    clusterBy: "ani",


    // Job refreshing
    areJobsRunning: true,
    isManualRefreshLoading: false,
    isRefreshQueryStillRunning: false,
    isPlotDrawing: true,

    // Vis
    showValuesOptions: [
      {text: "None", value: "none"},
      {text: "ANI", value: 'ani'},
      {text: "AF", value: 'af'}
    ],
    showValues: 'ani',  // null, af, ani

    // Scaling
    scaleMin: 0,
    scaleMax: 100,
    scaleRange: [70, 100],
    scaleStep: 0.01,
    scaleRangeOptimal: [70, 100],

    decimalPlaces: 2,

    scalePalette: "Greens",

    loadingProgressPct: 0,

    showPlotConfig: false,

    downloadSvgDisabled: false,

    plotWidth: 1000,
    plotHeight: 600,

    plotData: null as null | SkaniJobDataHeatmapResponse,

    plotColourScale: [] as SkaniColourRangePickerOutput[]


  }),
  methods: {

    onPlotCustomisationSave() {

      // Sanitise the height and width (cast to int)
      this.plotWidth = isNumeric(this.plotWidth) ? Number(this.plotWidth) : 600;
      this.plotHeight = isNumeric(this.plotHeight) ? Number(this.plotHeight) : 400;

      console.log(this.plotColourScale);

      this.showPlotConfig = false;
      this.drawHeatmapMethodCanvas();
    },

    // Load the heatmap data from the API and re-draw
    loadData() {
      if (this.jobId == null || this.jobId.length !== 8) {
        return;
      }
      this.$api.skani.getJobHeatmap(this.jobId, this.clusterBy).then(res => {
        this.plotData = res.data;
        this.drawHeatmapMethodCanvas();
      })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
          this.$emit('update', true);
        })
        .finally(() => {
          this.isRefreshQueryStillRunning = false;
        });
    },

    // Resets the scale back to the optimal range for this set of data
    resetScaleToOptimal() {
      this.scaleRange = this.scaleRangeOptimal;
    },

    // Do a manual refresh of the data, force the user to wait a few seconds.
    manualRefresh() {
      if (this.isManualRefreshLoading || this.isRefreshQueryStillRunning) {
        return;
      }
      this.isManualRefreshLoading = true;
      this.loadData();
      sleep(5000).finally(() => {
        this.isManualRefreshLoading = false;
      });
    },

    getInterpolator() {
      if (this.scalePalette === "plasma") {
        return d3.interpolatePlasma;
      } else if (this.scalePalette === "inferno") {
        return d3.interpolateInferno;
      } else if (this.scalePalette === "magma") {
        return d3.interpolateMagma;
      } else if (this.scalePalette === "cividis") {
        return d3.interpolateCividis;
      } else if (this.scalePalette === "BrBg") {
        return d3.interpolateBrBG;
      } else if (this.scalePalette === "PRGn") {
        return d3.interpolatePRGn;
      } else if (this.scalePalette === "PiYG") {
        return d3.interpolatePiYG;
      } else if (this.scalePalette === "PuOr") {
        return d3.interpolatePuOr;
      } else if (this.scalePalette === "RdBu") {
        return d3.interpolateRdBu;
      } else if (this.scalePalette === "RdGy") {
        return d3.interpolateRdGy;
      } else if (this.scalePalette === "RdYlBu") {
        return d3.interpolateRdYlBu;
      } else if (this.scalePalette === "RdYlGn") {
        return d3.interpolateRdYlGn;
      } else if (this.scalePalette === "Spectral") {
        return d3.interpolateSpectral;
      } else if (this.scalePalette === "Blues") {
        return d3.interpolateBlues;
      } else if (this.scalePalette === "Greens") {
        return d3.interpolateGreens;
      } else if (this.scalePalette === "Greys") {
        return d3.interpolateGreys;
      } else if (this.scalePalette === "Oranges") {
        return d3.interpolateOranges;
      } else if (this.scalePalette === "Purples") {
        return d3.interpolatePurples;
      } else if (this.scalePalette === "Reds") {
        return d3.interpolateReds;
      } else {
        return d3.interpolateViridis;
      }
    },

    getRectColour(data: SkaniJobHeatmapData) {

      const rectColour = d3.scaleSequential()
        .interpolator(this.getInterpolator())
        .domain(this.scaleRange);
      if (this.clusterBy === 'ani') {
        return rectColour(data.ani);
      } else {
        return rectColour(data.af);
      }

    },

    updateHeatmapScale() {
      const svgEle = this.$refs.svgEle as HTMLElement;
      const svg = d3.select(svgEle)
      svg.selectAll("#squares rect")
        // @ts-ignore
        .style("fill", d => this.getRectColour(d))
      this.updateHeatmapTextColours();
    },

    updateHeatmapTextColours() {
      const svgEle = this.$refs.svgEle as HTMLElement;
      const svg = d3.select(svgEle)
      svg.selectAll("#dataValues text")
        .style("fill", (d) => {
          //@ts-ignore
          return pickTextColorBasedOnBgColorSimple(this.getRectColour(d), '#FFFFFF', '#000000')
        })
    },

    drawHeatmapMethodCanvas() {
      if (this.plotData == null) {
        return;
      }
      this.isPlotDrawing = true;
      const data = generateHeatmapForSkani(this.plotData, this.plotWidth, this.plotHeight, this.plotColourScale);

      data.layout!.title = {
        text: `skani ${this.showValues.toUpperCase()} values (clustered by ${this.clusterBy.toUpperCase()})`,
        x: 0.5,
        xanchor: 'center',
        yanchor: 'top',
      }

      this.$Plotly.newPlot('plotlyContainer', data.data, data.layout, data.config);

      this.isPlotDrawing = false;


    },

    drawHeatmapMethodNew(heatmapData: SkaniJobDataHeatmapResponse) {
      //
      // // CONFIGURATION
      // const sizeTitleHeight = 30;  // height of the title
      // const sizeAxisLabels = 100;  // height/width of the axis labels
      // const sizeSpeciesInfo = 10;  // width/height of the species info bars
      // const sizeCell = 35;  // size of each heatmap cell
      // const cellPadding = 0.03; // padding between each cell (as a fraction of the cell size)
      // const tickSize = 3;
      // const fontSize = 8;
      // const cellRounding = 3; // rounding of the cell corner
      //
      // // HTML elements
      // const tooltipEle = this.$refs.tooltipEle as HTMLElement;
      // const svgEle = this.$refs.svgEle as HTMLElement;
      // const tooltip = d3.select(tooltipEle)
      // svgEle.innerHTML = "";
      //
      // // D3 data
      // const data = heatmapData.data;
      // const xValues = heatmapData.xLabels
      // const yValues = heatmapData.yLabels
      // const xSpecies = heatmapData.xSpecies;
      // const ySpecies = heatmapData.ySpecies;
      // const spReps = new Set(heatmapData.spReps);
      //
      // // Map the xValues and ySpecies into a single array
      // const xSpeciesAxisData = xValues.map((x, i) => {
      //   return {gid: x, sp: xSpecies[i]}
      // });
      // const ySpeciesAxisData = yValues.map((x, i) => {
      //   return {gid: x, sp: ySpecies[i]}
      // });
      //
      // // Computed values
      // const width = sizeAxisLabels + sizeSpeciesInfo + (xValues.length * sizeCell);
      // const height = sizeTitleHeight + sizeAxisLabels + sizeSpeciesInfo + (yValues.length * sizeCell);
      //
      // // Create the main SVG object
      // const svg = d3.select(svgEle)
      //   .attr("width", width)
      //   .attr("height", height)
      //   .attr("viewBox", `0 0 ${width} ${height}`)
      //   .append("g");
      //
      // // Create groups for elements
      // const heatmapGroup = svg.append('g');
      // const yAxisGroup = svg.append('g');
      // const xAxisGroup = svg.append('g');
      //
      //
      // // Create clipping groups for zooming content
      // // const defs = svg.append("defs")
      // //
      // // defs.append("clipPath")
      // //   .attr("id", "yAxisLabelsClip")
      // //   .append("rect")
      // //   .attr("x", 0)
      // //   .attr("y", sizeTitleHeight)
      // //   .attr("width", sizeAxisLabels)
      // //   .attr("height", yValues.length * sizeCell);
      //
      // // Create debugging regions
      // // Title
      // svg.append("rect")
      //   .attr("x", 0)
      //   .attr("y", 0)
      //   .attr("width", width)
      //   .attr("height", sizeTitleHeight)
      //   .style("fill", "#FF00FF")
      //   .style("opacity", 0.2);
      //
      // // Y axis labels (genome ids)
      // svg.append("rect")
      //   .attr("x", 0)
      //   .attr("y", sizeTitleHeight)
      //   .attr("width", sizeAxisLabels)
      //   .attr("height", yValues.length * sizeCell)
      //   .style("fill", "#00FFFF")
      //   .style("opacity", 0.2);
      //
      // // Y axis species info
      // svg.append("rect")
      //   .attr("x", sizeAxisLabels)
      //   .attr("y", sizeTitleHeight)
      //   .attr("width", sizeSpeciesInfo)
      //   .attr("height", yValues.length * sizeCell)
      //   .style("fill", "#FFA500")
      //   .style("opacity", 0.2);
      //
      // // X axis labels (genome ids)
      // svg.append("rect")
      //   .attr("x", sizeAxisLabels + sizeSpeciesInfo)
      //   .attr("y", sizeTitleHeight + sizeSpeciesInfo + yValues.length * sizeCell)
      //   .attr("width", xValues.length * sizeCell)
      //   .attr("height", sizeAxisLabels)
      //   .style("fill", "#FFFF00")
      //   .style("opacity", 0.2);
      //
      // // X axis species info
      // svg.append("rect")
      //   .attr("x", sizeAxisLabels + sizeSpeciesInfo)
      //   .attr("y", sizeTitleHeight + yValues.length * sizeCell)
      //   .attr("width", xValues.length * sizeCell)
      //   .attr("height", sizeSpeciesInfo)
      //   .style("fill", "#00FF00")
      //   .style("opacity", 0.2);
      //
      // // END OF DEBUGGING RECTANGLES
      //
      // // Create the X scale
      // const xScale = d3.scaleBand()
      //   .range([0, width])
      //   .domain(xValues)
      //   .padding(cellPadding)
      //   .range([
      //     sizeAxisLabels + sizeSpeciesInfo, // x start
      //     sizeAxisLabels + sizeSpeciesInfo + xValues.length * sizeCell  // x end
      //   ]);
      //
      // // Create the Y scale
      // const yScale = d3.scaleBand()
      //   .range([height, 0])
      //   .domain(yValues)
      //   .padding(cellPadding)
      //   .range([
      //     sizeTitleHeight,
      //     sizeTitleHeight + yValues.length * sizeCell
      //   ]);
      //
      // // Create the X axis
      // const xAxis = xAxisGroup.append("g")
      //   .style("font-size", fontSize)
      //   .attr("transform", `translate(0, ${yValues.length * sizeCell + sizeTitleHeight + sizeSpeciesInfo})`)
      //   .call(d3.axisBottom(xScale).tickSize(tickSize))
      //   .selectAll("text")
      //   .style("text-anchor", "end")
      //   .attr("transform", "rotate(-30)")
      //   .style("font-weight", function (d) {
      //     //@ts-ignore
      //     return spReps.has(d) ? "bold" : "normal";
      //   })
      //
      // // Create the Y axis
      // const yAxis = yAxisGroup.append("g")
      //   // .attr('clip-path', 'url(#yAxisLabelsClip)')
      //   .style("font-size", fontSize)
      //   .attr("transform", `translate(${sizeAxisLabels}, 0)`)
      //   .call(d3.axisLeft(yScale).tickSize(tickSize))
      //   .selectAll("text")
      //   .style("font-weight", function (d) {
      //     //@ts-ignore
      //     return spReps.has(d) ? "bold" : "normal";
      //   })
      //
      //
      // // add the squares
      //
      // const cells = heatmapGroup.append('g')
      //   .attr('id', 'squares')
      //   .selectAll()
      //   //@ts-ignore
      //   .data(data, d => `${d.x}-${d.y}`)
      //   .join("rect")
      //   //@ts-ignore
      //   .attr("x", function (d) {
      //     return xScale(xValues[d.x])
      //   })
      //   //@ts-ignore
      //   .attr("y", function (d) {
      //     return yScale(yValues[d.y])
      //   })
      //   .attr("rx", cellRounding)
      //   .attr("ry", cellRounding)
      //   .attr("width", xScale.bandwidth())
      //   .attr("height", yScale.bandwidth())
      //   // @ts-ignore
      //   .style("fill", d => this.getRectColour(d))
      //   .style("stroke-width", 1)
      //   .style("stroke", "none")
      //   .style("opacity", 1)
      //   .on("mouseover", function (d, i) {
      //     tooltip.style("visibility", "visible")
      //     d3.select(this).style("stroke", "black")
      //   })
      //   .on("mousemove", function (event, d) {
      //     tooltip
      //       //@ts-ignore
      //       .html(`Ref: ${xValues[d.x]}<br>Qry: ${yValues[d.y]}<br>ANI: ${d.ani}<br>AF: ${d.af}`)
      //       .style("top", `${event.pageY - pageYOffset}px`)
      //       .style("left", `${event.pageX - pageXOffset}px`);
      //   })
      //   .on("mouseleave", function (d, i) {
      //     tooltip.style("visibility", "hidden")
      //     d3.select(this).style("stroke", "none")
      //   })
      //
      //
      // // Draw the values if required
      // if (this.showValues !== 'none') {
      //   heatmapGroup.append("g")
      //     .attr('id', 'dataValues')
      //     .selectAll()
      //     //@ts-ignore
      //     .data(data, d => `${d.x}-${d.y}`)
      //     .join("text")
      //
      //     //@ts-ignore
      //     .attr("x", function (d) {
      //       //@ts-ignore
      //       return xScale(xValues[d.x]) + xScale.bandwidth() / 2
      //     })
      //     //@ts-ignore
      //     .attr("y", function (d) {
      //       //@ts-ignore
      //       return yScale(yValues[d.y]) + yScale.bandwidth() / 2 + 3
      //     })
      //     //@ts-ignore
      //     .text(d => this.showValues === 'ani' ? round(d.ani, this.decimalPlaces) : round(d.af, this.decimalPlaces))
      //     .style("text-anchor", "middle")
      //     .style("font-size", "10px")
      //     .style("fill", (d) => {
      //       return pickTextColorBasedOnBgColorSimple(this.getRectColour(d), '#FFFFFF', '#000000')
      //     })
      // }
      //
      // // Create an empty rectangle that will cover the entire plot, used for zooming
      // svg.append("rect")
      //   .attr("x", 0)
      //   .attr("y", 0)
      //   .attr("width", width)
      //   .attr("height", height)
      //   .style("fill", "none")
      //   .style("pointer-events", "all")
      //   .lower();
      //
      // // Create the zoom handler
      // const zoom = d3.zoom()
      //   .scaleExtent([1, Infinity])
      //   .translateExtent([
      //     [0, 0],
      //     [width, height]
      //   ])
      //   .extent([
      //     [0, 0],
      //     [width, height]
      //   ])
      //   .on("zoom", onZoom);
      // svg.call(zoom as any);
      //
      // function onZoom(e: any) {
      //   const t = e.transform;
      //
      //   // Scale the cells
      //   heatmapGroup.attr("transform", t);
      //
      //
      //   yAxisGroup.attr("transform", d3.zoomIdentity.translate(sizeAxisLabels / t.k, sizeAxisLabels / t.k).scale(t.k).toString());
      //   // yAxisGroup.selectAll("text").attr("transform", `scale(${1 / t.k})`);
      //   // yAxisGroup.selectAll("line").attr("transform", `scale(${1 / t.k})`);
      //
      //   // Rescale the x and y scales (CANNOT DO)
      //   // const newX = t.rescaleX(xScale);
      //   // const newY = t.rescaleY(yScale);
      //
      //   // Update axes
      //   // xAxis.call(d3.axisBottom(newX).tickSize(tickSize));
      //   // yAxis.call(d3.axisLeft(newY).tickSize(tickSize));
      //
      //
      //   // Update heatmap cells
      //   // cells.selectAll("rect")
      //   //   .attr("x", (d: any) => newX(d.x))
      //   //   .attr("y", (d: any) => newY(d.y))
      //   //   .attr("width", newX.bandwidth())
      //   //   .attr("height", newY.bandwidth());
      //
      //   // TODO: Only zoom on the heatmap cells
      //   // yAxis.attr("transform", d3.zoomIdentity.translate(0, t.y).scale(t.k).toString());
      //   // yAxis.selectAll("text").attr("transform",d3.zoomIdentity.scale(1/t.k).toString());
      //   // yAxis.selectAll("line").attr("transform",d3.zoomIdentity.scale(1/t.k).toString());
      //   // svg.attr("transform", t);
      // }

    },


    // The main method for drawing the heatmap
    drawHeatmapMethod(heatmapData: SkaniJobDataHeatmapResponse) {
      return

      // // HTML elements
      // const tooltipEle = this.$refs.tooltipEle as HTMLElement;
      // const svgEle = this.$refs.svgEle as HTMLElement;
      // const tooltip = d3.select(tooltipEle)
      // svgEle.innerHTML = "";
      //
      // // D3 data
      // const data = heatmapData.data;
      // const xValues = heatmapData.xLabels
      // const yValues = heatmapData.yLabels
      // const xSpecies = heatmapData.xSpecies;
      // const ySpecies = heatmapData.ySpecies;
      // const spReps = new Set(heatmapData.spReps);
      //
      // // Map the xValues and ySpecies into a single array
      // const xSpeciesAxisData = xValues.map((x, i) => {
      //   return {gid: x, sp: xSpecies[i]}
      // });
      // const ySpeciesAxisData = yValues.map((x, i) => {
      //   return {gid: x, sp: ySpecies[i]}
      // });
      //
      // /*
      // Configuration
      // |              title
      // |axis|gid|sp|cell|
      //             | sp |
      //             | gid|
      //             |axis
      //  */
      //
      // const padding = 0.03;
      // const rectSize = 35;  // the size of each square
      // const fontSize = 8;
      // const margin = {top: 30, right: 80, bottom: 100, left: 175}
      // const width = 300 + xValues.length * rectSize - margin.left - margin.right;
      // const height = 100 + yValues.length * rectSize - margin.top - margin.bottom;
      // const totalWidth = width + margin.left + margin.right;
      // const totalHeight = height + margin.top + margin.bottom;
      // const tickSize = 3;
      // const rectRounding = 3;
      // const pageXOffset = 130;
      // const pageYOffset = 300;
      //
      //
      // // Create a colour scale for the species
      // const allSpecies = [...new Set(xSpecies.concat(ySpecies))];
      // const speciesScale = d3.scaleOrdinal()
      //   .domain(allSpecies)
      //   .range(d3.schemeSet2);
      //
      // const filterGtEq0 = (x: number) => x >= 0;
      // const allAniValues = data.map(d => d.ani).filter(filterGtEq0);
      // const allAfValues = data.map(d => d.af).filter(filterGtEq0);
      //
      // // Reset the scale to be the same as the data
      // if (this.clusterBy === "ani") {
      //   this.scaleRange = [Math.min(...allAniValues), Math.max(...allAniValues)]
      // } else {
      //   this.scaleRange = [Math.min(...allAfValues), Math.max(...allAfValues)]
      // }
      // this.scaleRangeOptimal = this.scaleRange;
      //
      // // Create the main SVG object
      // const svg = d3.select(svgEle)
      //   .attr("width", totalWidth)
      //   .attr("height", totalHeight)
      //   .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
      //   .append("g")
      //   .attr("transform", `translate(${margin.left}, ${margin.top})`);
      //
      // // add patterns to svg
      // const defs = svg.append('defs')
      // defs.append('pattern')
      //   .attr('id', 'whitecarbon')
      //   .attr('patternUnits', 'userSpaceOnUse')
      //   .attr('width', 6)
      //   .attr('height', 6)
      //   .append('svg:image')
      //   .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB3aWR0aD0nNicgaGVpZ2h0PSc2Jz4KICA8cmVjdCB3aWR0aD0nNicgaGVpZ2h0PSc2JyBmaWxsPScjZWVlZWVlJy8+CiAgPGcgaWQ9J2MnPgogICAgPHJlY3Qgd2lkdGg9JzMnIGhlaWdodD0nMycgZmlsbD0nI2U2ZTZlNicvPgogICAgPHJlY3QgeT0nMScgd2lkdGg9JzMnIGhlaWdodD0nMicgZmlsbD0nI2Q4ZDhkOCcvPgogIDwvZz4KICA8dXNlIHhsaW5rOmhyZWY9JyNjJyB4PSczJyB5PSczJy8+Cjwvc3ZnPg==')
      //   .attr("width", 6)
      //   .attr("height", 6)
      //   .attr("x", 0)
      //   .attr("y", 0);
      // defs.append('pattern')
      //   .attr('id', 'smalldot')
      //   .attr('patternUnits', 'userSpaceOnUse')
      //   .attr('width', 5)
      //   .attr('height', 5)
      //   .append('svg:image')
      //   .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1JyBoZWlnaHQ9JzUnPgo8cmVjdCB3aWR0aD0nNScgaGVpZ2h0PSc1JyBmaWxsPScjZmZmJy8+CjxyZWN0IHdpZHRoPScxJyBoZWlnaHQ9JzEnIGZpbGw9JyNjY2MnLz4KPC9zdmc+')
      //   .attr("width", 5)
      //   .attr("height", 5)
      //   .attr("x", 0)
      //   .attr("y", 0);
      //
      // // Append a title
      // svg.append("text")
      //   .attr("x", ((width - (margin.left - margin.right) / 2) / 2))
      //   .attr("y", 0 - (margin.top / 2))
      //   .attr("text-anchor", "middle")
      //   .style("font-size", "14px")
      //   .style("font-weight", "600")
      //   .text(`skani ${this.showValues.toUpperCase()} values (clustered by ${this.clusterBy.toUpperCase()})`);
      //
      // // Create the X axis label:
      // svg.append("text")
      //   .attr("x", (width / 2))
      //   .attr("y", height + margin.bottom - 40)
      //   .attr("text-anchor", "middle")
      //   .style("font-size", "12px")
      //   .style("font-weight", "600")
      //
      // // Create the Y axis label:
      // svg.append("text")
      //   .attr("text-anchor", "middle")
      //   .attr("transform", `translate(${-margin.left + 20}, ${height / 2})rotate(-90)`)
      //   .style("font-size", "12px")
      //   .style("font-weight", "600")
      //
      // // Create the X scale
      // const xScale = d3.scaleBand()
      //   .range([0, width])
      //   .domain(xValues)
      //   .padding(padding)
      //   .range([0, xValues.length * rectSize]);
      //
      // // Create the Y scale
      // const yScale = d3.scaleBand()
      //   .range([height, 0])
      //   .domain(yValues)
      //   .padding(padding)
      //   .range([0, yValues.length * rectSize]);
      //
      // // Create the X axis
      // const xAxis = svg.append("g")
      //   .style("font-size", fontSize)
      //   .attr("transform", `translate(0, ${yValues.length * rectSize + 17})`)
      //   .call(d3.axisBottom(xScale).tickSize(tickSize))
      //   .selectAll("text")
      //   .style("text-anchor", "end")
      //   .attr("transform", "rotate(-30)")
      //   .style("font-weight", function (d) {
      //     //@ts-ignore
      //     return spReps.has(d) ? "bold" : "normal";
      //   })
      //
      // // Create the Y axis
      // const yAxis = svg.append("g")
      //   .style("font-size", fontSize)
      //   .attr("transform", `translate(-17, 0)`)
      //   .call(d3.axisLeft(yScale).tickSize(tickSize))
      //   .selectAll("text")
      //   .style("font-weight", function (d) {
      //     //@ts-ignore
      //     return spReps.has(d) ? "bold" : "normal";
      //   })
      // // .select(".domain").remove()
      //
      // // Add species information to the X axis
      // const xSpeciesAxis = svg.append("g")
      //   .selectAll()
      //   //@ts-ignore
      //   .data(xSpeciesAxisData, d => `${d.gid}~~${d.sp}`)
      //   .join("rect")
      //   //@ts-ignore
      //   .attr("x", function (d) {
      //     return xScale(d.gid)
      //   })
      //   //@ts-ignore
      //   .attr("y", function (d) {
      //     return height + 35
      //   })
      //   .attr("rx", rectRounding)
      //   .attr("ry", rectRounding)
      //   .attr("width", xScale.bandwidth())
      //   .attr("height", 6)
      //   //@ts-ignore
      //   .style("fill", function (d) {
      //     if (d.sp === 'n/a') {
      //       return 'white';
      //     } else {
      //       return speciesScale(d.sp)
      //     }
      //   })
      //   .on("mouseover", function (d, i) {
      //     tooltip.style("visibility", "visible")
      //     d3.select(this).style("stroke", "black")
      //   })
      //   .on("mousemove", function (event, d) {
      //     tooltip
      //       .html(`${d.sp}`)
      //       .style("top", `${event.pageY - pageYOffset}px`)
      //       .style("left", `${event.pageX - pageXOffset}px`);
      //   })
      //   .on("mouseleave", function (d, i) {
      //     tooltip.style("visibility", "hidden")
      //     d3.select(this).style("stroke", "none")
      //   })
      //
      // // Add species information to the Y axis
      // const ySpeciesAxis = svg.append("g")
      //   .selectAll()
      //   //@ts-ignore
      //   .data(ySpeciesAxisData, d => `${d.gid}~~~${d.sp}`)
      //   .join("rect")
      //   //@ts-ignore
      //   .attr("x", function (d) {
      //     return -10
      //   })
      //   //@ts-ignore
      //   .attr("y", function (d) {
      //     return yScale(d.gid)
      //   })
      //   .attr("rx", rectRounding)
      //   .attr("ry", rectRounding)
      //   .attr("width", 6)
      //   .attr("height", yScale.bandwidth())
      //   //@ts-ignore
      //   .style("fill", function (d) {
      //     if (d.sp === 'n/a') {
      //       return 'white';
      //     } else {
      //       return speciesScale(d.sp)
      //     }
      //   })
      //   .on("mouseover", function (d, i) {
      //     tooltip.style("visibility", "visible")
      //     d3.select(this).style("stroke", "black")
      //   })
      //   .on("mousemove", function (event, d) {
      //     tooltip
      //       .html(`${d.sp}`)
      //       .style("top", `${event.pageY - pageYOffset}px`)
      //       .style("left", `${event.pageX - pageXOffset}px`);
      //   })
      //   .on("mouseleave", function (d, i) {
      //     tooltip.style("visibility", "hidden")
      //     d3.select(this).style("stroke", "none")
      //   })
      //
      // // add the squares
      // const cells = svg.append('g')
      //   .attr('id', 'squares')
      //   .selectAll()
      //   //@ts-ignore
      //   .data(data, d => `${d.x}-${d.y}`)
      //   .join("rect")
      //   //@ts-ignore
      //   .attr("x", function (d) {
      //     return xScale(xValues[d.x])
      //   })
      //   //@ts-ignore
      //   .attr("y", function (d) {
      //     return yScale(yValues[d.y])
      //   })
      //   .attr("rx", rectRounding)
      //   .attr("ry", rectRounding)
      //   .attr("width", xScale.bandwidth())
      //   .attr("height", yScale.bandwidth())
      //   // @ts-ignore
      //   .style("fill", d => this.getRectColour(d))
      //   .style("stroke-width", 1)
      //   .style("stroke", "none")
      //   .style("opacity", 1)
      //   .on("mouseover", function (d, i) {
      //     tooltip.style("visibility", "visible")
      //     d3.select(this).style("stroke", "black")
      //   })
      //   .on("mousemove", function (event, d) {
      //     tooltip
      //       //@ts-ignore
      //       .html(`Ref: ${xValues[d.x]}<br>Qry: ${yValues[d.y]}<br>ANI: ${d.ani}<br>AF: ${d.af}`)
      //       .style("top", `${event.pageY - pageYOffset}px`)
      //       .style("left", `${event.pageX - pageXOffset}px`);
      //   })
      //   .on("mouseleave", function (d, i) {
      //     tooltip.style("visibility", "hidden")
      //     d3.select(this).style("stroke", "none")
      //   })
      //
      //
      // // Draw the values if required
      // if (this.showValues !== 'none') {
      //   svg.append("g")
      //     .attr('id', 'dataValues')
      //     .selectAll()
      //     //@ts-ignore
      //     .data(data, d => `${d.x}-${d.y}`)
      //     .join("text")
      //
      //     //@ts-ignore
      //     .attr("x", function (d) {
      //       //@ts-ignore
      //       return xScale(xValues[d.x]) + xScale.bandwidth() / 2
      //     })
      //     //@ts-ignore
      //     .attr("y", function (d) {
      //       //@ts-ignore
      //       return yScale(yValues[d.y]) + yScale.bandwidth() / 2 + 3
      //     })
      //     //@ts-ignore
      //     .text(d => this.showValues === 'ani' ? round(d.ani, this.decimalPlaces) : round(d.af, this.decimalPlaces))
      //     .style("text-anchor", "middle")
      //     .style("font-size", "10px")
      //     .style("fill", (d) => {
      //       return pickTextColorBasedOnBgColorSimple(this.getRectColour(d), '#FFFFFF', '#000000')
      //     })
      // }
      //

    },


    downloadHeatmap() {
      if (this.downloadSvgDisabled) {
        return;
      }
      this.downloadSvgDisabled = true;
      const svgEle = this.$refs.svgEle as HTMLElement;
      saveSvgElement(svgEle, 'heatmap.svg')
      sleep(2500).finally(() => {
        this.downloadSvgDisabled = false;
      });
    },


    drawHeatmap(heatmapData: SkaniJobDataHeatmapResponse) {
      try {
        this.isPlotDrawing = true;
        this.drawHeatmapMethod(heatmapData)
      } finally {
        this.isPlotDrawing = false;
      }
    },

    setScale() {
      this.scaleStep = 1 / Math.pow(10, this.decimalPlaces)
    },

    toggleOpenPlotConfiguration() {
      this.showPlotConfig = !this.showPlotConfig
      sleep(100).finally(() => {
        this.$vuetify.goTo(document.body.scrollHeight, {
          duration: 500,
          easing: 'easeInOutCubic'
        });
      })
    },

  },

  watch: {
    // When the job id parameter changes, load
    jobId(after, before) {
      if (isDefined(after) && after !== before) {
        this.loadData()
        this.showPlotConfig = false;
      }
    },
    clusterBy(after, before) {
      if (isDefined(after) && after !== before) {
        if (after === 'ani') {
          this.scaleMin = 0;
          this.scaleMax = 100;
          this.scaleRange = [70, 100];
        } else {
          this.scaleMin = 0;
          this.scaleMax = 1;
          this.scaleRange = [0, 1];
        }
        this.setScale();
        this.loadData()
      }
    },
    scaleRange(after, before) {
      if (isDefined(after) && after !== before) {
        this.updateHeatmapScale()
      }
    },
    scalePalette(after, before) {
      if (isDefined(after) && after !== before) {
        this.updateHeatmapScale()
      }
    },
    showValues(after, before) {
      if (isDefined(after) && after !== before) {
        if (after === 'af' && this.decimalPlaces == 0) {
          this.decimalPlaces = 2;
        }
        this.loadData()
      }
    },
    decimalPlaces(after, before) {
      if (isDefined(after) && after !== before) {
        this.setScale();
        this.loadData()
      }
    },
  },
  mounted() {
    this.loadData()
  },
  computed: {
    decimalPlacesOptions() {
      if (this.showValues == 'af') {
        return [1, 2, 3, 4];
      } else {
        return [0, 1, 2, 3, 4];
      }
    },
  },
})
</script>
<style scoped>
.tooltipStyle {
  position: absolute;
  z-index: 10;
  font: 10px sans-serif;
  font-weight: bold;
  border: black solid 1px;
  border-radius: 5px;
  background: #FFFFFF;
  padding: 5px;
}
</style>

<style>
/* Set the progress bar text colour to be white */
.v-progress-linear__content {
  color: white !important;
}


.plot-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

#plotlyContainer {
  width: 100%;
  height: 100%;
}

/* Override loading for skeleton */
.v-skeleton-loader:has(.v-skeleton-loader__image) {
  height: 150px;
  overflow: hidden;
}

.v-skeleton-loader__image {
  height: inherit;
  min-height: inherit;
  max-height: inherit;
}

</style>
