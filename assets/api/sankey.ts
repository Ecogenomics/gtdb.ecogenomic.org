import axios from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');
const apiCacheKey = process.env.apiCacheKey;

// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class SankeyApi {

  getSankey(request: SankeySearchRequest) {
    return axios.get<SankeySearchResponse>(`${apiBase}/sankey`,
      {
        timeout: apiTimeout,
        params: {...request, ...{cacheKey: apiCacheKey}}
      })
  }
}

// --------------------------------------------------------------------------------------------
// MODEL
// --------------------------------------------------------------------------------------------
export interface SankeySearchRequest {
  releaseFrom: string,
  releaseTo: string,
  taxon: string,
  filterRank?: string
}


export interface SankeyNode {
  col: string,
  id: number,
  linkHighlightId: number[],
  name: string,
  nodeHighlightId: number[],
  total: number
}

export interface SankeyLink {
  id: number
  linkHighlightId: number[]
  nodeHighlightId: number[]
  source: number
  target: number
  value: number
}

export interface SankeySearchResponse {
  nodes: SankeyNode[]
  links: SankeyLink[]
}
