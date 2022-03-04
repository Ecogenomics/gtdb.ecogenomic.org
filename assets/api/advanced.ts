import axios from "axios";
import {Dict} from "~/assets/ts/interfaces";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');


// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class AdvancedApi {

  getOptions() {
    return axios.get<AdvancedSearchOptionsResponse[]>(`${apiBase}/advanced/options`, {timeout: apiTimeout})
  }

  getOperators() {
    return axios.get<AdvancedSearchOperatorResponse[]>(`${apiBase}/advanced/operators`, {timeout: apiTimeout})
  }

  getColumns() {
    return axios.get<AdvancedSearchColumnResponse[]>(`${apiBase}/advanced/columns`, {timeout: apiTimeout})
  }

  getSearch(payload: Dict<string>) {
    return axios.get<AdvancedSearchResult>(`${apiBase}/advanced/search`, {params: payload})
  }

  getSearchDownloadUrl(payload: Dict<string>) {
    return axios.get<AdvancedSearchResult>(`${apiBase}/advanced/search`, {params: payload})
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
