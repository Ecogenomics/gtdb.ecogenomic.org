<template>
  <v-card flat>
    <v-card-text>

      <!-- Display when the Jobs are loading -->
      <template v-if="areJobsRunning">
        <v-row class="mt-5" no-gutters>
          <v-col>
            <h3>Loading...</h3>
            <p class="mt-2">
              Press the "Refresh" button below to reload the results.
            </p>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-progress-linear
              :value="loadingProgressPct"
              color="#5a6855"
              height="28"
              rounded
            >
              <strong>{{ Math.ceil(loadingProgressPct) }}%</strong>
            </v-progress-linear>
          </v-col>
          <v-col class="pl-5" cols="2">
            <v-btn
              :loading="isManualRefreshLoading || isRefreshQueryStillRunning || isPlotDrawing"
              color="#e2e2e2"
              depressed
              small
              width="100%"
              @click="manualRefresh"
            >
              Refresh
              <v-icon right>
                {{ mdiRefreshSvg }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p>
              <b>Note:</b> Comparisons that are still running will appear filled with dots. Large comparisons will take
              some time (~15
              minutes).
            </p>
          </v-col>
        </v-row>
      </template>

      <!-- Display when the Jobs are done -->
      <template v-else>
        <!-- Row for result text -->
        <v-row>
          <v-col>
            <p>
              All jobs have completed.
            </p>
            <ul>
              <li>GTDB Species representatives are bold.</li>
              <li>To download the raw data see "Tabular results"</li>
              <li>If data are missing let us know, some genomes may have not synchronised with NCBI.</li>
            </ul>
          </v-col>
        </v-row>
        <!-- Row for buttons -->
        <v-row>
          <v-col>
            <v-btn
              :loading="downloadSvgDisabled"
              depressed
              small
              @click="downloadHeatmap"
            >
              Download SVG
              <v-icon right>
                {{ mdiDownloadSvg }}
              </v-icon>
            </v-btn>
            <v-btn
              depressed
              small
              @click="toggleOpenPlotConfiguration"
            >
              Configure
              <v-icon right>
                {{ mdiWrenchSvg }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>


      <!-- Configuration row -->
      <v-expand-transition>
        <v-row v-show="showPlotConfig" class="mt-5">
          <v-card width="100%">
            <v-card-title>
              <v-icon left>
                {{ mdiWrenchSvg }}
              </v-icon>
              Plot configuration
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-select
                    v-model="clusterBy"
                    :items="clusterByOptions"
                    dense
                    label="Cluster by"
                    outlined
                  ></v-select>
                </v-col>
                <v-col>
                  <v-select
                    v-model="showValues"
                    :items="showValuesOptions"
                    dense
                    label="Show values"
                    outlined
                  ></v-select>
                </v-col>
                <v-col>
                  <v-select
                    v-model="decimalPlaces"
                    :items="decimalPlacesOptions"
                    dense
                    label="Show values (decimal places)"
                    outlined
                  ></v-select>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col>
                  <D3ScaleSelect v-model="scalePalette"></D3ScaleSelect>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col class="px-1" cols="1">
                  <v-text-field
                    :value="scaleRange[0]"
                    class="mt-0 pt-0"
                    dense
                    hide-details
                    single-line
                    type="number"
                    @change="$set(scaleRange, 0, $event)"
                  ></v-text-field>
                </v-col>
                <v-col cols="8">
                  <v-range-slider
                    v-model="scaleRange"
                    :max="scaleMax"
                    :min="scaleMin"
                    :step="scaleStep"
                    class="align-center"
                    hide-details
                  ></v-range-slider>
                </v-col>
                <v-col class="px-1" cols="1">
                  <v-text-field
                    :value="scaleRange[1]"
                    class="mt-0 pt-0"
                    dense
                    hide-details
                    single-line
                    style="width: 100px"
                    type="number"
                    @change="$set(scaleRange, 1, $event)"
                  ></v-text-field>
                </v-col>
                <v-col class="px-1" cols="2">
                  <v-btn
                    depressed
                    width="100%"
                    @click="resetScaleToOptimal"
                  >
                    Reset scale
                    <v-icon right>
                      {{ mdiScaleBalanceSvg }}
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-row>
      </v-expand-transition>

      <!-- Row for graph -->
      <v-row class="mt-15">
        <div ref="svgContainer" class="mx-auto" style="max-width: 100%;">
          <svg ref="svgEle" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"
               xmlns:xlink="http://www.w3.org/1999/xlink"></svg>
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
import {FastAniHeatmapDataStatus, FastAniJobHeatmap, FastAniJobHeatmapData} from "~/assets/api/fastani";
import FastAniLogsModal from "~/components/fastani/FastAniLogsModal.vue";
import * as d3 from 'd3v6';
import {isDefined, pickTextColorBasedOnBgColorSimple, saveSvgElement, sleep} from "~/assets/ts/common";
import D3ScaleSelect from "~/components/d3/D3ScaleSelect.vue";


function round(n: number, places: number) {
  return parseFloat(n.toFixed(places));
}

export default Vue.extend({
  props: {
    jobId: Number
  },
  components: {D3ScaleSelect, FastAniLogsModal, HelpTooltip},
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

    scalePalette: "viridis",

    loadingProgressPct: 0,

    showPlotConfig: false,

    downloadSvgDisabled: false,


  }),
  methods: {

    // Load the heatmap data from the API and re-draw
    loadData() {
      if (!isDefined(this.jobId) || this.jobId < 1) {
        return;
      }
      this.$api.fastani.getJobHeatmap(this.jobId, this.clusterBy).then(res => {
        this.drawHeatmap(res.data);
      })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
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

    getRectColour(data: FastAniJobHeatmapData) {
      if (data.status === FastAniHeatmapDataStatus.FINISHED) {
        const rectColour = d3.scaleSequential()
          .interpolator(this.getInterpolator())
          .domain(this.scaleRange);
        if (this.clusterBy === 'ani') {
          return rectColour(data.ani);
        } else {
          return rectColour(data.af);
        }
      } else if (data.status === FastAniHeatmapDataStatus.QUEUED) {
        return "url(#smalldot)";
      } else if (data.status === FastAniHeatmapDataStatus.ERROR) {
        return "url(#whitecarbon)";
      } else {
        return "#fff";
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

    drawHeatmapMethod(heatmapData: FastAniJobHeatmap) {

      // Set the progress
      this.loadingProgressPct = heatmapData.pctDone;

      // HTML elements
      const tooltipEle = this.$refs.tooltipEle as HTMLElement;
      const svgEle = this.$refs.svgEle as HTMLElement;
      const tooltip = d3.select(tooltipEle)
      svgEle.innerHTML = "";

      // D3 data
      const data = heatmapData.data;
      const xValues = heatmapData.xLabels
      const yValues = heatmapData.yLabels
      const xSpecies = heatmapData.xSpecies;
      const ySpecies = heatmapData.ySpecies;
      const spReps = new Set(heatmapData.spReps);

      // Merge the xValues and ySpecies into a single array
      const xSpeciesAxisData = xValues.map((x, i) => {
        return {gid: x, sp: xSpecies[i]}
      });
      const ySpeciesAxisData = yValues.map((x, i) => {
        return {gid: x, sp: ySpecies[i]}
      });

      // Configuration
      const padding = 0.03;
      const rectSize = 35;
      const fontSize = 8;
      const margin = {top: 30, right: 80, bottom: 100, left: 175}
      const width = 300 + xValues.length * rectSize - margin.left - margin.right;
      const height = 100 + yValues.length * rectSize - margin.top - margin.bottom;
      const tickSize = 3;
      const rectRounding = 3;
      const pageXOffset = 130;
      const pageYOffset = 300;

      // Create a colour scale for the species
      const allSpecies = [...new Set(xSpecies.concat(ySpecies))];
      const speciesScale = d3.scaleOrdinal()
        .domain(allSpecies)
        .range(d3.schemeSet2);

      const filterGtEq0 = (x: number) => x >= 0;
      const allAniValues = data.map(d => d.ani).filter(filterGtEq0);
      const allAfValues = data.map(d => d.af).filter(filterGtEq0);

      // Check if any jobs are still queued
      const allStatus = data.map(d => d.status).filter(x => x === FastAniHeatmapDataStatus.QUEUED);
      this.areJobsRunning = allStatus.length > 0;


      // Reset the scale to be the same as the data
      if (this.clusterBy === "ani") {
        this.scaleRange = [Math.min(...allAniValues), Math.max(...allAniValues)]
      } else {
        this.scaleRange = [Math.min(...allAfValues), Math.max(...allAfValues)]
      }
      this.scaleRangeOptimal = this.scaleRange;

      // Create the main SVG object
      const svg = d3.select(svgEle)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // add patterns to svg
      const defs = svg.append('defs')
      defs.append('pattern')
        .attr('id', 'whitecarbon')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 6)
        .attr('height', 6)
        .append('svg:image')
        .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB3aWR0aD0nNicgaGVpZ2h0PSc2Jz4KICA8cmVjdCB3aWR0aD0nNicgaGVpZ2h0PSc2JyBmaWxsPScjZWVlZWVlJy8+CiAgPGcgaWQ9J2MnPgogICAgPHJlY3Qgd2lkdGg9JzMnIGhlaWdodD0nMycgZmlsbD0nI2U2ZTZlNicvPgogICAgPHJlY3QgeT0nMScgd2lkdGg9JzMnIGhlaWdodD0nMicgZmlsbD0nI2Q4ZDhkOCcvPgogIDwvZz4KICA8dXNlIHhsaW5rOmhyZWY9JyNjJyB4PSczJyB5PSczJy8+Cjwvc3ZnPg==')
        .attr("width", 6)
        .attr("height", 6)
        .attr("x", 0)
        .attr("y", 0);
      defs.append('pattern')
        .attr('id', 'smalldot')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 5)
        .attr('height', 5)
        .append('svg:image')
        .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc1JyBoZWlnaHQ9JzUnPgo8cmVjdCB3aWR0aD0nNScgaGVpZ2h0PSc1JyBmaWxsPScjZmZmJy8+CjxyZWN0IHdpZHRoPScxJyBoZWlnaHQ9JzEnIGZpbGw9JyNjY2MnLz4KPC9zdmc+')
        .attr("width", 5)
        .attr("height", 5)
        .attr("x", 0)
        .attr("y", 0);

      // Append a title
      svg.append("text")
        .attr("x", ((width - (margin.left - margin.right) / 2) / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .text(`FastANI ${this.showValues.toUpperCase()} values (clustered by ${this.clusterBy.toUpperCase()})`);

      // Create the X scale
      const xScale = d3.scaleBand()
        .range([0, width])
        .domain(xValues)
        .padding(padding)
        .range([0, xValues.length * rectSize]);


      // Create the Y scale
      const yScale = d3.scaleBand()
        .range([height, 0])
        .domain(yValues)
        .padding(padding)
        .range([0, yValues.length * rectSize]);


      // Create the X axis
      svg.append("g")
        .style("font-size", fontSize)
        .attr("transform", `translate(0, ${yValues.length * rectSize + 17})`)
        .call(d3.axisBottom(xScale).tickSize(tickSize))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-30)")
        .style("font-weight", function (d) {
          //@ts-ignore
          return spReps.has(d) ? "bold" : "normal";
        })

      // Create the Y axis
      svg.append("g")
        .style("font-size", fontSize)
        .attr("transform", `translate(-17, 0)`)
        .call(d3.axisLeft(yScale).tickSize(tickSize))
        .selectAll("text")
        .style("font-weight", function (d) {
          //@ts-ignore
          return spReps.has(d) ? "bold" : "normal";
        })
      // .select(".domain").remove()


      // Add species information to the X axis
      svg.append("g")
        .selectAll()
        //@ts-ignore
        .data(xSpeciesAxisData, d => `${d.gid}~~${d.sp}`)
        .join("rect")
        //@ts-ignore
        .attr("x", function (d) {
          return xScale(d.gid)
        })
        //@ts-ignore
        .attr("y", function (d) {
          return height + 35
        })
        .attr("rx", rectRounding)
        .attr("ry", rectRounding)
        .attr("width", xScale.bandwidth())
        .attr("height", 6)
        //@ts-ignore
        .style("fill", function (d) {
          if (d.sp === 'n/a') {
            return 'white';
          } else {
            return speciesScale(d.sp)
          }
        })
        .on("mouseover", function (d, i) {
          tooltip.style("visibility", "visible")
          d3.select(this).style("stroke", "black")
        })
        .on("mousemove", function (event, d) {
          tooltip
            .html(`${d.sp}`)
            .style("top", `${event.pageY - pageYOffset}px`)
            .style("left", `${event.pageX - pageXOffset}px`);
        })
        .on("mouseleave", function (d, i) {
          tooltip.style("visibility", "hidden")
          d3.select(this).style("stroke", "none")
        })

      // Add species information to the Y axis
      svg.append("g")
        .selectAll()
        //@ts-ignore
        .data(ySpeciesAxisData, d => `${d.gid}~~~${d.sp}`)
        .join("rect")
        //@ts-ignore
        .attr("x", function (d) {
          return -10
        })
        //@ts-ignore
        .attr("y", function (d) {
          return yScale(d.gid)
        })
        .attr("rx", rectRounding)
        .attr("ry", rectRounding)
        .attr("width", 6)
        .attr("height", yScale.bandwidth())
        //@ts-ignore
        .style("fill", function (d) {
          if (d.sp === 'n/a') {
            return 'white';
          } else {
            return speciesScale(d.sp)
          }
        })
        .on("mouseover", function (d, i) {
          tooltip.style("visibility", "visible")
          d3.select(this).style("stroke", "black")
        })
        .on("mousemove", function (event, d) {
          tooltip
            .html(`${d.sp}`)
            .style("top", `${event.pageY - pageYOffset}px`)
            .style("left", `${event.pageX - pageXOffset}px`);
        })
        .on("mouseleave", function (d, i) {
          tooltip.style("visibility", "hidden")
          d3.select(this).style("stroke", "none")
        })

      // add the squares
      svg.append('g')
        .attr('id', 'squares')
        .selectAll()
        //@ts-ignore
        .data(data, d => `${d.x}-${d.y}`)
        .join("rect")
        //@ts-ignore
        .attr("x", function (d) {
          return xScale(xValues[d.x])
        })
        //@ts-ignore
        .attr("y", function (d) {
          return yScale(yValues[d.y])
        })
        .attr("rx", rectRounding)
        .attr("ry", rectRounding)
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        // @ts-ignore
        .style("fill", d => this.getRectColour(d))
        .style("stroke-width", 1)
        .style("stroke", "none")
        .style("opacity", 1)
        .on("mouseover", function (d, i) {
          tooltip.style("visibility", "visible")
          d3.select(this).style("stroke", "black")
        })
        .on("mousemove", function (event, d) {
          tooltip
            //@ts-ignore
            .html(`${xValues[d.x]}<br>${yValues[d.y]}<br>ANI: ${d.ani}<br>AF: ${d.af} (${d.mapped}/${d.total})`)
            .style("top", `${event.pageY - pageYOffset}px`)
            .style("left", `${event.pageX - pageXOffset}px`);
        })
        .on("mouseleave", function (d, i) {
          tooltip.style("visibility", "hidden")
          d3.select(this).style("stroke", "none")
        })


      // Draw the values if required
      if (this.showValues !== 'none') {

        // add the squares
        svg.append("g")
          .attr('id', 'dataValues')
          .selectAll()
          //@ts-ignore
          .data(data, d => `${d.x}-${d.y}`)
          .join("text")
          //@ts-ignore
          .filter(d => d.status === FastAniHeatmapDataStatus.FINISHED)

          //@ts-ignore
          .attr("x", function (d) {
            //@ts-ignore
            return xScale(xValues[d.x]) + xScale.bandwidth() / 2
          })
          //@ts-ignore
          .attr("y", function (d) {
            //@ts-ignore
            return yScale(yValues[d.y]) + yScale.bandwidth() / 2 + 3
          })
          //@ts-ignore
          .text(d => this.showValues === 'ani' ? round(d.ani, this.decimalPlaces) : round(d.af, this.decimalPlaces))
          .style("text-anchor", "middle")
          .style("font-size", "10px")
          .style("fill", (d) => {
            return pickTextColorBasedOnBgColorSimple(this.getRectColour(d), '#FFFFFF', '#000000')
          })

      }
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


    drawHeatmap(heatmapData: FastAniJobHeatmap) {
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
</style>
