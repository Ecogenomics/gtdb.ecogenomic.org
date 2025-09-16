/*

Interfaces and common methods used by skani components.

These have been placed outside the API scope as they do not mirror the backend.

 */

import {SkaniDeleteUserResultsAfter, SkaniJobDataHeatmapResponse} from "~/assets/api/skani";
import {Config, Data, Layout} from "plotly.js";
import {COLOURS} from "~/assets/ts/common";


// The row used when displaying the genomes selected for query / reference

export interface SkaniTableRow {
  name: string,
  isUser: boolean | null,
  isRep: boolean | null,
  domain: string | null,
  phylum: string | null,
  class: string | null,
  order: string | null,
  family: string | null,
  genus: string | null,
  species: string | null
}


export function formatSkaniDeleteAfterAsString(input: SkaniDeleteUserResultsAfter): string {
  console.log(input);
  switch (input) {
    case SkaniDeleteUserResultsAfter.DISABLED:
      return "Disabled";
    case SkaniDeleteUserResultsAfter.HOUR_1:
      return "1 Hour";
    case SkaniDeleteUserResultsAfter.DAY_1:
      return "1 Day";
    case SkaniDeleteUserResultsAfter.WEEK_1:
      return "1 Week";
    case SkaniDeleteUserResultsAfter.MONTH_1:
      return "1 Month";
    default:
      return "N/A";
  }
}


export function parseSkaniJobId(input: any): string | null {
  if (input != null && typeof input === "string" && input.length === 8) {
    return input
  }
  return null;
}

export interface PlotlyGraphData {
  data: Data[],
  layout?: Partial<Layout>,
  config?: Partial<Config>,
}


export interface SkaniColorScaleRow {
  start: number,
  end: number,
  color: string
}

export interface SkaniColourRangePickerOutput {
  stop: number,
  hex: string
}

export const DEFAULT_SKANI_COLOUR_SCALE: SkaniColourRangePickerOutput[] = [
  {stop: 0, hex: '#FFFFFF'},
  {stop: 50, hex: '#E5F5E0'},
  {stop: 94.99, hex: '#006D2C'},
  {stop: 95, hex: '#FD9068'},
  {stop: 100, hex: '#FD9068'},
];


function generateColourPalette(groupA: string[], groupB: string[]): [[number, string][], number[], number[]] {

  // Assign a unique number to each species (keeping most of the order)
  const outA: number[] = [];
  const outB: number[] = [];
  const mapping = new Map<string, number>();
  let nextIndex = 0;
  for (const item of groupA) {
    if (!mapping.has(item)) {
      mapping.set(item, nextIndex);
      nextIndex++;
    }
    outA.push(<number>mapping.get(item));
  }
  for (const item of groupB) {
    if (!mapping.has(item)) {
      mapping.set(item, nextIndex);
      nextIndex++;
    }
    outB.push(<number>mapping.get(item));
  }

  // Generate colours, they must be normalised between 0 and 1
  const scale: [number, string][] = [];

  if (nextIndex < 2) {
    scale.push([0, COLOURS[0 % COLOURS.length]]);
    scale.push([1, COLOURS[1 % COLOURS.length]]);
  } else {
    for (let i = 0; i < nextIndex; i++) {
      const curColor = COLOURS[i % COLOURS.length];
      scale.push([i / (nextIndex - 1), curColor]);
    }
  }

  return [scale, outA, outB];
}


