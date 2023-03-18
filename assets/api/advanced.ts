import axios from "axios";
import {Dict} from "~/assets/ts/interfaces";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');
const apiCacheKey = process.env.apiCacheKey || 1;

// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class AdvancedApi {

  getOptions() {
    return axios.get<AdvancedSearchOptionsResponse[]>(`${apiBase}/advanced/options`,
      {
      timeout: apiTimeout,
      params: {cacheKey: apiCacheKey}
    })
  }

  getOperators() {
    return axios.get<AdvancedSearchOperatorResponse[]>(`${apiBase}/advanced/operators`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

  getColumns() {
    return axios.get<AdvancedSearchColumnResponse[]>(`${apiBase}/advanced/columns`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

  getSearch(payload: Dict<string>) {
    return axios.get<AdvancedSearchResult>(`${apiBase}/advanced/search`,
      {
        timeout: apiTimeout,
        params: {...payload, ...{cacheKey: apiCacheKey}}
      })
  }

  getSearchDownloadUrl(params: URLSearchParams, format: string): string {
    params.append('cacheKey', apiCacheKey.toString());
    return `${apiBase}/advanced/search/download/${format}?${params.toString()}`
  }

  getSearchGenomesDownloadUrl(params: URLSearchParams): string {
    params.append('cacheKey', apiCacheKey.toString());
    return `${apiBase}/advanced/search/download-genomes?${params.toString()}`
  }

}

// --------------------------------------------------------------------------------------------
// MODEL
// --------------------------------------------------------------------------------------------

export interface AdvancedSearchOptionsResponse {
  id: number
  display: string
}

export interface AdvancedSearchDataTypeResponse {
  name: string
  value: string
}

export interface AdvancedSearchOperatorResponse {
  id: number
  display: string
  dataType: string
}

export interface AdvancedSearchColumnResponse {
  id: number
  display: string
  dataType: string
  options?: AdvancedSearchOptionsResponse[]
  group: string
}

export interface AdvancedSearchHeader {
  text: string
  value: string
}

export interface AdvancedSearchResult {
  headers: AdvancedSearchHeader[]
  rows: Dict<any>[]
}
