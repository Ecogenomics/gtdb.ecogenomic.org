import axios, {AxiosRequestConfig} from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');


// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class TaxonomyApi {

  partialSearch(taxon: string) {
    return axios.get<TaxonomyOptional>(`${apiBase}/taxonomy/partial/${taxon}`, {timeout: apiTimeout})
  }

  partialSearchAllReleases(taxon: string) {
    return axios.get<TaxonomyOptionalRelease[]>(`${apiBase}/taxonomy/partial/${taxon}/all-releases`, {timeout: apiTimeout})
  }

  notInLit() {
    return axios.get<TaxaNotInLiterature[]>(`${apiBase}/taxonomy/not-in-literature`, {timeout: apiTimeout})
  }

  taxonomyCountParams(query: TaxonomyCountRequest): string {
    const searchParams: TaxonomyCountUrl = {}
    if (query.page) {
      searchParams.page = query.page.toString()
    }
    if (query.itemsPerPage) {
      searchParams["items-per-page"] = query.itemsPerPage.toString()
    }
    if (query.sortBy && query.sortBy.length > 0) {
      searchParams["sort-by"] = query.sortBy.join(',')
    }
    if (query.sortDesc && query.sortDesc.length > 0) {
      searchParams["sort-desc"] = query.sortDesc.join(',')
    }
    if (query.search) {
      searchParams.search = query.search.toString()
    }
    if (query.proposed) {
      searchParams["gtdb-proposed"] = query.proposed.toString()
    }
    if (query.filterDomain) {
      searchParams["filter-domain"] = query.filterDomain.toString()
    }
    if (query.filterPhylum) {
      searchParams["filter-phylum"] = query.filterPhylum.toString()
    }
    if (query.filterClass) {
      searchParams["filter-class"] = query.filterClass.toString()
    }
    if (query.filterOrder) {
      searchParams["filter-order"] = query.filterOrder.toString()
    }
    if (query.filterFamily) {
      searchParams["filter-family"] = query.filterFamily.toString()
    }
    if (query.filterGenus) {
      searchParams["filter-genus"] = query.filterGenus.toString()
    }
    if (query.filterSpecies) {
      searchParams["filter-species"] = query.filterSpecies.toString()
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

  taxonomyCount(query: TaxonomyCountRequest) {
    const params = this.taxonomyCountParams(query)
    return axios.get<TaxonomyCountResponse>(`${apiBase}/taxonomy/count${params}`, {timeout: apiTimeout})
  }

  taxonomyCountDownloadUrl(query: TaxonomyCountRequest, fmt: string) {
    const params = this.taxonomyCountParams(query)
    return `${apiBase}/taxonomy/count/${fmt}${params}`
  }

}

// --------------------------------------------------------------------------------------------
// MODEL
// --------------------------------------------------------------------------------------------

export interface TaxonomyRequired {
  d: string | null
  p: string | null
  c: string | null
  o: string | null
  f: string | null
  g: string | null
  s: string | null
}


export interface TaxonomyOptional {
  d: string | null
  p: string | null
  c: string | null
  o: string | null
  f: string | null
  g: string | null
  s: string | null
}

export interface TaxaNotInLiterature {
  taxon: string
  taxonomy: TaxonomyOptional
  appearedInRelease: string
  taxonStatus: string
  notes: string
}

export interface TaxonomyCount {
  d: string,
  p: string,
  c: string,
  o: string,
  f: string,
  g: string,
  s: string,
  count: number
}



export interface TaxonomyCountResponse {
  totalRows: number,
  rows: TaxonomyCount[]
}

export interface TaxonomyCountRequest {
  page: number,
  itemsPerPage: number,
  sortBy?: string[],
  sortDesc?: boolean[],
  search?: string,
  proposed?: boolean,

  filterDomain?: string,
  filterPhylum?: string,
  filterClass?: string,
  filterOrder?: string,
  filterFamily?: string,
  filterGenus?: string,
  filterSpecies?: string,

}


export interface TaxonomyCountUrl {
  page?: string,
  "items-per-page"?: string,
  "sort-by"?: string,
  "sort-desc"?: string,
  search?: string,
  "gtdb-proposed"?: string

  "filter-domain"?: string,
  "filter-phylum"?: string,
  "filter-class"?: string,
  "filter-order"?: string,
  "filter-family"?: string,
  "filter-genus"?: string,
  "filter-species"?: string,
}

export interface TaxonomyOptionalRelease {
  release: string
  taxonomy: TaxonomyOptional
}
