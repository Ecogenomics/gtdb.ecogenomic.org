import axios from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');
const apiCacheKey = process.env.apiCacheKey;

// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class SpeciesApi {

  getByName(name: string) {
    return axios.get<SpeciesCluster>(`${apiBase}/species/search/${encodeURIComponent(name)}`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }


  // getSpeciesHeatmap(name: string) {
  //   return axios.get<SpeciesHeatmap>(`${apiBase}/species/heatmap/${encodeURIComponent(name)}`, {timeout: apiTimeout})
  // }
}

// --------------------------------------------------------------------------------------------
// MODEL
// --------------------------------------------------------------------------------------------

export interface SpeciesCluster {
  name: string,
  genomes: SpeciesClusterGenome[],
  d: string,
  p: string,
  c: string,
  o: string,
  f: string,
  g: string,
  s: string
}

export interface SpeciesClusterGenome {
  accession: string,
  ncbi_org_name: string,
  ncbi_tax: string,
  gtdb_species_rep: boolean,
  ncbi_type_material?: string
}

export interface SpeciesHeatmap {
  name: string,
  gtdbRep: string,
  xLabels: string[],
  yLabels: string[],
  data: [string, string, number, number, number][]
}
