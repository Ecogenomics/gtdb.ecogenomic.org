import axios from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');
const apiCacheKey = process.env.apiCacheKey || 1;

// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class SearchApi {

  getGtdbSearchQueryParameters(request: SearchGtdbRequest): string {
    const searchParams: SearchGtdbRequestUrl = {
      search: request.search,
      cacheKey: apiCacheKey.toString(),
    }
    if (request.page) {
      searchParams.page = request.page.toString()
    }
    if (request.itemsPerPage) {
      searchParams.itemsPerPage = request.itemsPerPage.toString()
    }
    if (request.sortBy && request.sortBy.length > 0) {
      searchParams.sortBy = request.sortBy.join(',')
    }
    if (request.sortDesc && request.sortDesc.length > 0) {
      searchParams.sortDesc = request.sortDesc.join(',')
    }
    if (request.searchField) {
      searchParams.searchField = request.searchField;
    }
    if (request.filterText) {
      searchParams.filterText = request.filterText
    }
    if (request.gtdbSpeciesRepOnly) {
      searchParams.gtdbSpeciesRepOnly = 'true'
    }
    if (request.ncbiTypeMaterialOnly) {
      searchParams.ncbiTypeMaterialOnly = 'true'
    }

    // @ts-ignore
    const params = new URLSearchParams(searchParams);
    const paramsStr = params.toString();
    if (paramsStr) {
      return `?${paramsStr}`
    } else {
      return ''
    }
  }

  getGtdbSearch(request: SearchGtdbRequest) {
    return axios.get<SearchGtdbResponse>(`${apiBase}/search/gtdb${this.getGtdbSearchQueryParameters(request)}`,
      {timeout: apiTimeout})
  }

  getGtdbSearchExportUrl(request: SearchGtdbRequest, fmt: string) {
    return `${apiBase}/search/gtdb/${fmt}${this.getGtdbSearchQueryParameters(request)}`
  }

}

// --------------------------------------------------------------------------------------------
// MODEL
// --------------------------------------------------------------------------------------------
export interface SearchGtdbRequest {
  page?: number,
  itemsPerPage?: number,
  sortBy?: string[],
  sortDesc?: boolean[],
  search: string,
  searchField: string
  filterText: string
  gtdbSpeciesRepOnly: boolean
  ncbiTypeMaterialOnly: boolean
}

export interface SearchGtdbRequestUrl {
  cacheKey: string,
  page?: string,
  itemsPerPage?: string,
  sortBy?: string,
  sortDesc?: string,
  search?: string,
  searchField?: string,
  filterText?: string,
  gtdbSpeciesRepOnly?: string,
  ncbiTypeMaterialOnly?: string
}

export interface SearchGtdbRow {
  gid: string
  accession: string
  ncbiOrgName: string
  ncbiTaxonomy: string
  gtdbTaxonomy: string
  isGtdbSpeciesRep: boolean
  isNcbiTypeMaterial: boolean
}

export interface SearchGtdbResponse {
  rows: SearchGtdbRow[]
  totalRows: number
}
