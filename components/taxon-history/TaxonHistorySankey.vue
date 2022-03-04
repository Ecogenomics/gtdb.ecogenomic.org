<template>
  <div>

    <!-- First row above Sankey -->
    <div class="d-flex">

      <!-- Download button -->
      <v-btn
        :disabled="isSankeyRunning || !hasData"
        color="#5a6855"
        depressed
        small
        style="color: #FFFFFF"
        @click="saveSankeyAsSvg"
      >
        Download
        <v-icon
          right
        >
          {{ mdiFileDownloadSvg }}
        </v-icon>
      </v-btn>

      <!-- Filter to specific rank -->
      <div class="ml-3">
        <TaxonHistoryFilterToRankSelect
          v-model="filterToRank"
          :disabled="isSankeyRunning || !hasData"
        />
      </div>

      <!-- Help modal -->
      <div class="ml-3">
        <TaxonHistoryHelpModal/>
      </div>

    </div>

    <!-- Main content of sankey -->
    <div class="mt-5">

      <!-- Show the skeleton loader when the query is running -->
      <div
        v-if="isSankeyRunning"
        class="d-flex rounded-xl v-skeleton-loader"
        style="min-height: 450px; background-color: #efefef; cursor: progress;"
      >
        <v-progress-circular
          :size="100"
          class="mx-auto my-auto"
          indeterminate
        ></v-progress-circular>
      </div>

      <!-- Show the result -->
      <div
        v-show="!isSankeyRunning"
        ref="sankeyContainer"
      ></div>

      <!-- If the sankey isn't running and there is no data, show a warning -->
      <div
        v-if="!isSankeyRunning && !hasData"
        class="rounded-lg pa-5 d-flex flex-row flex-shrink-1"
        style="background-color: #fdc8c8; max-width: 650px; border: #ffacac solid 1px;"
      >
        <div class="d-flex flex-column my-auto">
          <v-icon color="#af1111" size="35">
            {{ mdiAlertOctagonSvg }}
          </v-icon>
        </div>
        <div class="d-flex flex-column ml-5">
          Unable to generate diagram, try expanding the "from" and "to" ranges.<br>
          It is likely that {{ search.taxon }} appears in a release outside of the selected range.
        </div>
      </div>

    </div>

    <!-- Absolute positioned tooltip that follows the cursor around -->
    <div ref="sankeyTooltip" class="d3tooltip"></div>

    <!-- The tabular results -->
    <v-divider class="my-5"></v-divider>
    <h2>Tabular results</h2>
    <TaxonHistorySankeyTable
      :loading="isSankeyRunning"
      :rows="sankeyDataAsTable"
      class="mt-2"
    />

  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {SankeySearchRequest, SankeySearchResponse} from "~/assets/api/sankey";

import * as d3 from 'd3v5';
//@ts-ignore
import * as d3sankey from "d3-sankey";
import TaxonHistoryHelpModal from "~/components/taxon-history/TaxonHistoryHelpModal.vue";
import {mdiAlertOctagon, mdiFileDownload} from "@mdi/js";
import {saveSvgElement} from "~/assets/ts/common";
import TaxonHistoryFilterToRankSelect from "~/components/taxon-history/TaxonHistoryFilterToRankSelect.vue";
import {TaxonHistoryRelease, TaxonHistorySankeyModel, TaxonHistorySearch} from "~/assets/models/taxon-history";
import TaxonHistorySankeyTable from "~/components/taxon-history/TaxonHistorySankeyTable.vue";

function highlightNodeId(arrId: number[], doHighlight: boolean) {
  if (doHighlight) {
    arrId.forEach(function (id) {
      d3.select("#node-" + id).transition().style("fill", "#5a6855");
    });
  } else {
    arrId.forEach(function (id) {
      d3.select("#node-" + id).transition().style("fill", "#AAAAAA");
    });
  }
}

function highlightLinkId(arrId: number[], doHighlight: boolean) {
  if (doHighlight) {
    arrId.forEach(function (id) {
      d3.select("#link-" + id).transition().style("stroke-opacity", 0.7).style("stroke", "#ffc942");
    });
  } else {
    arrId.forEach(function (id) {
      d3.select("#link-" + id).transition().style("stroke-opacity", 0.2).style("stroke", "#AAAAAA");
    });
  }
}

