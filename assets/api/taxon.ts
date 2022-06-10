import axios, {AxiosRequestConfig} from "axios";

const apiBase = process.env.apiBase;
const apiTimeout = parseInt(process.env.apiTimeout || '30000');


// --------------------------------------------------------------------------------------------
// VIEW
// --------------------------------------------------------------------------------------------

export class TaxonApi {
  getTaxonName(taxon: string) {
    return axios.get<TaxonDescendants[]>(`${apiBase}/taxon/${encodeURIComponent(taxon)}`, {timeout: apiTimeout})
  }

  searchForTaxonByName(taxon: string) {
    return axios.get<TaxonSearchResponse>(`${apiBase}/taxon/search/${encodeURIComponent(taxon)}`, {timeout: apiTimeout})
  }

  searchForTaxonByNameAllReleases(taxon: string) {
    return axios.get<TaxonSearchResponse>(`${apiBase}/taxon/search/${encodeURIComponent(taxon)}/all-releases`, {timeout: apiTimeout})
  }

  getPreviousReleases(taxon: string) {
    return axios.get<TaxonPreviousReleases[]>(`${apiBase}/taxon/${encodeURIComponent(taxon)}/previous-releases`, {timeout: apiTimeout})
  }

  getTaxonGenomes(taxon: string, sp_reps_only: boolean) {
    return axios.get<string[]>(`${apiBase}/taxon/${encodeURIComponent(taxon)}/genomes?sp_reps_only=${sp_reps_only}`, {timeout: apiTimeout})
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
  typeMaterial?: string
}

export interface TaxonSearchResponse {
  matches: string[]
}
