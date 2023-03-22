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

  getTaxonGenomes(taxon: string, sp_reps_only: boolean) {
    return axios.get<string[]>(`${apiBase}/taxon/${encodeURIComponent(taxon)}/genomes`,
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

export interface TaxonDescendants {
  taxon: string,
  total: number,
  isGenome?: boolean,
  isRep?: boolean,
  typeMaterial?: string,
  nDescChildren?: number,
  bergeysUrl?: string,
  seqcodeUrl?: string
}

export interface TaxonSearchResponse {
  matches: string[]
}