export default Vue.extend({
  components: {TaxonHistoryFilterToRankSelect, TaxonHistoryHelpModal, TaxonHistorySankeyTable},
  props: {

    // The model to communicate with the parent
    value: {
      type: Object as PropType<TaxonHistorySankeyModel>,
      required: true
    },

    // The read only search query from the parent
    search: {
      type: Object as PropType<TaxonHistorySearch>,
      required: true
    }

  },
  data: () => ({
    // Images
    mdiFileDownloadSvg: mdiFileDownload,
    mdiAlertOctagonSvg: mdiAlertOctagon,

    // True if the Sankey API call is running
    isSankeyRunning: false,

    // The data retrieved from the API
    sankeyData: {} as SankeySearchResponse,
  }),
  watch: {
    // If either the parent search, or the filter to rank changes, we need to re-run the Sankey
    search: {
      handler() {
        this.runQuery();
      },
      deep: true,
    },
    value: {
      handler() {
        this.runQuery();
      },
      deep: true,
    },
  },
  computed: {
    // Returns True if the sankey api call is running, False otherwise
    filterToRank: {
      get(): string {
        return this.value.filterToRank
      },
      set(val: string) {
        const model = Object.assign({}, this.value);
        model.filterToRank = val;
        this.$emit('input', model)
      }
    },

    hasData(): boolean {
      return this.sankeyData && this.sankeyData.nodes && this.sankeyData.nodes.length > 0;
    },

    // Convert the sankey data into a table format
    sankeyDataAsTable() {
      const out = [] as any[];
      if (this.sankeyData.links) {
        this.sankeyData.links.forEach(link => {
          out.push({
            from: this.sankeyData.nodes[link.source].name,
            to: this.sankeyData.nodes[link.target].name,
            count: link.value
          });
        })
      }
      return out;

    }
  },
  mounted() {
    this.runQuery();
  },
  methods: {
    // Save the Sankey as an SVG diagram
    async saveSankeyAsSvg() {
      const sankeyContainer = this.$refs.sankeyContainer as HTMLElement;
      if (sankeyContainer.firstChild) {
        const nameArr = [
          `R${this.search.from}`,
          this.search.to === TaxonHistoryRelease.NCBI ? this.search.to : `R${this.search.to}`,
          this.search.taxon
        ];
        if (this.value.filterToRank) {
          nameArr.push(this.value.filterToRank);
        }
        const name = `taxon-history-${nameArr.join('-')}.svg`;
        saveSvgElement(sankeyContainer.firstChild as HTMLElement, name)
      }
    },

    // Run the search query for the Sankey diagram
    runQuery() {
      if (!this.search.to || !this.search.from || !this.search.taxon) {
        return;
      }

      // Required arguments
      const request = {
        taxon: this.search.taxon,
        releaseFrom: `R${this.search.from}`,
        releaseTo: this.search.to === TaxonHistoryRelease.NCBI ? this.search.to : `R${this.search.to}`,
      } as SankeySearchRequest

      // Maybe filter to rank.
      if (this.filterToRank) {
        //@ts-ignore
        request.filterRank = this.filterToRank
      }

      // Make the request
      this.isSankeyRunning = true;
      this.$api.sankey.getSankey(request).then((resp) => {
        this.sankeyData = resp.data
        if (this.hasData) {
          this.initSankey();
        }
      })
        .catch((err) => {
          this.$accessor.api.defaultCatch(err);
        })
        .finally(() => {
          this.isSankeyRunning = false;
        })
    },

    // Create the Sankey diagram
    initSankey() {
      // Load the container of the Sankey SVG
      const sankeyContainer = this.$refs.sankeyContainer as HTMLElement;
      const sankeyTooltip = this.$refs.sankeyTooltip as HTMLElement;

      // Clear the contents of the element before drawing
      sankeyContainer.innerHTML = '';

      // Configuration
      const margin = {top: 25, right: 0, bottom: 0, left: 0};
      const width = 1400 - margin.left - margin.right;
      const height = 450 - margin.top - margin.bottom;

      const svg = d3.select(sankeyContainer).append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", "0 0 1400 450")
        .append("g");

      const nodeWidth = 15;

      const sankey = d3sankey.sankey()
        .nodeWidth(nodeWidth)
        .nodePadding(13)
        .iterations(32)
        .nodeAlign(d3sankey.sankeyRight)
        .extent([[margin.left, margin.top], [width, height]]);

      let graph = sankey({
        //@ts-ignore
        nodes: this.sankeyData.nodes.map(d => Object.assign({}, d)),
        links: this.sankeyData.links.map(d => Object.assign({}, d))
      });

      const nodes = graph.nodes;
      const links = graph.links;

      // Extract the X coordinates for each rectangle.
      const depthX = new Map();
      //@ts-ignore
      nodes.forEach(function (node: d3sankey.SankeyNode) {
        depthX.set(node.layer, {x0: node.x0, col: node.col})
      });

      // Create a new list containing the names and coordinates.
      const arrCols: any[] = [];
      depthX.forEach(function (col) {
        arrCols.push({x: col.x0, col: col.col, y: 10})
      });

      svg.append("g")
        .style("font", "12px sans-serif")
        .style("font-weight", "bold")
        .selectAll("text")
        .data(arrCols)
        .join("text")
        .attr("x", d => d.x < width / 2 ? d.x : d.x + nodeWidth)
        .attr("text-anchor", d => d.x < width / 2 ? "start" : "end")
        .attr("y", d => d.y)
        .attr("dy", "0.35em")
        .text(d => d.col);

      //@ts-ignore
      svg.append("g")
        .selectAll("rect")
        .data(nodes)
        .join("rect")
        //@ts-ignore
        .attr("x", d => d.x0)
        //@ts-ignore
        .attr("y", d => (d.y1 - d.y0 <= 5) ? d.y0 - 2 : d.y0)
        //@ts-ignore
        .attr("height", d => Math.max(d.y1 - d.y0, 5))
        //@ts-ignore
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", "#AAAAAA")
        .attr("id", function (d, i) {
          //@ts-ignore
          return "node-" + d.id;
        })
        .on("mouseover", function (d, i) {

          //@ts-ignore
          highlightLinkId(d["linkHighlightId"], true);
          //@ts-ignore
          highlightNodeId(d["nodeHighlightId"], true);

          //@ts-ignore
          sankeyTooltip.innerHTML = `${d.name} (${d.total.toLocaleString()})`;
          tooltip.style("visibility", "visible");

        })
        .on("mouseout", function (d, i) {
          //@ts-ignore
          highlightLinkId(d["linkHighlightId"], false);
          //@ts-ignore
          highlightNodeId(d["nodeHighlightId"], false);
          tooltip.style("visibility", "hidden");
        })
        .on("mousemove", function (d, i) {
          //@ts-ignore
          tooltip.style("top", `${event.pageY - 80}px`).style("left", `${event.pageX - 130}px`);
          // if (d.x0 < width / 2) {
          //   //@ts-ignore
          //   tooltip.style("top", (event.pageY - 80) + "px").style("left", (event.pageX - 130) + "px");
          // } else {
          //   //@ts-ignore
          //   let divWidth = sankeyTooltip.offsetWidth;
          //   //@ts-ignore
          //   tooltip.style("top", (event.pageY - 80) + "px").style("left", (event.pageX - divWidth - 170) + "px");
          // }
        });

      const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.2)
        .selectAll("g")
        .data(links)
        .join("g")
        .style("mix-blend-mode", "multiply");

      const tooltip = d3.select(sankeyTooltip);

      link.append("path")
        .attr("d", d3sankey.sankeyLinkHorizontal())
        .attr("stroke", "#aaa")
        .attr("stroke-width", d => Math.max(3, <number>d.width))
        .attr("class", "d3Path")
        .attr("id", function (d, i) {
          //@ts-ignore
          return "link-" + d.id;
        })
        .on("mouseover", function (d, i) {
          //@ts-ignore
          highlightLinkId(d["linkHighlightId"], true);
          //@ts-ignore
          highlightNodeId(d["nodeHighlightId"], true);
          //@ts-ignore
          sankeyTooltip.innerHTML = `${d.source.name}<br>${d.target.name}<br>Genomes: ${d.value.toLocaleString()}`;
          tooltip.style("visibility", "visible");

        })
        .on("mouseout", function (d, i) {
          //@ts-ignore
          highlightLinkId(d["linkHighlightId"], false);
          //@ts-ignore
          highlightNodeId(d["nodeHighlightId"], false);
          tooltip.style("visibility", "hidden");
        })
        .on("mousemove", function (d, i) {
          //@ts-ignore
          tooltip.style("top", `${event.pageY - 80}px`).style("left", `${event.pageX - 130}px`);
          // if (d.source.x0 < width / 2) {
          //   //@ts-ignore
          //   tooltip.style("top", `${event.pageY}px`).style("left", `${event.pageX + 30}px`);
          // } else {
          //   //@ts-ignore
          //   let divWidth = sankeyTooltip.offsetWidth;
          //   //@ts-ignore
          //   tooltip.style("top", (event.pageY - 100) + "px").style("left", (event.pageX - divWidth - 170) + "px");
          // }
        });

      svg.append("g")
        .style("font", "10px sans-serif")
        .selectAll("text")
        .data(nodes)
        .join("text")
        //@ts-ignore
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        //@ts-ignore
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        //@ts-ignore
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(function (d, i) {
          //@ts-ignore
          const newName = d.name.replace(/(.+: )/i, "");
          //@ts-ignore
          return `${newName} (${d.total.toLocaleString()})`;
        })
        .on("click", function (d, i) {
          //@ts-ignore
          if (d !== null && d.col !== "NCBI") {
            //@ts-ignore
            const newName = d.name.replace(/(.+: )/i, "");
            if (newName !== null && newName.length > 3 && newName !== "Not Present") {
              window.open(`/tree?r=${newName}`);
            }
          }
        })
        .on("mouseover", function (d, i) {
          //@ts-ignore
          if (d !== null && d.col !== "NCBI") {
            //@ts-ignore
            const newName = d.name.replace(/(.+: )/i, "");
            if (newName !== null && newName.length > 3 && newName !== "Not Present") {
              d3.select(this).style("cursor", "pointer");
            }
          }
        })
        .on("mouseout", function (d, i) {
          d3.select(this).style("cursor", "default");
        });
    }
  }
})
</script>

<style scoped>
.d3tooltip {
  position: absolute;
  z-index: 10;
  visibility: hidden;
  font: 10px sans-serif;
  font-weight: bold;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px;
}
</style>
