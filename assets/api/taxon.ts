import axios from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');
const apiCacheKey = process.env.apiCacheKey;

// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class TaxonApi {
  getTaxonName(taxon: string) {
    return axios.get<TaxonDescendants[]>(`${apiBase}/taxon/${encodeURIComponent(taxon)}`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

  searchForTaxonByName(taxon: string) {
    return axios.get<TaxonSearchResponse>(`${apiBase}/taxon/search/${encodeURIComponent(taxon)}`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

  searchForTaxonByNameAllReleases(taxon: string) {
    return axios.get<TaxonSearchResponse>(`${apiBase}/taxon/search/${encodeURIComponent(taxon)}/all-releases`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

  getPreviousReleases(taxon: string) {
    return axios.get<TaxonPreviousReleases[]>(`${apiBase}/taxon/${encodeURIComponent(taxon)}/previous-releases`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey}
      })
  }

  getPreviousReleasesPaginated(taxon: string, page: number | null, itemsPerPage: number | null) {
    return axios.get<TaxonPreviousReleasesPaginated>(`${apiBase}/taxon/${encodeURIComponent(taxon)}/previous-releases/paginated`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey,
          page: page,
          itemsPerPage: itemsPerPage
        }
      })
  }

  getTaxonGenomes(taxon: string, sp_reps_only: boolean) {
    return axios.get<string[]>(`${apiBase}/taxon/${encodeURIComponent(taxon)}/genomes`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey, sp_reps_only: sp_reps_only}
      })
  }

  getTaxonGenomesDetail(taxon: string, sp_reps_only: boolean) {
    return axios.get<TaxonGenomesDetailResponse>(`${apiBase}/taxon/${encodeURIComponent(taxon)}/genomes-detail`,
      {
        timeout: apiTimeout,
        params: {cacheKey: apiCacheKey, sp_reps_only: sp_reps_only}
      })
  }


}

// --------------------------------------------------------------------------------------------
// MODEL
// --------------------------------------------------------------------------------------------

export interface TaxonPreviousReleases {
  taxon: string,
  firstSeen: string,
  lastSeen: string
}

export interface TaxonPreviousReleasesPaginated {
  totalRows: number,
  rows: TaxonPreviousReleases[]
}


export interface TaxonDescendants {
  taxon: string,
  total: number,
  isGenome?: boolean,
  isRep?: boolean,
  typeMaterial?: string,
  nDescChildren?: number,
  bergeysUrl?: string,
  seqcodeUrl?: string,
  lpsnUrl?: string,
  ncbiTaxId?: number,
  sandpiperUrl?: string,
}

export interface TaxonSearchResponse {
  matches: string[]
}

export interface TaxonGenomesDetailRow {
  gid: string,
  gtdbIsRep: boolean,
  gtdbDomain: string,
  gtdbPhylum: string,
  gtdbClass: string,
  gtdbOrder: string,
  gtdbFamily: string,
  gtdbGenus: string,
  gtdbSpecies: string,
}
export interface TaxonGenomesDetailResponse {
  rows: TaxonGenomesDetailRow[]
}
