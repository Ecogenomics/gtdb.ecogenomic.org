import axios from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');


// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class SankeyApi {

  getQueryParameters(request: SankeySearchRequest): string {
    // @ts-ignore
    const params = new URLSearchParams(request);
    const paramsStr = params.toString();
    if (paramsStr) {
      return `?${paramsStr}`
    } else {
      return ''
    }
  }

  getSankey(request: SankeySearchRequest) {
    return axios.get<SankeySearchResponse>(`${apiBase}/sankey${this.getQueryParameters(request)}`, {timeout: apiTimeout})
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