export function generateHeatmapForSkani(
  heatmapData: SkaniJobDataHeatmapResponse,
  width: number,
  height: number,
  plotColourScale: SkaniColourRangePickerOutput[]
): PlotlyGraphData {
  // CONFIGURATION
  const xValues = heatmapData.xLabels;
  const yValues = heatmapData.yLabels;
  const marginPx = {t: 100, l: 100, b: 100, r: 100};
  const axisTickFontSize = 10;
  const speciesAxisSizePx = 25;
  const xTickLengthPx = 25;
  const yTickLengthPx = 25;

  // Main heatmap
  const zValues = heatmapData.ani;

  // Generate a colour palette for the species
  const [secondaryPalette, speciesXIds, speciesYIds] = generateColourPalette(heatmapData.xSpecies, heatmapData.ySpecies);

  // Species secondary X axis (bottom)
  const catRow = speciesXIds;
  const catRowText = heatmapData.xSpecies;

  // Species secondary Y axis (left)
  const catCol = speciesYIds;
  const catColText = heatmapData.ySpecies;

  // Generate annotations for main heatmap
  const annotations: Partial<Layout>['annotations'] = [];

  // Limit the amount of annotations that can be displayed for performance reasons
  if (xValues.length * yValues.length < 100) {
    for (let i = 0; i < yValues.length; i++) {
      for (let j = 0; j < xValues.length; j++) {
        const curZValue = zValues[i][j].toFixed(2);
        if (curZValue === "0.00") {
          continue; // skip zero values
        }

        annotations.push({
          x: xValues[j],
          y: yValues[i],
          text: curZValue === "100.00" ? "100" : curZValue, // value to display
          xref: 'x',
          yref: 'y',
          showarrow: false,
          font: {
            color: 'black',   // adjust based on background for contrast
            size: 10,
          },
          align: 'center',
        });
      }
    }
  }

  // COMPUTED VALUES
  // Since there is a mix of pixel and relative sizing, we need to re-compute the pixel sizing based
  // on the total size
  const yAxisWidthProp = speciesAxisSizePx / height;
  const xAxisWidthProp = speciesAxisSizePx / width;

  // Create the hovertext
  const hoverText = [] as string[][];
  for (let i = 0; i < yValues.length; i++) {
    const row = [];
    for (let j = 0; j < xValues.length; j++) {
      row.push(`Ref: ${xValues[j]}<br>Query: ${yValues[i]}<br>ANI: ${zValues[i][j].toFixed(2)}<br>AF: ${heatmapData.af[i][j].toFixed(2)}`);
    }
    hoverText.push(row);
  }

  // Create the colourscale if provided
  let customColourScale: [number, string][] = [];
  if (plotColourScale.length > 0) {
    customColourScale = [];
    for (const entry of plotColourScale) {
      customColourScale.push([entry.stop / 100, entry.hex]);
    }
  } else {
    customColourScale = DEFAULT_SKANI_COLOUR_SCALE.map(entry => [entry.stop / 100, entry.hex]);
  }

  // MAIN HEATMAP
  const mainHeatmap: Partial<Data> = {
    x: xValues,
    y: yValues,
    z: zValues,
    type: 'heatmap',
    colorscale: customColourScale,
    zmin: 0,
    zmax: 100,
    xaxis: 'x',
    yaxis: 'y',
    //@ts-ignore
    text: hoverText,
    hovertemplate: '%{text}<extra></extra>',
    showscale: true,
  };

  // Secondary X axis
  const catRowHeatmap: Partial<Data> = {
    x: xValues,
    y: ['SpeciesRowX'],
    z: [catRow],
    // @ts-ignore
    text: [catRowText],
    type: 'heatmap',
    colorscale: secondaryPalette,
    showscale: false,
    xaxis: 'x',
    yaxis: 'y2',
    hovertemplate: '%{text}<extra></extra>',
  };

// Categorical column (left)
  const catColHeatmap: Partial<Data> = {
    x: ['SpeciesRowY'],
    y: yValues,
    z: catCol.map(v => [v]), // needs to be 2D array
    // @ts-ignore
    text: catColText.map(v => [v]),
    type: 'heatmap',
    colorscale: secondaryPalette,
    showscale: false,
    xaxis: 'x2',
    yaxis: 'y',
    hovertemplate: '%{text}<extra></extra>',
  };

  const layout: Partial<Layout> = {


    font: {
      size: 12,
    },

    annotations: annotations,

    // main heatmap axes
    xaxis: {
      domain: [xAxisWidthProp, 1],
      side: 'bottom',
      showticklabels: true,
      anchor: 'y',
      ticklen: xTickLengthPx, // extend them past the secondary axis
      ticks: 'outside',
      // scaleanchor: 'y',  // fixed aspect ratio for zooming
      // scaleratio: 1,   // fixed aspect ratio for zooming
      tickfont: {size: axisTickFontSize},
      automargin: true,
    },
    xaxis2: {
      domain: [0, xAxisWidthProp],
      side: 'left',
      anchor: 'y',
      fixedrange: true, // disable users zooming outside the plot
      title: {text: ''},
      showticklabels: false,
      ticks: '',
      automargin: true,
    },
    yaxis: {
      domain: [yAxisWidthProp, 1],
      side: 'left',
      showticklabels: true,
      anchor: 'x',
      ticklen: yTickLengthPx,  // extend them past the secondary axis
      ticks: 'outside',
      tickfont: {size: axisTickFontSize},
      automargin: true,
      autorange: 'reversed', // default behaviour is to invert the heatmap
    },
    yaxis2: {
      domain: [0, yAxisWidthProp],
      side: 'bottom',
      anchor: 'x',
      fixedrange: true,  // disable users zooming outside the plot
      title: {text: ''},
      showticklabels: false,
      ticks: '',
      automargin: true,
    },

    height: height,
    width: width,
    margin: marginPx,

    autosize: false,

  };


  const config = {
    responsive: true,
  }

  return {
    data: [mainHeatmap, catRowHeatmap, catColHeatmap],
    layout: layout,
    config: config
  }


}
